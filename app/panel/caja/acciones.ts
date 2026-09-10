'use server'

import { revalidatePath } from 'next/cache'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { sesionActual } from '@/lib/sesion'

export type EstadoCaja = { error: string | null; ok: boolean }

function aNumero(v: FormDataEntryValue | null): number {
  return Number(String(v ?? '').replace(/\./g, '').replace(/,/g, '.'))
}

export async function abrirCaja(
  _previo: EstadoCaja,
  datos: FormData
): Promise<EstadoCaja> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const inicial = aNumero(datos.get('inicial'))
  if (!Number.isFinite(inicial) || inicial < 0) {
    return { error: 'El monto inicial no puede ser negativo.', ok: false }
  }

  const supabase = await crearClienteServidor()

  // Dos cajas abiertas a la vez arruinan cualquier arqueo. El esquema no lo
  // impide con una constraint, así que se chequea acá; si algún día pasa a
  // importar de verdad, el lugar correcto es un índice único parcial.
  const { data: abierta } = await supabase
    .from('cajas')
    .select('id')
    .is('cerrada_en', null)
    .limit(1)
    .maybeSingle()

  if (abierta) {
    return { error: 'Ya hay una caja abierta. Cerrala antes de abrir otra.', ok: false }
  }

  const { error } = await supabase.from('cajas').insert({
    local_id: sesion.localId,
    abierta_por: sesion.usuarioId,
    monto_inicial: inicial,
  })

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede abrir la caja.', ok: false }
    }
    return { error: 'No se pudo abrir la caja.', ok: false }
  }

  revalidatePath('/panel/caja')
  return { error: null, ok: true }
}

/**
 * Cierra el turno de caja.
 *
 * `monto_sistema` lo calcula el servidor sumando el inicial más los cobros
 * en efectivo, no se acepta del formulario: es el número contra el que se
 * compara lo contado, y si viniera del navegador no compararía nada.
 *
 * El cierre queda auditado: hay un trigger sobre `cajas` que registra el
 * update con el usuario que lo hizo.
 */
export async function cerrarCaja(
  _previo: EstadoCaja,
  datos: FormData
): Promise<EstadoCaja> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const caja = String(datos.get('caja') ?? '')
  const contado = aNumero(datos.get('contado'))
  const motivo = String(datos.get('motivo') ?? '').trim()

  if (!caja) return { error: 'Falta la caja.', ok: false }
  if (!Number.isFinite(contado) || contado < 0) {
    return { error: 'Escribí cuánto efectivo contaste.', ok: false }
  }

  const supabase = await crearClienteServidor()

  const { data: fila } = await supabase
    .from('cajas')
    .select('monto_inicial, cerrada_en')
    .eq('id', caja)
    .maybeSingle()

  if (!fila) return { error: 'Esa caja no existe.', ok: false }
  if (fila.cerrada_en) return { error: 'Esa caja ya estaba cerrada.', ok: false }

  const { data: cobros } = await supabase
    .from('cobros')
    .select('monto, medio, anulado')
    .eq('caja_id', caja)

  const efectivo = (cobros ?? [])
    .filter((c) => !c.anulado && c.medio === 'efectivo')
    .reduce((a, c) => a + Number(c.monto), 0)

  const sistema = Number(fila.monto_inicial) + efectivo
  const diferencia = contado - sistema

  if (diferencia !== 0 && !motivo) {
    return {
      error: 'Hay diferencia con lo esperado: escribí a qué se debe.',
      ok: false,
    }
  }

  const { error } = await supabase
    .from('cajas')
    .update({
      cerrada_por: sesion.usuarioId,
      cerrada_en: new Date().toISOString(),
      monto_declarado: contado,
      monto_sistema: sistema,
      diferencia,
      motivo_diferencia: motivo || null,
    })
    .eq('id', caja)

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede cerrar la caja.', ok: false }
    }
    return { error: 'No se pudo cerrar la caja.', ok: false }
  }

  revalidatePath('/panel/caja')
  return { error: null, ok: true }
}
