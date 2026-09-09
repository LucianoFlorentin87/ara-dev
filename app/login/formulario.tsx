'use client'

import { useActionState } from 'react'
import { entrar, type EstadoLogin } from './acciones'

const inicial: EstadoLogin = { error: null }

const etiqueta = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--ink-2)',
} as const

export function Formulario() {
  const [estado, accion, pendiente] = useActionState(entrar, inicial)

  return (
    <form action={accion}>
      <label style={{ ...etiqueta, marginBottom: '6px' }} htmlFor="email">
        Correo
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vos@tulocal.com"
        className="campo"
      />

      <label style={{ ...etiqueta, margin: '16px 0 6px' }} htmlFor="clave">
        Contraseña
      </label>
      <input
        id="clave"
        name="clave"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        className="campo"
      />

      {estado.error && (
        <p
          role="alert"
          style={{
            margin: '14px 0 0',
            padding: '10px 13px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--warm-50)',
            color: 'var(--warm-700)',
            border: '1px solid var(--line)',
            fontSize: '13.5px',
            lineHeight: 1.5,
          }}
        >
          {estado.error}
        </p>
      )}

      <div style={{ marginTop: '22px' }}>
        <button type="submit" className="boton-primario" disabled={pendiente}>
          {pendiente ? 'Entrando…' : 'Entrar'}
        </button>
      </div>
    </form>
  )
}
