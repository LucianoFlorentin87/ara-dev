'use client'

import { useActionState, useEffect, useRef } from 'react'
import { anotarEnEspera, resolverEspera, type EstadoEspera } from './acciones'

const inicial: EstadoEspera = { error: null, ok: false }

type Opcion = { id: string; nombre: string }

export function Anotar({
  clientes,
  servicios,
  profesionales,
}: {
  clientes: Opcion[]
  servicios: Opcion[]
  profesionales: Opcion[]
}) {
  const [estado, accion, pendiente] = useActionState(anotarEnEspera, inicial)
  const formulario = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (estado.ok) formulario.current?.reset()
  }, [estado.ok])

  const etiqueta = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--ink-2)',
    margin: '12px 0 6px',
  } as const

  return (
    <form ref={formulario} action={accion}>
      <label style={{ ...etiqueta, marginTop: 0 }} htmlFor="cliente">
        Cliente
      </label>
      <select id="cliente" name="cliente" className="campo" required defaultValue="">
        <option value="" disabled>
          Elegí un cliente
        </option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <label style={etiqueta} htmlFor="servicio">
        Qué quiere
      </label>
      <select id="servicio" name="servicio" className="campo" defaultValue="">
        <option value="">Cualquier servicio</option>
        {servicios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      <label style={etiqueta} htmlFor="profesional">
        Con quién
      </label>
      <select id="profesional" name="profesional" className="campo" defaultValue="">
        <option value="">Cualquiera</option>
        {profesionales.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

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
        {pendiente ? 'Anotando…' : 'Anotar en la lista'}
      </button>
    </form>
  )
}

export function Resolver({ id }: { id: string }) {
  const [estado, accion, pendiente] = useActionState(resolverEspera, inicial)

  return (
    <form action={accion} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="pastilla" disabled={pendiente}>
        {pendiente ? '…' : 'Resuelto'}
      </button>
      {estado.error && (
        <span
          role="alert"
          style={{ fontSize: '12px', color: 'var(--warm-700)', marginLeft: '8px' }}
        >
          {estado.error}
        </span>
      )}
    </form>
  )
}
