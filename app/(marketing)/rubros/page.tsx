import Link from 'next/link'
import { RUBROS } from '@/lib/rubros'

export const metadata = {
  title: 'Rubros · Ára',
  description: 'Cómo se usa Ára en cada rubro: qué guarda la ficha y cómo se agenda.',
}

const h = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.035em',
} as const

export default function Rubros() {
  return (
    <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '40px 26px 0' }}>
      <div style={{ maxWidth: '720px', marginBottom: '34px' }}>
        <h1 style={{ ...h, fontSize: 'clamp(30px, 4.4vw, 46px)', margin: '0 0 12px' }}>
          Un sistema, nueve formas de trabajar
        </h1>
        <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
          La agenda, la ficha y la caja son las mismas. Lo que cambia es qué
          guarda cada ficha, cómo se reserva y qué se cobra.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '16px',
        }}
      >
        {RUBROS.map((r) => (
          <Link
            key={r.slug}
            href={`/rubros/${r.slug}`}
            className="tarjeta-mk"
            data-hover="true"
            style={{ textDecoration: 'none', color: 'var(--ink)', display: 'block' }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'var(--brand)',
                marginBottom: '10px',
              }}
            >
              {r.nombre}
            </div>
            <h2 style={{ ...h, fontSize: '22px', letterSpacing: '-0.028em', margin: '0 0 10px' }}>
              {r.titular}
            </h2>
            <p
              style={{
                fontSize: '14.5px',
                lineHeight: 1.6,
                color: 'var(--ink-2)',
                margin: '0 0 16px',
                textWrap: 'pretty',
              }}
            >
              {r.bajada}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {r.ficha.slice(0, 3).map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--ink-2)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line-soft)',
                    padding: '6px 12px',
                    borderRadius: '999px',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
