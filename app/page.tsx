import { redirect } from 'next/navigation'

/**
 * La raíz va a ser la landing de marketing (punto 7 del orden de trabajo).
 * Hasta entonces manda al panel, que a su vez manda al login si no hay sesión.
 */
export default function Inicio() {
  redirect('/panel')
}
