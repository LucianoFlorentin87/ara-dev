import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './ara.css'
import './componentes.css'
import './_noche/noche.css'

// Outfit para títulos, Manrope para texto. Van como archivos locales
// (paquetes @fontsource-variable) y no desde Google Fonts: así el build no
// depende de que Google responda. Son las mismas fuentes, en versión
// variable, que cubren todos los pesos que usa el diseño.
const outfit = localFont({
  src: '../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2',
  variable: '--fuente-titulos',
  weight: '100 900',
  display: 'swap',
})

const manrope = localFont({
  src: '../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
  variable: '--fuente-texto',
  weight: '200 800',
  display: 'swap',
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
