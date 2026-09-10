'use client'

import { useActionState, useState } from 'react'
import { cerrarCaja, type EstadoCaja } from './acciones'
import { guaranies } from '@/lib/tiempo'

const inicial: EstadoCaja = { error: null, ok: false }

export function Arqueo({
  cajaId,
  esperado,
}: {
  cajaId: string
  esperado: number
}) {
  const [estado, accion, pendiente] = useActionState(cerrarCaja, inicial)
  const [contado, setContado] = useState('')

  const contadoNum = Number(contado.replace(/\./g, ''))
  const hayNumero = contado !== '' && Number.isFinite(contadoNum)
  const diferencia = hayNumero ? contadoNum - esperado : 0

  return (
    <div
      style={{
        background: 'var(--brand-50)',
        border: '1px solid var(--brand-100)',
        borderRadius: '20px',
        padding: '20px',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
          fontWeight: 600,
          fontSize: '15px',
          margin: '0 0 10px',
          color: 'var(--brand-700)',
        }}
      >
        Arqueo y cierre
      </h3>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '13.5px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--brand-100)',
          marginBottom: '12px',
        }}
      >
        <span>Efectivo esperado</span>
        <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {guaranies(esperado)}
        </span>
      </div>

      <form action={accion}>
        <input type="hidden" name="caja" value={cajaId} />

        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--ink-2)',
            marginBottom: '6px',
          }}
          htmlFor="contado"
        >
          Efectivo contado
        </label>
        <input
          id="contado"
          name="contado"
          className="campo"
          inputMode="numeric"
          placeholder="0"
          required
          value={contado}
          onChange={(e) => setContado(e.target.value.replace(/[^\d]/g, ''))}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            margin: '14px 0',
          }}
        >
          <span>Diferencia</span>
          <span
            style={{
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              color:
                !hayNumero || diferencia === 0
                  ? 'var(--ink)'
                  : 'var(--warm-700)',
            }}
          >
            {hayNumero
              ? (diferencia > 0 ? '+' : '') + guaranies(diferencia)
              : '—'}
          </span>
        </div>

        {hayNumero && diferencia !== 0 && (
          <>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--ink-2)',
                margin: '0 0 6px',
              }}
              htmlFor="motivo"
            >
              A qué se debe la diferencia
            </label>
            <input
              id="motivo"
              name="motivo"
              className="campo"
              placeholder="Obligatorio cuando no cuadra"
              required
            />
          </>
        )}

        {estado.error && (
          <p role="alert" className="aviso-error">
            {estado.error}
          </p>
        )}

        <button
          type="submit"
          className="boton-primario"
          style={{ marginTop: '14px' }}
          disabled={pendiente}
        >
          {pendiente ? 'Cerrando…' : 'Cerrar turno de caja'}
        </button>
      </form>

      <p
        style={{
          fontSize: '12px',
          color: 'var(--ink-2)',
          margin: '10px 0 0',
          lineHeight: 1.5,
        }}
      >
        Al cerrar se guarda el corte con tu usuario y la hora, y queda en
        auditoría.
      </p>
    </div>
  )
}
