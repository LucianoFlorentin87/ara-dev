import Link from 'next/link'
import { RUBROS } from '@/lib/rubros'
import { Contenedor, Seccion, Titulo, Bajada, Tarjeta, Malla } from '../piezas'

export const metadata = {
  title: 'Rubros · Ára',
  description: 'Cómo se usa Ára en cada rubro: qué guarda la ficha y cómo se agenda.',
}

export default function Rubros() {
  return (
    <Contenedor>
      <Seccion>
        <Titulo>Un sistema, nueve formas de trabajar</Titulo>
        <Bajada>
          La agenda, la ficha y la caja son las mismas. Lo que cambia es qué
          guarda cada ficha, cómo se reserva y qué se cobra.
        </Bajada>

        <Malla min={300}>
          {RUBROS.map((r) => (
            <Tarjeta key={r.slug}>
              <h2
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '21px',
                  letterSpacing: '-0.025em',
                  margin: '0 0 10px',
                }}
              >
                {r.nombre}
              </h2>
              <ul
                style={{
                  margin: '0 0 16px',
                  padding: '0 0 0 18px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--ink-2)',
                }}
              >
                {r.bullets.slice(0, 2).map((b) => (
                  <li key={b} style={{ marginBottom: '6px' }}>
                    {b}
                  </li>
                ))}
              </ul>
              <Link className="pastilla" href={`/rubros/${r.slug}`}>
                Ver {r.posesivo}
              </Link>
            </Tarjeta>
          ))}
        </Malla>
      </Seccion>
    </Contenedor>
  )
}
