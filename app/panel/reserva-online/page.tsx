import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { guaranies } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'

export default async function ReservaOnline() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno' && sesion.rol !== 'recepcion') {
    return (
      <Vista>
        <Panel titulo="Tu rol no ve esta vista">
          <Vacio>El link de reserva lo configuran la dueña y recepción.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const [{ data: local }, { data: servicios }, { data: profesionales }, { data: online }] =
    await Promise.all([
      supabase.from('locales').select('slug, nombre, estado').eq('id', sesion.localId).maybeSingle(),
      supabase.from('servicios').select('id, nombre, precio, duracion_min, activo, visible_online').order('orden'),
      supabase.from('profesionales').select('id, nombre_publico, acepta_reservas_online, activo').order('orden'),
      supabase.from('turnos').select('id').eq('origen', 'online'),
    ])

  const visibles = (servicios ?? []).filter((s) => s.activo && s.visible_online)
  const ocultos = (servicios ?? []).filter((s) => s.activo && !s.visible_online)
  const aceptan = (profesionales ?? []).filter((p) => p.activo && p.acepta_reservas_online)
  const noAceptan = (profesionales ?? []).filter((p) => p.activo && !p.acepta_reservas_online)

  return (
    <Vista>
      <Panel titulo="El link de tus clientes">
        <div
          style={{
            fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '-0.03em',
            paddingTop: '12px',
            borderTop: '1px solid var(--line-soft)',
            wordBreak: 'break-all',
          }}
        >
          ara.com.py/{local?.slug}
        </div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--ink-2)',
            margin: '6px 0 0',
            lineHeight: 1.55,
          }}
        >
          {(online ?? []).length} turnos entraron por acá. El portal todavía no
          está construido y el dominio no está contratado, así que el link
          todavía no lleva a ningún lado.
        </p>
      </Panel>

      <div style={{ height: '16px' }} />

      <Rejilla min={330}>
        <Panel
          titulo="Servicios que se pueden reservar"
          ayuda={`${visibles.length} visibles · ${ocultos.length} ocultos del link`}
        >
          {visibles.length === 0 ? (
            <Vacio>No hay ningún servicio visible online.</Vacio>
          ) : (
            visibles.map((s) => (
              <Fila key={s.id}>
                <span style={{ flex: 1, minWidth: '140px', fontWeight: 600 }}>
                  {s.nombre}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                  {s.duracion_min} min
                </span>
                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {guaranies(Number(s.precio))}
                </span>
              </Fila>
            ))
          )}
          {ocultos.length > 0 && (
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-2)',
                margin: '12px 0 0',
                paddingTop: '12px',
                borderTop: '1px solid var(--line-soft)',
              }}
            >
              Fuera del link: {ocultos.map((s) => s.nombre).join(', ')}.
            </p>
          )}
        </Panel>

        <Panel
          titulo="Quién acepta reservas"
          ayuda={`${aceptan.length} de ${(profesionales ?? []).filter((p) => p.activo).length}`}
        >
          {aceptan.length === 0 ? (
            <Vacio>Nadie acepta reservas online.</Vacio>
          ) : (
            aceptan.map((p) => (
              <Fila key={p.id}>
                <span style={{ flex: 1, fontWeight: 600 }}>{p.nombre_publico}</span>
                <span className="chip">acepta</span>
              </Fila>
            ))
          )}
          {noAceptan.map((p) => (
            <Fila key={p.id} tenue>
              <span style={{ flex: 1, fontWeight: 600 }}>{p.nombre_publico}</span>
              <span className="chip">no acepta</span>
            </Fila>
          ))}
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
        Esta vista lee la configuración, todavía no la edita. Lo que muestra es
        exactamente lo que devuelven `servicios_publicos()` y
        `profesionales_publicos()`, las mismas funciones que va a usar el
        portal.
      </p>
    </Vista>
  )
}
