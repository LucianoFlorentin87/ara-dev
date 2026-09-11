'use client'

import { useActionState } from 'react'
import { ETIQUETA_ROL, type Rol } from '@/lib/menu'
import { alternarUsuario, cambiarRol, type EstadoUsuario } from './acciones'

const inicial: EstadoUsuario = { error: null, ok: null }

const ROLES: Rol[] = ['dueno', 'profesional', 'recepcion', 'cajero']

export type UsuarioFila = {
  id: string
  nombre: string
  email: string
  rol: Rol
  activo: boolean
  atiendeComo: string | null
}

export function FilaUsuario({
  usuario: u,
  esYo,
  iniciales,
}: {
  usuario: UsuarioFila
  esYo: boolean
  iniciales: string
}) {
  const [estadoRol, guardarRol, guardandoRol] = useActionState(cambiarRol, inicial)
  const [estadoBaja, alternar, alternando] = useActionState(alternarUsuario, inicial)

  const error = estadoRol.error ?? estadoBaja.error

  return (
    <div
      style={{
        padding: '12px 0',
        borderTop: '1px solid var(--line-soft)',
        opacity: u.activo ? 1 : 0.55,
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
      >
        <span
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '999px',
            background: u.activo ? 'var(--brand-solid)' : 'var(--neutral-solid)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
          }}
        >
          {iniciales}
        </span>
        <span style={{ flex: 1, minWidth: '150px' }}>
          <span style={{ display: 'block', fontWeight: 600 }}>
            {u.nombre}
            {esYo ? ' · vos' : ''}
          </span>
          <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
            {u.email}
            {u.atiendeComo ? ` · atiende como ${u.atiendeComo}` : ''}
            {u.activo ? '' : ' · dado de baja'}
          </span>
        </span>

        {/* El rol se guarda al elegirlo: es un select de cuatro opciones, un
            botón "Guardar" al lado solo agrega un clic. */}
        <form action={guardarRol}>
          <input type="hidden" name="usuario" value={u.id} />
          <label className="solo-lectores" htmlFor={`rol-${u.id}`}>
            Rol de {u.nombre}
          </label>
          <select
            id={`rol-${u.id}`}
            name="rol"
            className="select-rol"
            defaultValue={u.rol}
            disabled={guardandoRol || !u.activo}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ETIQUETA_ROL[r]}
              </option>
            ))}
          </select>
        </form>

        {!esYo && (
          <form action={alternar}>
            <input type="hidden" name="usuario" value={u.id} />
            <input type="hidden" name="activo" value={String(u.activo)} />
            <button type="submit" className="boton-mini" disabled={alternando}>
              {alternando ? '…' : u.activo ? 'Dar de baja' : 'Habilitar'}
            </button>
          </form>
        )}
      </div>

      {error && (
        <p
          role="alert"
          style={{
            fontSize: '12.5px',
            color: 'var(--warm-700)',
            margin: '8px 0 0',
            paddingLeft: '44px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
