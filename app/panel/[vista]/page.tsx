import { notFound, redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { itemDe, puedeVer, ETIQUETA_ROL } from '@/lib/menu'

export default async function Vista({ params }: PageProps<'/panel/[vista]'>) {
  const { vista } = await params

  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const item = itemDe(vista)
  if (!item) notFound()

  // El menú no se la ofrece, pero la URL se puede escribir a mano.
  // Esto es cortesía, no seguridad: lo que protege los datos es RLS.
  if (!puedeVer(sesion.rol, vista)) {
    redirect('/panel')
  }

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line-soft)',
          borderRadius: 'var(--r-md)',
          boxShadow: 'var(--sh-1)',
          padding: '40px 32px',
          maxWidth: '560px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            letterSpacing: '-0.03em',
            margin: '0 0 8px',
          }}
        >
          {item.label}
        </h1>
        <p
          style={{
            fontSize: '14.5px',
            lineHeight: 1.6,
            color: 'var(--ink-2)',
            margin: 0,
          }}
        >
          Esta vista todavía no está construida. El diseño está en{' '}
          <code
            style={{
              fontSize: '13px',
              background: 'var(--surface-2)',
              padding: '1px 6px',
              borderRadius: '6px',
            }}
          >
            diseno/Panel v4.dc.html
          </code>
          .
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--ink-2)',
            margin: '18px 0 0',
            paddingTop: '16px',
            borderTop: '1px solid var(--line-soft)',
          }}
        >
          Entraste como <strong>{sesion.nombre}</strong> ·{' '}
          {ETIQUETA_ROL[sesion.rol]} · {sesion.local.nombre}
        </p>
      </div>
    </div>
  )
}
