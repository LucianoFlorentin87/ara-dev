import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { iniciales } from '@/lib/menu'
import {
  horaDe,
  guaranies,
  hoyISO,
  instanteDe,
  sumarDias,
  diaSemana,
  ahoraMs,
  ZONA,
} from '@/lib/tiempo'
import { Vista, Panel, Vacio, estiloTitulo } from '../ui'

/** Gs. 1.240.000 → "1,24 M", como el diseño. */
function compacto(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace('.', ',') + ' M'
  if (n >= 1_000) return Math.round(n / 1_000) + ' mil'
  return String(Math.round(n))
}

function Spark({ valores }: { valores: number[] }) {
  const max = Math.max(1, ...valores)
  return (
    <div
      style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '26px', marginTop: '13px' }}
      aria-hidden
    >
      {valores.map((v, i) => (
        <span
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(3, Math.round((v / max) * 26))}px`,
            borderRadius: '2px',
            background: i === valores.length - 1 ? 'var(--brand)' : 'var(--brand-100)',
          }}
        />
      ))}
    </div>
  )
}

function Kpi({
  label,
  valor,
  delta,
  bueno,
  nota,
  spark,
}: {
  label: string
  valor: string
  delta: string
  bueno: boolean
  nota: string
  spark: number[]
}) {
  return (
    <Panel>
      <div
        style={{
          fontSize: '10.5px',
          fontWeight: 700,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-2)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '27px',
            lineHeight: 1,
            letterSpacing: '-0.035em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {valor}
        </span>
        <span className="delta" data-bueno={bueno}>
          {delta}
        </span>
      </div>
      <Spark valores={spark} />
      <div style={{ fontSize: '11.5px', color: 'var(--ink-2)', marginTop: '8px' }}>
        {nota}
      </div>
    </Panel>
  )
}

export default async function Indicadores() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña ve los indicadores">
          <Vacio>Tu rol entra directo a su vista de trabajo.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const hoy = hoyISO()
  const manana = sumarDias(hoy, 1)
  const supabase = await crearClienteServidor()

  const [
    { data: turnos },
    { data: cobros },
    { data: clientes },
    { data: productos },
    { data: paquetes },
    { data: profesionales },
    { data: horarios },
  ] = await Promise.all([
    supabase
      .from('turnos')
      .select('id, inicio, fin, estado, origen, profesional_id, clientes(nombre, apellido), servicios(nombre), profesionales(nombre_publico)')
      .gte('inicio', instanteDe(sumarDias(hoy, -20), '00:00').toISOString())
      .lt('inicio', instanteDe(sumarDias(hoy, 2), '00:00').toISOString())
      .order('inicio'),
    supabase
      .from('cobros')
      .select('monto, anulado, created_at, turno_id')
      .gte('created_at', instanteDe(sumarDias(hoy, -20), '00:00').toISOString()),
    supabase.from('clientes').select('id, nombre, apellido, ultima_visita, fecha_nac'),
    supabase.from('productos').select('nombre, stock, stock_minimo').eq('activo', true),
    supabase
      .from('paquetes_clientes')
      .select('saldo_pendiente, vence_el, cerrado, clientes(nombre, apellido)')
      .eq('cerrado', false),
    supabase.from('profesionales').select('id, nombre_publico').eq('activo', true).order('orden'),
    supabase.from('horarios').select('hora_inicio, hora_fin, profesional_id').eq('dia_semana', diaSemana(hoy)),
  ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const ahora = ahoraMs()
  const todos = turnos ?? []
  const validos = (cobros ?? []).filter((c) => !c.anulado)

  const enDia = (iso: string, dia: string) =>
    new Date(iso).getTime() >= instanteDe(dia, '00:00').getTime() &&
    new Date(iso).getTime() < instanteDe(sumarDias(dia, 1), '00:00').getTime()

  const turnosDe = (dia: string) =>
    todos.filter((t) => enDia(t.inicio, dia) && t.estado !== 'cancelado')
  const ingresosDe = (dia: string) =>
    validos.filter((c) => enDia(c.created_at, dia)).reduce((a, c) => a + Number(c.monto), 0)

  const ultimos = (n: number) =>
    Array.from({ length: n }, (_, i) => sumarDias(hoy, -(n - 1 - i)))

  const deHoy = turnosDe(hoy)
  const online = deHoy.filter((t) => t.origen === 'online').length
  const semanaPasada = turnosDe(sumarDias(hoy, -7))

  const ingresosHoy = ingresosDe(hoy)
  const ingresosSemanaPasada = ingresosDe(sumarDias(hoy, -7))
  const variacion =
    ingresosSemanaPasada > 0
      ? Math.round(((ingresosHoy - ingresosSemanaPasada) / ingresosSemanaPasada) * 100)
      : null

  const ausenciasSemana = todos.filter(
    (t) =>
      t.estado === 'ausente' &&
      new Date(t.inicio).getTime() >= instanteDe(sumarDias(hoy, -6), '00:00').getTime()
  ).length
  const turnosSemana = todos.filter(
    (t) =>
      t.estado !== 'cancelado' &&
      new Date(t.inicio).getTime() >= instanteDe(sumarDias(hoy, -6), '00:00').getTime() &&
      new Date(t.inicio).getTime() < instanteDe(manana, '00:00').getTime()
  ).length

  const dormidos = (clientes ?? []).filter((c) => {
    if (!c.ultima_visita) return false
    const dias = Math.round(
      (new Date(hoy + 'T12:00:00Z').getTime() - new Date(c.ultima_visita + 'T12:00:00Z').getTime()) /
        86400000
    )
    return dias >= 45
  })

  const dias14 = ultimos(14)
  const ingresos14 = dias14.map(ingresosDe)
  const total14 = ingresos14.reduce((a, b) => a + b, 0)
  const maxBarra = Math.max(1, ...ingresos14)

  // --- Requiere atención: cada aviso sale de un dato, no de una lista fija ---
  const alertas: { titulo: string; detalle: string; tag: string; tono: string; href: string }[] = []

  // Turnos atendidos que todavía nadie cobró. Es el aviso más caro de
  // ignorar: es plata trabajada que no entró a la caja.
  const cobradosIds = new Set(validos.map((c) => c.turno_id).filter(Boolean))
  const sinCobrar = turnosDe(hoy).filter(
    (t) => t.estado === 'terminado' && !cobradosIds.has(t.id)
  )
  if (sinCobrar.length > 0) {
    alertas.push({
      titulo: `${sinCobrar.length} ${sinCobrar.length === 1 ? 'turno atendido' : 'turnos atendidos'} sin cobrar`,
      detalle: 'Están esperando en Caja, con el precio ya cargado',
      tag: 'Caja',
      tono: 'coral',
      href: '/panel/caja',
    })
  }

  const enMora = (paquetes ?? []).filter(
    (p) => Number(p.saldo_pendiente) > 0 && p.vence_el && p.vence_el < hoy
  )
  if (enMora.length > 0) {
    alertas.push({
      titulo: `${enMora.length} ${enMora.length === 1 ? 'cliente' : 'clientes'} en mora de paquete`,
      detalle: `Saldo vencido por ${guaranies(enMora.reduce((a, p) => a + Number(p.saldo_pendiente), 0))}`,
      tag: 'Cobros',
      tono: 'coral',
      href: '/panel/clientes',
    })
  }

  const bajos = (productos ?? []).filter((p) => Number(p.stock) <= Number(p.stock_minimo))
  if (bajos.length > 0) {
    alertas.push({
      titulo:
        bajos.length === 1
          ? `${bajos[0].nombre} por debajo del mínimo`
          : `${bajos.length} productos por debajo del mínimo`,
      detalle:
        bajos.length === 1
          ? `Quedan ${Number(bajos[0].stock)} · mínimo ${Number(bajos[0].stock_minimo)}`
          : bajos.slice(0, 3).map((p) => p.nombre).join(', '),
      tag: 'Stock',
      tono: 'coral',
      href: '/panel/stock',
    })
  }

  const sinConfirmarManana = turnosDe(manana).filter((t) => t.estado === 'pendiente')
  if (sinConfirmarManana.length > 0) {
    alertas.push({
      titulo: `${sinConfirmarManana.length} ${sinConfirmarManana.length === 1 ? 'turno' : 'turnos'} de mañana sin confirmar`,
      detalle: `Desde las ${horaDe(sinConfirmarManana[0].inicio)}`,
      tag: 'Agenda',
      tono: 'neutro',
      href: '/panel/comunicacion',
    })
  }

  const mmdd = hoy.slice(5)
  const cumples = (clientes ?? []).filter((c) => c.fecha_nac && c.fecha_nac.slice(5) === mmdd)
  for (const c of cumples.slice(0, 2)) {
    alertas.push({
      titulo: `Cumpleaños de ${[c.nombre, c.apellido].filter(Boolean).join(' ')}`,
      detalle: 'Hoy',
      tag: 'Marketing',
      tono: 'neutro',
      href: `/panel/clientes/${c.id}`,
    })
  }

  // --- Ocupación de hoy: minutos agendados sobre minutos disponibles ---
  const aMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5))
  const ventanaLocal = (horarios ?? []).filter((h) => !h.profesional_id)
  const minutosLocal = ventanaLocal.reduce((a, h) => a + (aMin(h.hora_fin) - aMin(h.hora_inicio)), 0)

  const ocupacion = (profesionales ?? []).map((p) => {
    const propio = (horarios ?? []).filter((h) => h.profesional_id === p.id)
    const disponibles =
      propio.length > 0
        ? propio.reduce((a, h) => a + (aMin(h.hora_fin) - aMin(h.hora_inicio)), 0)
        : minutosLocal
    const ocupados = deHoy
      .filter((t) => t.profesional_id === p.id)
      .reduce((a, t) => a + (new Date(t.fin).getTime() - new Date(t.inicio).getTime()) / 60000, 0)
    return {
      id: p.id,
      nombre: p.nombre_publico,
      pct: disponibles > 0 ? Math.round((ocupados / disponibles) * 100) : 0,
      nota:
        disponibles > 0
          ? `${Math.floor(ocupados / 60)} h ${String(Math.round(ocupados % 60)).padStart(2, '0')} de ${Math.floor(disponibles / 60)} h`
          : 'no trabaja hoy',
    }
  })

  const proximos = deHoy
    .filter((t) => new Date(t.fin).getTime() >= ahora)
    .slice(0, 6)

  const nombreDia = new Intl.DateTimeFormat('es-PY', { timeZone: ZONA, weekday: 'long' }).format(
    new Date(instanteDe(sumarDias(hoy, -7), '12:00'))
  )

  return (
    <div style={{ padding: '22px 24px 40px', minWidth: 0 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 215px), 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <Kpi
          label="Turnos hoy"
          valor={String(deHoy.length)}
          delta={`${deHoy.length - semanaPasada.length >= 0 ? '+' : ''}${deHoy.length - semanaPasada.length}`}
          bueno={deHoy.length >= semanaPasada.length}
          nota={online > 0 ? `${online} por reserva online` : 'ninguno por el link'}
          spark={ultimos(7).map((d) => turnosDe(d).length)}
        />
        <Kpi
          label="Ingresos del día"
          valor={compacto(ingresosHoy)}
          delta={variacion === null ? '—' : `${variacion >= 0 ? '+' : ''}${variacion}%`}
          bueno={(variacion ?? 0) >= 0}
          nota={`vs. ${nombreDia} pasado`}
          spark={ultimos(7).map(ingresosDe)}
        />
        <Kpi
          label="Ausencias"
          valor={String(ausenciasSemana)}
          delta={turnosSemana > 0 ? `${Math.round((ausenciasSemana / turnosSemana) * 100)}%` : '0%'}
          bueno={ausenciasSemana === 0}
          nota={`de ${turnosSemana} turnos de la semana`}
          spark={ultimos(7).map(
            (d) => todos.filter((t) => enDia(t.inicio, d) && t.estado === 'ausente').length
          )}
        />
        <Kpi
          label="Sin volver"
          valor={String(dormidos.length)}
          delta="45 d"
          bueno={dormidos.length === 0}
          nota="clientes listos para recall"
          spark={ultimos(7).map(() => dormidos.length)}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <Panel>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <h3 style={estiloTitulo}>Ingresos · últimos 14 días</h3>
            <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
              Total {guaranies(total14)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '130px',
              borderBottom: '1px solid var(--line-soft)',
              paddingBottom: '2px',
            }}
          >
            {ingresos14.map((v, i) => (
              <span
                key={dias14[i]}
                title={`${dias14[i]}: ${guaranies(v)}`}
                style={{
                  flex: 1,
                  height: `${Math.max(2, Math.round((v / maxBarra) * 128))}px`,
                  borderRadius: '4px 4px 0 0',
                  background: i === ingresos14.length - 1 ? 'var(--brand-solid)' : 'var(--brand-100)',
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--ink-2)',
              marginTop: '7px',
            }}
          >
            <span>{dias14[0].slice(8)}/{dias14[0].slice(5, 7)}</span>
            <span>{dias14[7].slice(8)}/{dias14[7].slice(5, 7)}</span>
            <span>hoy</span>
          </div>
        </Panel>

        <Panel titulo="Requiere atención">
          {alertas.length === 0 ? (
            <Vacio>Nada pendiente. Raro, pero pasa.</Vacio>
          ) : (
            alertas.map((a) => (
              <div
                key={a.titulo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '11px 0',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>
                    {a.titulo}
                  </span>
                  <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-2)' }}>
                    {a.detalle}
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: 'none' }}>
                  <span className="tag" data-tono={a.tono}>
                    {a.tag}
                  </span>
                  <Link href={a.href} className="boton-mini">
                    Resolver
                  </Link>
                </span>
              </div>
            ))
          )}
        </Panel>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '16px',
        }}
      >
        <Panel
          titulo="Próximos turnos"
          accion={
            <Link href="/panel/agenda" className="boton-mini">
              Ver agenda →
            </Link>
          }
        >
          {proximos.length === 0 ? (
            <Vacio>No queda nadie para hoy.</Vacio>
          ) : (
            proximos.map((t) => {
              const cli = uno(t.clientes) as { nombre: string; apellido: string | null } | null
              const srv = uno(t.servicios) as { nombre: string } | null
              const pro = uno(t.profesionales) as { nombre_publico: string } | null
              const nombre = [cli?.nombre, cli?.apellido].filter(Boolean).join(' ')
              const enCurso = t.estado === 'en_atencion'
              return (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '11px',
                    padding: '11px 0',
                    borderTop: '1px solid var(--line-soft)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      width: '42px',
                      flex: 'none',
                    }}
                  >
                    {horaDe(t.inicio)}
                  </span>
                  <span
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '999px',
                      background: enCurso ? 'var(--brand-solid)' : 'var(--neutral-solid)',
                      color: '#fff',
                      fontSize: '11px',
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
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {nombre}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        color: 'var(--ink-2)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {srv?.nombre} · {pro?.nombre_publico}
                    </span>
                  </span>
                  <span
                    className="tag"
                    data-tono={
                      enCurso ? 'tinta' : t.origen === 'online' ? 'coral' : 'neutro'
                    }
                  >
                    {enCurso
                      ? 'En atención'
                      : t.origen === 'online'
                        ? 'Online'
                        : t.estado === 'pendiente'
                          ? 'Sin confirmar'
                          : 'Confirmado'}
                  </span>
                </div>
              )
            })
          )}
        </Panel>

        <Panel titulo="Ocupación por profesional">
          {ocupacion.length === 0 ? (
            <Vacio>No hay profesionales activos.</Vacio>
          ) : (
            ocupacion.map((o) => (
              <div key={o.id} style={{ padding: '11px 0', borderTop: '1px solid var(--line-soft)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    fontSize: '13.5px',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{o.nombre}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                    {o.pct}%
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
                      width: `${Math.min(100, o.pct)}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: o.pct >= 85 ? 'var(--warm-solid)' : 'var(--brand)',
                    }}
                  />
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-2)', marginTop: '4px' }}>
                  {o.nota}
                </div>
              </div>
            ))
          )}
        </Panel>
      </div>
    </div>
  )
}
