import Link from 'next/link'
import { RUBROS } from '@/lib/rubros'
import { RanuraFoto } from './ranura-foto'
import {
  ESTADISTICAS,
  FILAS,
  RECALL,
  AGENDA_HERO,
  ETIQUETA_PORTADA,
} from './portada-datos'

export const metadata = {
  title: 'Ára · turnos, fichas y caja en un solo lugar',
  description:
    'Turnos sin doble reserva, reserva online para tus clientes, caja al cierre del día y la ficha de cada persona con su historial.',
}

// Pendiente del cliente: el WhatsApp real. Hoy es el marcador del diseño.
const WA = 'https://wa.me/595981000000'

const titulo = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.035em',
} as const

export default function Portada() {
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
            minHeight: '560px',
            display: 'flex',
          }}
        >
          <RanuraFoto descripcion="Foto de un local trabajando — plano amplio" />
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
              padding: '56px 40px 48px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
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
                  marginBottom: '24px',
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
                Turnos, fichas y caja · Paraguay
              </span>

              <h1
                style={{
                  ...titulo,
                  fontSize: 'clamp(38px, 5.6vw, 66px)',
                  lineHeight: 1.04,
                  margin: '0 0 20px',
                  maxWidth: '20ch',
                }}
              >
                Una nueva forma de manejar{' '}
                <span style={{ color: 'var(--warm)' }}>tu agenda</span>
              </h1>

              <p
                style={{
                  fontSize: '18.5px',
                  lineHeight: 1.6,
                  margin: '0 0 32px',
                  maxWidth: '44ch',
                  color: 'rgba(255,255,255,.9)',
                }}
              >
                Turnos sin doble reserva, reserva online para tus clientes, caja al
                cierre del día y la ficha de cada persona con su historial. Se abre en
                el navegador:{' '}
                <strong style={{ fontWeight: 700, color: '#fff' }}>no instalás nada</strong>.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href="/alta" className="cta-blanco">
                  Probar gratis 14 días
                </Link>
                <Link href="/sistema" className="cta-linea">
                  Ver por dentro
                </Link>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '26px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,.82)',
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--warm)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  style={{ flex: 'none' }}
                  aria-hidden
                >
                  <path d="m4 12.5 5 5L20 6.5" />
                </svg>
                Sin tarjeta. Te damos de alta el local y te dejamos la agenda cargada.
              </div>
            </div>

            {/* La agenda flotante */}
            <div style={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
              <div
                style={{
                  width: 'min(310px, 100%)',
                  background: 'var(--surface)',
                  borderRadius: '34px',
                  padding: '14px',
                  boxShadow: '0 30px 70px -20px rgba(0,0,0,.6)',
                  animation: 'flotar 7s ease-in-out infinite',
                }}
              >
                <div
                  style={{
                    background: 'var(--brand-solid)',
                    color: '#fff',
                    borderRadius: '24px 24px 14px 14px',
                    padding: '16px 18px 18px',
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
                    Viernes 5 de septiembre
                  </div>
                  <div
                    style={{
                      ...titulo,
                      fontSize: '25px',
                      letterSpacing: '-0.02em',
                      marginTop: '4px',
                    }}
                  >
                    14 turnos hoy
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.88, marginTop: '2px' }}>
                    3 entraron solos por el link
                  </div>
                </div>

                <div style={{ padding: '6px 4px 4px' }}>
                  {AGENDA_HERO.map((t) => (
                    <div
                      key={t.hora}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '11px',
                        padding: '11px 8px',
                        borderRadius: '14px',
                        background: t.destacado ? 'var(--brand-50)' : undefined,
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
                        {t.hora}
                      </span>
                      <span
                        aria-hidden
                        style={{
                          width: '4px',
                          height: '30px',
                          borderRadius: '999px',
                          background: t.tono === 'warm' ? 'var(--warm)' : 'var(--brand-solid)',
                          flex: 'none',
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
                          {t.quien}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '11.5px',
                            color: t.tono === 'warm' ? 'var(--warm-700)' : 'var(--ink-2)',
                            fontWeight: t.tono === 'warm' ? 600 : undefined,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {t.que}
                        </span>
                      </span>
                    </div>
                  ))}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      margin: '6px 8px 4px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: 'var(--warm-50)',
                      border: '1px dashed var(--warm)',
                    }}
                  >
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--warm-700)' }}>
                      11:00 libre
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--warm-700)' }}>
                      2 en espera
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Las cuatro cifras */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '60px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(50%, 210px), 1fr))',
            gap: '14px',
          }}
        >
          {ESTADISTICAS.map(([cifra, pie]) => (
            <div
              key={cifra}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--r-md)',
                padding: '22px 24px',
                boxShadow: 'var(--sh-1)',
              }}
            >
              <div
                style={{
                  ...titulo,
                  fontSize: '32px',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: 'var(--brand)',
                }}
              >
                {cifra}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--ink-2)',
                  marginTop: '7px',
                  lineHeight: 1.45,
                }}
              >
                {pie}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Las cuatro filas con foto */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '78px 26px 0' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 46px' }}>
          <h2
            style={{
              ...titulo,
              fontSize: 'clamp(30px, 4.2vw, 46px)',
              lineHeight: 1.08,
              margin: '0 0 14px',
            }}
          >
            Lo que tu recepción deja de hacer a mano
          </h2>
          <p style={{ fontSize: '17.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
            Cuatro cosas que cambian el día del local. Todas entran en cualquier plan.
          </p>
        </div>

        {FILAS.map((f, i) => (
          <div
            key={f.etiqueta}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
              gap: '44px',
              alignItems: 'center',
              marginBottom: i === FILAS.length - 1 ? 0 : '64px',
            }}
          >
            <div style={{ order: f.invertida ? 2 : undefined }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  aspectRatio: '4 / 3',
                  boxShadow: 'var(--sh-2)',
                  border: '1px solid var(--line-soft)',
                }}
              >
                <RanuraFoto descripcion={f.foto} />
              </div>
            </div>

            <div style={{ order: f.invertida ? 1 : undefined }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  padding: '6px 13px',
                  borderRadius: '999px',
                  color: f.tono === 'warm' ? 'var(--warm-700)' : 'var(--brand)',
                  background: f.tono === 'warm' ? 'var(--warm-50)' : 'var(--brand-50)',
                  border:
                    f.tono === 'warm' ? '1px solid var(--warm)' : '1px solid var(--brand-100)',
                }}
              >
                {f.etiqueta}
              </span>
              <h3
                style={{
                  ...titulo,
                  fontSize: 'clamp(24px, 2.8vw, 33px)',
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                  margin: '0 0 14px',
                }}
              >
                {f.titulo}
              </h3>
              <p style={{ fontSize: '16.5px', lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }}>
                {f.texto[0]}
                <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>{f.texto[1]}</strong>
                {f.texto[2]}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Recall */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '78px 26px 0' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--line-soft)',
            borderRadius: 'var(--r-xl)',
            padding: '46px 34px',
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
              Recall
            </span>
            <h2
              style={{
                ...titulo,
                fontSize: 'clamp(26px, 3.4vw, 40px)',
                lineHeight: 1.1,
                margin: '0 0 14px',
              }}
            >
              La plata que ya está en tu base de datos
            </h2>
            <p
              style={{
                fontSize: '16.5px',
                lineHeight: 1.65,
                color: 'var(--ink-2)',
                margin: '0 0 24px',
              }}
            >
              El sistema te arma la lista de clientes que no vuelven hace 3, 6 o 12
              meses, con un botón para escribirles. El mensaje sale listo y abre
              WhatsApp:{' '}
              <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>
                sin costo por mensaje
              </strong>
              .
            </p>
            <Link href="/funciones" className="cta-solido">
              Ver todas las funciones
            </Link>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-soft)',
              borderRadius: 'var(--r-lg)',
              padding: '22px 24px',
              boxShadow: 'var(--sh-2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                }}
              >
                Sin volver hace 6 meses
              </span>
              <span style={{ ...titulo, fontSize: '22px', color: 'var(--brand)' }}>38</span>
            </div>

            {RECALL.map(([quien, detalle]) => (
              <div
                key={quien}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '13px 0',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 600 }}>
                    {quien}
                  </span>
                  <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-2)' }}>
                    {detalle}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: 'var(--brand)',
                    background: 'var(--brand-50)',
                    border: '1px solid var(--brand-100)',
                    padding: '6px 13px',
                    borderRadius: '999px',
                    flex: 'none',
                  }}
                >
                  Escribir
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Los nueve rubros */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '78px 26px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2
            style={{
              ...titulo,
              fontSize: 'clamp(26px, 3.4vw, 40px)',
              lineHeight: 1.1,
              margin: '0 0 12px',
            }}
          >
            Pensado para nueve rubros
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'var(--ink-2)',
              margin: '0 auto',
              maxWidth: '58ch',
            }}
          >
            La base es la misma. Lo que cambia es la ficha del cliente y el catálogo de
            servicios, y eso lo configuramos con vos.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {RUBROS.map((r) => (
            <Link key={r.slug} href={`/rubros/${r.slug}`} className="pastilla-rubro">
              {ETIQUETA_PORTADA[r.slug] ?? r.nombre}
            </Link>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section style={{ padding: '78px 26px 0' }}>
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            borderRadius: 'var(--r-xl)',
            background: 'var(--brand-solid)',
            color: '#fff',
            padding: '64px 38px',
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
          <div style={{ position: 'relative', maxWidth: '680px', margin: '0 auto' }}>
            <h2
              style={{
                ...titulo,
                fontSize: 'clamp(30px, 4.6vw, 52px)',
                lineHeight: 1.06,
                margin: '0 0 18px',
              }}
            >
              ¿Qué esperás? Cargá tus servicios hoy
            </h2>
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                margin: '0 0 32px',
                color: 'rgba(255,255,255,.9)',
              }}
            >
              14 días completos, sin tarjeta. Te damos de alta el local, cargamos tu
              catálogo y te dejamos la agenda funcionando. Mañana ya tomás turnos desde
              el link.
            </p>
            <div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Link href="/alta" className="cta-blanco">
                Crear mi cuenta de prueba
              </Link>
              <a href={WA} className="cta-linea" target="_blank" rel="noreferrer">
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
