-- ------------------------------------------------------------
-- El campo "Algo que debamos saber" del portal
-- ------------------------------------------------------------
-- En `diseno/Portal v4.dc.html` el tercer campo del paso 4 no es el correo:
-- es una nota libre ("Alergias, preferencias, referencias"). El esquema
-- original guardaba ahí el email del cliente, así que la reserva online
-- perdía lo único que la persona escribe con sus palabras.
--
-- Esta migración agrega `p_nota` a reservar_online() y la guarda en
-- turnos.notas, que ya existía y hasta ahora solo se llenaba desde el panel.
-- El email queda como parámetro opcional: sigue siendo válido, simplemente
-- el portal ya no lo pide.
--
-- Correr una vez en el SQL Editor de Supabase, sobre el esquema ya creado.

-- Hay que borrar la versión anterior: agregar un parámetro con default
-- sobre la misma función deja dos sobrecargas que PostgREST no sabe resolver.
drop function if exists reservar_online(text, uuid, uuid, timestamptz, text, text, text);

create or replace function reservar_online(
  p_slug text, p_servicio uuid, p_profesional uuid, p_inicio timestamptz,
  p_nombre text, p_celular text, p_email text default null,
  p_nota text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_local uuid; v_cliente uuid; v_turno uuid;
begin
  select id into v_local from locales where slug = p_slug and estado in ('prueba','activo');
  if v_local is null then raise exception 'Local no disponible'; end if;

  -- El servicio y el profesional tienen que ser de ESTE local y estar
  -- ofrecidos online. Los tres ids llegan del navegador y ninguna FK los ata
  -- entre sí: sin esto se puede reservar con el profesional de otro local,
  -- o con un servicio oculto del portal.
  if not exists (select 1 from servicios s
                  where s.id = p_servicio and s.local_id = v_local
                    and s.activo and s.visible_online) then
    raise exception 'Ese servicio no está disponible para reserva online';
  end if;
  if not exists (select 1 from profesionales p
                  where p.id = p_profesional and p.local_id = v_local
                    and p.activo and p.acepta_reservas_online) then
    raise exception 'Ese profesional no está disponible para reserva online';
  end if;

  select id into v_cliente from clientes where local_id = v_local and celular = p_celular;
  if v_cliente is null then
    insert into clientes (local_id, nombre, celular, email, origen, primera_visita)
    values (v_local, p_nombre, p_celular, p_email, 'online', current_date)
    returning id into v_cliente;
    insert into fichas (local_id, cliente_id) values (v_local, v_cliente);
  end if;

  insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin,
                      estado, origen, notas)
  values (v_local, v_cliente, p_profesional, p_servicio, p_inicio, p_inicio,
          'pendiente', 'online', nullif(btrim(coalesce(p_nota, '')), ''))
  returning id into v_turno;   -- fin y precio los pone el trigger

  return v_turno;
end $$;

revoke all on function reservar_online(text,uuid,uuid,timestamptz,text,text,text,text) from public;
grant execute on function reservar_online(text,uuid,uuid,timestamptz,text,text,text,text)
  to anon, authenticated;
