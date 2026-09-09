'use client'

import { usePathname } from 'next/navigation'
import { itemDe } from '@/lib/menu'

export function TituloVista() {
  const ruta = usePathname()
  const vista = ruta.split('/')[2] ?? ''
  const label = itemDe(vista)?.label ?? 'Panel'

  return (
    <span
      style={{
        fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
        fontWeight: 700,
        fontSize: '15.5px',
        letterSpacing: '-0.02em',
        color: 'var(--ink)',
      }}
    >
      {label}
    </span>
  )
}
