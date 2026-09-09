import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Cliente con la clave secreta: saltea RLS por completo.
 *
 * Solo para lo que tiene que saltearlo a propósito. Nunca se importa
 * desde un archivo con 'use client': el `import 'server-only'` de arriba
 * hace que el build falle si eso llega a pasar.
 */
export function crearClienteAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
