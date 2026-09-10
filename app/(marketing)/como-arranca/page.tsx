import Link from 'next/link'
import { PASOS, FAQ_ARRANQUE } from '@/lib/marketing'
import { RanuraFoto } from '../ranura-foto'

export const metadata = {
  title: 'Cómo arranca · Ára',
  description:
    'No te dejamos una cuenta vacía con un tutorial: configuramos con vos el rubro, los servicios, los precios, los horarios y el equipo.',
}

// Pendiente del cliente: el WhatsApp real. Hoy es el marcador del diseño.
const WA = 'https://wa.me/595981000000'

const titulo = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.035em',
} as const

const NECESITAS = [
  'Una computadora o tablet en el mostrador',
  'Internet, aunque sea el del celular',
  'Un WhatsApp del local para los recordatorios',
  'Tu lista de clientes, si la tenés en una planilla',
]

function Tilde({ tamano = 17 }: { tamano?: number }) {
  return (
    <svg
      width={tamano}
      height={tamano}
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
  )
}

export default function ComoArranca() {
  return (
    <>
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '52px 26px 0' }}>
        <div style={{ maxWidth: '800px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--brand)',
              background: 'var(--brand-50)',
              border: '1px solid var(--brand-100)',
              padding: '7px 14px',
              borderRadius: '999px',
              marginBottom: '22px',
            }}
          >
            Puesta en marcha
          </span>
          <h1
            style={{
              ...titulo,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 1.04,
              margin: '0 0 18px',
            }}
          >
            De la llamada a los turnos entrando solos
          </h1>
          <p style={{ fontSize: '18.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
            No te dejamos una cuenta vacía con un tutorial.{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>
              Lo configuramos con vos
            </strong>
            : rubro, servicios, precios, horarios y equipo. Vos empezás con el sistema ya
            cargado.
          </p>
        </div>
      </section>

      {/* Los cuatro pasos */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '44px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '18px',
          }}
        >
          {PASOS.map((p) => (
            <div key={p.n} className="tarjeta-mk" data-hover="true" style={{ padding: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '18px',
                }}
              >
                <span
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '999px',
                    background: 'var(--brand-solid)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                  }}
                >
                  {p.n}
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--warm-700)',
                    background: 'var(--warm-50)',
                    border: '1px solid var(--warm)',
                    padding: '5px 12px',
                    borderRadius: '999px',
                  }}
                >
                  {p.tiempo}
                </span>
              </div>
              <h2
                style={{
                  ...titulo,
                  fontSize: '19.5px',
                  letterSpacing: '-0.025em',
                  margin: '0 0 8px',
                }}
              >
                {p.titulo}
              </h2>
              <p
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  color: 'var(--ink-2)',
                  margin: '0 0 14px',
                  textWrap: 'pretty',
                }}
              >
                {p.texto}
              </p>
              {p.items.map((it) => (
                <div
                  key={it}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '9px 0',
                    borderTop: '1px solid var(--line-soft)',
                  }}
                >
                  <Tilde tamano={15} />
                  <span style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink-2)' }}>
                    {it}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Lo que necesitás tener */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '62px 26px 0' }}>
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
              Lo que necesitás tener
            </span>
            <h2
              style={{
                ...titulo,
                fontSize: 'clamp(26px, 3.4vw, 38px)',
                lineHeight: 1.1,
                margin: '0 0 14px',
              }}
            >
              No hace falta comprar nada
            </h2>
            <p
              style={{
                fontSize: '16.5px',
                lineHeight: 1.65,
                color: 'var(--ink-2)',
                margin: '0 0 22px',
              }}
            >
              Se usa desde el navegador. Si tenés una computadora en el mostrador y los
              profesionales tienen celular, ya está.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {NECESITAS.map((x) => (
                <div key={x} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                  <Tilde />
                  <span style={{ fontSize: '15px', lineHeight: 1.55, color: 'var(--ink-2)' }}>
                    {x}
                  </span>
                </div>
              ))}
            </div>
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
            <RanuraFoto descripcion="Foto del mostrador o de la recepción" />
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '62px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '40px',
          }}
        >
          <div>
            <h2
              style={{
                ...titulo,
                fontSize: 'clamp(26px, 3.4vw, 38px)',
                lineHeight: 1.1,
                margin: '0 0 12px',
              }}
            >
              Preguntas frecuentes
            </h2>
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--ink-2)',
                margin: '0 0 20px',
              }}
            >
              Si te queda algo, escribinos y te contestamos en el día.
            </p>
            <a href={WA} className="cta-solido" target="_blank" rel="noreferrer">
              Escribir por WhatsApp
            </a>
          </div>

          <div>
            {FAQ_ARRANQUE.map((q) => (
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
              Arrancá esta semana
            </h2>
            <p
              style={{
                fontSize: '17.5px',
                lineHeight: 1.6,
                margin: '0 0 30px',
                color: 'rgba(255,255,255,.9)',
              }}
            >
              Una llamada de veinte minutos y el mismo día tenés el local cargado. 14 días
              de prueba, sin tarjeta.
            </p>
            <div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <a href={WA} className="cta-blanco" target="_blank" rel="noreferrer">
                Coordinar la llamada
              </a>
              <Link href="/precios" className="cta-linea">
                Ver precios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
