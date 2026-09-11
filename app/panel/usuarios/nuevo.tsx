'use client'

import { useActionState, useEffect, useRef } from 'react'
import { crearUsuario, type EstadoUsuario } from './acciones'
import { ETIQUETA_ROL, type Rol } from '@/lib/menu'

const inicial: EstadoUsuario = { error: null, ok: null }

const ROLES: Rol[] = ['profesional', 'recepcion', 'cajero', 'dueno']

export type SinCuenta = { id: string; nombre: string }

export function NuevoUsuario({
  sinCuenta,
  hayClave,
}: {
  sinCuenta: SinCuenta[]
  hayClave: boolean
}) {
  const [estado, accion, pendiente] = useActionState(crearUsuario, inicial)
  const dialogo = useRef<HTMLDialogElement>(null)
  const formulario = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (estado.ok) {
      dialogo.current?.close()
      formulario.current?.reset()
    }
  }, [estado.ok])

  return (
    <>
      <button
        type="button"
        className="boton-nuevo"
        onClick={() => dialogo.current?.showModal()}
      >
        + Nuevo usuario
      </button>

      {estado.ok && (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--warm-700)',
            background: 'var(--warm-50)',
            border: '1px solid var(--warm)',
            borderRadius: '10px',
            padding: '9px 12px',
            margin: '12px 0 0',
          }}
        >
          {estado.ok}
        </p>
      )}

      <dialog ref={dialogo} className="dialogo">
        <h2
          style={{
            fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            letterSpacing: '-0.03em',
            margin: '0 0 4px',
          }}
        >
          Nuevo usuario
        </h2>
        <p
          style={{
            fontSize: '13.5px',
            lineHeight: 1.5,
            color: 'var(--ink-2)',
            margin: '0 0 18px',
          }}
        >
          Le ponés una contraseña y se la pasás. Desde Mi perfil la puede cambiar.
        </p>

        {!hayClave && (
          <p className="aviso-error" style={{ marginTop: 0 }}>
            Falta cargar <code>SUPABASE_SERVICE_ROLE_KEY</code> en el servidor. Sin esa
            clave no se puede crear la cuenta.
          </p>
        )}

        <form ref={formulario} action={accion}>
          <label htmlFor="u-nombre">Nombre y apellido</label>
          <input
            id="u-nombre"
            name="nombre"
            className="campo"
            required
            autoComplete="off"
            placeholder="Sofía Ramírez"
          />

          <label htmlFor="u-email">Correo</label>
          <input
            id="u-email"
            name="email"
            type="email"
            className="campo"
            required
            autoComplete="off"
            placeholder="sofia@studiokuna.com.py"
          />

          <label htmlFor="u-rol">Rol</label>
          <select id="u-rol" name="rol" className="campo" required defaultValue="profesional">
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ETIQUETA_ROL[r]}
              </option>
            ))}
          </select>

          {sinCuenta.length > 0 && (
            <>
              <label htmlFor="u-prof">Enlazar con quien ya atiende (opcional)</label>
              <select id="u-prof" name="profesional" className="campo" defaultValue="">
                <option value="">No enlazar</option>
                {sinCuenta.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="u-clave">Contraseña provisoria</label>
          <input
            id="u-clave"
            name="clave"
            type="text"
            className="campo"
            required
            minLength={8}
            autoComplete="off"
            placeholder="al menos 8 caracteres"
          />

          {estado.error && (
            <p role="alert" className="aviso-error">
              {estado.error}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end',
              marginTop: '22px',
            }}
          >
            <button
              type="button"
              className="boton-suave"
              onClick={() => dialogo.current?.close()}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="boton-primario"
              style={{ width: 'auto', padding: '12px 22px' }}
              disabled={pendiente || !hayClave}
            >
              {pendiente ? 'Creando…' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
