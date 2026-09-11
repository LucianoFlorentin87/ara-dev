'use client'

import { useActionState, useState } from 'react'
import { cobrarTurno, type EstadoCobroTurno } from './acciones'

const inicial: EstadoCobroTurno = { error: null, ok: false }

export type PorCobrar = {
  id: string
  hora: string
  cliente: string
  servicio: string
  profesional: string
  monto: string
  sena: string | null
}

const MEDIOS = [
  ['efectivo', 'Efectivo'],
  ['transferencia', 'Transferencia'],
  ['tarjeta', 'Tarjeta'],
  ['qr', 'QR'],
] as const

/**
 * Una fila por turno terminado sin cobrar. El monto ya viene calculado del
 * servidor; acá lo único que se elige es el medio de pago.
 */
function Fila({ t }: { t: PorCobrar }) {
  const [estado, cobrar, pendiente] = useActionState(cobrarTurno, inicial)
  const [medio, setMedio] = useState<string>('efectivo')

  return (
    <form
      action={cobrar}
      style={{ padding: '13px 0', borderTop: '1px solid var(--warm)' }}
    >
      <input type="hidden" name="turno" value={t.id} />
      <input type="hidden" name="medio" value={medio} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: '12.5px',
            color: 'var(--ink-2)',
            fontVariantNumeric: 'tabular-nums',
            width: '44px',
            flex: 'none',
          }}
        >
          {t.hora}
        </span>
        <span style={{ flex: 1, minWidth: '160px' }}>
          <span style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>
            {t.cliente}
          </span>
          <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
            {t.servicio} · {t.profesional}
            {t.sena ? ` · seña ${t.sena}` : ''}
          </span>
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: '14.5px',
            fontVariantNumeric: 'tabular-nums',
            flex: 'none',
            color: 'var(--warm-700)',
          }}
        >
          {t.monto}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          marginTop: '9px',
          paddingLeft: '56px',
        }}
      >
        {MEDIOS.map(([clave, nombre]) => (
          <button
            key={clave}
            type="button"
            className="medio-pago"
            data-activo={medio === clave}
            onClick={() => setMedio(clave)}
          >
            {nombre}
          </button>
        ))}
        <button
          type="submit"
          className="boton-cobrar"
          disabled={pendiente}
          style={{ marginLeft: 'auto' }}
        >
          {pendiente ? 'Cobrando…' : 'Cobrar'}
        </button>
      </div>

      {estado.error && (
        <p
          role="alert"
          style={{
            fontSize: '12.5px',
            color: 'var(--warm-700)',
            margin: '8px 0 0',
            paddingLeft: '56px',
          }}
        >
          {estado.error}
        </p>
      )}
    </form>
  )
}

export function PanelPorCobrar({ turnos, total }: { turnos: PorCobrar[]; total: string }) {
  if (turnos.length === 0) return null

  return (
    <div
      style={{
        background: 'var(--warm-50)',
        border: '1px solid var(--warm)',
        borderRadius: '20px',
        padding: '18px 20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '2px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            margin: 0,
            color: 'var(--warm-700)',
          }}
        >
          Por cobrar
        </h3>
        <span
          style={{
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--warm-700)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {total}
        </span>
      </div>
      <p style={{ fontSize: '12.5px', color: 'var(--ink-2)', margin: '0 0 6px' }}>
        {turnos.length === 1
          ? 'Un turno terminado esperando el cobro.'
          : `${turnos.length} turnos terminados esperando el cobro.`}{' '}
        El monto sale del precio del servicio: elegí con qué pagan y listo.
      </p>

      {turnos.map((t) => (
        <Fila key={t.id} t={t} />
      ))}
    </div>
  )
}
