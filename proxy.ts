import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refresca el token en cada request. Sin esto la sesión se vence sola y
 * el panel empieza a devolver vacío en vez de error.
 *
 * En Next 16 este archivo se llama `proxy.ts` y exporta `proxy`.
 * `middleware.ts` quedó deprecado — es el mismo mecanismo, otro nombre.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (nuevas, headers) => {
          nuevas.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          nuevas.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          // Estas cabeceras no son opcionales: marcan la respuesta como
          // no cacheable. Sin ellas un CDN puede guardar la respuesta con
          // la cookie de sesión de alguien y servírsela a otra persona.
          Object.entries(headers).forEach(([clave, valor]) =>
            response.headers.set(clave, valor)
          )
        },
      },
    }
  )

  // No borrar: es la llamada que refresca el token. Va temprano, antes
  // de que se genere cualquier respuesta.
  await supabase.auth.getClaims()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
