'use client'

import { useState } from 'react'

export type Bloque = {
  id: string
  cliente: string
  servicio: string
  rango: string
  precio: string
  top: number
  alto: number
  tipo: 'confirmado' | 'online' | 'pendiente'
}

export type Profesional = {
  id: string
  nombre: string
  iniciales: string
  carga: string
  bloques: Bloque[]
}

const ALTO_FILA = 52

export function Grilla({
  horas,
  profesionales,
  lineaAhora,
  horaAhora,
}: {
  horas: string[]
  profesionales: Profesional[]
  lineaAhora: number | null
  horaAhora: string
}) {
  const [filtro, setFiltro] = useState<string | null>(null)
  const columnas = `56px repeat(${profesionales.length}, minmax(0, 1fr))`

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="pastilla"
            data-activo={filtro === null}
            onClick={() => setFiltro(null)}
          >
            Todos
          </button>
          {profesionales.map((p) => (
            <button
              key={p.id}
              type="button"
              className="pastilla"
              data-activo={filtro === p.id}
              onClick={() => setFiltro(filtro === p.id ? null : p.id)}
            >
              {p.nombre.split(' ')[0]}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '14px',
            fontSize: '12px',
            color: 'var(--ink-2)',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                background: 'var(--brand-solid)',
                display: 'block',
              }}
            />
            Confirmado
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                background: 'var(--warm-solid)',
                display: 'block',
              }}
            />
            Reserva online
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '3px',
                border: '1.5px dashed var(--ink-2)',
                display: 'block',
              }}
            />
            Sin confirmar
          </span>
        </div>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line-soft)',
          borderRadius: '20px',
          boxShadow: 'var(--sh-1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: columnas,
            borderBottom: '1px solid var(--line-soft)',
          }}
        >
          <div
            style={{
              padding: '9px',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '.1em',
              color: 'var(--ink-2)',
              borderRight: '1px solid var(--line-soft)',
            }}
          >
            Hora
          </div>
          {profesionales.map((p) => (
            <div
              key={p.id}
              style={{
                padding: '9px 11px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRight: '1px solid var(--line-soft)',
                opacity: filtro === null || filtro === p.id ? 1 : 0.28,
                transition: 'opacity .2s cubic-bezier(.2,.7,.3,1)',
              }}
            >
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '999px',
                  background: 'var(--neutral-solid)',
                  color: '#fff',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  flex: 'none',
                }}
              >
                {p.iniciales}
              </span>
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 600,
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.nombre}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    color: 'var(--ink-2)',
                  }}
                >
                  {p.carga}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: columnas,
            position: 'relative',
          }}
        >
          <div style={{ borderRight: '1px solid var(--line-soft)' }}>
            {horas.map((h) => (
              <div
                key={h}
                style={{
                  height: `${ALTO_FILA}px`,
                  borderBottom: '1px solid var(--line-soft)',
                  padding: '3px 7px',
                  fontSize: '11px',
                  color: 'var(--ink-2)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {profesionales.map((p) => (
            <div
              key={p.id}
              style={{
                borderRight: '1px solid var(--line-soft)',
                position: 'relative',
                minWidth: 0,
                opacity: filtro === null || filtro === p.id ? 1 : 0.28,
                transition: 'opacity .2s cubic-bezier(.2,.7,.3,1)',
                backgroundImage:
                  'repeating-linear-gradient(to bottom, transparent 0 51px, var(--line-soft) 51px 52px)',
              }}
            >
              {p.bloques.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="turno"
                  data-tipo={b.tipo}
                  style={{ top: `${b.top}px`, height: `${b.alto}px` }}
                  title={`${b.cliente} · ${b.servicio} · ${b.rango}`}
                >
                  <span
                    style={{
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 600,
                      fontSize: '12.5px',
                      lineHeight: 1.15,
                    }}
                  >
                    {b.cliente}
                  </span>
                  <span
                    style={{ fontSize: '11.5px', lineHeight: 1.25, opacity: 0.9 }}
                  >
                    {b.servicio}
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      marginTop: 'auto',
                      opacity: 0.8,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {b.rango} · {b.precio}
                  </span>
                </button>
              ))}
            </div>
          ))}

          {lineaAhora !== null && (
            <div
              style={{
                position: 'absolute',
                left: '56px',
                right: 0,
                top: `${lineaAhora}px`,
                height: '2px',
                background: 'var(--warm-solid)',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '-9px',
                  background: 'var(--warm-solid)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {horaAhora}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
