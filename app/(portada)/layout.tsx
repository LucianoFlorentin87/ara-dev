import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './noche.css'
import { Flecha, Marca } from './iconos'

/**
 * Marco de la portada "noche". Va separado del layout de (marketing) porque
 * la portada es siempre oscura y tiene su propio encabezado flotante; las
 * demás páginas de marketing siguen con el diseño original.
 */

const NAV = [
  ['/rubros', 'Rubros'],
  ['/sistema', 'El sistema'],
  ['/funciones', 'Funciones'],
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

export default function PortadaLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className={`noche ${GeistSans.variable} ${GeistMono.variable}`}>
      <header className="n-cabecera">
        <div className="n-cont n-cabecera-fila">
          <Link href="/" className="n-logo" aria-label="Ára, inicio">
            <span className="n-logo-marca">
              <Marca />
            </span>
            ÁRA
          </Link>

          <nav className="n-grupo n-nav-escritorio" aria-label="Principal">
            {NAV.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="n-boton"
                data-tipo="vidrio"
                data-chico="true"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="n-grupo">
              <Link
                href="/alta"
                className="n-boton n-solo-escritorio"
                data-tipo="primario"
                data-chico="true"
              >
                Probar gratis <Flecha />
              </Link>
              <Link href="/login" className="n-boton" data-tipo="vidrio" data-chico="true">
                Ingresar
              </Link>
            </div>

            <details className="n-menu-movil">
              <summary
                className="n-boton"
                data-tipo="vidrio"
                data-chico="true"
                style={{ borderRadius: '4px' }}
              >
                Menú
              </summary>
              <div className="n-menu-movil-panel">
                {NAV.map(([href, label]) => (
                  <Link key={href} href={href}>
                    {label} <Flecha />
                  </Link>
                ))}
                <Link href="/como-arranca">
                  Cómo arranca <Flecha />
                </Link>
                <Link href="/alta">
                  Probar gratis <Flecha />
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="n-pie">
        <div className="n-cont">
          <div className="n-pie-malla">
            <div className="n-pie-col">
              <span className="n-logo" style={{ marginBottom: '6px' }}>
                <span className="n-logo-marca">
                  <Marca />
                </span>
                ÁRA
              </span>
              <span style={{ color: 'var(--n-ink-2)', fontWeight: 300, lineHeight: 1.6 }}>
                Gestión de turnos para locales de servicios. Asunción, Paraguay.
              </span>
            </div>

            {COLUMNAS.map((c) => (
              <div key={c.titulo} className="n-pie-col">
                <span className="n-rotulo" style={{ marginBottom: '4px' }}>
                  {c.titulo}
                </span>
                {c.enlaces.map(([href, label]) =>
                  href.startsWith('http') ? (
                    <a key={label} href={href} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  ) : (
                    <Link key={label} href={href}>
                      {label}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="n-pie-base">
            <span>© 2026 Ára</span>
            {/* Términos y privacidad todavía no tienen texto: en el diseño
                también son marcadores. */}
            <span style={{ display: 'flex', gap: '20px' }}>
              <a href="#">Términos</a>
              <a href="#">Privacidad</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
