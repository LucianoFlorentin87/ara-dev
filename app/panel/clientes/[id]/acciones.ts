'use server'

import { revalidatePath } from 'next/cache'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { sesionActual } from '@/lib/sesion'

export type EstadoCobro = { error: string | null; ok: boolean }

/**
 * Registra un cobro. Un cobro nunca se borra —hay un trigger que lo
 * impide— así que esto es de una sola dirección: para deshacerlo se
 * marca `anulado` con su motivo, y queda en auditoría.
 *
 * Si hay una caja abierta el cobro se le engancha. Si no, queda con
 * caja_id null: sigue siendo un cobro válido, pero no va a aparecer en
 * el cierre de ninguna caja. Eso se resuelve cuando exista esa vista.
 */
export async function registrarCobro(
  _previo: EstadoCobro,
  datos: FormData
): Promise<EstadoCobro> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const cliente = String(datos.get('cliente') ?? '')
  const turno = String(datos.get('turno') ?? '')
  const medio = String(datos.get('medio') ?? 'efectivo')
  const concepto = String(datos.get('concepto') ?? '').trim()
  const monto = Number(String(datos.get('monto') ?? '').replace(/\./g, ''))

  if (!cliente) return { error: 'Falta el cliente.', ok: false }
  if (!Number.isFinite(monto) || monto <= 0) {
    return { error: 'El monto tiene que ser mayor a cero.', ok: false }
  }

  const supabase = await crearClienteServidor()

  const { data: caja } = await supabase
    .from('cajas')
    .select('id')
    .is('cerrada_en', null)
    .limit(1)
    .maybeSingle()

  // El profesional del cobro sale del turno, para que la comisión caiga
  // en quien atendió y no en quien cobró.
  let profesional: string | null = null
  if (turno) {
    const { data: t } = await supabase
      .from('turnos')
      .select('profesional_id')
      .eq('id', turno)
      .maybeSingle()
    profesional = t?.profesional_id ?? null
  }

  const { error } = await supabase.from('cobros').insert({
    local_id: sesion.localId,
    caja_id: caja?.id ?? null,
    turno_id: turno || null,
    cliente_id: cliente,
    profesional_id: profesional,
    monto,
    medio,
    concepto: concepto || null,
    created_by: sesion.usuarioId,
  })

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede registrar cobros.', ok: false }
    }
    if (error.code === 'P0001' || error.code === '23514') {
      return { error: error.message, ok: false }
    }
    return { error: 'No se pudo registrar el cobro.', ok: false }
  }

  revalidatePath(`/panel/clientes/${cliente}`)
  return { error: null, ok: true }
}
