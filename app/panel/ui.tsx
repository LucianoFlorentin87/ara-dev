import type { CSSProperties, ReactNode } from 'react'

/** Piezas repetidas del panel, con los valores del diseño. */

export const estiloPanel: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--line-soft)',
  borderRadius: '20px',
  padding: '18px 20px',
  boxShadow: 'var(--sh-1)',
}

export const estiloTitulo: CSSProperties = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 600,
  fontSize: '14.5px',
  letterSpacing: '-0.01em',
  margin: '0 0 8px',
}

export function Panel({
  titulo,
  ayuda,
  accion,
  children,
  estilo,
}: {
  titulo?: string
  ayuda?: string
  accion?: ReactNode
  children: ReactNode
  estilo?: CSSProperties
}) {
  return (
    <div style={{ ...estiloPanel, ...estilo }}>
      {(titulo || accion) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: ayuda ? '2px' : '6px',
          }}
        >
          <div>
            {titulo && <h3 style={estiloTitulo}>{titulo}</h3>}
            {ayuda && (
              <div style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>{ayuda}</div>
            )}
          </div>
          {accion}
        </div>
      )}
      {children}
    </div>
  )
}

/** Una fila de lista con separador arriba, como en todas las vistas. */
export function Fila({
  children,
  tenue,
}: {
  children: ReactNode
  tenue?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 0',
        borderTop: '1px solid var(--line-soft)',
        flexWrap: 'wrap',
        fontSize: '13.5px',
        opacity: tenue ? 0.55 : 1,
      }}
    >
      {children}
    </div>
  )
}

export function Vacio({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: '13.5px',
        lineHeight: 1.55,
        color: 'var(--ink-2)',
        margin: 0,
        paddingTop: '12px',
        borderTop: '1px solid var(--line-soft)',
      }}
    >
      {children}
    </p>
  )
}

export function Estadistica({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: '10.5px',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          color: 'var(--ink-2)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
          fontWeight: 700,
          fontSize: '18px',
          marginTop: '3px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {valor}
      </div>
    </div>
  )
}

export function Rejilla({
  min = 330,
  children,
}: {
  min?: number
  children: ReactNode
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

/** Envoltorio de página: el padding que usan todas las vistas. */
export function Vista({ children }: { children: ReactNode }) {
  return <div style={{ padding: '24px' }}>{children}</div>
}
