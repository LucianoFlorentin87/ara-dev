import Link from 'next/link'
import { RUBROS } from '@/lib/rubros'
import { FUNCIONES } from '@/lib/marketing'
import { Contenedor, Seccion, Titulo, Bajada, Tarjeta, Malla } from './piezas'

export const metadata = {
  title: 'Ára · turnos, fichas y caja en un solo lugar',
  description:
    'Sistema de gestión de turnos para peluquerías, estética, salud y bienestar en Paraguay.',
}

const FILAS = [
  {
    titulo: 'La agenda no deja pisar un turno',
    texto:
      'Dos personas pueden estar reservando el mismo horario en el mismo segundo. La base de datos lo resuelve antes de guardar, no el navegador de ninguna de las dos.',
  },
  {
    titulo: 'La ficha se adapta a tu rubro',
    texto:
      'Una peluquería guarda la fórmula de color. Un consultorio, la historia médica. Los campos no están escritos en el sistema: los define tu local.',
  },
  {
    titulo: 'Tus clientes reservan solos',
    texto:
      'Un link propio muestra tus servicios, tu equipo y los huecos reales de tu agenda. Nunca muestra el nombre de quien ya tiene ese turno.',
  },
  {
    titulo: 'La caja cierra con vos',
    texto:
      'Cobros del turno, arqueo contra lo que contaste y, si no cuadra, el motivo queda escrito. Un cobro no se borra: se anula y queda registrado.',
  },
]

export default function Landing() {
  return (
    <>
      <Seccion espacio={0}>
        <div
          style={{
            background: 'var(--brand-solid)',
            color: '#fff',
            padding: '72px 0 84px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.18,
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #fff 1.2px, transparent 0)',
              backgroundSize: '22px 22px',
              maskImage: 'radial-gradient(90% 90% at 80% 0%, #000 0%, transparent 70%)',
            }}
          />
          <Contenedor>
            <div style={{ position: 'relative', maxWidth: '760px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                  marginBottom: '16px',
                }}
              >
                Hecho para Paraguay
              </div>
              <h1
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(34px, 6.4vw, 58px)',
                  lineHeight: 1.04,
                  letterSpacing: '-0.04em',
                  margin: '0 0 18px',
                }}
              >
                Tu agenda, tus fichas y tu caja, en un solo lugar.
              </h1>
              <p
                style={{
                  fontSize: '17.5px',
                  lineHeight: 1.6,
                  opacity: 0.92,
                  margin: '0 0 30px',
                  maxWidth: '58ch',
                }}
              >
                Turnos sin doble reserva, reserva online para tus clientes y el
                cierre de caja del día. Para peluquerías, estética, uñas,
                gimnasios y consultorios.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  href="/como-arranca"
                  className="boton-primario"
                  style={{ width: 'auto', padding: '14px 26px', display: 'inline-block', textDecoration: 'none', background: '#fff', color: 'var(--brand-solid)' }}
                >
                  Cómo arranca
                </Link>
                <Link
                  href="/precios"
                  style={{
                    display: 'inline-block',
                    padding: '14px 26px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,.5)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                  }}
                >
                  Ver precios
                </Link>
              </div>
            </div>
          </Contenedor>
        </div>
      </Seccion>

      <Contenedor>
        <Seccion>
          <Titulo>Lo que resuelve</Titulo>
          <Malla min={280}>
            {FILAS.map((f) => (
              <Tarjeta key={f.titulo}>
                <h3
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '19px',
                    letterSpacing: '-0.02em',
                    margin: '0 0 8px',
                  }}
                >
                  {f.titulo}
                </h3>
                <p style={{ fontSize: '14.5px', lineHeight: 1.62, color: 'var(--ink-2)', margin: 0 }}>
                  {f.texto}
                </p>
              </Tarjeta>
            ))}
          </Malla>
        </Seccion>

        <Seccion>
          <Titulo>Para tu rubro</Titulo>
          <Bajada>
            El sistema es el mismo; lo que cambia son los campos de la ficha,
            los servicios cargados y cómo se agenda.
          </Bajada>
          <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
            {RUBROS.map((r) => (
              <Link key={r.slug} className="pastilla" href={`/rubros/${r.slug}`}>
                {r.nombre}
              </Link>
            ))}
          </div>
        </Seccion>

        <Seccion>
          <Titulo>Diez funciones, sin relleno</Titulo>
          <Malla min={240}>
            {FUNCIONES.map((f) => (
              <Tarjeta key={f.n} tono={f.tono === 'brand' ? 'brand' : undefined}>
                <div
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: 'var(--brand)',
                    marginBottom: '6px',
                  }}
                >
                  {f.n}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 600,
                    fontSize: '17px',
                    letterSpacing: '-0.02em',
                    margin: '0 0 6px',
                  }}
                >
                  {f.titulo}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
                  {f.texto}
                </p>
              </Tarjeta>
            ))}
          </Malla>
        </Seccion>

        <Seccion>
          <Tarjeta tono="brand">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Titulo tamano="clamp(24px, 3.6vw, 34px)" centrado>
                Empezá con tus datos de verdad
              </Titulo>
              <Bajada centrado>
                Se carga el catálogo de tu rubro, tu equipo y tu horario. En una
                tarde estás agendando.
              </Bajada>
              <Link
                href="/como-arranca"
                className="boton-primario"
                style={{ width: 'auto', padding: '14px 28px', display: 'inline-block', textDecoration: 'none' }}
              >
                Ver cómo arranca
              </Link>
            </div>
          </Tarjeta>
        </Seccion>
      </Contenedor>
    </>
  )
}
