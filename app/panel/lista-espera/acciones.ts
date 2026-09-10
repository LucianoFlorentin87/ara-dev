'use server'

import { revalidatePath } from 'next/cache'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { sesionActual } from '@/lib/sesion'

export type EstadoEspera = { error: string | null; ok: boolean }

export async function anotarEnEspera(
  _previo: EstadoEspera,
  datos: FormData
): Promise<EstadoEspera> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const cliente = String(datos.get('cliente') ?? '')
  const servicio = String(datos.get('servicio') ?? '')
  const profesional = String(datos.get('profesional') ?? '')

  if (!cliente) return { error: 'Elegí un cliente.', ok: false }

  const supabase = await crearClienteServidor()
  const { error } = await supabase.from('lista_espera').insert({
    local_id: sesion.localId,
    cliente_id: cliente,
    servicio_id: servicio || null,
    profesional_id: profesional || null,
  })

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede tocar la lista de espera.', ok: false }
    }
    return { error: 'No se pudo anotar.', ok: false }
  }

  revalidatePath('/panel/lista-espera')
  return { error: null, ok: true }
}

export async function resolverEspera(
  _previo: EstadoEspera,
  datos: FormData
): Promise<EstadoEspera> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const id = String(datos.get('id') ?? '')
  if (!id) return { error: 'Falta la fila.', ok: false }

  const supabase = await crearClienteServidor()
  const { error } = await supabase
    .from('lista_espera')
    .update({ resuelto: true })
    .eq('id', id)

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede tocar la lista de espera.', ok: false }
    }
    return { error: 'No se pudo marcar como resuelto.', ok: false }
  }

  revalidatePath('/panel/lista-espera')
  return { error: null, ok: true }
}
