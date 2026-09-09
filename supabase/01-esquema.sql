-- ============================================================
-- ÁRA — esquema completo para Supabase (Postgres 15+)
-- Pegar entero en el SQL Editor de Supabase y ejecutar una vez.
-- Orden: extensiones → tipos → tablas → índices → funciones
--        → triggers → RLS → funciones públicas → datos de ejemplo
-- ============================================================

create extension if not exists btree_gist;
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. TIPOS
-- ------------------------------------------------------------
create type rol_usuario   as enum ('dueno','profesional','recepcion','cajero');
create type estado_turno  as enum ('pendiente','confirmado','en_atencion','terminado','ausente','cancelado');
create type origen_turno  as enum ('mostrador','online','telefono');
create type estado_local  as enum ('prueba','activo','suspendido','baja');
create type medio_pago    as enum ('efectivo','tarjeta','transferencia','qr','otro');
create type tipo_producto as enum ('insumo','venta');

-- ------------------------------------------------------------
-- 2. TABLAS
-- ------------------------------------------------------------

-- 2.1 El local y su gente ------------------------------------

create table planes (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  precio_mensual numeric(12,2) not null,
  max_usuarios  int,                       -- null = ilimitado
  modulos       jsonb not null default '{}'::jsonb,
  activo        boolean not null default true,
  created_at    timestamptz not null default now()
);

create table locales (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  slug          text not null unique,      -- ara.com.py/<slug>
  rubro         text not null,
  direccion     text,
  telefono_wa   text,
  instagram     text,
  zona_horaria  text not null default 'America/Asuncion',
  moneda        text not null default 'PYG',
  config        jsonb not null default '{}'::jsonb,  -- esquema de campos de ficha por rubro
  plan_id       uuid references planes(id),
  estado        estado_local not null default 'prueba',
  prueba_hasta  date,
  created_at    timestamptz not null default now(),
  constraint slug_valido check (slug ~ '^[a-z0-9-]{3,40}$')
);

create table usuarios (
  id            uuid primary key default gen_random_uuid(),
  auth_id       uuid not null references auth.users(id) on delete cascade,
  local_id      uuid not null references locales(id) on delete cascade,
  nombre        text not null,
  email         text not null,
  rol           rol_usuario not null,
  activo        boolean not null default true,
  ultimo_acceso timestamptz,
  created_at    timestamptz not null default now(),
  unique (auth_id, local_id)               -- una persona puede estar en varios locales
);

create table profesionales (
  id            uuid primary key default gen_random_uuid(),
  local_id      uuid not null references locales(id) on delete cascade,
  usuario_id    uuid references usuarios(id) on delete set null,  -- null = todavía sin login
  nombre_publico text not null,
  especialidad  text,
  anios_oficio  int,
  bio           text,
  foto_url      text,
  slug          text,                      -- su link propio: /<local>/<slug>
  comision_servicios numeric(5,2) default 0,
  comision_productos numeric(5,2) default 0,
  acepta_reservas_online boolean not null default true,
  orden         int not null default 0,
  activo        boolean not null default true,
  created_at    timestamptz not null default now(),
  unique (local_id, slug)
);

create table recursos (
  id         uuid primary key default gen_random_uuid(),
  local_id   uuid not null references locales(id) on delete cascade,
  nombre     text not null,
  tipo       text,                          -- cabina | sillon | consultorio | sala
  capacidad  int not null default 1,
  activo     boolean not null default true,
  created_at timestamptz not null default now()
);

create table horarios (
  id             uuid primary key default gen_random_uuid(),
  local_id       uuid not null references locales(id) on delete cascade,
  profesional_id uuid references profesionales(id) on delete cascade,  -- null = horario del local
  dia_semana     int not null check (dia_semana between 0 and 6),      -- 0 = domingo
  hora_inicio    time not null,
  hora_fin       time not null,
  check (hora_fin > hora_inicio)
);

create table bloqueos (
  id             uuid primary key default gen_random_uuid(),
  local_id       uuid not null references locales(id) on delete cascade,
  profesional_id uuid references profesionales(id) on delete cascade,  -- null = todo el local
  desde          timestamptz not null,
  hasta          timestamptz not null,
  motivo         text,
  created_at     timestamptz not null default now(),
  check (hasta > desde)
);

-- 2.2 Catálogo ------------------------------------------------

create table servicios (
  id            uuid primary key default gen_random_uuid(),
  local_id      uuid not null references locales(id) on delete cascade,
  nombre        text not null,
  categoria     text,
  duracion_min  int not null check (duracion_min > 0),
  precio        numeric(12,2) not null default 0,
  requiere_sena boolean not null default false,
  sena_monto    numeric(12,2) default 0,
  activo        boolean not null default true,
  visible_online boolean not null default true,
  orden         int not null default 0,
  created_at    timestamptz not null default now()
);

create table servicios_profesionales (
  id             uuid primary key default gen_random_uuid(),
  local_id       uuid not null references locales(id) on delete cascade,
  servicio_id    uuid not null references servicios(id) on delete cascade,
  profesional_id uuid not null references profesionales(id) on delete cascade,
  precio_propio  numeric(12,2),             -- null = usa servicios.precio
  duracion_propia int,                      -- null = usa servicios.duracion_min
  unique (servicio_id, profesional_id)
);

create table paquetes (
  id                uuid primary key default gen_random_uuid(),
  local_id          uuid not null references locales(id) on delete cascade,
  nombre            text not null,
  servicio_id       uuid references servicios(id) on delete set null,
  cantidad_sesiones int not null check (cantidad_sesiones > 0),
  precio_total      numeric(12,2) not null,
  vencimiento_dias  int,
  activo            boolean not null default true
);

-- 2.3 Clientes y turnos ---------------------------------------

create table clientes (
  id            uuid primary key default gen_random_uuid(),
  local_id      uuid not null references locales(id) on delete cascade,
  nombre        text not null,
  apellido      text,
  celular       text,
  email         text,
  fecha_nac     date,
  notas         text,
  profesional_habitual_id uuid references profesionales(id) on delete set null,
  origen        text,
  primera_visita date,
  ultima_visita  date,
  created_at    timestamptz not null default now(),
  unique (local_id, celular)                -- llave con la que entra al portal
);

create table fichas (
  id             uuid primary key default gen_random_uuid(),
  local_id       uuid not null references locales(id) on delete cascade,
  cliente_id     uuid not null unique references clientes(id) on delete cascade,
  datos          jsonb not null default '{}'::jsonb,  -- campos propios del rubro
  actualizado_por uuid references usuarios(id) on delete set null,
  actualizado_en timestamptz not null default now()
);

create table paquetes_clientes (
  id              uuid primary key default gen_random_uuid(),
  local_id        uuid not null references locales(id) on delete cascade,
  cliente_id      uuid not null references clientes(id) on delete cascade,
  paquete_id      uuid not null references paquetes(id),
  sesiones_usadas int not null default 0,
  saldo_pendiente numeric(12,2) not null default 0,
  vence_el        date,
  cerrado         boolean not null default false,
  created_at      timestamptz not null default now()
);

create table turnos (
  id                uuid primary key default gen_random_uuid(),
  local_id          uuid not null references locales(id) on delete cascade,
  cliente_id        uuid not null references clientes(id) on delete cascade,
  profesional_id    uuid not null references profesionales(id),
  servicio_id       uuid not null references servicios(id),
  recurso_id        uuid references recursos(id),
  inicio            timestamptz not null,
  fin               timestamptz not null,
  estado            estado_turno not null default 'pendiente',
  precio_congelado  numeric(12,2) not null default 0,
  origen            origen_turno not null default 'mostrador',
  sena_pagada       numeric(12,2) not null default 0,
  notas             text,
  paquete_cliente_id uuid references paquetes_clientes(id) on delete set null,
  created_by        uuid references usuarios(id) on delete set null,
  created_at        timestamptz not null default now(),
  check (fin > inicio)
);

-- REGLA 1 y 2: dos turnos no pueden pisarse. Postgres lo hace cumplir,
-- no el frontend: es lo único que resiste dos personas agendando a la vez.
alter table turnos add constraint sin_choque_profesional
  exclude using gist (
    profesional_id with =,
    tstzrange(inicio, fin) with &&
  ) where (estado not in ('cancelado','ausente'));

alter table turnos add constraint sin_choque_recurso
  exclude using gist (
    recurso_id with =,
    tstzrange(inicio, fin) with &&
  ) where (recurso_id is not null and estado not in ('cancelado','ausente'));

create table lista_espera (
  id             uuid primary key default gen_random_uuid(),
  local_id       uuid not null references locales(id) on delete cascade,
  cliente_id     uuid not null references clientes(id) on delete cascade,
  servicio_id    uuid references servicios(id) on delete set null,
  profesional_id uuid references profesionales(id) on delete set null,
  desde          timestamptz,
  hasta          timestamptz,
  avisado_en     timestamptz,
  resuelto       boolean not null default false,
  created_at     timestamptz not null default now()
);

create table archivos (
  id            uuid primary key default gen_random_uuid(),
  local_id      uuid not null references locales(id) on delete cascade,
  cliente_id    uuid not null references clientes(id) on delete cascade,
  turno_id      uuid references turnos(id) on delete set null,
  tipo          text,                      -- foto | radiografia | consentimiento | orden
  storage_path  text not null,             -- bucket privado de Supabase Storage
  subido_por    uuid references usuarios(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- 2.4 Plata ----------------------------------------------------

create table cajas (
  id               uuid primary key default gen_random_uuid(),
  local_id         uuid not null references locales(id) on delete cascade,
  abierta_por      uuid references usuarios(id),
  abierta_en       timestamptz not null default now(),
  monto_inicial    numeric(12,2) not null default 0,
  cerrada_por      uuid references usuarios(id),
  cerrada_en       timestamptz,
  monto_declarado  numeric(12,2),
  monto_sistema    numeric(12,2),
  diferencia       numeric(12,2),
  motivo_diferencia text
);

create table cobros (
  id              uuid primary key default gen_random_uuid(),
  local_id        uuid not null references locales(id) on delete cascade,
  caja_id         uuid references cajas(id),
  turno_id        uuid references turnos(id) on delete set null,
  cliente_id      uuid references clientes(id) on delete set null,
  profesional_id  uuid references profesionales(id) on delete set null,
  monto           numeric(12,2) not null,
  medio           medio_pago not null default 'efectivo',
  concepto        text,
  comprobante_nro text,
  anulado         boolean not null default false,
  anulado_motivo  text,
  anulado_por     uuid references usuarios(id),
  created_by      uuid references usuarios(id),
  created_at      timestamptz not null default now()
);

create table productos (
  id            uuid primary key default gen_random_uuid(),
  local_id      uuid not null references locales(id) on delete cascade,
  nombre        text not null,
  categoria     text,
  tipo          tipo_producto not null default 'insumo',
  stock         numeric(12,2) not null default 0,
  stock_minimo  numeric(12,2) not null default 0,
  costo         numeric(12,2) default 0,
  precio_venta  numeric(12,2) default 0,
  activo        boolean not null default true
);

create table movimientos_stock (
  id          uuid primary key default gen_random_uuid(),
  local_id    uuid not null references locales(id) on delete cascade,
  producto_id uuid not null references productos(id) on delete cascade,
  cantidad    numeric(12,2) not null,      -- positivo entra, negativo sale
  motivo      text,
  turno_id    uuid references turnos(id) on delete set null,
  usuario_id  uuid references usuarios(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- 2.5 Suscripción y auditoría ---------------------------------

create table suscripciones (
  id          uuid primary key default gen_random_uuid(),
  local_id    uuid not null references locales(id) on delete cascade,
  plan_id     uuid not null references planes(id),
  desde       date not null default current_date,
  hasta       date,
  estado      text not null default 'activa',
  ultimo_pago date
);

create table auditoria (
  id         bigserial primary key,
  local_id   uuid,
  tabla      text not null,
  fila_id    uuid,
  accion     text not null,               -- insert | update | delete
  usuario_id uuid,
  antes      jsonb,
  despues    jsonb,
  cuando     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. ÍNDICES (las consultas que se hacen mil veces por día)
-- ------------------------------------------------------------
create index on turnos    (local_id, inicio);
create index on turnos    (profesional_id, inicio);
create index on turnos    (cliente_id, inicio desc);
create index on clientes  (local_id, celular);
create index on clientes  (local_id, ultima_visita);
create index on cobros    (caja_id);
create index on cobros    (local_id, created_at desc);
create index on usuarios  (auth_id);
create index on archivos  (cliente_id);
create index on movimientos_stock (producto_id, created_at desc);

-- ------------------------------------------------------------
-- 4. FUNCIONES DE CONTEXTO (quién soy)
-- ------------------------------------------------------------

create or replace function mi_local() returns uuid
  language sql stable security definer set search_path = public as $$
  select local_id from usuarios where auth_id = auth.uid() and activo limit 1
$$;

create or replace function mi_rol() returns rol_usuario
  language sql stable security definer set search_path = public as $$
  select rol from usuarios where auth_id = auth.uid() and activo limit 1
$$;

create or replace function mi_usuario() returns uuid
  language sql stable security definer set search_path = public as $$
  select id from usuarios where auth_id = auth.uid() and activo limit 1
$$;

create or replace function mi_profesional() returns uuid
  language sql stable security definer set search_path = public as $$
  select p.id from profesionales p
  join usuarios u on u.id = p.usuario_id
  where u.auth_id = auth.uid() and u.activo limit 1
$$;

-- ------------------------------------------------------------
-- 5. TRIGGERS (reglas 3 a 9 del modelo de datos)
-- ------------------------------------------------------------

-- REGLA 3 y 4: la duración y el precio los pone la base, nunca el cliente.
create or replace function turno_completar() returns trigger
  language plpgsql security definer set search_path = public as $$
declare
  v_dur int; v_precio numeric(12,2);
begin
  select coalesce(sp.duracion_propia, s.duracion_min),
         coalesce(sp.precio_propio,   s.precio)
    into v_dur, v_precio
  from servicios s
  left join servicios_profesionales sp
    on sp.servicio_id = s.id and sp.profesional_id = new.profesional_id
  where s.id = new.servicio_id;

  if v_dur is null then
    raise exception 'El servicio % no existe', new.servicio_id;
  end if;

  new.fin := new.inicio + make_interval(mins => v_dur);
  if tg_op = 'INSERT' then
    new.precio_congelado := v_precio;      -- se congela: un cambio de precios no lo toca
  end if;
  return new;
end $$;

create trigger t_turno_completar
  before insert or update of inicio, servicio_id, profesional_id on turnos
  for each row execute function turno_completar();

-- REGLA 6: solo se agenda lo que el profesional hace.
create or replace function turno_valida_servicio() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from servicios_profesionales where servicio_id = new.servicio_id) then
    if not exists (
      select 1 from servicios_profesionales
      where servicio_id = new.servicio_id and profesional_id = new.profesional_id
    ) then
      raise exception 'Ese profesional no realiza el servicio seleccionado';
    end if;
  end if;
  return new;
end $$;

create trigger t_turno_valida_servicio
  before insert or update of servicio_id, profesional_id on turnos
  for each row execute function turno_valida_servicio();

-- REGLA 5: el turno cae dentro del horario y fuera de los bloqueos.
-- Vale también para el mostrador: si está de vacaciones, no se agenda ni a mano.
create or replace function turno_valida_horario() returns trigger
  language plpgsql security definer set search_path = public as $$
declare
  v_tz text; v_ini timestamp; v_fin timestamp; v_dow int;
begin
  if new.estado in ('cancelado','ausente') then return new; end if;

  select zona_horaria into v_tz from locales where id = new.local_id;
  v_ini := new.inicio at time zone v_tz;
  v_fin := new.fin    at time zone v_tz;
  v_dow := extract(dow from v_ini);

  if not exists (
    select 1 from horarios h
    where h.local_id = new.local_id and h.profesional_id is null
      and h.dia_semana = v_dow
      and v_ini::time >= h.hora_inicio and v_fin::time <= h.hora_fin
  ) then
    raise exception 'El turno cae fuera del horario del local';
  end if;

  if exists (select 1 from horarios where profesional_id = new.profesional_id) then
    if not exists (
      select 1 from horarios h
      where h.profesional_id = new.profesional_id
        and h.dia_semana = v_dow
        and v_ini::time >= h.hora_inicio and v_fin::time <= h.hora_fin
    ) then
      raise exception 'El profesional no trabaja en ese horario';
    end if;
  end if;

  if exists (
    select 1 from bloqueos b
    where b.local_id = new.local_id
      and (b.profesional_id is null or b.profesional_id = new.profesional_id)
      and tstzrange(b.desde, b.hasta) && tstzrange(new.inicio, new.fin)
  ) then
    raise exception 'Hay un bloqueo en ese rango (vacaciones, feriado o ausencia)';
  end if;

  return new;
end $$;

create trigger t_turno_valida_horario
  before insert or update of inicio, profesional_id, estado on turnos
  for each row execute function turno_valida_horario();

-- REGLA 8: la sesión del paquete se descuenta al terminar el turno.
create or replace function turno_descuenta_paquete() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if new.estado = 'terminado' and old.estado <> 'terminado'
     and new.paquete_cliente_id is not null then
    update paquetes_clientes pc
       set sesiones_usadas = pc.sesiones_usadas + 1,
           cerrado = (pc.sesiones_usadas + 1) >= (select cantidad_sesiones from paquetes where id = pc.paquete_id)
     where pc.id = new.paquete_cliente_id;
  end if;

  if new.estado = 'terminado' and old.estado <> 'terminado' then
    update clientes set ultima_visita = (new.inicio at time zone 'America/Asuncion')::date
     where id = new.cliente_id;
  end if;
  return new;
end $$;

create trigger t_turno_descuenta_paquete
  after update of estado on turnos
  for each row execute function turno_descuenta_paquete();

-- REGLA 7: el movimiento de stock actualiza el saldo del producto.
create or replace function stock_aplica() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  update productos set stock = stock + new.cantidad where id = new.producto_id;
  return new;
end $$;

create trigger t_stock_aplica
  after insert on movimientos_stock
  for each row execute function stock_aplica();

-- Un cobro nunca se borra: se anula. Y suma al total de la caja abierta.
create or replace function cobro_no_se_borra() returns trigger
  language plpgsql as $$
begin
  raise exception 'Los cobros no se borran: marcá anulado = true con su motivo';
end $$;

create trigger t_cobro_no_se_borra
  before delete on cobros
  for each row execute function cobro_no_se_borra();

-- REGLA 9: auditoría de lo sensible.
create or replace function auditar() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into auditoria (local_id, tabla, fila_id, accion, usuario_id, antes, despues)
  values (
    coalesce((case when tg_op = 'DELETE' then old.local_id else new.local_id end), null),
    tg_table_name,
    (case when tg_op = 'DELETE' then old.id else new.id end),
    lower(tg_op),
    mi_usuario(),
    (case when tg_op = 'INSERT' then null else to_jsonb(old) end),
    (case when tg_op = 'DELETE' then null else to_jsonb(new) end)
  );
  return coalesce(new, old);
end $$;

create trigger t_aud_servicios after insert or update or delete on servicios
  for each row execute function auditar();
create trigger t_aud_usuarios  after insert or update or delete on usuarios
  for each row execute function auditar();
create trigger t_aud_cobros    after insert or update on cobros
  for each row execute function auditar();
create trigger t_aud_fichas    after insert or update on fichas
  for each row execute function auditar();
create trigger t_aud_cajas     after update on cajas
  for each row execute function auditar();

-- ------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- El aislamiento por local va en TODAS las tablas con local_id.
-- Encima, el filtro por rol donde el diseño lo pide.
-- ------------------------------------------------------------

alter table locales        enable row level security;
alter table usuarios       enable row level security;
alter table profesionales  enable row level security;
alter table recursos       enable row level security;
alter table horarios       enable row level security;
alter table bloqueos       enable row level security;
alter table servicios      enable row level security;
alter table servicios_profesionales enable row level security;
alter table paquetes       enable row level security;
alter table clientes       enable row level security;
alter table fichas         enable row level security;
alter table paquetes_clientes enable row level security;
alter table turnos         enable row level security;
alter table lista_espera   enable row level security;
alter table archivos       enable row level security;
alter table cajas          enable row level security;
alter table cobros         enable row level security;
alter table productos      enable row level security;
alter table movimientos_stock enable row level security;
alter table suscripciones  enable row level security;
alter table auditoria      enable row level security;
alter table planes         enable row level security;

-- El local: cada uno ve el suyo; solo el dueño lo edita.
create policy loc_ver  on locales for select using (id = mi_local());
create policy loc_edit on locales for update using (id = mi_local() and mi_rol() = 'dueno');

create policy planes_ver on planes for select using (true);

-- Aislamiento + escritura del dueño. Patrón que se repite.
create policy prof_ver   on profesionales for select using (local_id = mi_local());
create policy prof_edit  on profesionales for update
  using (local_id = mi_local() and (mi_rol() = 'dueno' or id = mi_profesional()));
create policy prof_crea  on profesionales for insert
  with check (local_id = mi_local() and mi_rol() = 'dueno');

create policy usr_ver  on usuarios for select
  using (local_id = mi_local() and (mi_rol() = 'dueno' or auth_id = auth.uid()));
create policy usr_todo on usuarios for all
  using (local_id = mi_local() and mi_rol() = 'dueno')
  with check (local_id = mi_local() and mi_rol() = 'dueno');

create policy rec_ver  on recursos for select using (local_id = mi_local());
create policy rec_todo on recursos for all
  using (local_id = mi_local() and mi_rol() = 'dueno')
  with check (local_id = mi_local() and mi_rol() = 'dueno');

create policy hor_ver  on horarios for select using (local_id = mi_local());
create policy hor_todo on horarios for all
  using (local_id = mi_local() and (mi_rol() = 'dueno' or profesional_id = mi_profesional()))
  with check (local_id = mi_local() and (mi_rol() = 'dueno' or profesional_id = mi_profesional()));

create policy blo_ver  on bloqueos for select using (local_id = mi_local());
create policy blo_todo on bloqueos for all
  using (local_id = mi_local() and (mi_rol() = 'dueno' or profesional_id = mi_profesional()))
  with check (local_id = mi_local() and (mi_rol() = 'dueno' or profesional_id = mi_profesional()));

-- Catálogo: todos lo leen, solo el dueño lo toca.
create policy srv_ver  on servicios for select using (local_id = mi_local());
create policy srv_todo on servicios for all
  using (local_id = mi_local() and mi_rol() = 'dueno')
  with check (local_id = mi_local() and mi_rol() = 'dueno');

create policy sp_ver  on servicios_profesionales for select using (local_id = mi_local());
create policy sp_todo on servicios_profesionales for all
  using (local_id = mi_local() and (mi_rol() = 'dueno' or profesional_id = mi_profesional()))
  with check (local_id = mi_local() and (mi_rol() = 'dueno' or profesional_id = mi_profesional()));

create policy paq_ver  on paquetes for select using (local_id = mi_local());
create policy paq_todo on paquetes for all
  using (local_id = mi_local() and mi_rol() = 'dueno')
  with check (local_id = mi_local() and mi_rol() = 'dueno');

-- Clientes: el profesional ve solo a quien atendió.
create policy cli_ver on clientes for select using (
  local_id = mi_local() and (
    mi_rol() in ('dueno','recepcion','cajero')
    or exists (select 1 from turnos t where t.cliente_id = clientes.id and t.profesional_id = mi_profesional())
  )
);
create policy cli_escribe on clientes for insert
  with check (local_id = mi_local() and mi_rol() in ('dueno','recepcion','profesional'));
create policy cli_edita on clientes for update
  using (local_id = mi_local() and mi_rol() in ('dueno','recepcion'));

-- Ficha: la más estricta. Recepción y caja NO entran.
create policy fic_ver on fichas for select using (
  local_id = mi_local() and (
    mi_rol() = 'dueno'
    or exists (select 1 from turnos t where t.cliente_id = fichas.cliente_id and t.profesional_id = mi_profesional())
  )
);
create policy fic_escribe on fichas for all using (
  local_id = mi_local() and (
    mi_rol() = 'dueno'
    or exists (select 1 from turnos t where t.cliente_id = fichas.cliente_id and t.profesional_id = mi_profesional())
  )
) with check (local_id = mi_local() and mi_rol() in ('dueno','profesional'));

create policy arc_ver on archivos for select using (
  local_id = mi_local() and (
    mi_rol() = 'dueno'
    or exists (select 1 from turnos t where t.cliente_id = archivos.cliente_id and t.profesional_id = mi_profesional())
  )
);
create policy arc_sube on archivos for insert
  with check (local_id = mi_local() and mi_rol() in ('dueno','profesional'));

create policy pc_ver  on paquetes_clientes for select using (local_id = mi_local());
create policy pc_todo on paquetes_clientes for all
  using (local_id = mi_local() and mi_rol() in ('dueno','recepcion','cajero'))
  with check (local_id = mi_local() and mi_rol() in ('dueno','recepcion','cajero'));

-- Turnos: el profesional ve y edita los suyos.
create policy tur_ver on turnos for select using (
  local_id = mi_local() and (
    mi_rol() in ('dueno','recepcion','cajero') or profesional_id = mi_profesional()
  )
);
create policy tur_crea on turnos for insert
  with check (local_id = mi_local() and mi_rol() in ('dueno','recepcion','profesional'));
create policy tur_edita on turnos for update using (
  local_id = mi_local() and (
    mi_rol() in ('dueno','recepcion') or profesional_id = mi_profesional()
  )
);

create policy esp_todo on lista_espera for all
  using (local_id = mi_local() and mi_rol() in ('dueno','recepcion'))
  with check (local_id = mi_local() and mi_rol() in ('dueno','recepcion'));

-- Caja: la abre y cierra quien cobra.
create policy caj_ver  on cajas for select
  using (local_id = mi_local() and mi_rol() in ('dueno','cajero'));
create policy caj_todo on cajas for all
  using (local_id = mi_local() and mi_rol() in ('dueno','cajero'))
  with check (local_id = mi_local() and mi_rol() in ('dueno','cajero'));

-- Cobros: el profesional ve solo los suyos (su producción).
create policy cob_ver on cobros for select using (
  local_id = mi_local() and (
    mi_rol() in ('dueno','cajero') or profesional_id = mi_profesional()
  )
);
create policy cob_crea on cobros for insert
  with check (local_id = mi_local() and mi_rol() in ('dueno','cajero'));
create policy cob_anula on cobros for update
  using (local_id = mi_local() and mi_rol() in ('dueno','cajero'));

create policy prod_ver  on productos for select using (local_id = mi_local());
create policy prod_todo on productos for all
  using (local_id = mi_local() and mi_rol() in ('dueno','cajero'))
  with check (local_id = mi_local() and mi_rol() in ('dueno','cajero'));

create policy mov_ver  on movimientos_stock for select
  using (local_id = mi_local() and mi_rol() in ('dueno','cajero'));
create policy mov_crea on movimientos_stock for insert
  with check (local_id = mi_local() and mi_rol() in ('dueno','cajero'));

create policy sus_ver on suscripciones for select
  using (local_id = mi_local() and mi_rol() = 'dueno');

-- Auditoría: solo lectura, y solo el dueño. Nadie la edita ni la borra.
create policy aud_ver on auditoria for select
  using (local_id = mi_local() and mi_rol() = 'dueno');

-- ------------------------------------------------------------
-- 7. LO PÚBLICO (reserva online y portal del cliente)
-- No se abren tablas: se exponen funciones que devuelven
-- exactamente lo que el portal necesita y nada más.
-- ------------------------------------------------------------

create or replace function local_publico(p_slug text)
returns table (nombre text, rubro text, direccion text, instagram text, zona_horaria text)
language sql stable security definer set search_path = public as $$
  select l.nombre, l.rubro, l.direccion, l.instagram, l.zona_horaria
  from locales l where l.slug = p_slug and l.estado in ('prueba','activo')
$$;

create or replace function servicios_publicos(p_slug text)
returns table (id uuid, nombre text, categoria text, duracion_min int,
               precio numeric, requiere_sena boolean, sena_monto numeric)
language sql stable security definer set search_path = public as $$
  select s.id, s.nombre, s.categoria, s.duracion_min, s.precio, s.requiere_sena, s.sena_monto
  from servicios s join locales l on l.id = s.local_id
  where l.slug = p_slug and s.activo and s.visible_online
  order by s.orden, s.nombre
$$;

create or replace function profesionales_publicos(p_slug text, p_servicio uuid default null)
returns table (id uuid, nombre_publico text, especialidad text, anios_oficio int,
               bio text, foto_url text, slug text)
language sql stable security definer set search_path = public as $$
  select p.id, p.nombre_publico, p.especialidad, p.anios_oficio, p.bio, p.foto_url, p.slug
  from profesionales p join locales l on l.id = p.local_id
  where l.slug = p_slug and p.activo and p.acepta_reservas_online
    and (p_servicio is null or exists (
      select 1 from servicios_profesionales sp
      where sp.profesional_id = p.id and sp.servicio_id = p_servicio))
  order by p.orden, p.nombre_publico
$$;

-- Huecos libres: devuelve horarios, nunca el nombre de otro cliente.
create or replace function huecos_libres(
  p_slug text, p_servicio uuid, p_profesional uuid, p_fecha date
) returns table (inicio timestamptz, fin timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare
  v_local uuid; v_tz text; v_dur int; v_dow int; v_paso int := 15;
begin
  select l.id, l.zona_horaria into v_local, v_tz
  from locales l where l.slug = p_slug and l.estado in ('prueba','activo');
  if v_local is null then return; end if;

  select coalesce(sp.duracion_propia, s.duracion_min) into v_dur
  from servicios s
  left join servicios_profesionales sp on sp.servicio_id = s.id and sp.profesional_id = p_profesional
  where s.id = p_servicio and s.local_id = v_local and s.activo and s.visible_online;
  if v_dur is null then return; end if;

  v_dow := extract(dow from p_fecha);

  return query
  with ventanas as (
    select h.hora_inicio, h.hora_fin from horarios h
    where h.local_id = v_local and h.dia_semana = v_dow
      and (h.profesional_id = p_profesional
           or (h.profesional_id is null
               and not exists (select 1 from horarios where profesional_id = p_profesional)))
  ),
  candidatos as (
    select gs as ini, gs + make_interval(mins => v_dur) as fin
    from ventanas v,
    lateral generate_series(
      ((p_fecha + v.hora_inicio) at time zone v_tz),
      ((p_fecha + v.hora_fin) at time zone v_tz) - make_interval(mins => v_dur),
      make_interval(mins => v_paso)
    ) gs
  )
  select c.ini, c.fin from candidatos c
  where c.ini > now()
    and not exists (
      select 1 from turnos t
      where t.profesional_id = p_profesional
        and t.estado not in ('cancelado','ausente')
        and tstzrange(t.inicio, t.fin) && tstzrange(c.ini, c.fin))
    and not exists (
      select 1 from bloqueos b
      where b.local_id = v_local
        and (b.profesional_id is null or b.profesional_id = p_profesional)
        and tstzrange(b.desde, b.hasta) && tstzrange(c.ini, c.fin))
  order by c.ini;
end $$;

-- Reservar desde el portal. Crea el cliente si no existe.
create or replace function reservar_online(
  p_slug text, p_servicio uuid, p_profesional uuid, p_inicio timestamptz,
  p_nombre text, p_celular text, p_email text default null
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

  insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin, estado, origen)
  values (v_local, v_cliente, p_profesional, p_servicio, p_inicio, p_inicio, 'pendiente', 'online')
  returning id into v_turno;   -- fin y precio los pone el trigger

  return v_turno;
end $$;

-- Alta de un local nuevo (pantalla /crear-cuenta).
-- Es lo único del alta que no puede pasar por RLS: hasta que exista la fila en
-- usuarios, mi_local() devuelve null y ninguna política deja escribir, ni
-- siquiera en locales. Esta función crea el local y deja como dueño a quien
-- está logueado. El resto del alta —horario, catálogo, equipo— ya entra por
-- las policies normales, porque a partir de acá mi_rol() es 'dueno'.
create or replace function crear_local(
  p_nombre text, p_slug text, p_rubro text, p_nombre_usuario text,
  p_direccion text default null, p_telefono_wa text default null,
  p_instagram text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_auth uuid := auth.uid(); v_email text; v_local uuid;
begin
  if v_auth is null then
    raise exception 'Hay que iniciar sesión para crear un local';
  end if;

  select email into v_email from auth.users where id = v_auth;

  if exists (select 1 from locales where slug = p_slug) then
    raise exception 'Ya hay un local con la dirección /%', p_slug;
  end if;

  insert into locales (nombre, slug, rubro, direccion, telefono_wa, instagram,
                       estado, prueba_hasta)
  values (p_nombre, p_slug, p_rubro, p_direccion, p_telefono_wa, p_instagram,
          'prueba', current_date + 30)
  returning id into v_local;

  insert into usuarios (auth_id, local_id, nombre, email, rol)
  values (v_auth, v_local, p_nombre_usuario, v_email, 'dueno');

  return v_local;
end $$;

revoke all on function crear_local(text,text,text,text,text,text,text) from public;
grant execute on function crear_local(text,text,text,text,text,text,text) to authenticated;

revoke all on function reservar_online(text,uuid,uuid,timestamptz,text,text,text) from public;
grant execute on function local_publico(text),
                        servicios_publicos(text),
                        profesionales_publicos(text,uuid),
                        huecos_libres(text,uuid,uuid,date),
                        reservar_online(text,uuid,uuid,timestamptz,text,text,text)
  to anon, authenticated;

-- ------------------------------------------------------------
-- 8. STORAGE (bucket privado para fotos, radiografías, consentimientos)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('archivos','archivos', false)
  on conflict (id) do nothing;

-- Las rutas son {local_id}/{cliente_id}/{uuid}.ext. El primer segmento aísla
-- el local; el segundo decide quién entra, con el mismo criterio que las
-- policies de la tabla archivos: la dueña ve todo, el profesional solo los
-- clientes que atendió, recepción y caja no entran. Sin esto, el aislamiento
-- por local alcanzaba para que recepción bajara una radiografía con URL firmada.
create or replace function puede_ver_cliente(p_cliente uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select mi_rol() = 'dueno'
      or exists (select 1 from turnos t
                  where t.cliente_id = p_cliente
                    and t.profesional_id = mi_profesional())
$$;

-- El segundo segmento de una ruta cualquiera no tiene por qué ser un uuid:
-- el case evita que el cast reviente la policy. Ruta rara = solo la dueña.
create or replace function carpeta_cliente(p_name text) returns uuid
  language sql stable set search_path = public as $$
  select case when (storage.foldername(p_name))[2] ~
              '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
         then ((storage.foldername(p_name))[2])::uuid end
$$;

create policy archivos_lee on storage.objects for select using (
  bucket_id = 'archivos'
  and (storage.foldername(name))[1] = mi_local()::text
  and puede_ver_cliente(carpeta_cliente(name))
);
create policy archivos_sube on storage.objects for insert with check (
  bucket_id = 'archivos'
  and (storage.foldername(name))[1] = mi_local()::text
  and mi_rol() in ('dueno','profesional')
  and puede_ver_cliente(carpeta_cliente(name))
);

-- ============================================================
-- FIN DEL ESQUEMA
-- Los datos de ejemplo van en 02-datos-ejemplo.sql
-- ============================================================
