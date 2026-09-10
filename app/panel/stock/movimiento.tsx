'use client'

import { useActionState, useEffect, useRef } from 'react'
import { moverStock, type EstadoStock } from './acciones'

const inicial: EstadoStock = { error: null, ok: false }

export function Movimiento({
  productos,
}: {
  productos: { id: string; nombre: string }[]
}) {
  const [estado, accion, pendiente] = useActionState(moverStock, inicial)
  const formulario = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (estado.ok) formulario.current?.reset()
  }, [estado.ok])

  return (
    <form ref={formulario} action={accion}>
      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--ink-2)',
          margin: '0 0 6px',
        }}
        htmlFor="producto"
      >
        Producto
      </label>
      <select id="producto" name="producto" className="campo" required defaultValue="">
        <option value="" disabled>
          Elegí uno
        </option>
        {productos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--ink-2)',
              margin: '0 0 6px',
            }}
            htmlFor="cantidad"
          >
            Cantidad
          </label>
          <input
            id="cantidad"
            name="cantidad"
            className="campo"
            inputMode="numeric"
            required
            placeholder="0"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--ink-2)',
              margin: '0 0 6px',
            }}
            htmlFor="signo"
          >
            Entra o sale
          </label>
          <select id="signo" name="signo" className="campo" defaultValue="entrada">
            <option value="entrada">Entra</option>
            <option value="salida">Sale</option>
          </select>
        </div>
      </div>

      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--ink-2)',
          margin: '12px 0 6px',
        }}
        htmlFor="motivo"
      >
        Motivo
      </label>
      <input
        id="motivo"
        name="motivo"
        className="campo"
        placeholder="Compra, uso en un servicio, ajuste…"
      />

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
        {pendiente ? 'Registrando…' : 'Registrar movimiento'}
      </button>
    </form>
  )
}
