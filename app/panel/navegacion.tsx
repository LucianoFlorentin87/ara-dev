'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Grupo } from '@/lib/menu'

export function Navegacion({ grupos }: { grupos: Grupo[] }) {
  const ruta = usePathname()

  return (
    <nav style={{ padding: '6px 0 18px', overflowY: 'auto', flex: 1 }}>
      {grupos.map((g) => (
        <div key={g.titulo}>
          <div
            style={{
              padding: '15px 18px 6px',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'var(--ink-2)',
            }}
          >
            {g.titulo}
          </div>
          {g.items.map((it) => {
            const href = `/panel/${it.vista}`
            return (
              <Link
                key={it.vista}
                href={href}
                className="item-menu"
                data-activo={ruta === href}
                aria-current={ruta === href ? 'page' : undefined}
              >
                <span
                  style={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {it.label}
                </span>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
