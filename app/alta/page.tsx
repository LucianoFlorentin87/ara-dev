import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { claseNoche } from '../_noche/marco'
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
  if (!data.user) redirect('/registro')

  const { data: miembro } = await supabase.from('usuarios').select('id').eq('auth_id', data.user.id).limit(1)
  if (miembro?.length) redirect('/panel')

  return (
    <div className={claseNoche} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Asistente nombreUsuario={String(data.user.user_metadata?.nombre ?? data.user.email?.split('@')[0] ?? 'Dueño')} correo={data.user.email ?? ''} />
    </div>
  )
}
