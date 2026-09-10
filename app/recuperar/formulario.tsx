'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import {
  pedirRecuperacion,
  cambiarClave,
  type EstadoRecuperar,
  type EstadoNueva,
} from './acciones'

const etiqueta = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--ink-2)',
  marginBottom: '6px',
} as const

export function PedirRecuperacion() {
  const [estado, accion, pendiente] = useActionState<EstadoRecuperar, FormData>(
    pedirRecuperacion,
    { error: null, enviado: false }
  )

  if (estado.enviado) {
    return (
      <>
        <p style={{ fontSize: '14.5px', lineHeight: 1.6, margin: '0 0 20px' }}>
          Si esa dirección tiene una cuenta, le llegó un enlace. Revisá también
          el correo no deseado.
        </p>
        <Link href="/login" className="boton-suave" style={{ textDecoration: 'none' }}>
          Volver a entrar
        </Link>
      </>
    )
  }

  return (
    <form action={accion}>
      <label style={etiqueta} htmlFor="email">
        Correo
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className="campo"
        required
        autoComplete="email"
        placeholder="vos@tulocal.com"
      />

      {estado.error && (
        <p role="alert" className="aviso-error">
          {estado.error}
        </p>
      )}

      <div style={{ marginTop: '22px' }}>
        <button type="submit" className="boton-primario" disabled={pendiente}>
          {pendiente ? 'Enviando…' : 'Mandarme el enlace'}
        </button>
      </div>

      <div style={{ marginTop: '18px', textAlign: 'center' }}>
        <Link href="/login" style={{ fontSize: '13.5px', textDecoration: 'none' }}>
          Volver a entrar
        </Link>
      </div>
    </form>
  )
}

export function NuevaClave() {
  const [estado, accion, pendiente] = useActionState<EstadoNueva, FormData>(
    cambiarClave,
    { error: null, ok: false }
  )

  if (estado.ok) {
    return (
      <>
        <p style={{ fontSize: '14.5px', lineHeight: 1.6, margin: '0 0 20px' }}>
          Listo. Ya podés entrar con la contraseña nueva.
        </p>
        <Link href="/login" className="boton-primario" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
          Entrar
        </Link>
      </>
    )
  }

  return (
    <form action={accion}>
      <label style={etiqueta} htmlFor="clave">
        Contraseña nueva
      </label>
      <input
        id="clave"
        name="clave"
        type="password"
        className="campo"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="••••••••"
      />
      <p style={{ fontSize: '12.5px', color: 'var(--ink-2)', margin: '8px 0 0' }}>
        Al menos 8 caracteres.
      </p>

      {estado.error && (
        <p role="alert" className="aviso-error">
          {estado.error}
        </p>
      )}

      <div style={{ marginTop: '22px' }}>
        <button type="submit" className="boton-primario" disabled={pendiente}>
          {pendiente ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </div>
    </form>
  )
}
