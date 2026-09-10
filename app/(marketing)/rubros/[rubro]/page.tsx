import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RUBROS, rubroPorSlug } from '@/lib/rubros'
import { Contenedor, Seccion, Titulo, Bajada, Tarjeta, Malla } from '../../piezas'

/**
 * Las nueve landings de rubro son una sola ruta con distinta data, igual
 * que en el diseño, donde es un archivo parametrizado por la prop `rubro`.
 */
export function generateStaticParams() {
  return RUBROS.map((r) => ({ rubro: r.slug }))
}

export async function generateMetadata({ params }: PageProps<'/rubros/[rubro]'>) {
  const { rubro } = await params
  const r = rubroPorSlug(rubro)
  return {
    title: r ? `${r.nombre} · Ára` : 'Ára',
    description: r ? `Ára para ${r.posesivo}: agenda, ficha y caja.` : undefined,
  }
}

export default async function LandingRubro({ params }: PageProps<'/rubros/[rubro]'>) {
  const { rubro } = await params
  const r = rubroPorSlug(rubro)
  if (!r) notFound()

  return (
    <Contenedor>
      <Seccion>
        <Link
          href="/rubros"
          style={{ fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '14px' }}
        >
          ‹ Todos los rubros
        </Link>
        <Titulo>Ára para {r.posesivo}</Titulo>
        <Bajada>
          Lo mismo que usa cualquier local, con la ficha y el catálogo que{' '}
          {r.posesivo} necesita.
        </Bajada>

        <Malla min={280}>
          {r.bullets.map((b) => (
            <Tarjeta key={b}>
              <p style={{ fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{b}</p>
            </Tarjeta>
          ))}
        </Malla>
      </Seccion>

      <Seccion>
        <Malla min={300}>
          <Tarjeta>
            <h3
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '19px',
                letterSpacing: '-0.02em',
                margin: '0 0 12px',
              }}
            >
              Qué guarda la ficha
            </h3>
            {r.ficha.map((f) => (
              <div
                key={f}
                style={{
                  padding: '9px 0',
                  borderTop: '1px solid var(--line-soft)',
                  fontSize: '14.5px',
                }}
              >
                {f}
              </div>
            ))}
          </Tarjeta>

          <Tarjeta>
            <h3
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '19px',
                letterSpacing: '-0.02em',
                margin: '0 0 12px',
              }}
            >
              Catálogo de ejemplo
            </h3>
            {r.servicios.map((s) => (
              <div
                key={s.nombre}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '9px 0',
                  borderTop: '1px solid var(--line-soft)',
                  fontSize: '14.5px',
                }}
              >
                <span>
                  {s.nombre}
                  <span style={{ color: 'var(--ink-2)', fontSize: '12.5px' }}> · {s.dur}</span>
                </span>
                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {s.precio}
                </span>
              </div>
            ))}
            <p style={{ fontSize: '12.5px', color: 'var(--ink-2)', margin: '14px 0 0' }}>
              Precios de referencia: se cargan los tuyos.
            </p>
          </Tarjeta>

          <Tarjeta tono="brand">
            <h3
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '19px',
                letterSpacing: '-0.02em',
                margin: '0 0 12px',
                color: 'var(--brand-700)',
              }}
            >
              Un día cualquiera
            </h3>
            {r.miniAgenda.map((m) => (
              <div
                key={m.hora + m.cliente}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '9px 0',
                  borderTop: '1px solid var(--brand-100)',
                  fontSize: '14px',
                }}
              >
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--ink-2)',
                    flex: 'none',
                    width: '44px',
                  }}
                >
                  {m.hora}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600 }}>{m.cliente}</span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '12.5px',
                      color: m.online ? 'var(--warm-700)' : 'var(--ink-2)',
                    }}
                  >
                    {m.servicio}
                  </span>
                </span>
              </div>
            ))}
          </Tarjeta>
        </Malla>
      </Seccion>

      <Seccion>
        <Tarjeta>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Titulo tamano="clamp(22px, 3.2vw, 30px)" centrado>
              ¿Lo probamos con tus datos?
            </Titulo>
            <Bajada centrado>
              Se carga tu catálogo, tu equipo y tu horario, y ves tu propia
              agenda funcionando.
            </Bajada>
            <Link
              href="/como-arranca"
              className="boton-primario"
              style={{ width: 'auto', padding: '13px 26px', display: 'inline-block', textDecoration: 'none' }}
            >
              Cómo arranca
            </Link>
          </div>
        </Tarjeta>
      </Seccion>
    </Contenedor>
  )
}
