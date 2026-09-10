'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Grupo } from '@/lib/menu'

export function Navegacion({
  grupos,
  contadores = {},
}: {
  grupos: Grupo[]
  contadores?: Record<string, number>
}) {
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
            const activo = ruta === href || ruta.startsWith(href + '/')
            const cuenta = contadores[it.vista] ?? 0
            return (
              <Link
                key={it.vista}
                href={href}
                className="item-menu"
                data-activo={activo}
                aria-current={activo ? 'page' : undefined}
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
                {cuenta > 0 && <span className="badge-menu">{cuenta}</span>}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
