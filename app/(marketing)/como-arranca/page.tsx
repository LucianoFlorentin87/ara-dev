import { PASOS, FAQ_ARRANQUE } from '@/lib/marketing'
import { Contenedor, Seccion, Titulo, Bajada, Tarjeta, Pregunta } from '../piezas'

export const metadata = {
  title: 'Cómo arranca · Ára',
  description: 'Los cuatro pasos de la puesta en marcha, y qué hace falta tener a mano.',
}

export default function Arranque() {
  return (
    <Contenedor ancho={860}>
      <Seccion>
        <Titulo>Cómo arranca</Titulo>
        <Bajada>
          Cuatro pasos. Lo más largo es cargar tu catálogo, y eso se hace una
          sola vez.
        </Bajada>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PASOS.map((p) => (
            <Tarjeta key={p.n}>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '999px',
                    background: 'var(--brand-solid)',
                    color: '#fff',
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                  }}
                >
                  {p.n}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'baseline',
                      flexWrap: 'wrap',
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                        fontWeight: 700,
                        fontSize: '20px',
                        letterSpacing: '-0.025em',
                        margin: 0,
                      }}
                    >
                      {p.titulo}
                    </h2>
                    <span className="chip">{p.tiempo}</span>
                  </div>
                  <p
                    style={{
                      fontSize: '14.5px',
                      lineHeight: 1.62,
                      color: 'var(--ink-2)',
                      margin: '8px 0 0',
                    }}
                  >
                    {p.texto}
                  </p>
                  {Array.isArray(p.items) && p.items.length > 0 && (
                    <ul
                      style={{
                        margin: '10px 0 0',
                        padding: '0 0 0 18px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                      }}
                    >
                      {p.items.map((it: string) => (
                        <li key={it} style={{ marginBottom: '4px' }}>
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Tarjeta>
          ))}
        </div>
      </Seccion>

      <Seccion>
        <Titulo tamano="clamp(24px, 3.6vw, 32px)">Preguntas</Titulo>
        <div style={{ marginTop: '10px' }}>
          {FAQ_ARRANQUE.map((f) => (
            <Pregunta key={f.p} p={f.p} r={f.r} />
          ))}
        </div>
      </Seccion>
    </Contenedor>
  )
}
