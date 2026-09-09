-- ============================================================
-- ÁRA — comprobación de que las reglas funcionan
-- Reemplaza los tres chequeos manuales del paso 1.5 de DESPLIEGUE.md.
--
-- Ejecutar DESPUÉS de 01-esquema.sql y 02-datos-ejemplo.sql.
-- Se pega entero en el SQL Editor de Supabase y se ejecuta.
--
-- NO deja nada: todo corre dentro de una transacción que termina en
-- rollback. Los turnos, clientes, bloqueos y filas de auditoría que
-- crea desaparecen al terminar. Se puede correr las veces que haga falta.
--
-- Devuelve una tabla. Todas las filas tienen que decir 'ok'.
-- Cualquier 'FALLA' es una regla que no está funcionando.
-- ============================================================

begin;

create schema pruebas;

create table pruebas.resultado (
  n serial primary key, estado text, regla text, detalle text
);

-- security definer: los bloques de RLS corren como 'authenticated' y 'anon',
-- que no tienen permiso de escribir en esta tabla.
create function pruebas.anotar(p_estado text, p_regla text, p_detalle text) returns void
  language sql security definer set search_path = pruebas as $f$
  insert into pruebas.resultado(estado, regla, detalle) values (p_estado, p_regla, p_detalle)
$f$;

-- p_cond null = no se pudo probar (falta la cuenta del rol). Se distingue
-- de 'ok' a propósito: un bloque sin sesión devuelve 0 filas en todo, y eso
-- se parece peligrosamente a una política funcionando.
create function pruebas.afirmar(p_cond boolean, p_regla text, p_detalle text) returns void
  language sql security definer set search_path = pruebas as $f$
  select pruebas.anotar(
    case when p_cond is null then 'sin probar' when p_cond then 'ok' else 'FALLA' end,
    p_regla, p_detalle)
$f$;

-- Devuelve la condición solo si existe la cuenta de ese rol; si no, null.
create function pruebas.si_existe(p_email text, p_cond boolean) returns boolean
  language sql security definer set search_path = pruebas, public as $f$
  select case when exists (select 1 from usuarios where email = p_email) then p_cond end
$f$;

create function pruebas.debe_fallar(p_sql text, p_regla text) returns void
  language plpgsql security definer set search_path = pruebas, public as $f$
begin
  begin
    execute p_sql;
    perform pruebas.anotar('FALLA', p_regla, 'se permitió y NO debía');
  exception when others then
    perform pruebas.anotar('ok', p_regla, sqlerrm);
  end;
end $f$;

create function pruebas.debe_pasar(p_sql text, p_regla text) returns void
  language plpgsql security definer set search_path = pruebas, public as $f$
begin
  begin
    execute p_sql;
    perform pruebas.anotar('ok', p_regla, 'ejecutó sin error');
  exception when others then
    perform pruebas.anotar('FALLA', p_regla, sqlerrm);
  end;
end $f$;

-- Para pasar datos desde un bloque que corre como anon hacia las
-- comprobaciones de después, que corren como postgres.
create table pruebas.contexto (clave text primary key, valor text);

create function pruebas.guardar(p_clave text, p_valor text) returns void
  language sql security definer set search_path = pruebas as $f$
  insert into pruebas.contexto values (p_clave, p_valor)
  on conflict (clave) do update set valor = excluded.valor
$f$;

grant usage on schema pruebas to anon, authenticated;
grant execute on all functions in schema pruebas to anon, authenticated;

-- ------------------------------------------------------------
-- PARTE 1 — Las 9 reglas de negocio
-- ------------------------------------------------------------
do $bloque$
declare
  L      constant uuid := '33333333-3333-3333-3333-333333333333';
  SOFIA  constant uuid := '55555555-0000-0000-0000-000000000001';
  ANDREA constant uuid := '55555555-0000-0000-0000-000000000002';
  MAURO  constant uuid := '55555555-0000-0000-0000-000000000003';
  CORTE_DAMA constant uuid := '66666666-0000-0000-0000-000000000001';
  COLOR_RAIZ constant uuid := '66666666-0000-0000-0000-000000000003';
  BRUSHING   constant uuid := '66666666-0000-0000-0000-000000000005';
  C1 constant uuid := '77777777-0000-0000-0000-000000000001';
  C2 constant uuid := '77777777-0000-0000-0000-000000000002';
  C3 constant uuid := '77777777-0000-0000-0000-000000000003';
  v_mar date; v_lun date; v_rec uuid; v_turno uuid;
  v_ini timestamptz; v_fin timestamptz; v_precio numeric; v_stock numeric;
  v_paq uuid; v_pc uuid; v_n int;
begin
  -- Un martes de la semana que viene: el local abre 09-19 y Sofía también.
  -- Así la prueba no depende del día en que se corra.
  v_mar := current_date + 7;
  while extract(dow from v_mar) <> 2 loop v_mar := v_mar + 1; end loop;
  v_lun := v_mar + 6;                       -- el lunes siguiente: cerrado
  select id into v_rec from recursos where local_id = L order by nombre limit 1;

  -- REGLA 3: el fin lo calcula la base --------------------------------
  insert into turnos (local_id, cliente_id, profesional_id, servicio_id, recurso_id, inicio, fin, estado)
  values (L, C1, SOFIA, CORTE_DAMA, v_rec,
          (v_mar + time '15:00') at time zone 'America/Asuncion',
          (v_mar + time '15:00') at time zone 'America/Asuncion', 'confirmado')
  returning id, inicio, fin, precio_congelado into v_turno, v_ini, v_fin, v_precio;

  perform pruebas.afirmar(v_fin = v_ini + interval '45 min',
    'R3 el fin lo calcula la base',
    'corte de dama, 45 min, 15:00 → ' || to_char(v_fin at time zone 'America/Asuncion', 'HH24:MI'));

  -- REGLA 4: el precio se congela al agendar ---------------------------
  perform pruebas.afirmar(v_precio = 120000, 'R4 el precio se congela',
    'precio al agendar = ' || v_precio);
  update servicios set precio = 999999 where id = CORTE_DAMA;
  select precio_congelado into v_precio from turnos where id = v_turno;
  perform pruebas.afirmar(v_precio = 120000, 'R4 el precio se congela',
    'con la lista en 999.999 el turno sigue en ' || v_precio);
  update servicios set precio = 120000 where id = CORTE_DAMA;

  -- REGLA 1: dos turnos no se pisan ------------------------------------
  perform pruebas.debe_fallar(format(
    'insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin)'
    || ' values (%L, %L, %L, %L, %L, %L)',
    L, C2, SOFIA, BRUSHING,
    (v_mar + time '15:30') at time zone 'America/Asuncion',
    (v_mar + time '15:30') at time zone 'America/Asuncion'),
    'R1 dos turnos no se pisan');

  -- REGLA 2: el recurso tampoco ----------------------------------------
  perform pruebas.debe_fallar(format(
    'insert into turnos (local_id, cliente_id, profesional_id, servicio_id, recurso_id, inicio, fin)'
    || ' values (%L, %L, %L, %L, %L, %L, %L)',
    L, C2, ANDREA, BRUSHING, v_rec,
    (v_mar + time '15:30') at time zone 'America/Asuncion',
    (v_mar + time '15:30') at time zone 'America/Asuncion'),
    'R2 el recurso tampoco');

  -- cancelar libera el hueco
  update turnos set estado = 'cancelado' where id = v_turno;
  perform pruebas.debe_pasar(format(
    'insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin)'
    || ' values (%L, %L, %L, %L, %L, %L)',
    L, C2, SOFIA, BRUSHING,
    (v_mar + time '15:30') at time zone 'America/Asuncion',
    (v_mar + time '15:30') at time zone 'America/Asuncion'),
    'R1 cancelar libera el hueco');

  -- REGLA 5: horario del local, del profesional y bloqueos --------------
  perform pruebas.debe_fallar(format(
    'insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin)'
    || ' values (%L, %L, %L, %L, %L, %L)',
    L, C1, SOFIA, CORTE_DAMA,
    (v_lun + time '10:00') at time zone 'America/Asuncion',
    (v_lun + time '10:00') at time zone 'America/Asuncion'),
    'R5 un lunes: el local está cerrado');

  perform pruebas.debe_fallar(format(
    'insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin)'
    || ' values (%L, %L, %L, %L, %L, %L)',
    L, C1, SOFIA, CORTE_DAMA,
    (v_mar + time '18:45') at time zone 'America/Asuncion',
    (v_mar + time '18:45') at time zone 'America/Asuncion'),
    'R5 no entra antes del cierre');

  insert into bloqueos (local_id, profesional_id, desde, hasta, motivo)
  values (L, SOFIA,
          (v_mar + time '16:00') at time zone 'America/Asuncion',
          (v_mar + time '18:00') at time zone 'America/Asuncion', 'vacaciones');
  perform pruebas.debe_fallar(format(
    'insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin)'
    || ' values (%L, %L, %L, %L, %L, %L)',
    L, C1, SOFIA, CORTE_DAMA,
    (v_mar + time '16:30') at time zone 'America/Asuncion',
    (v_mar + time '16:30') at time zone 'America/Asuncion'),
    'R5 bloqueo: no se agenda ni a mano');

  -- REGLA 6: solo se agenda lo que el profesional hace -------------------
  perform pruebas.debe_fallar(format(
    'insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin)'
    || ' values (%L, %L, %L, %L, %L, %L)',
    L, C2, MAURO, COLOR_RAIZ,
    (v_mar + time '10:00') at time zone 'America/Asuncion',
    (v_mar + time '10:00') at time zone 'America/Asuncion'),
    'R6 Mauro no hace color');

  -- REGLA 7: el movimiento descuenta stock -------------------------------
  select stock into v_stock from productos where local_id = L and nombre = 'Shampoo matizador';
  insert into movimientos_stock (local_id, producto_id, cantidad, motivo)
  select L, id, -2, 'prueba' from productos where local_id = L and nombre = 'Shampoo matizador';
  perform pruebas.afirmar(
    (select stock from productos where local_id = L and nombre = 'Shampoo matizador') = v_stock - 2,
    'R7 el movimiento descuenta stock',
    v_stock || ' - 2 = ' || (select stock from productos where local_id = L and nombre = 'Shampoo matizador'));

  -- REGLA 8: la sesión del paquete se descuenta sola ---------------------
  insert into paquetes (local_id, nombre, servicio_id, cantidad_sesiones, precio_total)
  values (L, '4 brushings', BRUSHING, 4, 300000) returning id into v_paq;
  insert into paquetes_clientes (local_id, cliente_id, paquete_id)
  values (L, C3, v_paq) returning id into v_pc;

  insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin, estado, paquete_cliente_id)
  values (L, C3, ANDREA, BRUSHING,
          (v_mar + time '11:00') at time zone 'America/Asuncion',
          (v_mar + time '11:00') at time zone 'America/Asuncion', 'confirmado', v_pc)
  returning id into v_turno;
  update turnos set estado = 'terminado' where id = v_turno;

  select sesiones_usadas into v_n from paquetes_clientes where id = v_pc;
  perform pruebas.afirmar(v_n = 1, 'R8 la sesión del paquete se descuenta',
    'sesiones_usadas = ' || v_n || ' de 4');
  perform pruebas.afirmar((select ultima_visita from clientes where id = C3) = v_mar,
    'R8 se actualiza la última visita',
    'ultima_visita = ' || (select ultima_visita from clientes where id = C3));

  -- REGLA 9: auditoría ---------------------------------------------------
  select count(*) into v_n from auditoria where tabla = 'servicios' and accion = 'update';
  perform pruebas.afirmar(v_n >= 2, 'R9 auditoría de precios',
    v_n || ' filas en auditoria por los cambios de precio');

  insert into cobros (local_id, monto, medio, concepto) values (L, 50000, 'efectivo', 'prueba');
  perform pruebas.debe_fallar('delete from cobros where concepto = ''prueba''',
    'R9 un cobro no se borra, se anula');
end $bloque$;

-- ------------------------------------------------------------
-- PARTE 2 — RLS: qué ve cada rol
-- Se hace pasando por 'authenticated' con el auth_id de cada uno,
-- igual que cuando entran desde el navegador.
-- ------------------------------------------------------------

-- Carla, la dueña
select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where rol = 'dueno' and local_id = '33333333-3333-3333-3333-333333333333'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where rol = 'dueno' and local_id = '33333333-3333-3333-3333-333333333333'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar(mi_rol() = 'dueno', 'sesión de Carla', 'mi_rol() = ' || coalesce(mi_rol()::text,'NULL'));
select pruebas.afirmar((select count(*) from fichas) = 5, 'RLS la dueña ve las fichas',
  (select count(*)::text from fichas) || ' de 5 fichas');
select pruebas.afirmar((select count(*) from auditoria) > 0, 'RLS la dueña ve la auditoría',
  (select count(*)::text from auditoria) || ' filas');
select pruebas.afirmar((select count(*) from cobros) > 0, 'RLS la dueña ve los cobros',
  (select count(*)::text from cobros) || ' cobros');
reset role;

-- Sofía, profesional
select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where email = 'sofia@studiokuna.com.py'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where email = 'sofia@studiokuna.com.py'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar(pruebas.si_existe('sofia@studiokuna.com.py',
  mi_profesional() = '55555555-0000-0000-0000-000000000001'),
  'sesión de Sofía', 'mi_profesional() = ' || coalesce(mi_profesional()::text, 'NULL'));
select pruebas.afirmar(pruebas.si_existe('sofia@studiokuna.com.py',
  not exists (select 1 from turnos where profesional_id <> '55555555-0000-0000-0000-000000000001')),
  'RLS el profesional solo ve sus turnos',
  (select count(*)::text from turnos) || ' turnos visibles, todos suyos');
select pruebas.afirmar(pruebas.si_existe('sofia@studiokuna.com.py',
  (select count(*) from cobros) = 0),
  'RLS el profesional no ve cobros ajenos',
  (select count(*)::text from cobros) || ' cobros visibles');
reset role;

-- Rocío, recepción
select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where email = 'recepcion@studiokuna.com.py'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where email = 'recepcion@studiokuna.com.py'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar(pruebas.si_existe('recepcion@studiokuna.com.py', mi_rol() = 'recepcion'),
  'sesión de Rocío', 'mi_rol() = ' || coalesce(mi_rol()::text,'NULL'));
select pruebas.afirmar(pruebas.si_existe('recepcion@studiokuna.com.py',
  (select count(*) from fichas) = 0), 'RLS recepción NO ve fichas',
  (select count(*)::text from fichas) || ' fichas visibles');
select pruebas.afirmar(pruebas.si_existe('recepcion@studiokuna.com.py',
  (select count(*) from archivos) = 0), 'RLS recepción NO ve archivos',
  (select count(*)::text from archivos) || ' archivos visibles');
select pruebas.afirmar(pruebas.si_existe('recepcion@studiokuna.com.py',
  (select count(*) from cobros) = 0), 'RLS recepción NO ve ingresos',
  (select count(*)::text from cobros) || ' cobros visibles');
select pruebas.afirmar(pruebas.si_existe('recepcion@studiokuna.com.py',
  (select count(*) from turnos) > 0), 'RLS recepción ve la agenda entera',
  (select count(*)::text from turnos) || ' turnos visibles');
reset role;

-- Mirta, caja
select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where email = 'caja@studiokuna.com.py'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where email = 'caja@studiokuna.com.py'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar(pruebas.si_existe('caja@studiokuna.com.py', mi_rol() = 'cajero'),
  'sesión de Mirta', 'mi_rol() = ' || coalesce(mi_rol()::text,'NULL'));
select pruebas.afirmar(pruebas.si_existe('caja@studiokuna.com.py',
  (select count(*) from fichas) = 0), 'RLS caja NO ve fichas',
  (select count(*)::text from fichas) || ' fichas visibles');
select pruebas.afirmar(pruebas.si_existe('caja@studiokuna.com.py',
  (select count(*) from cobros) > 0), 'RLS caja ve los cobros',
  (select count(*)::text from cobros) || ' cobros visibles');
reset role;

-- ------------------------------------------------------------
-- PARTE 3 — El portal público: lo que ve alguien sin cuenta
-- ------------------------------------------------------------

-- Un segundo local, para probar que no se cruzan. Desaparece con el rollback.
insert into locales (id, nombre, slug, rubro, estado)
values ('99999999-9999-9999-9999-999999999999', 'Otro Local', 'otrolocal', 'estetica', 'activo');
insert into profesionales (id, local_id, nombre_publico, slug)
values ('99999999-0000-0000-0000-000000000001',
        '99999999-9999-9999-9999-999999999999', 'Intrusa', 'intrusa');

select set_config('request.jwt.claim.sub', '', false),
       set_config('request.jwt.claims', '', false);
set role anon;

select pruebas.afirmar((select count(*) from servicios) = 0,
  'RLS anon no lee tablas', (select count(*)::text from servicios) || ' servicios por consulta directa');
select pruebas.afirmar((select count(*) from clientes) = 0,
  'RLS anon no lee clientes', (select count(*)::text from clientes) || ' clientes por consulta directa');
select pruebas.afirmar((select count(*) from turnos) = 0,
  'RLS anon no lee turnos', (select count(*)::text from turnos) || ' turnos por consulta directa');
select pruebas.afirmar((select count(*) from local_publico('studiokuna')) = 1,
  'portal local_publico()', 'devuelve la ficha del local');
select pruebas.afirmar((select count(*) from servicios_publicos('studiokuna')) = 7,
  'portal servicios_publicos()',
  (select count(*)::text from servicios_publicos('studiokuna')) || ' de 7 servicios visibles online');
select pruebas.afirmar(
  (select count(*) from profesionales_publicos('studiokuna', '66666666-0000-0000-0000-000000000003')) = 1,
  'portal profesionales_publicos() filtra por servicio', 'solo Sofía hace color raíz');

do $bloque$
declare
  CORTE_DAMA constant uuid := '66666666-0000-0000-0000-000000000001';
  SOFIA      constant uuid := '55555555-0000-0000-0000-000000000001';
  v_mar date; v_n int; v_ini timestamptz; v_turno uuid; v_fin timestamptz; v_precio numeric;
begin
  v_mar := current_date + 7;
  while extract(dow from v_mar) <> 2 loop v_mar := v_mar + 1; end loop;

  select count(*) into v_n from huecos_libres('studiokuna', CORTE_DAMA, SOFIA, v_mar);
  perform pruebas.afirmar(v_n > 0, 'portal huecos_libres()',
    v_n || ' huecos para corte de dama con Sofía');

  select h.inicio into v_ini from huecos_libres('studiokuna', CORTE_DAMA, SOFIA, v_mar) h
   where (h.inicio at time zone 'America/Asuncion')::time >= time '14:00'
   order by h.inicio limit 1;

  select reservar_online('studiokuna', CORTE_DAMA, SOFIA, v_ini,
                         'Cliente de Prueba', '0999123456', null) into v_turno;
  perform pruebas.afirmar(v_turno is not null, 'portal reservar_online() reserva',
    'devolvió el turno ' || coalesce(v_turno::text, 'NULL'));

  -- Lo que quedó escrito en las tablas NO se comprueba acá: desde anon,
  -- RLS tapa turnos, clientes y fichas, que es justo lo que se busca.
  -- Se pasa el id hacia afuera y se verifica después del reset role.
  perform pruebas.guardar('turno_online', v_turno::text);
  perform pruebas.guardar('inicio_online', v_ini::text);

  perform pruebas.debe_fallar(format(
    'select reservar_online(''studiokuna'', %L, %L, %L, ''Otro'', ''0999777888'', null)',
    CORTE_DAMA, SOFIA, v_ini),
    'portal no permite reservar dos veces el mismo hueco');

  perform pruebas.afirmar(
    not exists (select 1 from huecos_libres('studiokuna', CORTE_DAMA, SOFIA, v_mar) h where h.inicio = v_ini),
    'portal el hueco tomado desaparece', 'huecos_libres() ya no lo ofrece');

  -- Aislamiento entre locales: los tres ids llegan del navegador.
  perform pruebas.debe_fallar(format(
    'select reservar_online(''studiokuna'', %L, %L, %L, ''Colada'', ''0999555444'', null)',
    CORTE_DAMA, '99999999-0000-0000-0000-000000000001'::uuid, v_ini + interval '3 hours'),
    'portal rechaza un profesional de otro local');
end $bloque$;

reset role;

-- Lo que dejó reservar_online(), ya fuera de anon.
do $bloque$
declare
  v_turno uuid; v_ini timestamptz; v_fin timestamptz; v_precio numeric;
begin
  select valor::uuid        into v_turno from pruebas.contexto where clave = 'turno_online';
  select valor::timestamptz into v_ini   from pruebas.contexto where clave = 'inicio_online';
  select fin, precio_congelado into v_fin, v_precio from turnos where id = v_turno;

  perform pruebas.afirmar(v_fin = v_ini + interval '45 min' and v_precio = 120000,
    'portal el fin y el precio los pone la base',
    'fin ' || to_char(v_fin at time zone 'America/Asuncion', 'HH24:MI') || ', precio ' || v_precio);

  perform pruebas.afirmar(
    (select origen from turnos where id = v_turno) = 'online'
    and exists (select 1 from fichas f join clientes c on c.id = f.cliente_id
                where c.celular = '0999123456'),
    'portal crea cliente y ficha', 'cliente con origen online y su ficha');
end $bloque$;

-- ------------------------------------------------------------
-- PARTE 4 — Storage: las fotos y radiografías del bucket privado
-- Belén Ortiz (cliente 7777...04) no tiene ningún turno, así que nadie
-- más que la dueña tiene por qué ver su carpeta.
-- ------------------------------------------------------------
insert into storage.objects (bucket_id, name) values
  ('archivos', '33333333-3333-3333-3333-333333333333/77777777-0000-0000-0000-000000000001/foto.jpg'),
  ('archivos', '33333333-3333-3333-3333-333333333333/77777777-0000-0000-0000-000000000004/radiografia.jpg');

select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where rol = 'dueno' and local_id = '33333333-3333-3333-3333-333333333333'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where rol = 'dueno' and local_id = '33333333-3333-3333-3333-333333333333'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar((select count(*) from storage.objects where bucket_id = 'archivos') = 2,
  'Storage la dueña ve todo el bucket',
  (select count(*)::text from storage.objects where bucket_id = 'archivos') || ' de 2 archivos');
reset role;

select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where email = 'sofia@studiokuna.com.py'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where email = 'sofia@studiokuna.com.py'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar(pruebas.si_existe('sofia@studiokuna.com.py',
  (select count(*) from storage.objects where bucket_id = 'archivos') = 1),
  'Storage el profesional solo ve a quien atendió',
  (select count(*)::text from storage.objects where bucket_id = 'archivos')
  || ' archivo (el de Lucía, no el de Belén)');
reset role;

select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where email = 'recepcion@studiokuna.com.py'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where email = 'recepcion@studiokuna.com.py'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar(pruebas.si_existe('recepcion@studiokuna.com.py',
  (select count(*) from storage.objects where bucket_id = 'archivos') = 0),
  'Storage recepción NO baja radiografías',
  (select count(*)::text from storage.objects where bucket_id = 'archivos') || ' archivos visibles');
reset role;

select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where email = 'caja@studiokuna.com.py'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where email = 'caja@studiokuna.com.py'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.afirmar(pruebas.si_existe('caja@studiokuna.com.py',
  (select count(*) from storage.objects where bucket_id = 'archivos') = 0),
  'Storage caja NO baja radiografías',
  (select count(*)::text from storage.objects where bucket_id = 'archivos') || ' archivos visibles');
reset role;

-- ------------------------------------------------------------
-- PARTE 5 — Alta de un local nuevo (pantalla /crear-cuenta)
-- Va último: después de esto Carla queda en dos locales y mi_local()
-- deja de ser unívoca para ella.
-- ------------------------------------------------------------
select set_config('request.jwt.claim.sub', '', false),
       set_config('request.jwt.claims', '', false);
set role anon;
select pruebas.debe_fallar(
  'select crear_local(''Local Trucho'', ''trucho'', ''estetica'', ''Nadie'')',
  'Alta sin sesión no crea local');
reset role;

select set_config('request.jwt.claim.sub',
  (select auth_id::text from usuarios where rol = 'dueno' and local_id = '33333333-3333-3333-3333-333333333333'), false),
       set_config('request.jwt.claims',
  json_build_object('sub', (select auth_id from usuarios where rol = 'dueno' and local_id = '33333333-3333-3333-3333-333333333333'),
                    'role', 'authenticated')::text, false);
set role authenticated;
select pruebas.debe_pasar(
  'select crear_local(''Studio Nuevo'', ''studionuevo'', ''unas'', ''Carla Domínguez'')',
  'Alta crea el local con sesión iniciada');
select pruebas.debe_fallar(
  'select crear_local(''Otro Studio Kuña'', ''studiokuna'', ''peluqueria'', ''Carla Domínguez'')',
  'Alta rechaza un slug ya tomado');
reset role;

select pruebas.afirmar(
  exists (select 1 from usuarios u join locales l on l.id = u.local_id
          where l.slug = 'studionuevo' and u.rol = 'dueno'
            and u.auth_id = (select auth_id from usuarios where rol = 'dueno' and local_id = '33333333-3333-3333-3333-333333333333')),
  'Alta deja a quien lo creó como dueño',
  'la fila en usuarios queda con rol dueno');
select pruebas.afirmar(
  (select estado from locales where slug = 'studionuevo') = 'prueba'
  and (select prueba_hasta from locales where slug = 'studionuevo') = current_date + 30,
  'Alta arranca en prueba por 30 días',
  'estado = prueba, vence ' || (select prueba_hasta::text from locales where slug = 'studionuevo'));

-- ------------------------------------------------------------
-- RESULTADO
-- ------------------------------------------------------------
select estado, regla, detalle from pruebas.resultado order by n;

rollback;
