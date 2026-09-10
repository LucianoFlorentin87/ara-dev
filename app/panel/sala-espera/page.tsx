import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { horaDe, hoyISO, instanteDe, sumarDias, ahoraMs } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio } from '../ui'

export default async function SalaEspera() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const hoy = hoyISO()
  const supabase = await crearClienteServidor()

  const { data: turnos } = await supabase
    .from('turnos')
    .select('id, inicio, estado, clientes(nombre, apellido), servicios(nombre), profesionales(nombre_publico)')
    .gte('inicio', instanteDe(hoy, '00:00').toISOString())
    .lt('inicio', instanteDe(sumarDias(hoy, 1), '00:00').toISOString())
    .in('estado', ['confirmado', 'pendiente', 'en_atencion'])
    .order('inicio')

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const ahora = ahoraMs()
  const todos = turnos ?? []
  const atendiendo = todos.filter((t) => t.estado === 'en_atencion')
  // "En sala" es una inferencia, no un dato: la hora ya pasó y el turno
  // sigue sin abrirse. El esquema no tiene marca de llegada.
  const enSala = todos.filter(
    (t) => t.estado !== 'en_atencion' && new Date(t.inicio).getTime() <= ahora
  )
  const porVenir = todos.filter(
    (t) => t.estado !== 'en_atencion' && new Date(t.inicio).getTime() > ahora
  )

  const listar = (
    lista: typeof todos,
    vacio: string,
    conEspera = false
  ) =>
    lista.length === 0 ? (
      <Vacio>{vacio}</Vacio>
    ) : (
      lista.map((t) => {
        const cli = uno(t.clientes) as { nombre: string; apellido: string | null } | null
        const srv = uno(t.servicios) as { nombre: string } | null
        const pro = uno(t.profesionales) as { nombre_publico: string } | null
        const minutos = Math.round((ahora - new Date(t.inicio).getTime()) / 60000)
        return (
          <Fila key={t.id}>
            <span
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-2)',
                fontVariantNumeric: 'tabular-nums',
                width: '44px',
                flex: 'none',
              }}
            >
              {horaDe(t.inicio)}
            </span>
            <span style={{ flex: 1, minWidth: '150px' }}>
              <span style={{ display: 'block', fontWeight: 600, fontSize: '14px' }}>
                {[cli?.nombre, cli?.apellido].filter(Boolean).join(' ')}
              </span>
              <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                {srv?.nombre} · {pro?.nombre_publico}
              </span>
            </span>
            {conEspera && minutos > 0 && (
              <span className="chip" data-tono={minutos > 15 ? 'alerta' : undefined}>
                esperando {minutos} min
              </span>
            )}
          </Fila>
        )
      })
    )

  return (
    <Vista>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Panel titulo="En atención" ayuda={`${atendiendo.length} ahora mismo`}>
          {listar(atendiendo, 'Nadie está siendo atendido en este momento.')}
        </Panel>

        <Panel
          titulo="Deberían estar acá"
          ayuda="Su hora ya pasó y el turno sigue sin abrirse"
        >
          {listar(enSala, 'Nadie esperando.', true)}
        </Panel>

        <Panel titulo="Más tarde hoy" ayuda={`${porVenir.length} turnos por venir`}>
          {listar(porVenir, 'No queda nadie para hoy.')}
        </Panel>
      </div>

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        Quién está en sala se deduce de la hora, no de un dato: el esquema no
        tiene marca de llegada. Para que esto sea exacto hace falta decidir si
        se agrega una, o si alcanza con abrir el turno al recibir a la persona.
      </p>
    </Vista>
  )
}
