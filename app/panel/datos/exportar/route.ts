import { crearClienteServidor } from '@/lib/supabase/servidor'
import { sesionActual } from '@/lib/sesion'
import { hoyISO } from '@/lib/tiempo'

/**
 * Exporta a CSV lo que la sesión tenga permitido leer.
 *
 * No usa `service_role`: corre con la sesión de quien pide, así que RLS
 * decide qué filas salen. Una recepcionista que exporte clientes no se
 * lleva las fichas, porque la política no se las deja leer.
 */

const TABLAS: Record<string, { columnas: string; orden: string }> = {
  clientes: {
    columnas:
      'nombre, apellido, celular, email, origen, primera_visita, ultima_visita, notas',
    orden: 'nombre',
  },
  turnos: {
    columnas: 'inicio, fin, estado, origen, precio_congelado, notas',
    orden: 'inicio',
  },
  cobros: {
    columnas: 'created_at, monto, medio, concepto, anulado, anulado_motivo',
    orden: 'created_at',
  },
  servicios: {
    columnas: 'nombre, categoria, duracion_min, precio, activo, visible_online',
    orden: 'orden',
  },
  productos: {
    columnas: 'nombre, categoria, tipo, stock, stock_minimo, costo, precio_venta',
    orden: 'nombre',
  },
}

/** Comillas dobles y separador punto y coma: es lo que abre Excel en es-PY. */
function celda(v: unknown): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

export async function GET(pedido: Request) {
  const sesion = await sesionActual()
  if (!sesion) return new Response('Sin sesión', { status: 401 })

  const tabla = new URL(pedido.url).searchParams.get('tabla') ?? ''
  const def = TABLAS[tabla]
  if (!def) return new Response('Tabla no exportable', { status: 400 })

  const supabase = await crearClienteServidor()
  const { data, error } = await supabase
    .from(tabla)
    .select(def.columnas)
    .order(def.orden)

  if (error) return new Response('No se pudo exportar', { status: 500 })

  const filas = (data ?? []) as unknown as Record<string, unknown>[]
  const encabezados = def.columnas.split(',').map((c) => c.trim())
  const cuerpo = [
    encabezados.join(';'),
    ...filas.map((f) => encabezados.map((c) => celda(f[c])).join(';')),
  ].join('\r\n')

  // BOM para que Excel reconozca el UTF-8 y no rompa los acentos.
  return new Response('﻿' + cuerpo, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ara-${tabla}-${hoyISO()}.csv"`,
    },
  })
}
