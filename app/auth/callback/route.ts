import { NextResponse, type NextRequest } from 'next/server'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { destinoAuth } from '@/lib/auth-destino'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (code) {
    const supabase = await crearClienteServidor()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const destino = destinoAuth(request.nextUrl.searchParams.get('next'), '/alta')
      const respuesta = NextResponse.redirect(new URL(destino, request.url))
      respuesta.headers.set('Cache-Control', 'private, no-store')
      return respuesta
    }
  }
  return NextResponse.redirect(new URL('/login?enlace=invalido', request.url))
}
