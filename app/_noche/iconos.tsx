/** Íconos de la portada. Trazos con currentColor: toman el color del texto. */
import type { ReactNode } from 'react'

type Props = { tamano?: number }

function Icono({
  tamano = 18,
  children,
  className,
}: Props & { children: ReactNode; className?: string }) {
  return (
    <svg
      className={className}
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

export function Marca({ tamano = 14 }: Props) {
  return (
    <Icono tamano={tamano}>
      <rect x="3" y="5" width="18" height="16" rx="4" />
      <path d="M8 3v4M16 3v4M3 11h18" />
      <circle cx="12" cy="16" r="1.7" fill="currentColor" stroke="none" />
    </Icono>
  )
}

export function Flecha() {
  return (
    <Icono tamano={12} className="n-flecha">
      <path d="M9 6l6 6-6 6" />
    </Icono>
  )
}

export function Tilde() {
  return (
    <Icono tamano={15}>
      <path d="m4 12.5 5 5L20 6.5" />
    </Icono>
  )
}

export function Mas() {
  return (
    <Icono tamano={12}>
      <path d="M12 5v14M5 12h14" />
    </Icono>
  )
}

/** Los seis de la grilla de beneficios. */
export const ICONOS = {
  porcentaje: (
    <Icono tamano={22}>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </Icono>
  ),
  mensaje: (
    <Icono tamano={22}>
      <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12Z" />
    </Icono>
  ),
  herramienta: (
    <Icono tamano={22}>
      <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5L13 5" />
      <path d="M3 21l6-6" />
    </Icono>
  ),
  pantalla: (
    <Icono tamano={22}>
      <rect x="2.5" y="4" width="13" height="10" rx="1.5" />
      <rect x="17" y="8" width="4.5" height="12" rx="1" />
      <path d="M6 18h6" />
    </Icono>
  ),
  billete: (
    <Icono tamano={22}>
      <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v5M18 9.5v5" />
    </Icono>
  ),
  descarga: (
    <Icono tamano={22}>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </Icono>
  ),
} as const
