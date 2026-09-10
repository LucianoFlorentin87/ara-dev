'use client'

import { useActionState, useEffect, useRef } from 'react'
import { crearTurno, type EstadoTurno } from './acciones'

const inicial: EstadoTurno = { error: null, ok: false }

export type Opcion = { id: string; nombre: string; detalle?: string }

export function NuevoTurno({
  fecha,
  clientes,
  profesionales,
  servicios,
}: {
  fecha: string
  clientes: Opcion[]
  profesionales: Opcion[]
  servicios: Opcion[]
}) {
  const [estado, accion, pendiente] = useActionState(crearTurno, inicial)
  const dialogo = useRef<HTMLDialogElement>(null)
  const formulario = useRef<HTMLFormElement>(null)

  // Se cierra solo cuando la base aceptó el turno. Si rebotó contra una
  // constraint, queda abierto con el error y lo escrito.
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
        className="pastilla"
        data-activo={true}
        onClick={() => dialogo.current?.showModal()}
      >
        + Nuevo turno
      </button>

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
          Nuevo turno
        </h2>
        <p
          style={{
            fontSize: '13.5px',
            lineHeight: 1.5,
            color: 'var(--ink-2)',
            margin: '0 0 18px',
          }}
        >
          La duración y el precio los calcula el sistema según el servicio.
        </p>

        <form ref={formulario} action={accion}>
          <input type="hidden" name="fecha" value={fecha} />

          <label htmlFor="cliente">Cliente</label>
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

          <label htmlFor="profesional">Profesional</label>
          <select
            id="profesional"
            name="profesional"
            className="campo"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Elegí un profesional
            </option>
            {profesionales.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="servicio">Servicio</label>
          <select id="servicio" name="servicio" className="campo" required defaultValue="">
            <option value="" disabled>
              Elegí un servicio
            </option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
                {s.detalle ? ` · ${s.detalle}` : ''}
              </option>
            ))}
          </select>

          <label htmlFor="hora">Hora de inicio</label>
          <input
            id="hora"
            name="hora"
            type="time"
            step={300}
            className="campo"
            required
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
              disabled={pendiente}
            >
              {pendiente ? 'Agendando…' : 'Agendar'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
