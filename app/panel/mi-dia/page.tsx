import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import {
  horaDe,
  guaranies,
  hoyISO,
  instanteDe,
  sumarDias,
  ahoraMs,
} from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio, Rejilla, Estadistica } from '../ui'

export default async function MiDia() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const supabase = await crearClienteServidor()

  const { data: yo } = await supabase
    .from('profesionales')
    .select('id, nombre_publico, comision_servicios')
    .eq('usuario_id', sesion.usuarioId)
    .maybeSingle()

  if (!yo) {
    return (
      <Vista>
        <Panel titulo="Esta vista es para el equipo que atiende">
          <Vacio>
            Tu usuario no está enlazado a una ficha de profesional, así que no
            hay una agenda propia que mostrar. Se enlaza desde Usuarios y
            permisos.
          </Vacio>
        </Panel>
      </Vista>
    )
  }

  const hoy = hoyISO()
  const primeroDelMes = hoy.slice(0, 8) + '01'

  const [{ data: turnos }, { data: cobros }] = await Promise.all([
    supabase
      .from('turnos')
      .select('id, inicio, fin, estado, notas, precio_congelado, clientes(id, nombre, apellido, notas), servicios(nombre, duracion_min)')
      .eq('profesional_id', yo.id)
      .gte('inicio', instanteDe(hoy, '00:00').toISOString())
      .lt('inicio', instanteDe(sumarDias(hoy, 1), '00:00').toISOString())
      .not('estado', 'in', '(cancelado,ausente)')
      .order('inicio'),
    supabase
      .from('cobros')
      .select('monto, anulado')
      .eq('profesional_id', yo.id)
      .gte('created_at', instanteDe(primeroDelMes, '00:00').toISOString()),
  ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const ahora = ahoraMs()
  const mios = turnos ?? []
  const producido = (cobros ?? [])
    .filter((c) => !c.anulado)
    .reduce((a, c) => a + Number(c.monto), 0)
  const comision = (producido * Number(yo.comision_servicios)) / 100
  const minutos = mios.reduce(
    (a, t) => a + (new Date(t.fin).getTime() - new Date(t.inicio).getTime()) / 60000,
    0
  )

  return (
    <Vista>
      <Rejilla min={330}>
        <Panel
          titulo={`Hoy tenés ${mios.length} ${mios.length === 1 ? 'turno' : 'turnos'}`}
          ayuda={`${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, '0')} de trabajo`}
        >
          {mios.length === 0 ? (
            <Vacio>No tenés turnos hoy.</Vacio>
          ) : (
            mios.map((t) => {
              const cli = uno(t.clientes) as
                | { id: string; nombre: string; apellido: string | null; notas: string | null }
                | null
              const srv = uno(t.servicios) as { nombre: string } | null
              const pasado = new Date(t.fin).getTime() < ahora
              const nota = t.notas || cli?.notas
              return (
                <Fila key={t.id} tenue={pasado}>
                  <span
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--ink-2)',
                      fontSize: '12.5px',
                      width: '44px',
                      flex: 'none',
                    }}
                  >
                    {horaDe(t.inicio)}
                  </span>
                  <span style={{ flex: 1, minWidth: '160px' }}>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '14px' }}>
                      {[cli?.nombre, cli?.apellido].filter(Boolean).join(' ')}
                    </span>
                    <span
                      style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                    >
                      {srv?.nombre} · {guaranies(Number(t.precio_congelado))}
                    </span>
                    {nota && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          color: 'var(--warm-700)',
                          marginTop: '3px',
                        }}
                      >
                        {nota}
                      </span>
                    )}
                  </span>
                  <span className="chip">{t.estado.replace('_', ' ')}</span>
                </Fila>
              )
            })
          )}
        </Panel>

        <Panel titulo="Tu mes" ayuda="Cobros con tu nombre, desde el 1">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '2px',
              paddingTop: '14px',
              borderTop: '1px solid var(--line-soft)',
            }}
          >
            <Estadistica label="Producción" valor={guaranies(producido)} />
            <Estadistica label="Tu comisión" valor={guaranies(comision)} />
            <Estadistica
              label="Comisión"
              valor={`${Number(yo.comision_servicios)}%`}
            />
          </div>
          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--ink-2)',
              margin: '16px 0 0',
              lineHeight: 1.55,
            }}
          >
            La comisión se ve pero no se edita: la define quien administra el
            local.
          </p>
        </Panel>
      </Rejilla>
    </Vista>
  )
}
