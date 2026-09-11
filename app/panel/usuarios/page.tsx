import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { ETIQUETA_ROL, type Rol, iniciales } from '@/lib/menu'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'
import { NuevoUsuario } from './nuevo'
import { FilaUsuario } from './fila'
import { hayClaveAdmin } from './acciones'

const QUE_VE: Record<Rol, string> = {
  dueno: 'Todo el panel',
  profesional: 'Sus turnos, sus clientes y sus fichas',
  recepcion: 'La agenda entera y los clientes. Nunca los ingresos ni las fichas',
  cajero: 'La caja, los cobros y el stock. Nunca las fichas',
}

export default async function Usuarios() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña ve los usuarios">
          <Vacio>Los permisos los maneja quien administra el local.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const [{ data: usuarios }, { data: profesionales }] = await Promise.all([
    supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, ultimo_acceso')
      .order('nombre'),
    supabase
      .from('profesionales')
      .select('id, nombre_publico, usuario_id, activo')
      .order('orden'),
  ])

  const porUsuario = new Map(
    (profesionales ?? [])
      .filter((p) => p.usuario_id)
      .map((p) => [p.usuario_id as string, p.nombre_publico])
  )
  const sinCuenta = (profesionales ?? []).filter((p) => p.activo && !p.usuario_id)
  const hayClave = await hayClaveAdmin()

  return (
    <Vista>
      <Rejilla min={330}>
        <Panel
          titulo="Quién entra al sistema"
          ayuda={`${(usuarios ?? []).length} cuentas`}
          accion={
            <NuevoUsuario
              hayClave={hayClave}
              sinCuenta={sinCuenta.map((p) => ({ id: p.id, nombre: p.nombre_publico }))}
            />
          }
        >
          {(usuarios ?? []).length === 0 ? (
            <Vacio>No hay usuarios cargados.</Vacio>
          ) : (
            (usuarios ?? []).map((u) => (
              <FilaUsuario
                key={u.id}
                usuario={{
                  id: u.id,
                  nombre: u.nombre,
                  email: u.email,
                  rol: u.rol as Rol,
                  activo: u.activo,
                  atiendeComo: porUsuario.get(u.id) ?? null,
                }}
                esYo={u.id === sesion.usuarioId}
                iniciales={iniciales(u.nombre)}
              />
            ))
          )}
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel titulo="Qué ve cada rol" ayuda="Lo hace cumplir la base, no el menú">
            {(Object.keys(QUE_VE) as Rol[]).map((r) => (
              <div
                key={r}
                style={{ padding: '11px 0', borderTop: '1px solid var(--line-soft)' }}
              >
                <div style={{ fontWeight: 600, fontSize: '13.5px' }}>
                  {ETIQUETA_ROL[r]}
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--ink-2)',
                    lineHeight: 1.5,
                    marginTop: '2px',
                  }}
                >
                  {QUE_VE[r]}
                </div>
              </div>
            ))}
          </Panel>

          {sinCuenta.length > 0 && (
            <Panel
              titulo="Atienden pero no entran"
              ayuda="Tienen ficha de profesional sin cuenta enlazada"
            >
              {sinCuenta.map((p) => (
                <Fila key={p.id}>
                  <span style={{ flex: 1, fontWeight: 600 }}>{p.nombre_publico}</span>
                  <span className="chip">sin cuenta</span>
                </Fila>
              ))}
              <p
                style={{
                  fontSize: '12.5px',
                  color: 'var(--ink-2)',
                  margin: '12px 0 0',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--line-soft)',
                  lineHeight: 1.55,
                }}
              >
                Se les puede agendar turnos igual. Sin cuenta no ven Mi día ni
                Mi perfil.
              </p>
            </Panel>
          )}
        </div>
      </Rejilla>

    </Vista>
  )
}
