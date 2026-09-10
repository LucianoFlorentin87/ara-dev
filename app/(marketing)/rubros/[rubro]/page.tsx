import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RUBROS, rubroPorSlug } from '@/lib/rubros'
import { RanuraFoto } from '../../ranura-foto'

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
    title: r ? `${r.titular} · Ára` : 'Ára',
    description: r?.bajada,
  }
}

// Pendiente del cliente: el WhatsApp real. Hoy es el marcador del diseño.
const WA = 'https://wa.me/595981000000'

const h2 = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.035em',
} as const

export default async function LandingRubro({ params }: PageProps<'/rubros/[rubro]'>) {
  const { rubro } = await params
  const r = rubroPorSlug(rubro)
  if (!r) notFound()

  const otros = RUBROS.filter((o) => o.slug !== r.slug)

  return (
    <>
      {/* Hero */}
      <section style={{ padding: '26px 26px 0' }}>
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            position: 'relative',
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--sh-3)',
            minHeight: '520px',
            display: 'flex',
          }}
        >
          <RanuraFoto descripcion="Foto del rubro trabajando — plano amplio" />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(200deg, rgba(76,21,181,.94) 0%, rgba(106,43,224,.86) 42%, rgba(26,16,48,.72) 100%)',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.3,
              backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1.1px, transparent 0)',
              backgroundSize: '26px 26px',
              maskImage: 'radial-gradient(80% 70% at 85% 15%, #000 0%, transparent 72%)',
            }}
          />

          <div
            style={{
              position: 'relative',
              flex: 1,
              minWidth: 0,
              padding: '52px 40px 46px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 370px), 1fr))',
              gap: '40px',
              alignItems: 'center',
              color: '#fff',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  background: 'rgba(255,255,255,.18)',
                  border: '1px solid rgba(255,255,255,.3)',
                  padding: '7px 16px',
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
                    background: 'var(--warm)',
                    animation: 'pulseDot 2.4s ease-in-out infinite',
                  }}
                />
                {r.etiqueta}
              </span>

              <h1
                style={{
                  ...h2,
                  fontSize: 'clamp(36px, 5.2vw, 60px)',
                  lineHeight: 1.05,
                  margin: '0 0 18px',
                  maxWidth: '21ch',
                }}
              >
                {r.titular}
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  lineHeight: 1.6,
                  margin: '0 0 30px',
                  maxWidth: '46ch',
                  color: 'rgba(255,255,255,.9)',
                }}
              >
                {r.bajada}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/como-arranca" className="cta-blanco">
                  Probar gratis 14 días
                </Link>
                <Link href="/studiokuna" className="cta-linea">
                  Ver la demo
                </Link>
              </div>
            </div>

            {/* Tarjeta de agenda flotando */}
            <div style={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
              <div
                style={{
                  width: 'min(320px, 100%)',
                  background: 'var(--surface)',
                  borderRadius: '30px',
                  padding: '14px',
                  boxShadow: '0 30px 70px -20px rgba(0,0,0,.6)',
                }}
              >
                <div
                  style={{
                    background: 'var(--brand-solid)',
                    color: '#fff',
                    borderRadius: '22px 22px 12px 12px',
                    padding: '15px 17px 17px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      opacity: 0.85,
                    }}
                  >
                    Agenda de hoy
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 700,
                      fontSize: '24px',
                      letterSpacing: '-0.02em',
                      marginTop: '4px',
                    }}
                  >
                    {r.turnosHoy}
                  </div>
                  <div style={{ fontSize: '12.5px', opacity: 0.88, marginTop: '2px' }}>
                    {r.notaAgenda}
                  </div>
                </div>

                <div style={{ padding: '5px 3px 3px' }}>
                  {r.agenda.map((a, i) => (
                    <div
                      key={a.hora + a.cliente}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 8px',
                        borderRadius: '13px',
                        background: i === 1 ? 'var(--brand-50)' : 'transparent',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--ink-2)',
                          width: '40px',
                          flex: 'none',
                        }}
                      >
                        {a.hora}
                      </span>
                      <span
                        aria-hidden
                        style={{
                          width: '4px',
                          height: '30px',
                          borderRadius: '999px',
                          flex: 'none',
                          background: a.online ? 'var(--warm-solid)' : 'var(--brand-solid)',
                        }}
                      />
                      <span style={{ minWidth: 0 }}>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            color: 'var(--ink)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {a.cliente}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '11.5px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: a.online ? 'var(--warm-700)' : 'var(--ink-2)',
                            fontWeight: a.online ? 600 : 400,
                          }}
                        >
                          {a.servicio}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '66px 26px 0' }}>
        <div style={{ maxWidth: '720px', marginBottom: '34px' }}>
          <h2 style={{ ...h2, fontSize: 'clamp(28px, 3.8vw, 42px)', margin: '0 0 12px' }}>
            {r.tituloProblemas}
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
            Tres cosas que pasan en {r.posesivo} y que el sistema resuelve sin
            que nadie tenga que acordarse.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '16px',
          }}
        >
          {r.problemas.map((p) => (
            <div key={p.titulo} className="tarjeta-mk" data-hover="true">
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'var(--warm-700)',
                  background: 'var(--warm-50)',
                  border: '1px solid var(--warm)',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  display: 'inline-block',
                  marginBottom: '14px',
                }}
              >
                {p.antes}
              </div>
              <h3 style={{ ...h2, fontSize: '20px', letterSpacing: '-0.025em', margin: '0 0 9px' }}>
                {p.titulo}
              </h3>
              <p
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  color: 'var(--ink-2)',
                  margin: 0,
                  textWrap: 'pretty',
                }}
              >
                {p.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ficha y catálogo */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '66px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '16px',
          }}
        >
          <div className="tarjeta-mk">
            <h3 style={{ ...h2, fontSize: '21px', letterSpacing: '-0.025em', margin: '0 0 8px' }}>
              La ficha de {r.posesivo}
            </h3>
            <p
              style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 18px' }}
            >
              Los campos son los de tu rubro, no una lista genérica. Los que no
              usás, no aparecen.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {r.ficha.map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: '13px',
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

          <div className="tarjeta-mk">
            <h3 style={{ ...h2, fontSize: '21px', letterSpacing: '-0.025em', margin: '0 0 8px' }}>
              Tu catálogo, ya cargado
            </h3>
            <p
              style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 12px' }}
            >
              Arrancás con los servicios típicos del rubro y sus duraciones.
              Ajustás los precios y listo.
            </p>
            {r.servicios.map((s) => (
              <div
                key={s.nombre}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '12px 0',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                <span style={{ fontSize: '14.5px', fontWeight: 600, minWidth: 0 }}>
                  {s.nombre}
                </span>
                <span style={{ textAlign: 'right', flex: 'none' }}>
                  <span
                    style={{ display: 'block', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {s.precio}
                  </span>
                  <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                    {s.dur}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reserva online */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '66px 26px 0' }}>
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
              Reserva online
            </span>
            <h2 style={{ ...h2, fontSize: 'clamp(26px, 3.4vw, 38px)', margin: '0 0 14px' }}>
              {r.tituloReserva}
            </h2>
            <p
              style={{ fontSize: '16.5px', lineHeight: 1.65, color: 'var(--ink-2)', margin: '0 0 24px' }}
            >
              {r.textoReserva}
            </p>
            <Link href="/studiokuna" className="cta-solido">
              Ver cómo lo ve tu cliente
            </Link>
          </div>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
              border: '1px solid var(--line-soft)',
              boxShadow: 'var(--sh-2)',
              aspectRatio: '4 / 3',
            }}
          >
            <RanuraFoto descripcion="Foto de una atención o del local" />
          </div>
        </div>
      </section>

      {/* Preguntas */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '66px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '40px',
          }}
        >
          <div>
            <h2 style={{ ...h2, fontSize: 'clamp(26px, 3.4vw, 38px)', margin: '0 0 12px' }}>
              Preguntas de {r.posesivo}
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 20px' }}>
              Lo que más nos preguntan en este rubro.
            </p>
            <a href={WA} className="cta-solido" target="_blank" rel="noopener noreferrer">
              Preguntar por WhatsApp
            </a>
          </div>
          <div>
            {r.faq.map((q) => (
              <details key={q.p} className="faq-mk">
                <summary>
                  {q.p}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    style={{ flex: 'none' }}
                    aria-hidden
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p
                  style={{
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    color: 'var(--ink-2)',
                    margin: '12px 0 0',
                    maxWidth: '64ch',
                  }}
                >
                  {q.r}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Otros rubros */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '66px 26px 0' }}>
        <h2 style={{ ...h2, fontSize: 'clamp(22px, 2.8vw, 28px)', margin: '0 0 16px' }}>
          También sirve para
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {otros.map((o) => (
            <Link key={o.slug} href={`/rubros/${o.slug}`} className="pastilla-rubro">
              {o.nombre}
            </Link>
          ))}
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
            padding: '58px 34px',
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
            <h2 style={{ ...h2, fontSize: 'clamp(28px, 4.2vw, 46px)', lineHeight: 1.08, margin: '0 0 16px' }}>
              {r.cierre}
            </h2>
            <p
              style={{
                fontSize: '17.5px',
                lineHeight: 1.6,
                margin: '0 0 30px',
                color: 'rgba(255,255,255,.9)',
              }}
            >
              14 días completos, sin tarjeta. Te configuramos el local con tu
              catálogo y tu equipo, y arrancás con la agenda cargada.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/como-arranca" className="cta-blanco">
                Crear mi cuenta de prueba
              </Link>
              <a href={WA} className="cta-linea" target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
