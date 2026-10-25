'use server'

import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { destinoAuth } from '@/lib/auth-destino'

export type EstadoLogin = { error: string | null }

export async function entrar(
  _previo: EstadoLogin,
  datos: FormData
): Promise<EstadoLogin> {
  const email = String(datos.get('email') ?? '').trim()
  const clave = String(datos.get('clave') ?? '')

  if (!email || !clave) {
    return { error: 'Completá el correo y la contraseña.' }
  }

  const supabase = await crearClienteServidor()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: clave,
  })

  if (error) {
    // A propósito no se distingue "no existe" de "clave incorrecta": decirlo
    // convierte el login en una forma de averiguar qué correos tienen cuenta.
    return { error: 'Correo o contraseña incorrectos.' }
  }

  // Quien vino desde el alta vuelve al alta; el resto, al panel. Solo se
  // aceptan rutas propias: un `volver` con host ajeno sería un redirect
  // abierto servido desde nuestro dominio.
  const volver = String(datos.get('volver') ?? '')
  redirect(destinoAuth(volver))
}

export async function salir() {
  const supabase = await crearClienteServidor()
  await supabase.auth.signOut()
  redirect('/login')
}
