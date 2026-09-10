import type { ReactNode } from 'react'

export function Contenedor({ children, ancho = 1120 }: { children: ReactNode; ancho?: number }) {
  return (
    <div style={{ maxWidth: `${ancho}px`, margin: '0 auto', padding: '0 22px' }}>
      {children}
    </div>
  )
}

export function Seccion({
  children,
  espacio = 56,
}: {
  children: ReactNode
  espacio?: number
}) {
  return <section style={{ padding: `${espacio}px 0` }}>{children}</section>
}

export function Titulo({
  children,
  tamano = 'clamp(28px, 4.4vw, 42px)',
  centrado,
}: {
  children: ReactNode
  tamano?: string
  centrado?: boolean
}) {
  return (
    <h2
      style={{
        fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
        fontWeight: 700,
        fontSize: tamano,
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
        margin: '0 0 14px',
        textAlign: centrado ? 'center' : 'left',
      }}
    >
      {children}
    </h2>
  )
}

export function Bajada({
  children,
  centrado,
}: {
  children: ReactNode
  centrado?: boolean
}) {
  return (
    <p
      style={{
        fontSize: '16.5px',
        lineHeight: 1.65,
        color: 'var(--ink-2)',
        margin: '0 0 26px',
        maxWidth: '62ch',
        textAlign: centrado ? 'center' : 'left',
        marginLeft: centrado ? 'auto' : undefined,
        marginRight: centrado ? 'auto' : undefined,
      }}
    >
      {children}
    </p>
  )
}

export function Tarjeta({
  children,
  tono,
}: {
  children: ReactNode
  tono?: 'brand' | 'warm'
}) {
  const fondo =
    tono === 'brand'
      ? { background: 'var(--brand-50)', border: '1px solid var(--brand-100)' }
      : tono === 'warm'
        ? { background: 'var(--warm-50)', border: '1px solid var(--line)' }
        : { background: 'var(--surface)', border: '1px solid var(--line-soft)' }

  return (
    <div
      style={{
        ...fondo,
        borderRadius: 'var(--r-lg)',
        padding: '22px 24px',
        boxShadow: 'var(--sh-1)',
      }}
    >
      {children}
    </div>
  )
}

export function Malla({
  children,
  min = 260,
}: {
  children: ReactNode
  min?: number
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`,
        gap: '16px',
        alignItems: 'start',
      }}
    >
      {children}
    </div>
  )
}

export function Pregunta({ p, r }: { p: string; r: string }) {
  return (
    <details
      style={{
        borderTop: '1px solid var(--line-soft)',
        padding: '16px 0',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '15.5px',
          listStyle: 'none',
        }}
      >
        {p}
      </summary>
      <p
        style={{
          fontSize: '14.5px',
          lineHeight: 1.65,
          color: 'var(--ink-2)',
          margin: '10px 0 0',
        }}
      >
        {r}
      </p>
    </details>
  )
}
