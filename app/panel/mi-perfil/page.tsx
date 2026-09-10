import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { guaranies } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default async function MiPerfil() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const supabase = await crearClienteServidor()

  const { data: yo } = await supabase
    .from('profesionales')
    .select('id, nombre_publico, especialidad, anios_oficio, bio, slug, comision_servicios, comision_productos, acepta_reservas_online')
    .eq('usuario_id', sesion.usuarioId)
    .maybeSingle()

  if (!yo) {
    return (
      <Vista>
        <Panel titulo="Esta vista es para el equipo que atiende">
          <Vacio>
            Tu usuario no está enlazado a una ficha de profesional. Se enlaza
            desde Usuarios y permisos.
          </Vacio>
        </Panel>
      </Vista>
    )
  }

  const [{ data: horarios }, { data: mios }, { data: servicios }, { data: local }] =
    await Promise.all([
      supabase
        .from('horarios')
        .select('dia_semana, hora_inicio, hora_fin')
        .eq('profesional_id', yo.id)
        .order('dia_semana'),
      supabase
        .from('servicios_profesionales')
        .select('servicio_id, precio_propio, duracion_propia')
        .eq('profesional_id', yo.id),
      supabase.from('servicios').select('id, nombre, precio, duracion_min'),
      supabase.from('locales').select('slug').eq('id', sesion.localId).maybeSingle(),
    ])

  const porId = new Map((servicios ?? []).map((s) => [s.id, s]))
  const enlace = local?.slug && yo.slug ? `ara.com.py/${local.slug}/${yo.slug}` : null

  return (
    <Vista>
      <Rejilla min={330}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel titulo="Tu horario" ayuda="Dentro del horario del local">
            {(horarios ?? []).length === 0 ? (
              <Vacio>
                No tenés horario propio: se usa el del local para todos tus días.
              </Vacio>
            ) : (
              (horarios ?? []).map((h, i) => (
                <Fila key={`${h.dia_semana}-${i}`}>
                  <span style={{ flex: 1, fontWeight: 600 }}>{DIAS[h.dia_semana]}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {h.hora_inicio.slice(0, 5)} a {h.hora_fin.slice(0, 5)}
                  </span>
                </Fila>
              ))
            )}
          </Panel>

          <Panel
            titulo="Lo que hacés"
            ayuda="Solo se te puede agendar esto"
          >
            {(mios ?? []).length === 0 ? (
              <Vacio>
                No tenés servicios asignados, así que se te puede agendar
                cualquiera del catálogo.
              </Vacio>
            ) : (
              (mios ?? []).map((m) => {
                const s = porId.get(m.servicio_id)
                const precio = m.precio_propio ?? s?.precio ?? 0
                const propio = m.precio_propio !== null
                return (
                  <Fila key={m.servicio_id}>
                    <span style={{ flex: 1, minWidth: '140px' }}>
                      <span style={{ display: 'block', fontWeight: 600 }}>
                        {s?.nombre}
                      </span>
                      <span
                        style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                      >
                        {m.duracion_propia ?? s?.duracion_min} min
                        {propio ? ' · precio propio' : ''}
                      </span>
                    </span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {guaranies(Number(precio))}
                    </span>
                  </Fila>
                )
              })
            )}
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel titulo="Tu presentación pública">
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Nombre</span>
              <span style={{ fontWeight: 600 }}>{yo.nombre_publico}</span>
            </Fila>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Especialidad</span>
              <span style={{ fontWeight: 600 }}>{yo.especialidad ?? '—'}</span>
            </Fila>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Años de oficio</span>
              <span style={{ fontWeight: 600 }}>{yo.anios_oficio ?? '—'}</span>
            </Fila>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Reservas online</span>
              <span style={{ fontWeight: 600 }}>
                {yo.acepta_reservas_online ? 'Sí' : 'No'}
              </span>
            </Fila>
            {yo.bio && (
              <p
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'var(--ink-2)',
                  margin: '12px 0 0',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                {yo.bio}
              </p>
            )}
          </Panel>

          <Panel titulo="Tu link propio">
            {enlace ? (
              <>
                <div
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    letterSpacing: '-0.02em',
                    wordBreak: 'break-all',
                  }}
                >
                  {enlace}
                </div>
                <p
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--ink-2)',
                    margin: '6px 0 0',
                    lineHeight: 1.5,
                  }}
                >
                  Lleva directo a reservar con vos. El dominio todavía no está
                  contratado.
                </p>
              </>
            ) : (
              <Vacio>Todavía no tenés un enlace propio configurado.</Vacio>
            )}
          </Panel>

          <Panel titulo="Tu comisión">
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Servicios</span>
              <span style={{ fontWeight: 600 }}>
                {Number(yo.comision_servicios)}%
              </span>
            </Fila>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Productos</span>
              <span style={{ fontWeight: 600 }}>
                {Number(yo.comision_productos)}%
              </span>
            </Fila>
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-2)',
                margin: '12px 0 0',
                lineHeight: 1.55,
              }}
            >
              Se ve, no se edita. Si tiene que ser negociable desde acá, es una
              decisión del negocio, no de la pantalla.
            </p>
          </Panel>
        </div>
      </Rejilla>
    </Vista>
  )
}
