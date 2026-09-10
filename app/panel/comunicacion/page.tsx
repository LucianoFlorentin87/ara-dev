import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { horaDe, hoyISO, instanteDe, sumarDias, ZONA } from '@/lib/tiempo'
import { enlaceWA } from '@/lib/whatsapp'
import { Vista, Panel, Fila, Vacio } from '../ui'

function diaLargo(fechaISO: string): string {
  const [a, m, d] = fechaISO.split('-').map(Number)
  const t = new Intl.DateTimeFormat('es-PY', {
    timeZone: ZONA,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(Date.UTC(a, m - 1, d, 12)))
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export default async function Comunicacion() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno' && sesion.rol !== 'recepcion') {
    return (
      <Vista>
        <Panel titulo="Tu rol no ve esta vista">
          <Vacio>Los recordatorios los manejan la dueña y recepción.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const manana = sumarDias(hoyISO(), 1)
  const supabase = await crearClienteServidor()

  const [{ data: turnos }, { data: local }] = await Promise.all([
    supabase
      .from('turnos')
      .select('id, inicio, estado, clientes(id, nombre, apellido, celular), servicios(nombre), profesionales(nombre_publico)')
      .gte('inicio', instanteDe(manana, '00:00').toISOString())
      .lt('inicio', instanteDe(sumarDias(manana, 1), '00:00').toISOString())
      .not('estado', 'in', '(cancelado,ausente)')
      .order('inicio'),
    supabase.from('locales').select('nombre').eq('id', sesion.localId).maybeSingle(),
  ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const nombreLocal = local?.nombre ?? 'el local'
  const lista = turnos ?? []
  const sinConfirmar = lista.filter((t) => t.estado === 'pendiente')

  return (
    <Vista>
      <Panel
        titulo={`Recordatorios para ${diaLargo(manana)}`}
        ayuda={`${lista.length} turnos · ${sinConfirmar.length} todavía sin confirmar`}
      >
        {lista.length === 0 ? (
          <Vacio>No hay turnos mañana. Nada que recordar.</Vacio>
        ) : (
          lista.map((t) => {
            const cli = uno(t.clientes) as
              | { id: string; nombre: string; apellido: string | null; celular: string | null }
              | null
            const srv = uno(t.servicios) as { nombre: string } | null
            const pro = uno(t.profesionales) as { nombre_publico: string } | null

            const texto =
              `Hola ${cli?.nombre ?? ''}, te recordamos tu turno en ${nombreLocal}: ` +
              `${diaLargo(manana).toLowerCase()} a las ${horaDe(t.inicio)}, ` +
              `${srv?.nombre ?? ''}${pro ? ` con ${pro.nombre_publico}` : ''}. ` +
              `Si no podés venir, avisanos así lo liberamos. ¡Gracias!`

            const wa = enlaceWA(cli?.celular, texto)

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
                <span style={{ flex: 1, minWidth: '160px' }}>
                  {cli ? (
                    <Link
                      href={`/panel/clientes/${cli.id}`}
                      style={{ display: 'block', fontWeight: 600, textDecoration: 'none' }}
                    >
                      {[cli.nombre, cli.apellido].filter(Boolean).join(' ')}
                    </Link>
                  ) : (
                    <span style={{ display: 'block', fontWeight: 600 }}>Sin cliente</span>
                  )}
                  <span
                    style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                  >
                    {srv?.nombre} · {pro?.nombre_publico}
                  </span>
                </span>
                {t.estado === 'pendiente' && <span className="chip">sin confirmar</span>}
                {wa ? (
                  <a
                    className="pastilla"
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Recordar
                  </a>
                ) : (
                  <span className="chip">sin celular</span>
                )}
              </Fila>
            )
          })
        )}
      </Panel>

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        Cada botón abre WhatsApp con el mensaje ya escrito. No queda registro de
        si se mandó: para eso haría falta una tabla de envíos, que hoy el
        esquema no tiene.
      </p>
    </Vista>
  )
}
