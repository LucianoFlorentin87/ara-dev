import Link from 'next/link'
import { BotonTema } from '../tema'

const NAV = [
  ['/rubros', 'Rubros'],
  ['/sistema', 'El sistema'],
  ['/funciones', 'Funciones'],
  ['/precios', 'Precios'],
] as const

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(14px)',
          background: 'color-mix(in oklab, var(--bg) 84%, transparent)',
        }}
      >
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            padding: '16px 26px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              textDecoration: 'none',
              color: 'var(--ink)',
              flex: 'none',
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
              flex: 1,
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 'none' }}>
            <BotonTema />
            <Link
              href="/como-arranca"
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

      <footer style={{ padding: '56px 26px 34px', marginTop: '20px' }}>
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            paddingTop: '26px',
            borderTop: '1px solid var(--line-soft)',
            display: 'flex',
            gap: '18px',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--ink-2)',
          }}
        >
          <span>Ára · gestión de turnos para Paraguay</span>
          <span style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className="enlace-nav">
                {label}
              </Link>
            ))}
            <Link href="/login" className="enlace-nav">
              Entrar
            </Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
