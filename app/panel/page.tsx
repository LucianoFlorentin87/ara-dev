import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { INICIO_POR_ROL } from '@/lib/menu'

/**
 * Cada rol entra a una vista distinta: dueño a Indicadores, profesional a
 * Mi día, recepción a la Agenda, cajero a Caja.
 */
export default async function Panel() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')
  redirect(`/panel/${INICIO_POR_ROL[sesion.rol]}`)
}
