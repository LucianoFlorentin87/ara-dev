'use server'

import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { validarAlta, type AltaValidada } from './validacion'

export type EstadoAlta = { error: string | null }

export async function darDeAlta(_previo: EstadoAlta, datos: FormData): Promise<EstadoAlta> {
  let alta: AltaValidada
  try { alta = validarAlta(datos) }
  catch (error) { return { error: error instanceof Error ? error.message : 'Revisá los datos del local.' } }

  const supabase = await crearClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?volver=/alta')

  // La base crea local, dueño, profesional, horarios y catálogo en una transacción.
  const { error } = await supabase.rpc('completar_alta', {
    p_nombre: alta.nombre, p_slug: alta.slug, p_rubro: alta.rubro,
    p_nombre_usuario: String(user.user_metadata?.nombre ?? user.email?.split('@')[0] ?? 'Dueño').slice(0, 100),
    p_direccion: alta.direccion, p_telefono_wa: alta.telefono, p_instagram: alta.instagram,
    p_horarios: alta.horarios, p_servicios: alta.servicios,
  })
  if (error) {
    if (error.code === '23505') return { error: 'Ese nombre de local ya tiene un link. Elegí otro nombre.' }
    if (error.message.includes('cuenta ya tiene un local')) return { error: 'Tu cuenta ya tiene un local. Ingresá al panel.' }
    return { error: 'No se pudo completar el alta. No se guardó un local a medias. Probá de nuevo o contactanos.' }
  }
  redirect('/panel')
}
