import Link from 'next/link'
import { FAQ_PRECIOS } from '@/lib/marketing'

export const metadata = {
  title: 'Precios · Ára',
  description:
    'Empezás con la prueba y el plan se define después. Se puede cambiar cuando el equipo crece y dar de baja cuando quieras: no hay plazo mínimo.',
}

// Pendiente del cliente: el WhatsApp real y los precios de verdad. Gs. 150.000
// y Gs. 350.000 son los marcadores del diseño.
const WA = 'https://wa.me/595981000000'

const titulo = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.035em',
} as const

const PLAN_IND = [
  '1 usuario',
  'Agenda, clientes y reserva online',
  'Servicios, precios y cobros',
  'Recordatorios por WhatsApp',
  'Reportes básicos de ingresos',
]

const PLAN_EQ = [
  'Usuarios ilimitados con roles',
  'Todo lo del plan individual',
  'Caja con corte de efectivo',
  'Stock de productos e insumos',
  'Recall de clientes inactivos',
  'Reportes completos y export a CSV',
]

const COMUNES = [
  'Clientes y turnos ilimitados',
  'Portal del cliente incluido',
  'Actualizaciones incluidas',
  'Soporte por WhatsApp',
  'Configuración del local incluida',
  'Tus datos, siempre exportables',
]

const SIN = [
  [
    'Sin comisión por cobro',
    'No nos quedamos con un porcentaje de lo que facturás. El sistema registra el cobro, no lo procesa.',
  ],
  [
    'Sin costo por mensaje',
    'Los recordatorios abren tu WhatsApp con el texto listo, así que no hay proveedor de mensajería que te facture aparte.',
  ],
  [
    'Sin costo de instalación',
    'La configuración del local, la carga de tu catálogo y la importación de clientes están incluidas.',
  ],
] as const

function Tilde() {
  return (
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
  )
}

function Lista({ items, borde = 'var(--line-soft)' }: { items: string[]; borde?: string }) {
  return (
    <>
      {items.map((x) => (
        <div
          key={x}
          style={{
            display: 'flex',
            gap: '11px',
            padding: borde === 'var(--line)' ? '12px 0' : '11px 0',
            borderTop: `1px solid ${borde}`,
          }}
        >
          <Tilde />
          <span style={{ fontSize: '14.5px', lineHeight: 1.55, color: 'var(--ink-2)' }}>{x}</span>
        </div>
      ))}
    </>
  )
}

export default function Precios() {
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
            14 días gratis, sin tarjeta
          </span>
          <h1
            style={{
              ...titulo,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 1.04,
              margin: '0 0 18px',
            }}
          >
            Precios en guaraníes, sin contrato
          </h1>
          <p style={{ fontSize: '18.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
            Empezás con la prueba y el plan se define después. Se puede cambiar cuando el
            equipo crece y se puede dar de baja cuando quieras:{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>no hay plazo mínimo</strong>.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '18px',
            alignItems: 'start',
          }}
        >
          {/* Individual */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              padding: '30px',
              boxShadow: 'var(--sh-1)',
            }}
          >
            <h2 style={{ ...titulo, fontSize: '22px', letterSpacing: '-0.025em', margin: '0 0 5px' }}>
              Individual
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-2)', margin: '0 0 22px' }}>
              Un profesional trabajando solo
            </p>
            <div
              style={{
                ...titulo,
                fontSize: '40px',
                letterSpacing: '-0.035em',
                lineHeight: 1,
              }}
            >
              Gs. 150.000
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--ink-2)', marginBottom: '24px' }}>
              por mes · 1 usuario
            </div>
            <Link href="/alta" className="boton-plan">
              Probar gratis 14 días
            </Link>
            <Lista items={PLAN_IND} />
          </div>

          {/* Equipo */}
          <div
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--brand-solid)',
              borderRadius: 'var(--r-lg)',
              padding: '30px',
              boxShadow: 'var(--sh-3)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-13px',
                left: '26px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '.09em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'var(--brand-solid)',
                padding: '6px 13px',
                borderRadius: '999px',
              }}
            >
              Más elegido
            </span>
            <h2 style={{ ...titulo, fontSize: '22px', letterSpacing: '-0.025em', margin: '0 0 5px' }}>
              Equipo
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-2)', margin: '0 0 22px' }}>
              Varios profesionales, recepción y caja
            </p>
            <div
              style={{
                ...titulo,
                fontSize: '40px',
                letterSpacing: '-0.035em',
                lineHeight: 1,
              }}
            >
              Gs. 350.000
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--ink-2)', marginBottom: '24px' }}>
              por mes · usuarios ilimitados
            </div>
            <Link href="/alta" className="boton-plan" data-destacado="true">
              Probar gratis 14 días
            </Link>
            <Lista items={PLAN_EQ} />
          </div>

          {/* En los dos planes */}
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--line-soft)',
              borderRadius: 'var(--r-lg)',
              padding: '30px',
            }}
          >
            <h2 style={{ ...titulo, fontSize: '22px', letterSpacing: '-0.025em', margin: '0 0 5px' }}>
              En los dos planes
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-2)', margin: '0 0 16px' }}>
              Nada se cobra por módulo
            </p>
            <Lista items={COMUNES} borde="var(--line)" />
            <div
              style={{
                borderTop: '1px solid var(--line)',
                marginTop: '16px',
                paddingTop: '18px',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--ink-2)',
              }}
            >
              ¿Más de un local o un caso raro? Escribinos y lo vemos.
            </div>
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '12px',
                fontSize: '14.5px',
                fontWeight: 700,
                textDecoration: 'none',
                color: 'var(--brand)',
              }}
            >
              Hablar por WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* Los tres "sin" */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '62px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '16px',
          }}
        >
          {SIN.map(([t, texto]) => (
            <div
              key={t}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--r-md)',
                padding: '24px',
                boxShadow: 'var(--sh-1)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '17px',
                  margin: '0 0 8px',
                }}
              >
                {t}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
                {texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre el pago */}
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
              Sobre el pago
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
              Lo que más nos preguntan antes de arrancar.
            </p>
          </div>
          <div>
            {FAQ_PRECIOS.map((q) => (
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
              Probalo antes de pagar nada
            </h2>
            <p
              style={{
                fontSize: '17.5px',
                lineHeight: 1.6,
                margin: '0 0 30px',
                color: 'rgba(255,255,255,.9)',
              }}
            >
              14 días completos con tu propio catálogo cargado. Si no te sirve, no pagás y
              te llevás tus datos.
            </p>
            <div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Link href="/alta" className="cta-blanco">
                Crear mi cuenta de prueba
              </Link>
              <Link href="/panel" className="cta-linea">
                Ver la demo primero
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
