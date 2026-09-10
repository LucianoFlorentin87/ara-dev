import Link from 'next/link'
import { redirect } from 'next/navigation'
import { RUBROS_RESUMEN } from '@/lib/rubros-resumen'

export const metadata = {
  title: 'Rubros · Ára',
  description:
    'La base es la misma para todos: agenda, clientes, servicios y cobros. Lo que cambia es la ficha del cliente y el catálogo de servicios.',
}

// Pendiente del cliente: el WhatsApp real. Hoy es el marcador del diseño.
const WA = 'https://wa.me/595981000000'

const titulo = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.035em',
} as const

/**
 * El comparador de rubros. En el diseño las pastillas cambian de rubro con
 * estado de cliente; acá el rubro elegido viaja en `?r=` para que cada uno
 * tenga su URL y la página siga siendo un componente de servidor.
 */
export default async function Rubros({ searchParams }: PageProps<'/rubros'>) {
  const params = await searchParams
  const pedido = typeof params.r === 'string' ? params.r : ''
  const r = RUBROS_RESUMEN.find((x) => x.slug === pedido) ?? RUBROS_RESUMEN[0]
  if (pedido && pedido !== r.slug) redirect('/rubros')

  return (
    <>
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '52px 26px 0' }}>
        <div style={{ maxWidth: '780px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--brand)',
              background: 'var(--brand-50)',
              border: '1px solid var(--brand-100)',
              padding: '7px 15px',
              borderRadius: '999px',
              marginBottom: '22px',
            }}
          >
            <span
              aria-hidden
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '999px',
                background: 'var(--brand-solid)',
                animation: 'pulseDot 2.4s ease-in-out infinite',
              }}
            />
            Nueve rubros configurados
          </span>
          <h1
            style={{
              ...titulo,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 1.04,
              margin: '0 0 18px',
            }}
          >
            Un sistema, el vocabulario de tu rubro
          </h1>
          <p style={{ fontSize: '18.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
            La base es la misma para todos: agenda, clientes, servicios y cobros. Lo que
            cambia es la{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>ficha del cliente</strong> y
            el{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>
              catálogo de servicios
            </strong>
            , y eso lo configuramos con vos antes de que empieces.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '34px 26px 0' }}>
        <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
          {RUBROS_RESUMEN.map((x) => (
            <Link
              key={x.slug}
              href={x.slug === RUBROS_RESUMEN[0].slug ? '/rubros' : `/rubros?r=${x.slug}`}
              className="tab-rubro"
              data-activo={x.slug === r.slug}
              aria-current={x.slug === r.slug ? 'true' : undefined}
              scroll={false}
            >
              {x.nombre}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '26px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '16px',
          }}
        >
          {/* Cómo se trabaja */}
          <div className="tarjeta-mk" data-hover="true" style={{ padding: '28px' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '13px',
                background: 'var(--brand-50)',
                border: '1px solid var(--brand-100)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '18px',
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
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </span>
            <h3 style={{ ...titulo, fontSize: '20px', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
              Cómo se trabaja
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', margin: '0 0 10px' }}>
              en {r.posesivo}
            </p>
            {r.bullets.map((b) => (
              <div
                key={b}
                style={{
                  display: 'flex',
                  gap: '11px',
                  padding: '13px 0',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  style={{ flex: 'none', marginTop: '3px' }}
                  aria-hidden
                >
                  <path d="m4 12.5 5 5L20 6.5" />
                </svg>
                <span
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.55,
                    color: 'var(--ink-2)',
                    textWrap: 'pretty',
                  }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>

          {/* La ficha incluye */}
          <div className="tarjeta-mk" data-hover="true" style={{ padding: '28px' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '13px',
                background: 'var(--brand-50)',
                border: '1px solid var(--brand-100)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '18px',
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
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M9 12h7M9 16h5" />
              </svg>
            </span>
            <h3 style={{ ...titulo, fontSize: '20px', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
              La ficha incluye
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', margin: '0 0 16px' }}>
              Los campos que no usás no aparecen
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {r.ficha.map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--ink-2)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line-soft)',
                    padding: '8px 14px',
                    borderRadius: '999px',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Servicios y precios */}
          <div className="tarjeta-mk" data-hover="true" style={{ padding: '28px' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '13px',
                background: 'var(--warm-50)',
                border: '1px solid var(--warm)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '18px',
              }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--warm-700)"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5v5l3 2" />
              </svg>
            </span>
            <h3 style={{ ...titulo, fontSize: '20px', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
              Servicios y precios
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', margin: '0 0 10px' }}>
              Ejemplo · cargás los tuyos
            </p>
            {r.servicios.map((s) => (
              <div
                key={s.nombre}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '13px 0',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 600, minWidth: 0 }}>{s.nombre}</span>
                <span style={{ textAlign: 'right', flex: 'none' }}>
                  <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 600 }}>
                    {s.precio}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-2)' }}>
                    {s.dur}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Un día común */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '60px 26px 0' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--line-soft)',
            borderRadius: 'var(--r-xl)',
            padding: '42px 34px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'var(--brand)',
                background: 'var(--surface)',
                border: '1px solid var(--brand-100)',
                padding: '6px 13px',
                borderRadius: '999px',
                marginBottom: '16px',
              }}
            >
              Un día común
            </span>
            <h2
              style={{
                ...titulo,
                fontSize: 'clamp(26px, 3.4vw, 38px)',
                lineHeight: 1.1,
                margin: '0 0 14px',
              }}
            >
              La agenda de hoy en {r.posesivo}
            </h2>
            <p
              style={{
                fontSize: '16.5px',
                lineHeight: 1.65,
                color: 'var(--ink-2)',
                margin: '0 0 24px',
              }}
            >
              Los turnos en durazno entraron por el link de reserva online, sin que nadie
              los cargue a mano. La barra a la izquierda muestra la duración real de cada
              servicio.
            </p>
            <Link href={`/rubros/${r.slug}`} className="cta-solido">
              Ver la página de este rubro
            </Link>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-soft)',
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--sh-2)',
              padding: '20px 22px',
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '.11em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                }}
              >
                Agenda de hoy
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: 'var(--brand)',
                  background: 'var(--brand-50)',
                  padding: '4px 11px',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                en vivo
              </span>
            </div>
            {r.miniAgenda.map((m) => (
              <div
                key={m.hora}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '13px 0',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--ink-2)',
                    width: '44px',
                    flex: 'none',
                  }}
                >
                  {m.hora}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: '4px',
                    height: '32px',
                    borderRadius: '999px',
                    flex: 'none',
                    background: m.online ? 'var(--warm-solid)' : 'var(--brand-solid)',
                  }}
                />
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {m.cliente}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '12.5px',
                      color: 'var(--ink-2)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {m.servicio}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section style={{ padding: '72px 26px 0' }}>
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            borderRadius: 'var(--r-xl)',
            background: 'var(--brand-solid)',
            color: '#fff',
            padding: '56px 34px',
            boxShadow: 'var(--sh-3)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.22,
              backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1.2px, transparent 0)',
              backgroundSize: '24px 24px',
              maskImage: 'radial-gradient(75% 75% at 50% 0%, #000 0%, transparent 72%)',
            }}
          />
          <div style={{ position: 'relative', maxWidth: '660px', margin: '0 auto' }}>
            <h2
              style={{
                ...titulo,
                fontSize: 'clamp(28px, 4.2vw, 46px)',
                lineHeight: 1.08,
                margin: '0 0 16px',
              }}
            >
              ¿Tu rubro no está en la lista?
            </h2>
            <p
              style={{
                fontSize: '17.5px',
                lineHeight: 1.6,
                margin: '0 0 30px',
                color: 'rgba(255,255,255,.9)',
              }}
            >
              Si trabajás con turnos, la base te sirve. Los campos de la ficha y el
              catálogo se configuran para cualquier negocio: contanos cómo trabajás y lo
              armamos.
            </p>
            <div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <a href={WA} className="cta-blanco" target="_blank" rel="noreferrer">
                Contarnos tu caso
              </a>
              <Link href="/funciones" className="cta-linea">
                Ver las funciones
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
