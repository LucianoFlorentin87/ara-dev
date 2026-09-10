'use server'

import { headers } from 'next/headers'
import { crearClienteServidor } from '@/lib/supabase/servidor'

export type EstadoRecuperar = { error: string | null; enviado: boolean }

export async function pedirRecuperacion(
  _previo: EstadoRecuperar,
  datos: FormData
): Promise<EstadoRecuperar> {
  const email = String(datos.get('email') ?? '').trim()
  if (!email) return { error: 'Escribí tu correo.', enviado: false }

  const cabeceras = await headers()
  const origen =
    cabeceras.get('origin') ??
    `https://${cabeceras.get('host') ?? 'ara-dev-beta.vercel.app'}`

  const supabase = await crearClienteServidor()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origen}/recuperar/nueva`,
  })

  // No se distingue si el correo existe: decirlo convierte esta pantalla en
  // una forma de averiguar qué direcciones tienen cuenta. Siempre responde
  // lo mismo, haya llegado el mail o no.
  if (error && error.status !== 400) {
    return { error: 'No se pudo enviar. Probá de nuevo en un rato.', enviado: false }
  }

  return { error: null, enviado: true }
}

export type EstadoNueva = { error: string | null; ok: boolean }

export async function cambiarClave(
  _previo: EstadoNueva,
  datos: FormData
): Promise<EstadoNueva> {
  const clave = String(datos.get('clave') ?? '')
  if (clave.length < 8) {
    return { error: 'La contraseña tiene que tener al menos 8 caracteres.', ok: false }
  }

  const supabase = await crearClienteServidor()

  // El link de recuperación deja una sesión temporal: sin ella, no hay a
  // quién cambiarle la contraseña.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      error: 'El enlace venció o ya se usó. Pedí uno nuevo.',
      ok: false,
    }
  }

  const { error } = await supabase.auth.updateUser({ password: clave })
  if (error) return { error: 'No se pudo cambiar la contraseña.', ok: false }

  return { error: null, ok: true }
}
