import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { iniciales } from '@/lib/menu'

/**
 * El diseño no tiene lista: su vista "clientes" es directamente la ficha de
 * una persona. Pero el menú dice "Todos los clientes" y sin lista no hay
 * cómo llegar a una ficha, así que esto está compuesto con sus tokens.
 */
export default async function Clientes() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const supabase = await crearClienteServidor()
  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, nombre, apellido, celular, ultima_visita, profesionales(nombre_publico)')
    .order('nombre')
    .limit(200)

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line-soft)',
          borderRadius: '20px',
          boxShadow: 'var(--sh-1)',
          overflow: 'hidden',
        }}
      >
        {(clientes ?? []).length === 0 ? (
          <p
            style={{
              padding: '40px 32px',
              margin: 0,
              fontSize: '14.5px',
              color: 'var(--ink-2)',
            }}
          >
            Todavía no hay clientes cargados.
          </p>
        ) : (
          (clientes ?? []).map((c, i) => {
            const prof = uno(c.profesionales) as { nombre_publico: string } | null
            const nombre = [c.nombre, c.apellido].filter(Boolean).join(' ')
            return (
              <Link
                key={c.id}
                href={`/panel/clientes/${c.id}`}
                className="fila-cliente"
                style={{
                  borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)',
                }}
              >
                <span
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '999px',
                    background: 'var(--neutral-solid)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                  }}
                >
                  {iniciales(nombre)}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {nombre}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: 'var(--ink-2)',
                    }}
                  >
                    {c.celular ?? 'sin celular'}
                    {prof ? ` · atiende ${prof.nombre_publico}` : ''}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--ink-2)',
                    flex: 'none',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.ultima_visita
                    ? `última visita ${new Date(c.ultima_visita + 'T12:00:00Z').toLocaleDateString('es-PY')}`
                    : 'sin visitas'}
                </span>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
