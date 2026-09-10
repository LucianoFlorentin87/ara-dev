'use client'

import { useState, useTransition } from 'react'
import {
  profesionalesPara,
  huecosPara,
  reservar,
  type Profesional,
  type Hueco,
} from './acciones'
import { iniciales } from '@/lib/menu'

export type Servicio = {
  id: string
  nombre: string
  duracion_min: number
  precio: number
}

const ZONA = 'America/Asuncion'

function guaranies(n: number) {
  return 'Gs. ' + Math.round(n).toLocaleString('es-PY')
}

function horaDe(iso: string) {
  return new Intl.DateTimeFormat('es-PY', {
    timeZone: ZONA,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

/** Los próximos 14 días, como fechas ISO en hora de Asunción. */
function proximosDias(): string[] {
  const hoy = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  const [a, m, d] = hoy.split('-').map(Number)
  return Array.from({ length: 14 }, (_, i) =>
    new Date(Date.UTC(a, m - 1, d + i)).toISOString().slice(0, 10)
  )
}

function partesDia(iso: string) {
  const [a, m, d] = iso.split('-').map(Number)
  const f = new Date(Date.UTC(a, m - 1, d, 12))
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('es-PY', { timeZone: ZONA, ...o }).format(f)
  return { dia: fmt({ weekday: 'short' }), num: fmt({ day: 'numeric' }), mes: fmt({ month: 'short' }) }
}

const tituloPaso = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  fontSize: '23px',
  letterSpacing: '-0.03em',
  margin: '0 0 16px',
} as const

export function Reserva({
  slug,
  servicios,
  nombreLocal,
}: {
  slug: string
  servicios: Servicio[]
  nombreLocal: string
}) {
  const [paso, setPaso] = useState(1)
  const [servicio, setServicio] = useState<Servicio | null>(null)
  const [profesionales, setProfesionales] = useState<Profesional[]>([])
  const [profesional, setProfesional] = useState<Profesional | null>(null)
  const [dia, setDia] = useState<string>(proximosDias()[0])
  const [huecos, setHuecos] = useState<Hueco[]>([])
  const [hueco, setHueco] = useState<Hueco | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState<string | null>(null)
  const [cargando, empezar] = useTransition()

  const dias = proximosDias()

  function elegirServicio(s: Servicio) {
    setServicio(s)
    setError(null)
    empezar(async () => {
      const ps = await profesionalesPara(slug, s.id)
      setProfesionales(ps)
      setPaso(2)
    })
  }

  function elegirProfesional(p: Profesional) {
    setProfesional(p)
    setError(null)
    empezar(async () => {
      const hs = await huecosPara(slug, servicio!.id, p.id, dias[0])
      setDia(dias[0])
      setHuecos(hs)
      setPaso(3)
    })
  }

  function elegirDia(d: string) {
    setDia(d)
    setHueco(null)
    empezar(async () => {
      setHuecos(await huecosPara(slug, servicio!.id, profesional!.id, d))
    })
  }

  function confirmar(datos: FormData) {
    setError(null)
    empezar(async () => {
      const r = await reservar(
        slug,
        servicio!.id,
        profesional!.id,
        hueco!.inicio,
        String(datos.get('nombre') ?? ''),
        String(datos.get('celular') ?? ''),
        String(datos.get('email') ?? '') || null
      )
      if (r.error) {
        setError(r.error)
        // Si se lo ganaron, recargamos los huecos y volvemos a elegir hora.
        if (r.error.startsWith('Justo')) {
          setHuecos(await huecosPara(slug, servicio!.id, profesional!.id, dia))
          setHueco(null)
          setPaso(3)
        }
        return
      }
      setListo(r.turno)
    })
  }

  if (listo) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <div
          style={{
            width: '62px',
            height: '62px',
            borderRadius: '999px',
            background: 'var(--brand-solid)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 18px',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="m4 12.5 5 5L20 6.5" />
          </svg>
        </div>
        <h2 style={{ ...tituloPaso, margin: '0 0 8px' }}>Turno reservado</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
          {servicio?.nombre} con {profesional?.nombre_publico}
          <br />
          {partesDia(dia).dia} {partesDia(dia).num} de {partesDia(dia).mes} a las{' '}
          {hueco && horaDe(hueco.inicio)}
          <br />
          en {nombreLocal}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginTop: '20px' }}>
          Si no podés venir, avisá al local así lo liberan.
        </p>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
        {paso > 1 && (
          <button
            type="button"
            className="boton-icono"
            onClick={() => {
              setError(null)
              setPaso(paso - 1)
            }}
            title="Atrás"
            aria-label="Atrás"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
        )}
        <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '999px',
                background: n <= paso ? 'var(--brand-solid)' : 'var(--line)',
                transition: 'background .2s cubic-bezier(.2,.7,.3,1)',
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--ink-2)',
            flex: 'none',
          }}
        >
          Paso {paso} de 4
        </span>
      </div>

      {error && (
        <p role="alert" className="aviso-error" style={{ marginTop: 0, marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {paso === 1 && (
        <>
          <h2 style={tituloPaso}>¿Qué te querés hacer?</h2>
          {servicios.length === 0 ? (
            <p style={{ color: 'var(--ink-2)', fontSize: '14.5px' }}>
              Este local todavía no publicó servicios para reservar online.
            </p>
          ) : (
            servicios.map((s) => (
              <button
                key={s.id}
                type="button"
                className="opcion"
                onClick={() => elegirServicio(s)}
                disabled={cargando}
              >
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 600,
                      fontSize: '16.5px',
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {s.nombre}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'var(--ink-2)',
                      marginTop: '2px',
                    }}
                  >
                    {s.duracion_min} minutos
                  </span>
                </span>
                <span
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    flex: 'none',
                    color: 'var(--brand)',
                  }}
                >
                  {guaranies(s.precio)}
                </span>
              </button>
            ))
          )}
        </>
      )}

      {paso === 2 && (
        <>
          <h2 style={tituloPaso}>¿Con quién?</h2>
          {profesionales.length === 0 ? (
            <p style={{ color: 'var(--ink-2)', fontSize: '14.5px' }}>
              Nadie está tomando reservas online para ese servicio. Escribile al
              local y lo agendan a mano.
            </p>
          ) : (
            profesionales.map((p) => (
              <button
                key={p.id}
                type="button"
                className="opcion"
                onClick={() => elegirProfesional(p)}
                disabled={cargando}
              >
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: '13px', minWidth: 0 }}
                >
                  <span
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '999px',
                      background: 'var(--neutral-solid)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      flex: 'none',
                    }}
                  >
                    {iniciales(p.nombre_publico)}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                        fontWeight: 600,
                        fontSize: '16.5px',
                        letterSpacing: '-0.015em',
                      }}
                    >
                      {p.nombre_publico}
                    </span>
                    {p.especialidad && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          color: 'var(--brand)',
                          fontWeight: 600,
                          marginTop: '2px',
                        }}
                      >
                        {p.especialidad}
                        {p.anios_oficio ? ` · ${p.anios_oficio} años` : ''}
                      </span>
                    )}
                    {p.bio && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '13px',
                          color: 'var(--ink-2)',
                          lineHeight: 1.5,
                          marginTop: '4px',
                        }}
                      >
                        {p.bio}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            ))
          )}
        </>
      )}

      {paso === 3 && (
        <>
          <h2 style={tituloPaso}>¿Cuándo te queda bien?</h2>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '2px 2px 12px',
              marginBottom: '16px',
            }}
          >
            {dias.map((d) => {
              const p = partesDia(d)
              return (
                <button
                  key={d}
                  type="button"
                  className="dia"
                  data-activo={dia === d}
                  onClick={() => elegirDia(d)}
                  disabled={cargando}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      opacity: 0.8,
                    }}
                  >
                    {p.dia}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 700,
                      fontSize: '20px',
                      marginTop: '3px',
                    }}
                  >
                    {p.num}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>
                    {p.mes}
                  </span>
                </button>
              )
            })}
          </div>

          {cargando ? (
            <p style={{ color: 'var(--ink-2)', fontSize: '14px' }}>Buscando horarios…</p>
          ) : huecos.length === 0 ? (
            <p style={{ color: 'var(--ink-2)', fontSize: '14.5px', lineHeight: 1.6 }}>
              No queda lugar ese día. Probá con otro.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                gap: '8px',
              }}
            >
              {huecos.map((h) => (
                <button
                  key={h.inicio}
                  type="button"
                  className="hueco"
                  data-activo={hueco?.inicio === h.inicio}
                  onClick={() => {
                    setHueco(h)
                    setPaso(4)
                  }}
                >
                  {horaDe(h.inicio)}
                </button>
              ))}
            </div>
          )}
          <p style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--ink-2)', margin: '16px 0 0' }}>
            Los horarios que no aparecen ya están tomados. Se actualizan solos.
          </p>
        </>
      )}

      {paso === 4 && hueco && (
        <>
          <h2 style={tituloPaso}>Confirmá tu turno</h2>
          <div
            style={{
              background: 'var(--brand-50)',
              border: '1px solid var(--brand-100)',
              borderRadius: 'var(--r-md)',
              padding: '16px 18px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '-0.02em',
              }}
            >
              {partesDia(dia).dia} {partesDia(dia).num} de {partesDia(dia).mes} ·{' '}
              {horaDe(hueco.inicio)}
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--ink-2)', marginTop: '4px' }}>
              {servicio?.nombre} con {profesional?.nombre_publico} ·{' '}
              {servicio && guaranies(servicio.precio)}
            </div>
          </div>

          <form action={confirmar}>
            <label
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px' }}
              htmlFor="nombre"
            >
              Tu nombre
            </label>
            <input id="nombre" name="nombre" className="campo" required autoComplete="name" />

            <label
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', margin: '14px 0 6px' }}
              htmlFor="celular"
            >
              Tu celular
            </label>
            <input
              id="celular"
              name="celular"
              className="campo"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="0981 234 567"
            />

            <label
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', margin: '14px 0 6px' }}
              htmlFor="email"
            >
              Tu email (opcional)
            </label>
            <input id="email" name="email" type="email" className="campo" autoComplete="email" />

            <button
              type="submit"
              className="boton-primario"
              style={{ marginTop: '20px' }}
              disabled={cargando}
            >
              {cargando ? 'Reservando…' : 'Confirmar turno'}
            </button>
          </form>
        </>
      )}
    </>
  )
}
