import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente para server components, server actions y route handlers.
 * Lee la sesión de las cookies, así que RLS ve al usuario real.
 *
 * Se crea uno por request. Nunca compartir uno entre requests: las
 * cabeceras anti-caché salen solo con la primera escritura de cookie.
 */
export async function crearClienteServidor() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (nuevas) => {
          // Desde un server component esto tira: no se pueden escribir
          // cookies durante el render. No es un problema mientras el
          // proxy corra, porque ahí ya se refrescó la sesión.
          try {
            nuevas.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
