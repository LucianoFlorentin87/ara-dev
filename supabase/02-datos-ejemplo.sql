-- ============================================================
-- ÁRA — datos de ejemplo (Studio Kuña, la peluquería de la demo)
-- Ejecutar DESPUÉS de 01-esquema.sql.
--
-- OJO: RLS está activo. Este script se corre desde el SQL Editor de
-- Supabase, que usa el rol de servicio y lo saltea. No intentes correrlo
-- desde el frontend.
--
-- Los usuarios de auth.users hay que crearlos antes a mano en
-- Authentication > Users, y pegar sus UUID donde dice PEGAR-AQUI.
-- ============================================================

-- 1. Planes -----------------------------------------------------
insert into planes (id, nombre, precio_mensual, max_usuarios, modulos) values
  ('11111111-1111-1111-1111-111111111111', 'Individual', 150000, 1,
   '{"caja":false,"stock":false,"recall":false,"reportes":"basicos"}'),
  ('22222222-2222-2222-2222-222222222222', 'Equipo', 350000, null,
   '{"caja":true,"stock":true,"recall":true,"reportes":"completos"}');

-- 2. El local ---------------------------------------------------
insert into locales (id, nombre, slug, rubro, direccion, telefono_wa, instagram, plan_id, estado, prueba_hasta, config)
values (
  '33333333-3333-3333-3333-333333333333',
  'Studio Kuña', 'studiokuna', 'peluqueria',
  'Malutín 1240, Villa Morra, Asunción',
  '595981000000', '@studiokuna',
  '22222222-2222-2222-2222-222222222222',
  'activo', null,
  -- El esquema de campos de la ficha, propio del rubro:
  '{"campos_ficha":[
     {"clave":"formula_color","label":"Fórmula de color","tipo":"texto"},
     {"clave":"tipo_cabello","label":"Tipo de cabello","tipo":"select","opciones":["Fino","Medio","Grueso","Rizado"]},
     {"clave":"alergias","label":"Alergias","tipo":"texto"},
     {"clave":"frecuencia_raiz","label":"Frecuencia de raíz (semanas)","tipo":"numero"}
   ]}'::jsonb
);

-- 3. Usuarios ---------------------------------------------------
-- Con UNA cuenta alcanza para entrar al panel. Creala en
-- Authentication > Users (con Auto Confirm User) o invitate por email.
--
-- Esa cuenta entra como Carla Domínguez, la dueña de la demo: el local
-- es ficticio y vos hacés de ella. Los otros tres roles son opcionales
-- y sirven para probar el menú filtrado por rol; si algún día creás las
-- cuentas con estos emails, se enlazan solas al volver a correr esto:
--
--   sofia@studiokuna.com.py       Sofía Ramírez   profesional
--   recepcion@studiokuna.com.py   Rocío Cabral    recepción
--   caja@studiokuna.com.py        Mirta Sosa      cajero

do $$
declare v_dueno uuid;
begin
  -- La cuenta de Carla si usaste el email de la demo; si no, la primera
  -- del proyecto, que en un proyecto recién creado es la tuya.
  select id into v_dueno from auth.users where email = 'carla@studiokuna.com.py';
  if v_dueno is null then
    select id into v_dueno from auth.users order by created_at limit 1;
  end if;
  if v_dueno is null then
    raise exception 'No hay ninguna cuenta en Authentication > Users. Creá una (o invitate por email) y volvé a correr este script.';
  end if;

  insert into usuarios (id, auth_id, local_id, nombre, email, rol)
  values ('44444444-0000-0000-0000-000000000001', v_dueno,
          '33333333-3333-3333-3333-333333333333', 'Carla Domínguez',
          (select email from auth.users where id = v_dueno), 'dueno');

  -- Los otros tres, solo si sus cuentas existen.
  insert into usuarios (id, auth_id, local_id, nombre, email, rol)
  select v.id, a.id, '33333333-3333-3333-3333-333333333333', v.nombre, v.email, v.rol::rol_usuario
  from (values
    ('44444444-0000-0000-0000-000000000002'::uuid, 'Sofía Ramírez', 'sofia@studiokuna.com.py', 'profesional'),
    ('44444444-0000-0000-0000-000000000003'::uuid, 'Rocío Cabral', 'recepcion@studiokuna.com.py', 'recepcion'),
    ('44444444-0000-0000-0000-000000000004'::uuid, 'Mirta Sosa', 'caja@studiokuna.com.py', 'cajero')
  ) as v(id, nombre, email, rol)
  join auth.users a on a.email = v.email;
end $$;

-- 4. Profesionales ----------------------------------------------
insert into profesionales (id, local_id, usuario_id, nombre_publico, especialidad, anios_oficio, bio, slug, comision_servicios, comision_productos, orden) values
  ('55555555-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333',
   -- null si todavía no existe su cuenta: la columna lo admite
   (select id from usuarios where id = '44444444-0000-0000-0000-000000000002'),
   'Sofía Ramírez', 'Colorista', 9,
   'Trabajo sobre todo color y balayage. Me gusta ver la base antes de decidir la fórmula.',
   'sofia', 35, 10, 1),
  ('55555555-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333',
   null, 'Andrea Giménez', 'Corte y peinado', 6,
   'Cortes con movimiento y peinados de fiesta. Atiendo jueves a sábado.',
   'andrea', 35, 10, 2),
  ('55555555-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333',
   null, 'Mauro Duarte', 'Barbería', 4,
   'Corte de caballero, barba y afeitado clásico. Turnos cortos, entro puntual.',
   'mauro', 40, 10, 3);

-- 5. Recursos ---------------------------------------------------
insert into recursos (local_id, nombre, tipo) values
  ('33333333-3333-3333-3333-333333333333', 'Sillón 1', 'sillon'),
  ('33333333-3333-3333-3333-333333333333', 'Sillón 2', 'sillon'),
  ('33333333-3333-3333-3333-333333333333', 'Lavacabezas', 'sillon');

-- 6. Horarios ---------------------------------------------------
-- Del local: martes a sábado. Lunes y domingo cerrado.
insert into horarios (local_id, profesional_id, dia_semana, hora_inicio, hora_fin) values
  ('33333333-3333-3333-3333-333333333333', null, 2, '09:00', '19:00'),
  ('33333333-3333-3333-3333-333333333333', null, 3, '09:00', '19:00'),
  ('33333333-3333-3333-3333-333333333333', null, 4, '09:00', '20:00'),
  ('33333333-3333-3333-3333-333333333333', null, 5, '09:00', '20:00'),
  ('33333333-3333-3333-3333-333333333333', null, 6, '08:00', '17:00');

-- El de Sofía: entra más tarde los jueves, sale antes los sábados.
insert into horarios (local_id, profesional_id, dia_semana, hora_inicio, hora_fin) values
  ('33333333-3333-3333-3333-333333333333', '55555555-0000-0000-0000-000000000001', 2, '09:00', '19:00'),
  ('33333333-3333-3333-3333-333333333333', '55555555-0000-0000-0000-000000000001', 3, '09:00', '19:00'),
  ('33333333-3333-3333-3333-333333333333', '55555555-0000-0000-0000-000000000001', 4, '12:00', '20:00'),
  ('33333333-3333-3333-3333-333333333333', '55555555-0000-0000-0000-000000000001', 5, '09:00', '20:00'),
  ('33333333-3333-3333-3333-333333333333', '55555555-0000-0000-0000-000000000001', 6, '08:00', '14:00');

-- 7. Servicios --------------------------------------------------
insert into servicios (id, local_id, nombre, categoria, duracion_min, precio, orden) values
  ('66666666-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Corte de dama', 'Cabello', 45, 120000, 1),
  ('66666666-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Corte de caballero', 'Cabello', 30, 90000, 2),
  ('66666666-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Color raíz', 'Color', 150, 250000, 3),
  ('66666666-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'Balayage', 'Color', 210, 780000, 4),
  ('66666666-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'Brushing', 'Peinado', 40, 90000, 5),
  ('66666666-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'Alisado orgánico', 'Tratamiento', 120, 620000, 6);

insert into servicios (id, local_id, nombre, categoria, duracion_min, precio, requiere_sena, sena_monto, orden) values
  ('66666666-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333', 'Peinado de fiesta', 'Peinado', 60, 180000, true, 50000, 7);

-- Quién hace qué. Sofía cobra más caro el balayage: es su especialidad.
insert into servicios_profesionales (local_id, servicio_id, profesional_id, precio_propio) values
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000003', '55555555-0000-0000-0000-000000000001', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000004', '55555555-0000-0000-0000-000000000001', 850000),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000005', '55555555-0000-0000-0000-000000000001', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000007', '55555555-0000-0000-0000-000000000001', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000002', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000005', '55555555-0000-0000-0000-000000000002', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000006', '55555555-0000-0000-0000-000000000002', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000007', '55555555-0000-0000-0000-000000000002', null),
  ('33333333-3333-3333-3333-333333333333', '66666666-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000003', null);

-- 8. Clientes ---------------------------------------------------
insert into clientes (id, local_id, nombre, apellido, celular, email, profesional_habitual_id, origen, primera_visita, ultima_visita) values
  ('77777777-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Lucía', 'Benítez', '0981234567', 'lucia.benitez@gmail.com', '55555555-0000-0000-0000-000000000001', 'recomendacion', '2024-03-14', current_date - 26),
  ('77777777-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Marcos', 'Ayala', '0982111222', null, '55555555-0000-0000-0000-000000000003', 'instagram', '2025-01-08', current_date - 12),
  ('77777777-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Rocío', 'Cabral', '0983444555', null, '55555555-0000-0000-0000-000000000002', 'online', '2025-06-02', current_date - 5),
  ('77777777-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'Belén', 'Ortiz', '0984777888', null, '55555555-0000-0000-0000-000000000001', 'recomendacion', '2023-11-20', current_date - 188),
  ('77777777-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'Kevin', 'Mora', '0985999000', null, '55555555-0000-0000-0000-000000000003', 'instagram', '2024-07-11', current_date - 201);

insert into fichas (local_id, cliente_id, datos) values
  ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000001',
   '{"formula_color":"7.1 + 6.0 · 20 vol","tipo_cabello":"Medio","alergias":"Amoníaco","frecuencia_raiz":5}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000002', '{"tipo_cabello":"Grueso"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000003', '{"tipo_cabello":"Fino"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000004',
   '{"formula_color":"8.3 · 30 vol","tipo_cabello":"Rizado","frecuencia_raiz":6}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000005', '{}'::jsonb);

-- 9. Productos --------------------------------------------------
insert into productos (local_id, nombre, categoria, tipo, stock, stock_minimo, costo, precio_venta) values
  ('33333333-3333-3333-3333-333333333333', 'Tinte 7.1 ceniza', 'Color', 'insumo', 3, 6, 45000, 0),
  ('33333333-3333-3333-3333-333333333333', 'Agua oxigenada 20 vol', 'Color', 'insumo', 1, 3, 28000, 0),
  ('33333333-3333-3333-3333-333333333333', 'Shampoo matizador', 'Venta', 'venta', 12, 6, 65000, 120000),
  ('33333333-3333-3333-3333-333333333333', 'Guantes de nitrilo', 'Insumo', 'insumo', 5, 2, 35000, 0),
  ('33333333-3333-3333-3333-333333333333', 'Toallas descartables', 'Insumo', 'insumo', 0, 4, 22000, 0),
  ('33333333-3333-3333-3333-333333333333', 'Serum de puntas', 'Venta', 'venta', 9, 4, 48000, 95000);

-- 10. Turnos de ejemplo ------------------------------------------
-- Se generan sobre el próximo día hábil para que caigan dentro del horario.
-- El trigger calcula fin y precio_congelado solo: por eso fin va = inicio.
do $$
declare
  v_dia date := current_date;
  v_sofia time;
begin
  -- buscar el próximo martes-sábado
  while extract(dow from v_dia) in (0, 1) loop
    v_dia := v_dia + 1;
  end loop;

  -- Sofía entra 12:00 los jueves. Si el día que tocó es jueves, su turno de
  -- color raíz (150 min) no puede arrancar 10:30: el trigger de horario lo
  -- rechaza y se cae el script entero. Se corre al inicio de su jornada.
  select greatest(time '10:30', h.hora_inicio) into v_sofia
  from horarios h
  where h.profesional_id = '55555555-0000-0000-0000-000000000001'
    and h.dia_semana = extract(dow from v_dia);

  insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin, estado, origen) values
    ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000002',
     '55555555-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000002',
     (v_dia + time '09:00') at time zone 'America/Asuncion',
     (v_dia + time '09:00') at time zone 'America/Asuncion', 'confirmado', 'mostrador'),
    ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000001',
     '55555555-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000003',
     (v_dia + v_sofia) at time zone 'America/Asuncion',
     (v_dia + v_sofia) at time zone 'America/Asuncion', 'confirmado', 'mostrador'),
    ('33333333-3333-3333-3333-333333333333', '77777777-0000-0000-0000-000000000003',
     '55555555-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000005',
     (v_dia + time '13:00') at time zone 'America/Asuncion',
     (v_dia + time '13:00') at time zone 'America/Asuncion', 'pendiente', 'online');
end $$;

-- 11. Suscripción -------------------------------------------------
insert into suscripciones (local_id, plan_id, desde, estado, ultimo_pago)
values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
        current_date - 90, 'activa', current_date - 8);

-- ============================================================
-- Para comprobar que las reglas funcionan, probá esto:
--
--   -- debe fallar: choque de horario con el turno de Sofía
--   insert into turnos (local_id, cliente_id, profesional_id, servicio_id, inicio, fin)
--   values ('3333...','7777...4','5555...1','6666...3',
--           (current_date + time '11:00') at time zone 'America/Asuncion',
--           (current_date + time '11:00') at time zone 'America/Asuncion');
--
--   -- debe fallar: Mauro no hace color
--   -- debe fallar: un lunes, el local está cerrado
-- ============================================================
