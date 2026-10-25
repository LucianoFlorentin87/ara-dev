import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { celdaCsv } from '../lib/csv'

// Ejecuta el handler real con dobles solo para sesión y acceso a la base.
// Ninguna petición sale de la máquina y no necesita secretos de Supabase.
test('endpoint CSV exige dueño, limita tablas y protege la descarga', async () => {
  let sesion: { rol: string } | null = null
  let consultas = 0
  const mod = { exports: {} as { GET: (r: Request) => Promise<Response> } }
  const codigo = ts.transpileModule(readFileSync('app/panel/datos/exportar/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(codigo, {
    exports: mod.exports, module: mod, Response, URL,
    require: (nombre: string) => {
      if (nombre === '@/lib/sesion') return { sesionActual: async () => sesion }
      if (nombre === '@/lib/csv') return { celdaCsv }
      if (nombre === '@/lib/tiempo') return { hoyISO: () => '2026-10-24' }
      if (nombre === '@/lib/supabase/servidor') return { crearClienteServidor: async () => ({ from: () => {
        consultas++
        return { select: () => ({ order: async () => ({ data: [{ nombre: '=1+1' }], error: null }) }) }
      } }) }
      throw new Error(`Import inesperado: ${nombre}`)
    },
  })
  const pedir = (tabla = 'clientes') => mod.exports.GET(new Request(`https://ara.test/panel/datos/exportar?tabla=${tabla}`))
  assert.equal((await pedir()).status, 401)
  for (const rol of ['profesional', 'recepcion', 'cajero']) {
    sesion = { rol }
    assert.equal((await pedir()).status, 403)
  }
  assert.equal(consultas, 0)
  sesion = { rol: 'dueno' }
  for (const tabla of ['usuarios', '__proto__', 'constructor']) assert.equal((await pedir(tabla)).status, 400)
  const respuesta = await pedir()
  assert.equal(respuesta.status, 200)
  assert.equal(respuesta.headers.get('cache-control'), 'private, no-store')
  assert.ok(respuesta.headers.get('content-disposition')?.startsWith('attachment;'))
  assert.match(await respuesta.text(), /'=1\+1/)
})
