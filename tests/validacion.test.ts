import assert from 'node:assert/strict'
import { test } from 'node:test'
import { celdaCsv } from '../lib/csv'
import { destinoAuth } from '../lib/auth-destino'
import { validarAlta } from '../app/alta/validacion'

test('CSV neutraliza fórmulas, conserva números y escapa separadores y CR', () => {
  for (const valor of ['=1+1', '+SUM(A1)', '-1+1', '@SUM(A1)', ' \t=1+1', '\r=1+1']) {
    assert.ok(celdaCsv(valor).replace(/^"/, '').startsWith("'"))
  }
  assert.equal(celdaCsv(-123), '-123')
  assert.equal(celdaCsv('María; "Pérez"'), '"María; ""Pérez"""')
  assert.equal(celdaCsv('a\rb'), '"a\rb"')
  assert.equal(celdaCsv(null), '')
})

test('retorno de autenticación rechaza dominios externos y barras invertidas', () => {
  for (const valor of ['https://evil.test', '//evil.test', '/\\evil.test', '/%2fevil.test', '/panel/../externo', null]) {
    assert.equal(destinoAuth(valor), '/panel')
  }
  assert.equal(destinoAuth('/alta'), '/alta')
  assert.equal(destinoAuth('/recuperar/nueva'), '/recuperar/nueva')
})

function formulario() {
  const f = new FormData()
  f.set('nombre', 'Mi salón')
  f.set('rubro', 'Peluquería')
  f.set('dias', JSON.stringify([false, true, true, true, true, true, false]))
  f.set('servicios', JSON.stringify([{ nombre: 'Corte', dur: '30 min', precio: '120.000' }]))
  return f
}

test('alta transforma catálogo y días con el formato esperado por la base', () => {
  const alta = validarAlta(formulario())
  assert.equal(alta.slug, 'misalon')
  assert.equal(alta.servicios[0].precio, 120000)
  assert.equal(alta.servicios[0].duracion_min, 30)
  assert.deepEqual(alta.horarios.map(h => h.dia_semana), [2, 3, 4, 5, 6])
})

test('alta rechaza JSON roto, tipos falsos, local inválido y precios negativos', () => {
  for (const [campo, valor] of [
    ['dias', '{'], ['dias', '["false"]'], ['dias', '[false,false,false,false,false,false,false]'],
    ['servicios', '{}'], ['servicios', '[]'], ['nombre', '💈'], ['nombre', 'x'.repeat(101)],
    ['servicios', '[{"nombre":"Corte","dur":"30 min","precio":"-10"}]'],
    ['servicios', '[{"nombre":null,"dur":"30 min","precio":"10"}]'],
  ]) {
    const f = formulario(); f.set(campo, valor)
    assert.throws(() => validarAlta(f))
  }
})
