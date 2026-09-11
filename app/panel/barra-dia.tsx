'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { fechaLarga, hoyISO, sumarDias } from '@/lib/tiempo'

/**
 * La fila de fecha y estado del día. En el diseño vive en el armazón del
 * panel, no en la agenda, así que se ve en todas las vistas.
 *
 * Navega con ?fecha= solo cuando estamos en la agenda, que es la única que
 * cambia según el día; en el resto muestra la fecha sin flechas.
 */
export function BarraDia({
  cajaAbierta,
  turnosHoy,
  enSala,
  porCobrar = 0,
}: {
  cajaAbierta: string | null
  turnosHoy: number
  enSala: number
  porCobrar?: number
}) {
  const ruta = usePathname()
  const params = useSearchParams()
  const esAgenda = ruta === '/panel/agenda'

  const pedida = params.get('fecha') ?? ''
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(pedida) ? pedida : hoyISO()

  return (
    <div
      style={{
        borderBottom: '1px solid var(--line-soft)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {esAgenda && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <Link
              className="boton-dia"
              href={`/panel/agenda?fecha=${sumarDias(fecha, -1)}`}
              aria-label="Día anterior"
            >
              ←
            </Link>
            <Link
              className="boton-dia"
              href="/panel/agenda"
              data-activo={fecha === hoyISO()}
            >
              Hoy
            </Link>
            <Link
              className="boton-dia"
              href={`/panel/agenda?fecha=${sumarDias(fecha, 1)}`}
              aria-label="Día siguiente"
            >
              →
            </Link>
          </div>
        )}
        <span style={{ fontSize: '13px', fontWeight: 600 }}>{fechaLarga(fecha)}</span>
      </div>

      <div
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {cajaAbierta ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--brand-50)',
              color: 'var(--brand-700)',
              borderRadius: '999px',
              padding: '4px 11px',
              fontWeight: 600,
            }}
          >
            <span
              aria-hidden
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '999px',
                background: 'var(--brand-solid)',
                animation: 'pulseDot 2.4s ease-in-out infinite',
              }}
            />
            Caja abierta {cajaAbierta}
          </span>
        ) : (
          <Link href="/panel/caja" className="tag">
            Caja cerrada
          </Link>
        )}
        {/* Lo que está esperando a alguien va en durazno, igual que en la
            portada. Un turno sin cobrar es plata que todavía no entró. */}
        {porCobrar > 0 && (
          <Link href="/panel/caja" className="pastilla-aviso">
            {porCobrar} sin cobrar
          </Link>
        )}
        <span>
          {turnosHoy} {turnosHoy === 1 ? 'turno' : 'turnos'}
        </span>
        <span>·</span>
        <span style={enSala > 0 ? { color: 'var(--warm-700)', fontWeight: 600 } : undefined}>
          {enSala} en sala de espera
        </span>
      </div>
    </div>
  )
}
