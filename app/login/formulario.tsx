'use client'

import Link from 'next/link'
import { useActionState, useRef } from 'react'
import { entrar, type EstadoLogin } from './acciones'

const inicial: EstadoLogin = { error: null }

const etiqueta = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--ink-2)',
} as const

/**
 * Los cuatro roles de la demo. En el diseño estos botones cambiaban de rol
 * directamente porque era un mock. Acá no pueden: hay una contraseña de por
 * medio. Lo que hacen es completar el correo de cada rol, que es lo más
 * cercano que puede hacer un login de verdad.
 */
const DEMO = [
  ['Dueño', 'dueno@studiokuna.com.py'],
  ['Profesional', 'sofia@studiokuna.com.py'],
  ['Recepción', 'recepcion@studiokuna.com.py'],
  ['Cajero', 'caja@studiokuna.com.py'],
] as const

export function Formulario({ volver = '' }: { volver?: string }) {
  const [estado, accion, pendiente] = useActionState(entrar, inicial)
  const campoCorreo = useRef<HTMLInputElement>(null)
  const campoClave = useRef<HTMLInputElement>(null)

  function completar(correo: string) {
    if (campoCorreo.current) campoCorreo.current.value = correo
    campoClave.current?.focus()
  }

  return (
    <form action={accion}>
      <input type="hidden" name="volver" value={volver} />
      <label style={{ ...etiqueta, marginBottom: '6px' }} htmlFor="email">
        Correo
      </label>
      <input
        ref={campoCorreo}
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
        ref={campoClave}
        id="clave"
        name="clave"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        className="campo"
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          margin: '16px 0 22px',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            color: 'var(--ink-2)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            name="recordar"
            defaultChecked
            style={{ width: '16px', height: '16px', accentColor: 'var(--brand)' }}
          />
          No cerrar sesión
        </label>
        <Link href="/recuperar" style={{ fontSize: '13.5px', textDecoration: 'none' }}>
          ¿Olvidaste la contraseña?
        </Link>
      </div>

      {estado.error && (
        <p role="alert" className="aviso-error" style={{ margin: '0 0 16px' }}>
          {estado.error}
        </p>
      )}

      <button type="submit" className="boton-primario" disabled={pendiente}>
        {pendiente ? 'Entrando…' : 'Entrar'}
      </button>

      <div
        style={{
          marginTop: '26px',
          paddingTop: '20px',
          borderTop: '1px solid var(--line-soft)',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-2)',
            marginBottom: '10px',
          }}
        >
          Entrar como (demo)
        </div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {DEMO.map(([rol, correo]) => (
            <button
              key={rol}
              type="button"
              className="pastilla"
              onClick={() => completar(correo)}
              title={`Completar con ${correo}`}
            >
              {rol}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
