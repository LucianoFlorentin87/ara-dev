import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { MarcoAuth } from '../marco-auth'
import { Registro } from './formulario'

export const metadata = { title: 'Crear cuenta · Ára' }

export default async function CrearCuenta() {
  const supabase = await crearClienteServidor()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/alta')
  return <MarcoAuth titulo="Creá tu cuenta" bajada="Primero tu cuenta; después configuramos tu local."><Registro /></MarcoAuth>
}
