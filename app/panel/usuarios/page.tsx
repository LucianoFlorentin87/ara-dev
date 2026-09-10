import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { ETIQUETA_ROL, type Rol, iniciales } from '@/lib/menu'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'

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

  return (
    <Vista>
      <Rejilla min={330}>
        <Panel
          titulo="Quién entra al sistema"
          ayuda={`${(usuarios ?? []).length} cuentas`}
        >
          {(usuarios ?? []).length === 0 ? (
            <Vacio>No hay usuarios cargados.</Vacio>
          ) : (
            (usuarios ?? []).map((u) => (
              <Fila key={u.id} tenue={!u.activo}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '999px',
                    background: 'var(--neutral-solid)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                  }}
                >
                  {iniciales(u.nombre)}
                </span>
                <span style={{ flex: 1, minWidth: '150px' }}>
                  <span style={{ display: 'block', fontWeight: 600 }}>{u.nombre}</span>
                  <span
                    style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                  >
                    {u.email}
                    {porUsuario.has(u.id) ? ` · atiende como ${porUsuario.get(u.id)}` : ''}
                  </span>
                </span>
                <span className="chip">{ETIQUETA_ROL[u.rol as Rol]}</span>
              </Fila>
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

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        Crear e invitar usuarios todavía no está: alta y baja de cuentas tocan
        Supabase Auth, no solo esta tabla, y conviene resolverlo junto con la
        pantalla de alta del local.
      </p>
    </Vista>
  )
}
