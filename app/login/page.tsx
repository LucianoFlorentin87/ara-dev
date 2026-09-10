import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { MarcoAuth } from '../marco-auth'
import { Formulario } from './formulario'

export default async function Login() {
  if (await sesionActual()) redirect('/panel')

  return (
    <MarcoAuth
      titulo="Entrar al panel"
      bajada="Con tu usuario del local. Cada rol ve solo lo que le corresponde."
    >
      <Formulario />
    </MarcoAuth>
  )
}
