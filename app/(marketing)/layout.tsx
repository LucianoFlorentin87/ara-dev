import Link from 'next/link'
import { BotonTema } from '../tema'

const NAV = [
  ['/rubros', 'Rubros'],
  ['/sistema', 'El sistema'],
  ['/funciones', 'Funciones'],
  ['/como-arranca', 'Cómo arranca'],
  ['/precios', 'Precios'],
] as const

// Pendiente del cliente: el WhatsApp real. Hoy es el marcador del diseño.
const WA = 'https://wa.me/595981000000'

const COLUMNAS = [
  {
    titulo: 'Producto',
    enlaces: [
      ['/funciones', 'Funciones'],
      ['/sistema', 'El sistema'],
      ['/precios', 'Precios'],
    ],
  },
  {
    titulo: 'Empezar',
    enlaces: [
      ['/como-arranca', 'Cómo arranca'],
      ['/rubros', 'Rubros'],
      [WA, 'WhatsApp'],
    ],
  },
  {
    titulo: 'Cuenta',
    enlaces: [
      ['/login', 'Iniciar sesión'],
      ['/alta', 'Probar gratis'],
    ],
  },
] as const

const rotulo = {
  fontSize: '11.5px',
  fontWeight: 700,
  letterSpacing: '.11em',
  textTransform: 'uppercase',
  color: 'var(--ink-2)',
  marginBottom: '3px',
} as const

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(16px)',
          background: 'color-mix(in oklab, var(--bg) 78%, transparent)',
          borderBottom: '1px solid var(--line-soft)',
        }}
      >
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            padding: '13px 26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
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
                width: '34px',
                height: '34px',
                borderRadius: '12px',
                background: 'var(--brand-solid)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--sh-2)',
              }}
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="16" rx="4" />
                <path d="M8 3v4M16 3v4M3 11h18" />
                <circle cx="12" cy="16" r="1.7" fill="#fff" stroke="none" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '21px',
                letterSpacing: '-0.02em',
              }}
            >
              Ára
            </span>
          </Link>

          <nav
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              fontSize: '14.5px',
              fontWeight: 500,
            }}
          >
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className="enlace-nav">
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BotonTema />
            <Link
              href="/alta"
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                textDecoration: 'none',
                color: '#fff',
                background: 'var(--brand-solid)',
                padding: '11px 22px',
                borderRadius: '999px',
                boxShadow: 'var(--sh-2)',
              }}
            >
              Probar gratis
            </Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer style={{ maxWidth: '1220px', margin: '0 auto', padding: '62px 26px 34px', width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(50%, 200px), 1fr))',
            gap: '30px',
            paddingBottom: '28px',
            borderBottom: '1px solid var(--line-soft)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  background: 'var(--brand-solid)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.3"
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
                  fontSize: '18px',
                  letterSpacing: '-0.02em',
                }}
              >
                Ára
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
              Gestión de turnos para locales de servicios. Asunción, Paraguay.
            </p>
          </div>

          {COLUMNAS.map((c) => (
            <div
              key={c.titulo}
              style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '14px' }}
            >
              <span style={rotulo}>{c.titulo}</span>
              {c.enlaces.map(([href, label]) =>
                href.startsWith('http') ? (
                  <a
                    key={label}
                    href={href}
                    className="enlace-nav"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                ) : (
                  <Link key={label} href={href} className="enlace-nav">
                    {label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            paddingTop: '20px',
            fontSize: '13px',
            color: 'var(--ink-2)',
          }}
        >
          <span>© 2026 Ára</span>
          {/* Términos y privacidad todavía no tienen texto: en el diseño
              también son marcadores. */}
          <span style={{ display: 'flex', gap: '20px' }}>
            <a href="#" className="enlace-nav">
              Términos
            </a>
            <a href="#" className="enlace-nav">
              Privacidad
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
