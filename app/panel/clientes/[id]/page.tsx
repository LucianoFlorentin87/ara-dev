import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { iniciales } from '@/lib/menu'
import { horaDe, guaranies, ahoraMs, ZONA } from '@/lib/tiempo'
import { RegistrarCobro } from './cobro'

type CampoFicha = {
  clave: string
  label: string
  tipo: string
  opciones?: string[]
}

const panel = {
  background: 'var(--surface)',
  border: '1px solid var(--line-soft)',
  borderRadius: '20px',
  padding: '18px 20px',
  boxShadow: 'var(--sh-1)',
} as const

const tituloPanel = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 600,
  fontSize: '14.5px',
  letterSpacing: '-0.01em',
  margin: '0 0 8px',
} as const

/** 0981234567 → 595981234567, que es lo que espera wa.me. */
function paraWhatsApp(celular: string | null): string | null {
  if (!celular) return null
  const solo = celular.replace(/\D/g, '')
  if (!solo) return null
  return solo.startsWith('595') ? solo : '595' + solo.replace(/^0/, '')
}

function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es-PY', {
    timeZone: ZONA,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

export default async function Ficha({
  params,
  searchParams,
}: PageProps<'/panel/clientes/[id]'>) {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const { id } = await params
  const tab = (await searchParams).tab
  const solapa = tab === 'historial' || tab === 'cobros' ? tab : 'resumen'

  const supabase = await crearClienteServidor()

  const [
    { data: cliente },
    { data: ficha },
    { data: local },
    { data: turnos },
    { data: cobros },
  ] = await Promise.all([
    supabase
      .from('clientes')
      .select(
        'id, nombre, apellido, celular, email, notas, origen, primera_visita, ultima_visita, profesionales(nombre_publico)'
      )
      .eq('id', id)
      .maybeSingle(),
    // Recepción y caja no pasan esta política: para ellos `ficha` es null y
    // el panel técnico no se dibuja. Es la regla, no un error.
    supabase.from('fichas').select('datos').eq('cliente_id', id).maybeSingle(),
    supabase.from('locales').select('config, rubro').eq('id', sesion.localId).maybeSingle(),
    supabase
      .from('turnos')
      .select('id, inicio, fin, estado, precio_congelado, servicios(nombre), profesionales(nombre_publico)')
      .eq('cliente_id', id)
      .order('inicio', { ascending: false }),
    supabase
      .from('cobros')
      .select('id, monto, medio, concepto, anulado, created_at')
      .eq('cliente_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!cliente) notFound()

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const nombre = [cliente.nombre, cliente.apellido].filter(Boolean).join(' ')
  const habitual = uno(cliente.profesionales) as { nombre_publico: string } | null
  const wa = paraWhatsApp(cliente.celular)

  const campos = ((local?.config as { campos_ficha?: CampoFicha[] })?.campos_ficha ??
    []) as CampoFicha[]
  const datos = (ficha?.datos ?? {}) as Record<string, unknown>

  const ahora = ahoraMs()
  const todos = turnos ?? []
  const terminados = todos.filter((t) => t.estado === 'terminado')
  const ausencias = todos.filter((t) => t.estado === 'ausente').length
  const proximo = [...todos]
    .reverse()
    .find((t) => new Date(t.inicio).getTime() > ahora && t.estado !== 'cancelado')

  const cobrosValidos = (cobros ?? []).filter((c) => !c.anulado)
  const gasto = cobrosValidos.reduce((a, c) => a + Number(c.monto), 0)
  const visitas = terminados.length

  // Días promedio entre visitas: sirve para el recall.
  let frecuencia: string = '—'
  if (terminados.length >= 2) {
    const fechas = terminados
      .map((t) => new Date(t.inicio).getTime())
      .sort((a, b) => a - b)
    const saltos = fechas.slice(1).map((f, i) => (f - fechas[i]) / 86400000)
    frecuencia =
      Math.round(saltos.reduce((a, b) => a + b, 0) / saltos.length) + ' días'
  }

  const stats = [
    { label: 'Visitas', valor: String(visitas) },
    { label: 'Gasto acumulado', valor: guaranies(gasto) },
    {
      label: 'Ticket promedio',
      valor: visitas > 0 ? guaranies(gasto / visitas) : '—',
    },
    { label: 'Frecuencia', valor: frecuencia },
    { label: 'Ausencias', valor: String(ausencias) },
  ]

  const alergias = String(datos['alergias'] ?? '').trim()

  return (
    <div style={{ padding: '24px' }}>
      <Link
        href="/panel/clientes"
        style={{
          fontSize: '13px',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '14px',
        }}
      >
        ‹ Todos los clientes
      </Link>

      <div style={panel}>
        <div
          style={{
            display: 'flex',
            gap: '18px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '999px',
              background: 'var(--brand-solid)',
              color: '#fff',
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '21px',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
            }}
          >
            {iniciales(nombre)}
          </span>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '25px',
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                {nombre}
              </h2>
              <span style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>
                {[cliente.celular, cliente.email].filter(Boolean).join(' · ') ||
                  'sin datos de contacto'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                marginTop: '10px',
              }}
            >
              {habitual && <span className="chip">Atiende {habitual.nombre_publico}</span>}
              {cliente.origen && <span className="chip">Llegó por {cliente.origen}</span>}
              {cliente.primera_visita && (
                <span className="chip">
                  Cliente desde {fechaCorta(cliente.primera_visita + 'T12:00:00Z')}
                </span>
              )}
              {alergias && (
                <span className="chip" data-tono="alerta">
                  Alergias: {alergias}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <RegistrarCobro
              clienteId={cliente.id}
              nombre={nombre}
              turnos={todos
                .filter((t) => t.estado !== 'cancelado')
                .slice(0, 12)
                .map((t) => {
                  const s = uno(t.servicios) as { nombre: string } | null
                  return {
                    id: t.id,
                    etiqueta: `${fechaCorta(t.inicio)} · ${s?.nombre ?? ''}`,
                    monto: Number(t.precio_congelado),
                  }
                })}
            />
            {wa && (
              <a
                className="boton-suave"
                style={{ textDecoration: 'none', display: 'inline-block' }}
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '2px',
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid var(--line-soft)',
          }}
        >
          {stats.map((f) => (
            <div key={f.label}>
              <div
                style={{
                  fontSize: '10.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  color: 'var(--ink-2)',
                }}
              >
                {f.label}
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
                {f.valor}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', margin: '18px 0' }}>
        {(
          [
            ['resumen', 'Resumen'],
            ['historial', 'Historial'],
            ['cobros', 'Cobros'],
          ] as const
        ).map(([clave, label]) => (
          <Link
            key={clave}
            className="pastilla"
            data-activo={solapa === clave}
            href={`/panel/clientes/${cliente.id}?tab=${clave}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {solapa === 'resumen' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          <div style={panel}>
            <h3 style={tituloPanel}>Ficha técnica · {local?.rubro ?? ''}</h3>
            {!ficha ? (
              <p
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'var(--ink-2)',
                  margin: 0,
                  paddingTop: '10px',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                Tu rol no tiene acceso a la ficha técnica.
              </p>
            ) : campos.length === 0 ? (
              <p
                style={{
                  fontSize: '13.5px',
                  color: 'var(--ink-2)',
                  margin: 0,
                  paddingTop: '10px',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                Este rubro todavía no tiene campos de ficha definidos.
              </p>
            ) : (
              campos.map((c) => (
                <div
                  key={c.clave}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '14px',
                    padding: '10px 0',
                    borderTop: '1px solid var(--line-soft)',
                    fontSize: '13.5px',
                  }}
                >
                  <span style={{ color: 'var(--ink-2)' }}>{c.label}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>
                    {datos[c.clave] !== undefined && datos[c.clave] !== ''
                      ? String(datos[c.clave])
                      : '—'}
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {alergias && (
              <div
                style={{
                  background: 'var(--warm-50)',
                  border: '1px solid var(--warm-700)',
                  borderRadius: '20px',
                  padding: '18px',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    margin: '0 0 6px',
                    color: 'var(--warm-700)',
                  }}
                >
                  Alerta clínica
                </h3>
                <div style={{ fontSize: '14px', lineHeight: 1.55 }}>
                  Alergias declaradas: {alergias}.
                </div>
              </div>
            )}

            <div style={panel}>
              <h3 style={tituloPanel}>Próximo turno</h3>
              {proximo ? (
                <>
                  <div
                    style={{
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 700,
                      fontSize: '18px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {fechaCorta(proximo.inicio)} {horaDe(proximo.inicio)} ·{' '}
                    {(uno(proximo.servicios) as { nombre: string } | null)?.nombre}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--ink-2)',
                      marginTop: '3px',
                    }}
                  >
                    Con{' '}
                    {
                      (uno(proximo.profesionales) as { nombre_publico: string } | null)
                        ?.nombre_publico
                    }{' '}
                    · {guaranies(Number(proximo.precio_congelado))}
                  </div>
                </>
              ) : (
                <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', margin: 0 }}>
                  No tiene turnos agendados.
                </p>
              )}
            </div>

            <div style={panel}>
              <h3 style={tituloPanel}>Preferencias</h3>
              <div
                style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink-2)' }}
              >
                {cliente.notas || 'Sin notas cargadas.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {solapa === 'historial' && (
        <div style={panel}>
          {todos.length === 0 ? (
            <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', margin: 0 }}>
              Todavía no tiene turnos.
            </p>
          ) : (
            <div
              style={{
                borderLeft: '2px solid var(--line)',
                paddingLeft: '20px',
                marginLeft: '5px',
              }}
            >
              {todos.map((t) => {
                const s = uno(t.servicios) as { nombre: string } | null
                const p = uno(t.profesionales) as { nombre_publico: string } | null
                return (
                  <div key={t.id} style={{ position: 'relative', padding: '0 0 20px' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '-26px',
                        top: '5px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '999px',
                        background:
                          t.estado === 'terminado'
                            ? 'var(--brand-solid)'
                            : t.estado === 'ausente'
                              ? 'var(--warm-solid)'
                              : 'var(--line)',
                        display: 'block',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '14px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
                        {s?.nombre} · {p?.nombre_publico}
                      </span>
                      <span
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--ink-2)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {fechaCorta(t.inicio)} {horaDe(t.inicio)} ·{' '}
                        {guaranies(Number(t.precio_congelado))}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                      {t.estado}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {solapa === 'cobros' && (
        <div style={panel}>
          {(cobros ?? []).length === 0 ? (
            <p style={{ fontSize: '13.5px', color: 'var(--ink-2)', margin: 0 }}>
              No hay cobros registrados. Si tu rol no ve ingresos, esta lista
              siempre se ve vacía.
            </p>
          ) : (
            (cobros ?? []).map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '14px',
                  padding: '10px 0',
                  borderTop: '1px solid var(--line-soft)',
                  fontSize: '13.5px',
                  opacity: c.anulado ? 0.55 : 1,
                }}
              >
                <span>
                  {c.concepto || 'Cobro'} · {c.medio}
                  {c.anulado ? ' · anulado' : ''}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    textDecoration: c.anulado ? 'line-through' : 'none',
                  }}
                >
                  {guaranies(Number(c.monto))}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
