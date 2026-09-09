import { crearClienteServidor } from '@/lib/supabase/servidor'
import type { Rol } from '@/lib/menu'

export type Sesion = {
  usuarioId: string
  nombre: string
  email: string
  rol: Rol
  localId: string
  local: { nombre: string; rubro: string; direccion: string | null }
}

/**
 * Quién está entrando, según la base y no según la cookie.
 *
 * Usa getUser(), que valida el token contra Supabase. getSession() lee lo que
 * venga en la cookie sin verificar, así que no sirve para decidir permisos.
 *
 * Devuelve null si no hay sesión, y también si hay sesión pero la persona no
 * tiene fila en `usuarios`: para el panel es lo mismo, no puede entrar. Ese
 * segundo caso es el error más común al montar el proyecto.
 */
export async function sesionActual(): Promise<Sesion | null> {
  const supabase = await crearClienteServidor()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('usuarios')
    .select('id, nombre, email, rol, local_id, locales(nombre, rubro, direccion)')
    .eq('auth_id', user.id)
    .maybeSingle()

  if (!data) return null

  const local = Array.isArray(data.locales) ? data.locales[0] : data.locales

  return {
    usuarioId: data.id,
    nombre: data.nombre,
    email: data.email,
    rol: data.rol as Rol,
    localId: data.local_id,
    local: {
      nombre: local?.nombre ?? '',
      rubro: local?.rubro ?? '',
      direccion: local?.direccion ?? null,
    },
  }
}
