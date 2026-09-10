'use client'

import { useActionState, useEffect, useRef } from 'react'
import { registrarCobro, type EstadoCobro } from './acciones'

const inicial: EstadoCobro = { error: null, ok: false }

export type TurnoCobrable = { id: string; etiqueta: string; monto: number }

const MEDIOS = [
  ['efectivo', 'Efectivo'],
  ['tarjeta', 'Tarjeta'],
  ['transferencia', 'Transferencia'],
  ['qr', 'QR'],
  ['otro', 'Otro'],
] as const

export function RegistrarCobro({
  clienteId,
  nombre,
  turnos,
}: {
  clienteId: string
  nombre: string
  turnos: TurnoCobrable[]
}) {
  const [estado, accion, pendiente] = useActionState(registrarCobro, inicial)
  const dialogo = useRef<HTMLDialogElement>(null)
  const formulario = useRef<HTMLFormElement>(null)
  const campoMonto = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (estado.ok) {
      dialogo.current?.close()
      formulario.current?.reset()
    }
  }, [estado.ok])

  // El monto es un campo no controlado: así `form.reset()` lo limpia solo y
  // no hace falta estado de React que después haya que sincronizar.
  //
  // Elegir un turno propone su precio congelado, que es el que corresponde
  // cobrar aunque la lista de precios haya cambiado desde que se agendó.
  function alElegirTurno(id: string) {
    const t = turnos.find((x) => x.id === id)
    if (t && campoMonto.current) campoMonto.current.value = String(t.monto)
  }

  return (
    <>
      <button
        type="button"
        className="pastilla"
        data-activo={true}
        onClick={() => dialogo.current?.showModal()}
      >
        Registrar cobro
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
          Registrar cobro
        </h2>
        <p
          style={{
            fontSize: '13.5px',
            lineHeight: 1.5,
            color: 'var(--ink-2)',
            margin: '0 0 18px',
          }}
        >
          A nombre de {nombre}. Un cobro no se borra: si te equivocás, se anula
          con su motivo y queda registrado.
        </p>

        <form ref={formulario} action={accion}>
          <input type="hidden" name="cliente" value={clienteId} />

          <label htmlFor="turno">Turno</label>
          <select
            id="turno"
            name="turno"
            className="campo"
            defaultValue=""
            onChange={(e) => alElegirTurno(e.target.value)}
          >
            <option value="">Sin turno asociado</option>
            {turnos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.etiqueta}
              </option>
            ))}
          </select>

          <label htmlFor="monto">Monto en guaraníes</label>
          <input
            ref={campoMonto}
            id="monto"
            name="monto"
            className="campo"
            inputMode="numeric"
            pattern="[0-9.]*"
            required
            placeholder="0"
          />

          <label htmlFor="medio">Medio de pago</label>
          <select id="medio" name="medio" className="campo" defaultValue="efectivo">
            {MEDIOS.map(([v, t]) => (
              <option key={v} value={v}>
                {t}
              </option>
            ))}
          </select>

          <label htmlFor="concepto">Concepto</label>
          <input
            id="concepto"
            name="concepto"
            className="campo"
            placeholder="Opcional"
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
              {pendiente ? 'Registrando…' : 'Registrar'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
