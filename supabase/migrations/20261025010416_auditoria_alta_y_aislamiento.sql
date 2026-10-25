-- Aplicar sobre 01-esquema.sql + 04-nota-reserva.sql, antes del nuevo frontend.
-- Si existen referencias cruzadas, la transacción falla sin corregir/borrar datos.
begin;

-- Toda FK entre entidades de un local debe conservar también su local_id.
do $$
declare r record; v_nombre text;
begin
  for r in
    select c.conrelid::regclass as hija, c.confrelid::regclass as padre,
           a.attname as columna, c.conname
    from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.contype = 'f' and n.nspname = 'public' and cardinality(c.conkey) = 1
      and a.attname <> 'local_id'
      and exists (select 1 from pg_attribute where attrelid = c.conrelid and attname = 'local_id' and not attisdropped)
      and exists (select 1 from pg_attribute where attrelid = c.confrelid and attname = 'local_id' and not attisdropped)
  loop
    v_nombre := r.padre::text || '_local_id_id_key';
    if not exists (select 1 from pg_constraint where conrelid = r.padre and conname = v_nombre) then
      execute format('alter table %s add constraint %I unique (local_id, id)', r.padre, v_nombre);
    end if;
    v_nombre := left(r.conname, 52) || '_local_fk';
    if not exists (select 1 from pg_constraint where conrelid = r.hija and conname = v_nombre) then
      execute format('alter table %s add constraint %I foreign key (local_id, %I) references %s (local_id, id) deferrable initially immediate not valid', r.hija, v_nombre, r.columna, r.padre);
      execute format('alter table %s validate constraint %I', r.hija, v_nombre);
    end if;
  end loop;
end $$;

-- Cambiar de rol también revoca el acceso que venía de una ficha profesional.
create or replace function mi_profesional() returns uuid
language sql stable security definer set search_path = public as $$
  select p.id from profesionales p join usuarios u on u.id = p.usuario_id
  where u.auth_id = auth.uid() and u.activo and u.rol in ('dueno','profesional') limit 1
$$;

-- La escritura de una ficha exige el mismo vínculo que su lectura.
drop policy fic_escribe on fichas;
create policy fic_escribe on fichas for all using (
  local_id = mi_local() and (
    mi_rol() = 'dueno'
    or exists (select 1 from turnos t where t.cliente_id = fichas.cliente_id and t.profesional_id = mi_profesional())
  )
) with check (
  local_id = mi_local() and (
    mi_rol() = 'dueno'
    or (mi_rol() = 'profesional' and exists (
      select 1 from turnos t where t.cliente_id = fichas.cliente_id and t.profesional_id = mi_profesional()
    ))
  )
);

-- Bloquea duplicados incluso si llegan dos solicitudes de alta simultáneas.
create or replace function crear_local(
  p_nombre text, p_slug text, p_rubro text, p_nombre_usuario text,
  p_direccion text default null, p_telefono_wa text default null,
  p_instagram text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_auth uuid := auth.uid(); v_email text; v_local uuid;
begin
  if v_auth is null then raise exception 'Hay que iniciar sesión para crear un local'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_auth::text, 0));
  if exists (select 1 from usuarios where auth_id = v_auth) then
    raise exception 'Esta cuenta ya tiene un local';
  end if;
  if length(btrim(p_nombre)) not between 1 and 100 or p_nombre is null
     or p_slug is null or p_slug !~ '^[a-z0-9-]{3,40}$'
     or p_rubro is null or p_rubro not in ('peluqueria','estetica','unas','gimnasio','odontologia','kinesiologia','nutricion','consultorio','tatuajes') then
    raise exception 'Datos del local inválidos';
  end if;
  select email into v_email from auth.users where id = v_auth;
  insert into locales (nombre, slug, rubro, direccion, telefono_wa, instagram, estado, prueba_hasta)
    values (btrim(p_nombre), p_slug, p_rubro, p_direccion, p_telefono_wa, p_instagram, 'prueba', current_date + 14)
    returning id into v_local;
  insert into usuarios (auth_id, local_id, nombre, email, rol)
    values (v_auth, v_local, p_nombre_usuario, v_email, 'dueno');
  return v_local;
end $$;
revoke all on function crear_local(text,text,text,text,text,text,text) from public;
grant execute on function crear_local(text,text,text,text,text,text,text) to authenticated;

-- SECURITY INVOKER: las inserciones de configuración siguen pasando por RLS.
create or replace function completar_alta(
  p_nombre text, p_slug text, p_rubro text, p_nombre_usuario text,
  p_direccion text, p_telefono_wa text, p_instagram text,
  p_horarios jsonb, p_servicios jsonb
) returns uuid language plpgsql security invoker set search_path = public as $$
declare v_local uuid; v_usuario uuid;
begin
  if auth.uid() is null then raise exception 'Hay que iniciar sesión'; end if;
  if jsonb_typeof(p_horarios) is distinct from 'array'
     or jsonb_typeof(p_servicios) is distinct from 'array' then
    raise exception 'Horario o catálogo inválido';
  end if;
  if jsonb_array_length(p_horarios) not between 1 and 7
     or jsonb_array_length(p_servicios) not between 1 and 100 then
    raise exception 'Horario o catálogo incompleto';
  end if;
  if exists (select 1 from jsonb_to_recordset(p_servicios) as s(nombre text, duracion_min int, precio numeric)
             where s.nombre is null or length(btrim(s.nombre)) not between 1 and 100
                or s.duracion_min is null or s.duracion_min not between 1 and 1440
                or s.precio is null or s.precio < 0 or s.precio > 9999999999 or trunc(s.precio) <> s.precio) then
    raise exception 'Servicio inválido';
  end if;
  v_local := crear_local(p_nombre, p_slug, p_rubro, p_nombre_usuario, p_direccion, p_telefono_wa, p_instagram);
  insert into horarios (local_id, dia_semana, hora_inicio, hora_fin)
    select v_local, h.dia_semana, h.hora_inicio, h.hora_fin
    from jsonb_to_recordset(p_horarios) as h(dia_semana int, hora_inicio time, hora_fin time);
  insert into servicios (local_id, nombre, duracion_min, precio, orden, activo, visible_online)
    select v_local, s->>'nombre', (s->>'duracion_min')::int, (s->>'precio')::numeric, (n - 1)::int, true, true
    from jsonb_array_elements(p_servicios) with ordinality as x(s, n);
  select id into v_usuario from usuarios where auth_id = auth.uid() and local_id = v_local;
  insert into profesionales (local_id, usuario_id, nombre_publico)
    values (v_local, v_usuario, p_nombre_usuario);
  return v_local;
end $$;
revoke all on function completar_alta(text,text,text,text,text,text,text,jsonb,jsonb) from public;
grant execute on function completar_alta(text,text,text,text,text,text,text,jsonb,jsonb) to authenticated;

-- La escritura debe verificar el futuro, aunque se saltee el selector de huecos.
create or replace function reserva_online_valida() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.origen = 'online' and new.inicio <= now() then
    raise exception 'Elegí un horario futuro';
  end if;
  return new;
end $$;
create trigger t_reserva_online_valida before insert on turnos
  for each row execute function reserva_online_valida();

commit;
