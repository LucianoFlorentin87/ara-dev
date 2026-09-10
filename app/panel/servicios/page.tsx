import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { guaranies } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'

export default async function Servicios() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const supabase = await crearClienteServidor()
  const [{ data: servicios }, { data: asignados }, { data: profesionales }] =
    await Promise.all([
      supabase
        .from('servicios')
        .select('id, nombre, categoria, duracion_min, precio, activo, visible_online, requiere_sena, sena_monto, orden')
        .order('orden'),
      supabase
        .from('servicios_profesionales')
        .select('servicio_id, profesional_id, precio_propio, duracion_propia'),
      supabase
        .from('profesionales')
        .select('id, nombre_publico')
        .eq('activo', true)
        .order('orden'),
    ])

  const nombrePro = new Map(
    (profesionales ?? []).map((p) => [p.id, p.nombre_publico])
  )

  const activos = (servicios ?? []).filter((s) => s.activo)

  return (
    <Vista>
      <Rejilla min={340}>
        <Panel
          titulo="Catálogo del local"
          ayuda={`${activos.length} servicios activos · se usan en la agenda, el link y el cobro`}
        >
          {(servicios ?? []).length === 0 ? (
            <Vacio>Todavía no hay servicios cargados.</Vacio>
          ) : (
            (servicios ?? []).map((s) => {
              const quienes = (asignados ?? []).filter((a) => a.servicio_id === s.id)
              return (
                <Fila key={s.id} tenue={!s.activo}>
                  <span style={{ flex: 1, minWidth: '160px' }}>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '14px' }}>
                      {s.nombre}
                    </span>
                    <span
                      style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                    >
                      {s.categoria} · {s.duracion_min} min
                      {quienes.length > 0
                        ? ' · ' +
                          quienes
                            .map((q) => nombrePro.get(q.profesional_id) ?? '')
                            .filter(Boolean)
                            .join(', ')
                        : ' · lo hace cualquiera'}
                    </span>
                  </span>
                  {!s.visible_online && <span className="chip">fuera del link</span>}
                  {s.requiere_sena && (
                    <span className="chip">seña {guaranies(Number(s.sena_monto))}</span>
                  )}
                  <span
                    style={{
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: '100px',
                      textAlign: 'right',
                    }}
                  >
                    {guaranies(Number(s.precio))}
                  </span>
                </Fila>
              )
            })
          )}
        </Panel>

        <Panel
          titulo="Precios propios"
          ayuda="Cuando alguien cobra distinto por el mismo servicio"
        >
          {(() => {
            const propios = (asignados ?? []).filter(
              (a) => a.precio_propio !== null || a.duracion_propia !== null
            )
            if (propios.length === 0) {
              return (
                <Vacio>
                  Nadie tiene precio ni duración propia: todos usan los del
                  catálogo.
                </Vacio>
              )
            }
            const nombreSrv = new Map(
              (servicios ?? []).map((s) => [s.id, s.nombre])
            )
            return propios.map((p, i) => (
              <Fila key={`${p.servicio_id}-${p.profesional_id}-${i}`}>
                <span style={{ flex: 1, minWidth: '150px' }}>
                  <span style={{ display: 'block', fontWeight: 600 }}>
                    {nombrePro.get(p.profesional_id)}
                  </span>
                  <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                    {nombreSrv.get(p.servicio_id)}
                  </span>
                </span>
                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {p.precio_propio !== null
                    ? guaranies(Number(p.precio_propio))
                    : `${p.duracion_propia} min`}
                </span>
              </Fila>
            ))
          })()}
        </Panel>
      </Rejilla>

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        Editar el catálogo todavía no está: cambiar un precio acá afecta turnos
        futuros pero no los ya agendados, que lo tienen congelado, y eso merece
        su propia pantalla con esa advertencia a la vista.
      </p>
    </Vista>
  )
}
