import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { guaranies, hoyISO, instanteDe, ZONA } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'

function mesDe(iso: string): string {
  return new Intl.DateTimeFormat('es-PY', {
    timeZone: ZONA,
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export default async function Informes() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña ve los informes">
          <Vacio>Son datos de todo el local.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const hoy = hoyISO()
  const desde = `${Number(hoy.slice(0, 4)) - 1}-${hoy.slice(5, 7)}-01`
  const supabase = await crearClienteServidor()

  const [{ data: turnos }, { data: cobros }] = await Promise.all([
    supabase
      .from('turnos')
      .select('inicio, estado, precio_congelado, servicios(nombre), clientes(nombre, apellido)')
      .gte('inicio', instanteDe(desde, '00:00').toISOString()),
    supabase
      .from('cobros')
      .select('monto, medio, anulado, created_at')
      .gte('created_at', instanteDe(desde, '00:00').toISOString()),
  ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const validos = (cobros ?? []).filter((c) => !c.anulado)

  // Por mes, tomando la clave del instante ya convertido a hora local.
  const claveMes = (iso: string) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: ZONA,
      year: 'numeric',
      month: '2-digit',
    }).format(new Date(iso))

  const meses = new Map<string, { ingresos: number; turnos: number }>()
  for (const c of validos) {
    const k = claveMes(c.created_at)
    const m = meses.get(k) ?? { ingresos: 0, turnos: 0 }
    meses.set(k, { ...m, ingresos: m.ingresos + Number(c.monto) })
  }
  for (const t of turnos ?? []) {
    if (t.estado === 'cancelado') continue
    const k = claveMes(t.inicio)
    const m = meses.get(k) ?? { ingresos: 0, turnos: 0 }
    meses.set(k, { ...m, turnos: m.turnos + 1 })
  }
  const filas = [...meses.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  const mayorIngreso = Math.max(1, ...filas.map(([, v]) => v.ingresos))

  // Servicios más pedidos.
  const porServicio = new Map<string, { veces: number; monto: number }>()
  for (const t of turnos ?? []) {
    if (t.estado === 'cancelado' || t.estado === 'ausente') continue
    const s = uno(t.servicios) as { nombre: string } | null
    if (!s) continue
    const v = porServicio.get(s.nombre) ?? { veces: 0, monto: 0 }
    porServicio.set(s.nombre, {
      veces: v.veces + 1,
      monto: v.monto + Number(t.precio_congelado),
    })
  }
  const ranking = [...porServicio.entries()]
    .sort((a, b) => b[1].monto - a[1].monto)
    .slice(0, 8)

  const porMedio = new Map<string, number>()
  for (const c of validos) {
    porMedio.set(c.medio, (porMedio.get(c.medio) ?? 0) + Number(c.monto))
  }

  return (
    <Vista>
      <Rejilla min={340}>
        <Panel titulo="Mes a mes" ayuda="Últimos doce meses">
          {filas.length === 0 ? (
            <Vacio>Todavía no hay movimiento para informar.</Vacio>
          ) : (
            filas.map(([k, v]) => (
              <div
                key={k}
                style={{ padding: '11px 0', borderTop: '1px solid var(--line-soft)' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13.5px',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {mesDe(k + '-15T12:00:00Z')}
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {guaranies(v.ingresos)}
                    <span style={{ color: 'var(--ink-2)', fontSize: '12px' }}>
                      {' '}
                      · {v.turnos} turnos
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: 'var(--surface-2)',
                    borderRadius: '999px',
                    marginTop: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(v.ingresos / mayorIngreso) * 100}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'var(--brand)',
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel titulo="Qué se pide más" ayuda="Por facturación del servicio">
            {ranking.length === 0 ? (
              <Vacio>Sin turnos suficientes.</Vacio>
            ) : (
              ranking.map(([nombre, v]) => (
                <Fila key={nombre}>
                  <span style={{ flex: 1, minWidth: '130px', fontWeight: 600 }}>
                    {nombre}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                    {v.veces} {v.veces === 1 ? 'vez' : 'veces'}
                  </span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {guaranies(v.monto)}
                  </span>
                </Fila>
              ))
            )}
          </Panel>

          <Panel titulo="Cómo pagan">
            {porMedio.size === 0 ? (
              <Vacio>Todavía no hay cobros.</Vacio>
            ) : (
              [...porMedio.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([medio, monto]) => (
                  <Fila key={medio}>
                    <span style={{ flex: 1, textTransform: 'capitalize' }}>{medio}</span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {guaranies(monto)}
                    </span>
                  </Fila>
                ))
            )}
          </Panel>
        </div>
      </Rejilla>

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        Los meses se agrupan por la hora de Asunción, no por UTC: si no, los
        cobros de la última noche de cada mes caerían en el mes siguiente.
      </p>
    </Vista>
  )
}
