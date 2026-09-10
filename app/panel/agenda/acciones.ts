'use server'

import { revalidatePath } from 'next/cache'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { sesionActual } from '@/lib/sesion'
import { instanteDe } from '@/lib/tiempo'

export type EstadoTurno = { error: string | null; ok: boolean }

/**
 * Crea un turno. No manda `precio_congelado` y manda `fin` igual a
 * `inicio` solo porque la columna es NOT NULL: los dos los pisa el
 * trigger `turno_completar` con la duración y el precio del servicio.
 *
 * Las validaciones no se repiten acá. Las nueve reglas viven en la base
 * como constraints y triggers, y esta función se limita a traducir lo que
 * rebota a algo que se pueda leer en pantalla.
 */
export async function crearTurno(
  _previo: EstadoTurno,
  datos: FormData
): Promise<EstadoTurno> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const cliente = String(datos.get('cliente') ?? '')
  const profesional = String(datos.get('profesional') ?? '')
  const servicio = String(datos.get('servicio') ?? '')
  const fecha = String(datos.get('fecha') ?? '')
  const hora = String(datos.get('hora') ?? '')

  if (!cliente || !profesional || !servicio || !fecha || !hora) {
    return { error: 'Faltan datos del turno.', ok: false }
  }

  const inicio = instanteDe(fecha, hora).toISOString()
  const supabase = await crearClienteServidor()

  const { error } = await supabase.from('turnos').insert({
    local_id: sesion.localId,
    cliente_id: cliente,
    profesional_id: profesional,
    servicio_id: servicio,
    inicio,
    fin: inicio,
    estado: 'confirmado',
    origen: 'mostrador',
    created_by: sesion.usuarioId,
  })

  if (error) {
    // 23P01 es la constraint de exclusión: dos turnos que se pisan. Es la
    // regla 1 (o la 2 si hay recurso) haciendo su trabajo. Nunca se le
    // muestra a nadie el texto de Postgres.
    if (error.code === '23P01') {
      return {
        error: 'Ese horario ya está tomado. Elegí otro o cambiá de profesional.',
        ok: false,
      }
    }

    // P0001 son nuestros triggers: horario del local, bloqueo, vacaciones,
    // servicio que el profesional no hace. Ya vienen redactados en
    // castellano desde el SQL, así que se muestran tal cual.
    if (error.code === 'P0001') {
      return { error: error.message, ok: false }
    }

    // 42501 es RLS: la política no deja escribir. Le pasa a caja, que
    // puede leer la agenda pero no agendar.
    if (error.code === '42501') {
      return { error: 'Tu rol no puede crear turnos.', ok: false }
    }

    return { error: 'No se pudo crear el turno.', ok: false }
  }

  revalidatePath('/panel/agenda')
  return { error: null, ok: true }
}

export type EstadoCambio = { error: string | null; ok: boolean }

const PERMITIDOS = ['confirmado', 'en_atencion', 'terminado', 'ausente', 'cancelado'] as const
export type EstadoTurnoValor = (typeof PERMITIDOS)[number]

/**
 * Cambia el estado de un turno.
 *
 * Pasarlo a `terminado` no es solo cosmético: dispara el trigger que
 * descuenta la sesión del paquete y actualiza la última visita del
 * cliente. Por eso la app no lleva su propia cuenta de nada.
 *
 * Ojo con un efecto lateral del esquema: `turno_valida_horario` también
 * corre en el update de `estado`, así que cerrar un turno viejo vuelve a
 * validar el horario del local. Si ese horario cambió, o si le cayó un
 * bloqueo encima, la base lo rechaza aunque el turno ya haya ocurrido.
 */
export async function cambiarEstado(
  _previo: EstadoCambio,
  datos: FormData
): Promise<EstadoCambio> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const turno = String(datos.get('turno') ?? '')
  const estado = String(datos.get('estado') ?? '') as EstadoTurnoValor

  if (!turno) return { error: 'Falta el turno.', ok: false }
  if (!PERMITIDOS.includes(estado)) {
    return { error: 'Ese estado no existe.', ok: false }
  }

  const supabase = await crearClienteServidor()
  const { error } = await supabase
    .from('turnos')
    .update({ estado })
    .eq('id', turno)

  if (error) {
    if (error.code === '23P01') {
      return { error: 'Al reactivarlo choca con otro turno.', ok: false }
    }
    if (error.code === 'P0001') {
      return { error: error.message, ok: false }
    }
    if (error.code === '42501') {
      return { error: 'Tu rol no puede cambiar turnos.', ok: false }
    }
    return { error: 'No se pudo cambiar el estado.', ok: false }
  }

  revalidatePath('/panel/agenda')
  return { error: null, ok: true }
}
