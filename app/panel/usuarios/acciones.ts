'use server'

import { revalidatePath } from 'next/cache'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { crearClienteAdmin } from '@/lib/supabase/admin'
import { sesionActual } from '@/lib/sesion'
import type { Rol } from '@/lib/menu'

export type EstadoUsuario = { error: string | null; ok: string | null }

const ROLES: Rol[] = ['dueno', 'profesional', 'recepcion', 'cajero']

/** Sin la clave secreta no se puede tocar auth.users. Se avisa, no se rompe. */
export async function hayClaveAdmin(): Promise<boolean> {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Da de alta a alguien del equipo.
 *
 * Son dos cosas en dos lugares: la cuenta vive en `auth.users`, que solo se
 * toca con la clave secreta, y el permiso vive en `usuarios`, que es lo que
 * leen todas las policies. Por eso la fila de `usuarios` se inserta con el
 * cliente normal y pasa por RLS igual que cualquier otra: el alta no es una
 * puerta de atrás, la clave secreta se usa nada más para la cuenta.
 *
 * Si el segundo paso falla, se borra la cuenta recién creada. Quedarse con
 * una cuenta de auth sin fila en `usuarios` es peor que no haber hecho
 * nada: puede iniciar sesión y no pertenece a ningún local.
 */
export async function crearUsuario(
  _previo: EstadoUsuario,
  datos: FormData
): Promise<EstadoUsuario> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: null }
  if (sesion.rol !== 'dueno') {
    return { error: 'Solo la dueña puede dar de alta usuarios.', ok: null }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error:
        'Falta la clave secreta de Supabase (SUPABASE_SERVICE_ROLE_KEY). Sin eso no se puede crear la cuenta.',
      ok: null,
    }
  }

  const nombre = String(datos.get('nombre') ?? '').trim()
  const email = String(datos.get('email') ?? '').trim().toLowerCase()
  const rol = String(datos.get('rol') ?? '') as Rol
  const profesional = String(datos.get('profesional') ?? '')
  const clave = String(datos.get('clave') ?? '')

  if (!nombre) return { error: 'Poné el nombre.', ok: null }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: 'Ese correo no parece válido.', ok: null }
  }
  if (!ROLES.includes(rol)) return { error: 'Elegí un rol.', ok: null }
  if (clave.length < 8) {
    return { error: 'La contraseña tiene que tener al menos 8 caracteres.', ok: null }
  }

  const supabase = await crearClienteServidor()

  // Dos personas del mismo local con el mismo correo no tiene sentido, y la
  // constraint de la tabla es sobre (auth_id, local_id), que no lo cubre.
  const { data: repetido } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .limit(1)
    .maybeSingle()

  if (repetido) {
    return { error: 'Ya hay alguien en el local con ese correo.', ok: null }
  }

  const admin = crearClienteAdmin()

  const { data: cuenta, error: errorCuenta } = await admin.auth.admin.createUser({
    email,
    password: clave,
    // Confirmado de entrada: la dueña le pasa la contraseña en persona y la
    // persona la cambia desde Mi perfil. El mail de invitación de Supabase
    // es de un solo uso y los escáneres de Gmail lo consumen antes de que
    // llegue, así que acá no sirve.
    email_confirm: true,
    user_metadata: { nombre },
  })

  if (errorCuenta || !cuenta?.user) {
    if (errorCuenta?.message?.toLowerCase().includes('already')) {
      return {
        error: 'Ese correo ya tiene cuenta en Ára. Escribinos para enlazarla a este local.',
        ok: null,
      }
    }
    return { error: errorCuenta?.message ?? 'No se pudo crear la cuenta.', ok: null }
  }

  const { data: fila, error: errorFila } = await supabase
    .from('usuarios')
    .insert({
      auth_id: cuenta.user.id,
      local_id: sesion.localId,
      nombre,
      email,
      rol,
    })
    .select('id')
    .single()

  if (errorFila || !fila) {
    await admin.auth.admin.deleteUser(cuenta.user.id)
    if (errorFila?.code === '42501') {
      return { error: 'Tu rol no puede dar de alta usuarios.', ok: null }
    }
    return { error: errorFila?.message ?? 'No se pudo guardar el usuario.', ok: null }
  }

  // Si la cuenta es de alguien que ya atiende, se enlaza con su ficha de
  // profesional. Es lo que hace que vea "Mi día" y "Mi perfil".
  if (profesional) {
    await supabase.from('profesionales').update({ usuario_id: fila.id }).eq('id', profesional)
  }

  revalidatePath('/panel/usuarios')
  return { error: null, ok: `${nombre} ya puede entrar con ${email}.` }
}

/** Da de baja o vuelve a habilitar a alguien. La cuenta de auth no se toca. */
export async function alternarUsuario(
  _previo: EstadoUsuario,
  datos: FormData
): Promise<EstadoUsuario> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: null }

  const usuario = String(datos.get('usuario') ?? '')
  const activo = String(datos.get('activo') ?? '') === 'true'

  if (!usuario) return { error: 'Falta el usuario.', ok: null }
  if (usuario === sesion.usuarioId) {
    return { error: 'No podés darte de baja a vos misma.', ok: null }
  }

  const supabase = await crearClienteServidor()
  const { error } = await supabase
    .from('usuarios')
    .update({ activo: !activo })
    .eq('id', usuario)

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede cambiar usuarios.', ok: null }
    }
    return { error: 'No se pudo cambiar el usuario.', ok: null }
  }

  revalidatePath('/panel/usuarios')
  return { error: null, ok: activo ? 'Dado de baja.' : 'Habilitado de nuevo.' }
}

/** Cambia el rol de alguien. Lo que puede ver lo deciden las policies. */
export async function cambiarRol(
  _previo: EstadoUsuario,
  datos: FormData
): Promise<EstadoUsuario> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: null }

  const usuario = String(datos.get('usuario') ?? '')
  const rol = String(datos.get('rol') ?? '') as Rol
  if (!usuario || !ROLES.includes(rol)) return { error: 'Falta el rol.', ok: null }

  if (usuario === sesion.usuarioId && rol !== 'dueno') {
    return {
      error: 'Si te sacás el rol de dueña te quedás sin poder volver a ponértelo.',
      ok: null,
    }
  }

  const supabase = await crearClienteServidor()
  const { error } = await supabase.from('usuarios').update({ rol }).eq('id', usuario)

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede cambiar permisos.', ok: null }
    }
    return { error: 'No se pudo cambiar el rol.', ok: null }
  }

  revalidatePath('/panel/usuarios')
  return { error: null, ok: 'Rol actualizado.' }
}
