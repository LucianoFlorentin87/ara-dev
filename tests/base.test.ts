import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist'
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto'

test('alta atómica, permisos por rol y aislamiento entre dos locales en Postgres', async () => {
  const db = new PGlite({ extensions: { btree_gist, pgcrypto } })
  try {
    // Solo sustituye las APIs de plataforma; las tablas, triggers y RLS son los reales del repo.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema storage;
      create table auth.users (id uuid primary key, email text, created_at timestamptz default now());
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      create table storage.buckets (id text primary key, name text, public boolean);
      create table storage.objects (id uuid default gen_random_uuid(), bucket_id text, name text);
      alter table storage.objects enable row level security;
      create function storage.foldername(text) returns text[] language sql immutable as
        $$ select (string_to_array($1, '/'))[1:array_length(string_to_array($1, '/'), 1)-1] $$;
      grant usage on schema public, auth, storage to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      insert into auth.users (id, email) values
        ('10000000-0000-0000-0000-000000000001', 'uno@example.test'),
        ('10000000-0000-0000-0000-000000000002', 'dos@example.test'),
        ('10000000-0000-0000-0000-000000000003', 'tres@example.test');
    `)
    await db.exec(await readFile('supabase/01-esquema.sql', 'utf8'))
    await db.exec(await readFile('supabase/04-nota-reserva.sql', 'utf8'))
    await db.exec(await readFile('supabase/migrations/20261025010416_auditoria_alta_y_aislamiento.sql', 'utf8'))
    await db.exec('grant select, insert, update, delete on all tables in schema public to authenticated; grant select on all tables in schema public to anon;')
    const sesion = async (n: number) => db.exec(`reset role; select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-${String(n).padStart(12, '0')}', false); set role authenticated;`)
    const alta = (nombre: string, slug: string, horarios = '[{"dia_semana":1,"hora_inicio":"09:00","hora_fin":"19:00"}]') => db.query<{ id: string }>(
      `select completar_alta($1,$2,'peluqueria','Dueño',null,null,null,$3::jsonb,'[{"nombre":"Corte","duracion_min":30,"precio":120000}]'::jsonb) as id`,
      [nombre, slug, horarios])
    await sesion(1)
    const localUno = (await alta('Uno', 'localuno')).rows[0].id
    const propio = (await db.query<{ id: string }>('select id from profesionales')).rows[0].id
    const servicio = (await db.query<{ id: string }>('select id from servicios')).rows[0].id
    assert.equal((await db.query<{ dias: number }>('select prueba_hasta - current_date as dias from locales')).rows[0].dias, 14)
    assert.equal((await db.query('select * from horarios')).rows.length, 1)
    assert.equal((await db.query('select * from servicios')).rows.length, 1)
    await assert.rejects(alta('Repetido', 'repetido'), /cuenta ya tiene un local/)

    await sesion(2)
    const localDos = (await alta('Dos', 'localdos')).rows[0].id
    assert.equal((await db.query('select * from locales')).rows.length, 1)
    const ajeno = (await db.query<{ id: string }>('select id from profesionales')).rows[0].id
    assert.notEqual(propio, ajeno)
    await sesion(1)
    assert.equal((await db.query('select * from locales where id = $1', [localDos])).rows.length, 0)
    await assert.rejects(db.query('insert into bloqueos(local_id, profesional_id, desde, hasta) values ($1,$2,now(),now()+interval \'1 hour\')', [localUno, ajeno]), /foreign key/)
    await assert.rejects(db.query('update profesionales set usuario_id = (select id from usuarios limit 1) where id = $1 returning id', [ajeno]).then(r => { if (r.rows.length === 0) throw new Error('denegado por RLS') }), /denegado por RLS/)

    await sesion(3)
    await assert.rejects(alta('Error', 'localfallido', '[{"dia_semana":1,"hora_inicio":"19:00","hora_fin":"09:00"}]'), /check constraint/)
    await db.exec('reset role')
    assert.equal((await db.query("select * from locales where slug = 'localfallido'")).rows.length, 0)
    assert.equal((await db.query("select * from usuarios where auth_id = '10000000-0000-0000-0000-000000000003'")).rows.length, 0)
    const fechas = (await db.query<{ futuro: string; pasado: string }>(`select
      ((date_trunc('week', now() at time zone 'America/Asuncion') + interval '7 days 10 hours') at time zone 'America/Asuncion')::text as futuro,
      ((date_trunc('week', now() at time zone 'America/Asuncion') - interval '7 days' + interval '10 hours') at time zone 'America/Asuncion')::text as pasado`)).rows[0]
    await db.exec("select set_config('request.jwt.claim.sub','',false); set role anon;")
    const reservar = (inicio: string) => db.query('select reservar_online($1,$2,$3,$4,\'Cliente ensayo\',\'595981123456\',null,\'Nota de ensayo\')', ['localuno', servicio, propio, inicio])
    await assert.rejects(reservar(fechas.pasado), /horario futuro/)
    await reservar(fechas.futuro)
    await assert.rejects(reservar(fechas.futuro), /exclusion constraint/)
    assert.equal((await db.query('select * from clientes')).rows.length, 0)
    await db.exec('reset role')
    assert.equal((await db.query<{ notas: string }>("select notas from turnos where origen='online'")).rows[0].notas, 'Nota de ensayo')
    // Mismo esquema, distintos roles: recepción/caja no pueden leer fichas clínicas.
    await db.query('insert into clientes(local_id,nombre) values ($1,\'Paciente\')', [localUno])
    await db.query('insert into fichas(local_id,cliente_id) select $1,id from clientes where local_id=$1 and nombre=\'Paciente\'', [localUno])
    for (const rol of ['recepcion', 'cajero', 'profesional', 'dueno']) {
      await db.exec('reset role')
      await db.query('update usuarios set rol=$1 where auth_id=\'10000000-0000-0000-0000-000000000001\'', [rol])
      await sesion(1)
      assert.equal((await db.query('select * from fichas')).rows.length, rol === 'dueno' ? 2 : rol === 'profesional' ? 1 : 0)
    }
    await db.exec('reset role')
    await db.query('update usuarios set activo=false where auth_id=\'10000000-0000-0000-0000-000000000001\'')
    await sesion(1)
    assert.equal((await db.query('select * from clientes')).rows.length, 0)
    await db.exec("reset role; select set_config('request.jwt.claim.sub','',false); set role anon;")
    await assert.rejects(alta('Anónimo', 'anonimo'), /permission denied/)
  } finally { await db.close() }
})
