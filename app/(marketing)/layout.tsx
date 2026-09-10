import Link from 'next/link'

const NAV = [
  ['/rubros', 'Rubros'],
  ['/sistema', 'El sistema'],
  ['/funciones', 'Funciones'],
  ['/como-arranca', 'Cómo arranca'],
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
          borderBottom: '1px solid var(--line-soft)',
          backdropFilter: 'blur(14px)',
          background: 'color-mix(in oklab, var(--bg) 84%, transparent)',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '12px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              textDecoration: 'none',
              color: 'var(--ink)',
              flex: 'none',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '9px',
                background: 'var(--brand-solid)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" aria-hidden>
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M8 3v4M16 3v4M3 11h18" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '17px',
                letterSpacing: '-0.025em',
              }}
            >
              Ára
            </span>
          </Link>

          <nav
            style={{
              display: 'flex',
              gap: '18px',
              flex: 1,
              flexWrap: 'wrap',
              fontSize: '13.5px',
            }}
          >
            {NAV.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{ textDecoration: 'none', color: 'var(--ink-2)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link className="pastilla" data-activo={true} href="/login" style={{ flex: 'none' }}>
            Entrar
          </Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer
        style={{
          borderTop: '1px solid var(--line-soft)',
          padding: '28px 22px',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'flex',
            gap: '18px',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--ink-2)',
          }}
        >
          <span>Ára · gestión de turnos para Paraguay</span>
          <span style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} style={{ textDecoration: 'none', color: 'var(--ink-2)' }}>
                {label}
              </Link>
            ))}
          </span>
        </div>
      </footer>
    </div>
  )
}
