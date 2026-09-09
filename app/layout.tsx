import type { Metadata } from 'next'
import { Outfit, Manrope } from 'next/font/google'
import './ara.css'
import './componentes.css'

// Outfit para títulos, Manrope para texto. Los dos con los pesos que usa el diseño.
const outfit = Outfit({
  variable: '--fuente-titulos',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const manrope = Manrope({
  variable: '--fuente-texto',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Ára',
  description: 'Gestión de turnos para peluquerías, estética, salud y bienestar.',
}

// El tema se lee antes de pintar: si se aplicara en un efecto, la pantalla
// arrancaría en claro y saltaría a oscuro.
const guionTema = `
try {
  var t = localStorage.getItem('ara:tema');
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.dataset.theme = 'dark';
  }
} catch (e) {}
`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: el script de arriba escribe data-theme antes
    // de que React hidrate, así que el HTML del servidor y el del cliente
    // difieren en ese atributo a propósito. Solo afecta a este nodo.
    <html
      lang="es"
      className={`${outfit.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: guionTema }} />
      </head>
      <body
        style={{
          background: 'var(--bg)',
          color: 'var(--ink)',
          fontFamily: 'var(--fuente-texto), Manrope, system-ui, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  )
}
