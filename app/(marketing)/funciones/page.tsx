import Link from 'next/link'
import { FUNCIONES } from '@/lib/marketing'

export const metadata = {
  title: 'Funciones · Ára',
  description:
    'Nada se cobra por módulo y nada depende de un servicio externo que te facture aparte. Lo que ves acá está en los dos planes.',
}

const titulo = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.035em',
} as const

const NO_HACEMOS = [
  [
    'No cobramos por tus cobros',
    'No hay comisión sobre lo que facturás. El sistema registra el cobro, no lo procesa.',
  ],
  [
    'Todavía no hay facturación legal',
    'Emitimos comprobante interno en PDF. La factura la seguís haciendo por tu vía habitual.',
  ],
  [
    'Un local por cuenta',
    'Varias sedes desde un solo panel está en el camino, todavía sin fecha.',
  ],
] as const

export default function Funciones() {
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
            Todo en cualquier plan
          </span>
          <h1
            style={{
              ...titulo,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 1.04,
              margin: '0 0 18px',
            }}
          >
            Diez cosas que tu recepción deja de hacer a mano
          </h1>
          <p style={{ fontSize: '18.5px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
            Nada se cobra por módulo y nada depende de un servicio externo que te facture
            aparte. Lo que ves acá está en el plan Individual y en el plan Equipo.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 26px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '16px',
          }}
        >
          {FUNCIONES.map((f) => {
            const warm = f.tono === 'warm'
            return (
              <div key={f.n} className="tarjeta-mk" data-hover="true" style={{ padding: '26px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      background: warm ? 'var(--warm-50)' : 'var(--brand-50)',
                      border: warm ? '1px solid var(--warm)' : '1px solid var(--brand-100)',
                    }}
                  >
                    {/* El markup del icono sale del diseño y es estático: no hay
                        nada del usuario en esta cadena. */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={warm ? 'var(--warm-700)' : 'var(--brand)'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      dangerouslySetInnerHTML={{ __html: f.icono }}
                    />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 700,
                      fontSize: '13px',
                      color: 'var(--ink-2)',
                      letterSpacing: '.04em',
                    }}
                  >
                    {f.n}
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
                  {f.titulo}
                </h2>
                <p
                  style={{
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    color: 'var(--ink-2)',
                    margin: 0,
                    textWrap: 'pretty',
                  }}
                >
                  {f.texto}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '60px 26px 0' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--line-soft)',
            borderRadius: 'var(--r-xl)',
            padding: '42px 34px',
          }}
        >
          <h2
            style={{
              ...titulo,
              fontSize: 'clamp(26px, 3.4vw, 38px)',
              lineHeight: 1.1,
              margin: '0 0 12px',
            }}
          >
            Lo que no hacemos
          </h2>
          <p
            style={{
              fontSize: '16.5px',
              lineHeight: 1.65,
              color: 'var(--ink-2)',
              margin: '0 0 26px',
              maxWidth: '60ch',
            }}
          >
            Preferimos decirlo antes de que lo descubras probando.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '16px',
            }}
          >
            {NO_HACEMOS.map(([t, texto]) => (
              <div
                key={t}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: 'var(--r-md)',
                  padding: '22px',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '16.5px',
                    margin: '0 0 7px',
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
        </div>
      </section>

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
              Probalo con tus propios servicios
            </h2>
            <p
              style={{
                fontSize: '17.5px',
                lineHeight: 1.6,
                margin: '0 0 30px',
                color: 'rgba(255,255,255,.9)',
              }}
            >
              14 días completos, sin tarjeta. Te damos de alta el local y cargamos tu
              catálogo antes de que empieces.
            </p>
            <div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Link href="/precios" className="cta-blanco">
                Ver precios
              </Link>
              <Link href="/como-arranca" className="cta-linea">
                Cómo arranca
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
