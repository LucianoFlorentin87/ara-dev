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
  // El portal abre en la pantalla de bienvenida del diseño; el asistente de
  // cuatro pasos aparece recién al apretar "Reservar un turno nuevo".
  const [enInicio, setEnInicio] = useState(true)
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
        String(datos.get('nota') ?? '') || null
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

  function volverAEmpezar() {
    setListo(null)
    setServicio(null)
    setProfesional(null)
    setHueco(null)
    setError(null)
    setPaso(1)
    setEnInicio(false)
  }

  const fechaLarga = `${partesDia(dia).dia} ${partesDia(dia).num} de ${partesDia(dia).mes}${
    hueco ? ` · ${horaDe(hueco.inicio)}` : ''
  }`

  if (enInicio) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '34px 22px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <h2
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(28px, 6vw, 36px)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                margin: '0 0 10px',
              }}
            >
              Reservá tu turno
            </h2>
            <p style={{ fontSize: '15.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
              Elegí servicio y horario en un minuto. No hace falta crear una cuenta.
            </p>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-soft)',
              borderRadius: 'var(--r-lg)',
              padding: '26px 24px',
              boxShadow: 'var(--sh-2)',
            }}
          >
            <button
              type="button"
              className="boton-primario"
              onClick={() => setEnInicio(false)}
            >
              Reservar un turno nuevo
            </button>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0 18px' }}
            >
              <span aria-hidden style={{ flex: 1, height: '1px', background: 'var(--line-soft)' }} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                }}
              >
                o entrá a lo tuyo
              </span>
              <span aria-hidden style={{ flex: 1, height: '1px', background: 'var(--line-soft)' }} />
            </div>

            {/* El código por WhatsApp todavía no está conectado: el sistema no
                manda mensajes por su cuenta. Hasta que se resuelva, el que
                quiere ver sus turnos escribe al local. */}
            <label
              htmlFor="cel-login"
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--ink-2)',
                marginBottom: '7px',
              }}
            >
              Tu celular
            </label>
            <input
              id="cel-login"
              type="tel"
              inputMode="tel"
              className="campo"
              placeholder="0981 234 567"
              disabled
            />
            <button type="button" className="boton-suave-bloque" disabled>
              Ver mis turnos
            </button>
            <p
              style={{
                fontSize: '12.5px',
                lineHeight: 1.55,
                color: 'var(--ink-2)',
                margin: '14px 0 0',
                textAlign: 'center',
              }}
            >
              Todavía no está disponible. Para ver o cambiar un turno, escribile al local.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (listo) {
    return (
      <div style={{ flex: 1, padding: '22px 22px 40px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', paddingTop: '20px' }}>
          <span
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '999px',
              background: 'var(--brand-solid)',
              display: 'inline-grid',
              placeItems: 'center',
              boxShadow: 'var(--sh-3)',
              marginBottom: '22px',
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
              <path d="m4 12.5 5 5L20 6.5" />
            </svg>
          </span>
          <h2
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(26px, 5vw, 34px)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
            }}
          >
            Turno confirmado
          </h2>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'var(--ink-2)',
              margin: '0 auto 26px',
              maxWidth: '40ch',
            }}
          >
            {servicio?.nombre} el {fechaLarga} con {profesional?.nombre_publico}, en{' '}
            {nombreLocal}. Si no podés venir, avisá al local así lo liberan.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="cta-solido" onClick={volverAEmpezar}>
              Reservar otro
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, padding: '22px 22px 40px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
        {/* En el primer paso, "atrás" vuelve a la bienvenida. */}
        <button
            type="button"
            className="boton-icono"
            onClick={() => {
              setError(null)
              if (paso === 1) setEnInicio(true)
              else setPaso(paso - 1)
            }}
            title="Atrás"
            aria-label="Atrás"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
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
                    {s.duracion_min} min
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
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ink-2)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  style={{ flex: 'none' }}
                  aria-hidden
                >
                  <path d="m10 6 6 6-6 6" />
                </svg>
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
              background: 'var(--surface)',
              border: '1px solid var(--line-soft)',
              borderRadius: 'var(--r-lg)',
              padding: '24px',
              boxShadow: 'var(--sh-2)',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--line-soft)',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '22px',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {servicio?.nombre}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-2)', marginTop: '3px' }}>
                  {servicio?.duracion_min} min · con {profesional?.nombre_publico}
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  letterSpacing: '-0.025em',
                  color: 'var(--brand)',
                  flex: 'none',
                }}
              >
                {servicio && guaranies(servicio.precio)}
              </div>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0 0' }}
            >
              <span
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: 'var(--brand-50)',
                  border: '1px solid var(--brand-100)',
                  display: 'grid',
                  placeItems: 'center',
                  flex: 'none',
                }}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <rect x="3" y="5" width="18" height="16" rx="4" />
                  <path d="M8 3v4M16 3v4M3 11h18" />
                </svg>
              </span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{fechaLarga}</div>
                <div style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>
                  Llegá 5 minutos antes
                </div>
              </div>
            </div>
          </div>

          <form
            action={confirmar}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-soft)',
              borderRadius: 'var(--r-lg)',
              padding: '24px',
              boxShadow: 'var(--sh-1)',
            }}
          >
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
              htmlFor="nota"
            >
              Algo que debamos saber (opcional)
            </label>
            <input
              id="nota"
              name="nota"
              className="campo"
              placeholder="Alergias, preferencias, referencias"
            />

            <button
              type="submit"
              className="boton-primario"
              style={{ marginTop: '20px' }}
              disabled={cargando}
            >
              {cargando ? 'Reservando…' : 'Confirmar turno'}
            </button>
            <p
              style={{
                fontSize: '12.5px',
                lineHeight: 1.55,
                color: 'var(--ink-2)',
                margin: '14px 0 0',
                textAlign: 'center',
              }}
            >
              El local te confirma por WhatsApp y te recuerda el día anterior.
            </p>
          </form>
        </>
      )}
      </div>
    </div>
  )
}
