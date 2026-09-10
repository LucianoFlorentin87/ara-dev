import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { Asistente } from './asistente'

export const metadata = {
  title: 'Dar de alta tu local · Ára',
  description: 'Cinco pasos: rubro, datos del local, horario, catálogo y equipo.',
}

/**
 * El alta crea el local del que después cuelga todo, así que necesita una
 * sesión: `crear_local()` es `security definer` pero exige `auth.uid()`.
 * Quien llega sin sesión pasa primero por el login y vuelve acá.
 */
export default async function Alta() {
  const supabase = await crearClienteServidor()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/login?volver=/alta')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Asistente />
    </div>
  )
}
