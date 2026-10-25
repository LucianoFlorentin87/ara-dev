'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'

export type EstadoRegistro = { error: string | null; enviado: boolean }

export async function registrar(_previo: EstadoRegistro, datos: FormData): Promise<EstadoRegistro> {
  const nombre = String(datos.get('nombre') ?? '').trim()
  const email = String(datos.get('email') ?? '').trim()
  const clave = String(datos.get('clave') ?? '')
  if (!nombre || nombre.length > 100) return { error: 'Escribí tu nombre (hasta 100 caracteres).', enviado: false }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return { error: 'Escribí un correo válido.', enviado: false }
  }
  if (clave.length < 8 || clave.length > 128) {
    return { error: 'La contraseña debe tener entre 8 y 128 caracteres.', enviado: false }
  }
  const cabeceras = await headers()
  const origen = cabeceras.get('origin')
  if (!origen) return { error: 'Volvé a abrir el formulario para crear tu cuenta.', enviado: false }
  const callback = new URL('/auth/callback', origen)
  callback.searchParams.set('next', '/alta')
  const supabase = await crearClienteServidor()
  const { data, error } = await supabase.auth.signUp({
    email, password: clave,
    options: { data: { nombre }, emailRedirectTo: callback.toString() },
  })
  if (error) return { error: 'No se pudo crear la cuenta. Si ya tenés una, ingresá o recuperá tu contraseña.', enviado: false }
  if (data.session) redirect('/alta')
  return { error: null, enviado: true }
}
