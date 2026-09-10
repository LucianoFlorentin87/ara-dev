import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { horaDe, guaranies, ZONA } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio } from '../ui'

const ESTADOS = [
  ['', 'Todos'],
  ['pendiente', 'Sin confirmar'],
  ['confirmado', 'Confirmados'],
  ['en_atencion', 'En atención'],
  ['terminado', 'Terminados'],
  ['ausente', 'No vinieron'],
  ['cancelado', 'Cancelados'],
] as const

function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es-PY', {
    timeZone: ZONA,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(iso))
}

export default async function Turnos({ searchParams }: PageProps<'/panel/turnos'>) {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const params = await searchParams
  const estado = typeof params.estado === 'string' ? params.estado : ''

  const supabase = await crearClienteServidor()
  let consulta = supabase
    .from('turnos')
    .select(
      'id, inicio, fin, estado, origen, precio_congelado, clientes(id, nombre, apellido), servicios(nombre), profesionales(nombre_publico)'
    )
    .order('inicio', { ascending: false })
    .limit(150)

  if (estado) consulta = consulta.eq('estado', estado)

  const { data: turnos } = await consulta

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  return (
    <Vista>
      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {ESTADOS.map(([valor, label]) => (
          <Link
            key={valor || 'todos'}
            className="pastilla"
            data-activo={estado === valor}
            href={valor ? `/panel/turnos?estado=${valor}` : '/panel/turnos'}
          >
            {label}
          </Link>
        ))}
      </div>

      <Panel
        titulo="Todos los turnos"
        ayuda={`${turnos?.length ?? 0} turnos · los más recientes primero`}
      >
        {(turnos ?? []).length === 0 ? (
          <Vacio>No hay turnos con ese estado.</Vacio>
        ) : (
          (turnos ?? []).map((t) => {
            const cli = uno(t.clientes) as
              | { id: string; nombre: string; apellido: string | null }
              | null
            const srv = uno(t.servicios) as { nombre: string } | null
            const pro = uno(t.profesionales) as { nombre_publico: string } | null
            const muerto = t.estado === 'cancelado' || t.estado === 'ausente'

            return (
              <Fila key={t.id} tenue={muerto}>
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--ink-2)',
                    fontSize: '12.5px',
                    width: '120px',
                    flex: 'none',
                  }}
                >
                  {fechaCorta(t.inicio)} {horaDe(t.inicio)}
                </span>
                <span style={{ flex: 1, minWidth: '160px' }}>
                  <span style={{ display: 'block', fontWeight: 600 }}>
                    {cli ? (
                      <Link
                        href={`/panel/clientes/${cli.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {[cli.nombre, cli.apellido].filter(Boolean).join(' ')}
                      </Link>
                    ) : (
                      'Sin cliente'
                    )}
                  </span>
                  <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                    {srv?.nombre} · {pro?.nombre_publico}
                  </span>
                </span>
                {t.origen === 'online' && <span className="chip">online</span>}
                <span className="chip">{t.estado.replace('_', ' ')}</span>
                <span
                  style={{
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '96px',
                    textAlign: 'right',
                  }}
                >
                  {guaranies(Number(t.precio_congelado))}
                </span>
              </Fila>
            )
          })
        )}
      </Panel>
    </Vista>
  )
}
