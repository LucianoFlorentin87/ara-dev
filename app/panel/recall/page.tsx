import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { hoyISO, ahoraMs } from '@/lib/tiempo'
import { enlaceWA } from '@/lib/whatsapp'
import { Vista, Panel, Fila, Vacio, Estadistica } from '../ui'

const UMBRAL_DIAS = 45

export default async function Recall() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña ve el recall">
          <Vacio>Es una herramienta de marketing del local.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const [{ data: clientes }, { data: futuros }, { data: local }] = await Promise.all([
    supabase
      .from('clientes')
      .select('id, nombre, apellido, celular, ultima_visita, profesionales(nombre_publico)')
      .not('ultima_visita', 'is', null)
      .order('ultima_visita'),
    supabase
      .from('turnos')
      .select('cliente_id')
      .gte('inicio', new Date(ahoraMs()).toISOString())
      .not('estado', 'in', '(cancelado,ausente)'),
    supabase.from('locales').select('nombre').eq('id', sesion.localId).maybeSingle(),
  ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  // Quien ya tiene turno no necesita que lo llamen.
  const conTurno = new Set((futuros ?? []).map((t) => t.cliente_id))
  const hoy = hoyISO()

  const dormidos = (clientes ?? [])
    .filter((c) => !conTurno.has(c.id))
    .map((c) => {
      const dias = Math.round(
        (new Date(hoy + 'T12:00:00Z').getTime() -
          new Date(c.ultima_visita + 'T12:00:00Z').getTime()) /
          86400000
      )
      return { ...c, dias }
    })
    .filter((c) => c.dias >= UMBRAL_DIAS)
    .sort((a, b) => b.dias - a.dias)

  const nombreLocal = local?.nombre ?? 'el local'

  return (
    <Vista>
      <Panel
        titulo="Clientes para recuperar"
        ayuda={`Sin venir hace ${UMBRAL_DIAS} días o más, y sin turno agendado`}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2px',
            padding: '14px 0',
            borderTop: '1px solid var(--line-soft)',
            borderBottom: '1px solid var(--line-soft)',
            marginBottom: '4px',
          }}
        >
          <Estadistica label="Para llamar" valor={String(dormidos.length)} />
          <Estadistica
            label="Con turno ya"
            valor={String(conTurno.size)}
          />
          <Estadistica
            label="Total de clientes"
            valor={String((clientes ?? []).length)}
          />
        </div>

        {dormidos.length === 0 ? (
          <Vacio>
            Nadie pasó los {UMBRAL_DIAS} días sin volver. O el local es muy
            nuevo, o están viniendo todos.
          </Vacio>
        ) : (
          dormidos.map((c) => {
            const nombre = [c.nombre, c.apellido].filter(Boolean).join(' ')
            const pro = uno(c.profesionales) as { nombre_publico: string } | null
            const texto = `Hola ${c.nombre}, ¿cómo estás? Te escribimos de ${nombreLocal}. Hace un tiempo que no nos visitás y queríamos saber si querés reservar un turno. ¡Te esperamos!`
            const wa = enlaceWA(c.celular, texto)
            return (
              <Fila key={c.id}>
                <span style={{ flex: 1, minWidth: '150px' }}>
                  <Link
                    href={`/panel/clientes/${c.id}`}
                    style={{ display: 'block', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {nombre}
                  </Link>
                  <span
                    style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                  >
                    {pro ? `atendía ${pro.nombre_publico}` : 'sin profesional fijo'}
                  </span>
                </span>
                <span
                  className="chip"
                  data-tono={c.dias >= UMBRAL_DIAS * 2 ? 'alerta' : undefined}
                >
                  {c.dias} días
                </span>
                {wa ? (
                  <a
                    className="pastilla"
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Escribir
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
        El sistema no manda nada solo: abre WhatsApp con el texto escrito para
        que lo leas y lo mandes desde tu número. Sin proveedor de mensajería y
        sin costo por mensaje.
      </p>
    </Vista>
  )
}
