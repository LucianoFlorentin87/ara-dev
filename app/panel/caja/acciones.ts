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

export type EstadoCobroTurno = { error: string | null; ok: boolean }

/**
 * Cobra un turno terminado con un clic.
 *
 * El monto NO viene del formulario: sale de `precio_congelado` menos la
 * seña que ya se pagó. Ese precio lo puso la base cuando se creó el turno
 * (regla 4), así que acá no hay nada que tipear y nada que se pueda
 * equivocar al tipearlo. Lo único que elige la persona es el medio de pago,
 * que es lo único que la base no puede saber sola.
 *
 * A propósito esto NO pasa solo al marcar el turno terminado: un cobro es
 * plata que entró. Si lo creara el sistema, el arqueo compararía contra
 * efectivo que nadie contó, y como los cobros no se borran —solo se anulan,
 * y quedan en auditoría— cada error se quedaría a la vista para siempre.
 * El turno terminado cae en la lista de "Por cobrar" y alguien confirma.
 */
export async function cobrarTurno(
  _previo: EstadoCobroTurno,
  datos: FormData
): Promise<EstadoCobroTurno> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const turno = String(datos.get('turno') ?? '')
  const medio = String(datos.get('medio') ?? 'efectivo')
  if (!turno) return { error: 'Falta el turno.', ok: false }

  const supabase = await crearClienteServidor()

  const { data: t } = await supabase
    .from('turnos')
    .select('id, estado, precio_congelado, sena_pagada, cliente_id, profesional_id, servicios(nombre)')
    .eq('id', turno)
    .maybeSingle()

  if (!t) return { error: 'Ese turno no existe o no lo podés ver.', ok: false }
  if (t.estado !== 'terminado') {
    return { error: 'Todavía no está terminado. Cerralo desde la agenda.', ok: false }
  }

  // Si alguien ya lo cobró desde la ficha —o desde otra pestaña— no se cobra
  // dos veces. La lista se arma con esta misma condición, pero entre que se
  // dibuja y se aprieta puede pasar cualquier cosa.
  const { data: yaEsta } = await supabase
    .from('cobros')
    .select('id')
    .eq('turno_id', turno)
    .eq('anulado', false)
    .limit(1)
    .maybeSingle()

  if (yaEsta) return { error: 'Ese turno ya estaba cobrado.', ok: false }

  const monto = Number(t.precio_congelado) - Number(t.sena_pagada ?? 0)
  if (!(monto > 0)) {
    return { error: 'No queda saldo por cobrar en ese turno.', ok: false }
  }

  const { data: caja } = await supabase
    .from('cajas')
    .select('id')
    .is('cerrada_en', null)
    .limit(1)
    .maybeSingle()

  const servicio = Array.isArray(t.servicios) ? t.servicios[0] : t.servicios

  const { error } = await supabase.from('cobros').insert({
    local_id: sesion.localId,
    caja_id: caja?.id ?? null,
    turno_id: t.id,
    cliente_id: t.cliente_id,
    // La comisión cae en quien atendió, no en quien cobró.
    profesional_id: t.profesional_id,
    monto,
    medio,
    concepto: servicio?.nombre ?? 'Turno',
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

  revalidatePath('/panel/caja')
  revalidatePath('/panel/agenda')
  revalidatePath('/panel/sala-espera')
  return { error: null, ok: true }
}
