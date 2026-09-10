'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import {
  RUBROS_ALTA,
  CATALOGOS,
  PASOS,
  DIAS_BASE,
  EQUIPO,
  slugDe,
} from './datos'
import { darDeAlta, type EstadoAlta } from './acciones'

const inicial: EstadoAlta = { error: null }

const tarjeta = {
  background: 'var(--surface)',
  border: '1px solid var(--line-soft)',
  borderRadius: '30px',
  padding: '30px 28px',
  boxShadow: 'var(--sh-1)',
} as const

const tituloPaso = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(24px, 3.4vw, 32px)',
  letterSpacing: '-0.03em',
  margin: '0 0 10px',
} as const

const bajadaPaso = {
  fontSize: '15.5px',
  lineHeight: 1.6,
  color: 'var(--ink-2)',
  margin: '0 0 24px',
  maxWidth: '62ch',
} as const

const etiqueta = { fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-2)' } as const
const campo = { display: 'flex', flexDirection: 'column', gap: '7px' } as const
const fila = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '13px 0',
  borderTop: '1px solid var(--line-soft)',
  flexWrap: 'wrap',
} as const

function chip(tono: string) {
  const neutro = tono === 'neutro'
  return {
    flex: 'none',
    fontSize: '11.5px',
    fontWeight: 700,
    padding: '5px 11px',
    borderRadius: '999px',
    whiteSpace: 'nowrap' as const,
    background: neutro ? 'var(--surface-2)' : 'var(--brand-50)',
    color: neutro ? 'var(--ink-2)' : 'var(--brand-700)',
    border: '1px solid ' + (neutro ? 'var(--line-soft)' : 'var(--brand-100)'),
  }
}

export function Asistente() {
  const [paso, setPaso] = useState(0)
  const [rubro, setRubro] = useState<string>('Peluquería')
  const [nombreLocal, setNombreLocal] = useState('')
  const [telLocal, setTelLocal] = useState('')
  const [dirLocal, setDirLocal] = useState('')
  const [igLocal, setIgLocal] = useState('')
  const [dias, setDias] = useState<boolean[]>(DIAS_BASE.map((d) => d.abierto))
  const [quitados, setQuitados] = useState<Record<number, true>>({})
  const [precios, setPrecios] = useState<Record<number, string>>({})

  const [estado, enviar, pendiente] = useActionState(darDeAlta, inicial)

  const catalogo = CATALOGOS[rubro] ?? []
  const slug = slugDe(nombreLocal)
  const ultimo = paso === 4

  const elegidos = catalogo
    .map((s, i) => ({ ...s, precio: precios[i] ?? s.precio, i }))
    .filter((s) => !quitados[s.i])

  return (
    <>
      <header
        style={{ borderBottom: '1px solid var(--line-soft)', background: 'var(--surface)' }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'var(--ink)',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '11px',
                background: 'var(--brand-solid)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="16" rx="4" />
                <path d="M8 3v4M16 3v4M3 11h18" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '19px',
                letterSpacing: '-0.02em',
              }}
            >
              Ára
            </span>
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '13.5px',
              color: 'var(--ink-2)',
            }}
          >
            <span>Paso {paso + 1} de 5</span>
            <Link href="/" className="enlace-nav">
              Salir
            </Link>
          </div>
        </div>
        <div style={{ height: '3px', background: 'var(--surface-2)' }}>
          <div
            style={{
              height: '100%',
              width: `${((paso + 1) / 5) * 100}%`,
              background: 'var(--brand-solid)',
              transition: 'width .3s cubic-bezier(.2,.7,.3,1)',
            }}
          />
        </div>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          padding: '34px 24px 48px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '10px',
            marginBottom: '30px',
          }}
        >
          {PASOS.map((x, i) => {
            const activo = i === paso
            const hecho = i < paso
            return (
              <button
                key={x.n}
                type="button"
                onClick={() => setPaso(i)}
                className="paso-alta"
                data-activo={activo}
              >
                <span
                  style={{
                    flex: 'none',
                    width: '26px',
                    height: '26px',
                    borderRadius: '999px',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    background: activo
                      ? 'rgba(255,255,255,.22)'
                      : hecho
                        ? 'var(--brand-solid)'
                        : 'var(--surface-2)',
                    color: activo || hecho ? '#fff' : 'var(--ink-2)',
                  }}
                >
                  {x.n}
                </span>
                <span style={{ minWidth: 0, textAlign: 'left' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {x.titulo}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      opacity: 0.75,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {x.corto}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* 1 · Rubro */}
        {paso === 0 && (
          <div style={tarjeta}>
            <h1 style={tituloPaso}>¿A qué se dedica tu local?</h1>
            <p style={bajadaPaso}>
              Con esto definimos los campos de la ficha del cliente y te cargamos un
              catálogo inicial de servicios típicos del rubro. Después lo ajustás.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
                gap: '10px',
              }}
            >
              {RUBROS_ALTA.map((r) => (
                <button
                  key={r.slug}
                  type="button"
                  className="opcion-rubro"
                  data-activo={r.nombre === rubro}
                  onClick={() => {
                    setRubro(r.nombre)
                    setQuitados({})
                    setPrecios({})
                  }}
                >
                  <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 600 }}>
                    {r.nombre}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      opacity: 0.8,
                      marginTop: '2px',
                    }}
                  >
                    {r.ejemplo}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2 · El local */}
        {paso === 1 && (
          <div style={tarjeta}>
            <h1 style={tituloPaso}>Datos del local</h1>
            <p style={bajadaPaso}>
              Esto es lo que ven tus clientes en el link de reserva y lo que aparece en
              los comprobantes.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '16px',
              }}
            >
              <label style={campo}>
                <span style={etiqueta}>Nombre del local</span>
                <input
                  type="text"
                  className="campo"
                  style={{ margin: 0 }}
                  placeholder="Studio Kuña"
                  value={nombreLocal}
                  onChange={(e) => setNombreLocal(e.target.value)}
                />
              </label>
              <label style={campo}>
                <span style={etiqueta}>WhatsApp del local</span>
                <input
                  type="tel"
                  className="campo"
                  style={{ margin: 0 }}
                  placeholder="0981 000 000"
                  value={telLocal}
                  onChange={(e) => setTelLocal(e.target.value)}
                />
              </label>
              <label style={campo}>
                <span style={etiqueta}>Dirección</span>
                <input
                  type="text"
                  className="campo"
                  style={{ margin: 0 }}
                  placeholder="Malutín 1240, Villa Morra"
                  value={dirLocal}
                  onChange={(e) => setDirLocal(e.target.value)}
                />
              </label>
              <label style={campo}>
                <span style={etiqueta}>Instagram (opcional)</span>
                <input
                  type="text"
                  className="campo"
                  style={{ margin: 0 }}
                  placeholder="@studiokuna"
                  value={igLocal}
                  onChange={(e) => setIgLocal(e.target.value)}
                />
              </label>
            </div>
            <div
              style={{
                marginTop: '18px',
                padding: '16px 18px',
                borderRadius: '14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--line-soft)',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                  marginBottom: '6px',
                }}
              >
                Tu link va a ser
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, wordBreak: 'break-all' }}>
                ara.com.py/{slug}
              </div>
            </div>
          </div>
        )}

        {/* 3 · Horario */}
        {paso === 2 && (
          <div style={tarjeta}>
            <h1 style={tituloPaso}>¿Cuándo abre el local?</h1>
            <p style={bajadaPaso}>
              Fuera de este horario no se puede reservar. Los feriados y las vacaciones
              se bloquean después, desde el panel.
            </p>
            {DIAS_BASE.map((d, i) => {
              const on = dias[i]
              return (
                <div key={d.nombre} style={{ ...fila, gap: '14px' }}>
                  <button
                    type="button"
                    className="perilla"
                    data-on={on}
                    aria-pressed={on}
                    aria-label={`${d.nombre}: ${on ? 'abierto' : 'cerrado'}`}
                    onClick={() =>
                      setDias((prev) => prev.map((v, j) => (j === i ? !v : v)))
                    }
                  >
                    <span />
                  </button>
                  <span style={{ fontSize: '14.5px', fontWeight: 600, flex: 1, minWidth: '90px' }}>
                    {d.nombre}
                  </span>
                  <span
                    style={{
                      flex: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: on ? 'var(--ink)' : 'var(--ink-2)',
                    }}
                  >
                    {on ? (d.rango === 'Cerrado' ? '09:00 – 19:00' : d.rango) : 'Cerrado'}
                  </span>
                </div>
              )
            })}
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-2)',
                margin: '16px 0 0',
                lineHeight: 1.55,
              }}
            >
              Cada profesional puede tener su propio horario dentro del horario del
              local. Eso se configura cuando cargás el equipo.
            </p>
          </div>
        )}

        {/* 4 · Servicios */}
        {paso === 3 && (
          <div style={tarjeta}>
            <h1 style={tituloPaso}>Tu catálogo inicial</h1>
            <p style={bajadaPaso}>
              Cargamos los servicios típicos de {rubro.toLowerCase()} con duraciones
              habituales. Ajustá los precios y sacá lo que no ofrecés.
            </p>
            {catalogo.map((s, i) => {
              const activo = !quitados[i]
              return (
                <div key={s.nombre} style={fila}>
                  <button
                    type="button"
                    className="tilde"
                    data-activo={activo}
                    aria-pressed={activo}
                    aria-label={`${activo ? 'Sacar' : 'Agregar'} ${s.nombre}`}
                    onClick={() =>
                      setQuitados((prev) => {
                        const q = { ...prev }
                        if (q[i]) delete q[i]
                        else q[i] = true
                        return q
                      })
                    }
                  >
                    {activo ? '✓' : ''}
                  </button>
                  <span style={{ flex: 1, minWidth: '140px' }}>
                    <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 600 }}>
                      {s.nombre}
                    </span>
                    <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                      {s.dur}
                    </span>
                  </span>
                  <input
                    type="text"
                    className="campo"
                    aria-label={`Precio de ${s.nombre}`}
                    style={{
                      margin: 0,
                      flex: 'none',
                      width: '132px',
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                    value={precios[i] ?? s.precio}
                    onChange={(e) =>
                      setPrecios((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                  />
                </div>
              )
            })}
            <button type="button" className="boton-punteado">
              Agregar otro servicio
            </button>
          </div>
        )}

        {/* 5 · Equipo */}
        {paso === 4 && (
          <div style={tarjeta}>
            <h1 style={tituloPaso}>¿Quién trabaja con vos?</h1>
            <p style={bajadaPaso}>
              Cada persona recibe una invitación por correo y elige su propia
              contraseña. Vos definís qué puede ver.
            </p>
            {EQUIPO.map((e, i) => (
              <div key={e.mail} style={fila}>
                <span
                  style={{
                    flex: 'none',
                    width: '38px',
                    height: '38px',
                    borderRadius: '999px',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#fff',
                    background: i === 0 ? 'var(--brand-solid)' : 'var(--neutral-solid)',
                  }}
                >
                  {e.ini}
                </span>
                <span style={{ flex: 1, minWidth: '150px' }}>
                  <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 600 }}>
                    {e.nombre}
                  </span>
                  <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                    {e.mail}
                  </span>
                </span>
                <span style={chip(e.tono)}>{e.rol}</span>
              </div>
            ))}
            <button type="button" className="boton-punteado">
              Invitar a alguien más
            </button>
            <div
              style={{
                marginTop: '22px',
                padding: '18px 20px',
                borderRadius: '16px',
                background: 'var(--brand-50)',
                border: '1px solid var(--brand-100)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '15.5px',
                  margin: '0 0 7px',
                  color: 'var(--brand-700)',
                }}
              >
                Ya está: el local queda listo
              </h3>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
                Al terminar te llevamos al panel con tu catálogo y tu equipo cargados, y
                con el link de reserva listo para compartir. Los 14 días de prueba
                empiezan hoy.
              </p>
            </div>
          </div>
        )}

        {estado.error && (
          <p role="alert" className="aviso-error" style={{ marginTop: '18px' }}>
            {estado.error}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginTop: '22px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="boton-atras"
            disabled={paso === 0}
            onClick={() => setPaso((p) => Math.max(0, p - 1))}
          >
            Atrás
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>{PASOS[paso].ayuda}</span>

            {ultimo ? (
              <form action={enviar}>
                <input type="hidden" name="rubro" value={rubro} />
                <input type="hidden" name="nombre" value={nombreLocal} />
                <input type="hidden" name="telefono" value={telLocal} />
                <input type="hidden" name="direccion" value={dirLocal} />
                <input type="hidden" name="instagram" value={igLocal} />
                <input type="hidden" name="dias" value={JSON.stringify(dias)} />
                <input type="hidden" name="servicios" value={JSON.stringify(elegidos)} />
                <button type="submit" className="cta-solido" disabled={pendiente}>
                  {pendiente ? 'Creando el local…' : 'Entrar al panel'}
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="cta-solido"
                onClick={() => setPaso((p) => Math.min(4, p + 1))}
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
