'use client'

import { useActionState } from 'react'
import { abrirCaja, type EstadoCaja } from './acciones'

const inicial: EstadoCaja = { error: null, ok: false }

export function AbrirCaja() {
  const [estado, accion, pendiente] = useActionState(abrirCaja, inicial)

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line-soft)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--sh-1)',
        maxWidth: '420px',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
          fontWeight: 700,
          fontSize: '20px',
          letterSpacing: '-0.03em',
          margin: '0 0 6px',
        }}
      >
        No hay caja abierta
      </h2>
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.55,
          color: 'var(--ink-2)',
          margin: '0 0 18px',
        }}
      >
        Los cobros que se registren sin caja abierta quedan sueltos: no van a
        aparecer en ningún cierre.
      </p>

      <form action={accion}>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--ink-2)',
            marginBottom: '6px',
          }}
          htmlFor="inicial"
        >
          Efectivo con el que arranca
        </label>
        <input
          id="inicial"
          name="inicial"
          className="campo"
          inputMode="numeric"
          placeholder="0"
          required
          defaultValue="0"
        />

        {estado.error && (
          <p role="alert" className="aviso-error">
            {estado.error}
          </p>
        )}

        <button
          type="submit"
          className="boton-primario"
          style={{ marginTop: '16px' }}
          disabled={pendiente}
        >
          {pendiente ? 'Abriendo…' : 'Abrir caja'}
        </button>
      </form>
    </div>
  )
}
