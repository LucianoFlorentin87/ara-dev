'use client'

import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react'
import Link from 'next/link'
import type { Rubro } from '@/lib/rubros'
import { Flecha } from './iconos'

/**
 * Los nueve rubros como pestañas. Cada pestaña muestra la agenda de ejemplo
 * y los campos de la ficha de ese rubro, sacados de lib/rubros.ts.
 * Flechas izquierda/derecha mueven entre pestañas (patrón ARIA de tabs).
 */
export function PestanasRubros({
  rubros,
  etiquetas,
}: {
  rubros: Rubro[]
  etiquetas: Record<string, string>
}) {
  const [activo, setActivo] = useState(0)
  const base = useId()
  const r = rubros[activo]

  function teclado(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const paso = e.key === 'ArrowRight' ? 1 : -1
    const siguiente = (activo + paso + rubros.length) % rubros.length
    setActivo(siguiente)
    document.getElementById(`${base}-tab-${siguiente}`)?.focus()
  }

  return (
    <div>
      <div className="n-pestanas" role="tablist" aria-label="Rubros" onKeyDown={teclado}>
        {rubros.map((x, i) => (
          <button
            key={x.slug}
            id={`${base}-tab-${i}`}
            type="button"
            role="tab"
            className="n-pestana"
            aria-selected={i === activo}
            aria-controls={`${base}-panel`}
            tabIndex={i === activo ? 0 : -1}
            onClick={() => setActivo(i)}
          >
            {etiquetas[x.slug] ?? x.nombre}
          </button>
        ))}
      </div>

      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${activo}`}
        className="n-rubro"
      >
        <div className="n-escena" style={{ '--x': '20%', '--y': '15%' } as CSSProperties}>
          {/* key: al cambiar de rubro la maqueta se monta de nuevo y repite la entrada */}
          <div className="n-ventana" key={r.slug}>
            <div className="n-ventana-cabeza">
              <span>{r.turnosHoy}</span>
              <span>{r.notaAgenda}</span>
            </div>
            {r.agenda.slice(0, 4).map((t, i) => (
              <div
                key={t.hora + t.cliente}
                className="n-fila n-entra"
                style={{ '--i': i } as CSSProperties}
              >
                <span className="n-hora">{t.hora}</span>
                <span className="n-barra" data-tono={t.online ? 'calido' : undefined} />
                <span className="n-fila-texto">
                  <b>{t.cliente}</b>
                  <span>{t.servicio}</span>
                </span>
                {t.online && (
                  <span className="n-chip" data-tono="calido">
                    Online
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="n-rubro-texto">
          <span className="n-ojo" style={{ marginBottom: 0 }}>
            {r.etiqueta}
          </span>
          <h3 className="n-rubro-titular">{r.titular}</h3>
          <p className="n-texto">{r.bajada}</p>
          <div>
            <div className="n-rotulo">En la ficha</div>
            <ul className="n-lista-ficha">
              {r.ficha.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="n-grupo" style={{ marginTop: 'auto' }}>
            <Link href={`/rubros/${r.slug}`} className="n-boton" data-tipo="primario">
              Ver {r.nombre} <Flecha />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
