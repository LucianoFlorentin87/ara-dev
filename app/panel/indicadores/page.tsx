import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import {
  guaranies,
  hoyISO,
  instanteDe,
  sumarDias,
  ahoraMs,
} from '@/lib/tiempo'
import { Vista, Panel, Estadistica, Rejilla, Fila, Vacio } from '../ui'

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
  const primeroDelMes = hoy.slice(0, 8) + '01'
  const supabase = await crearClienteServidor()

  const [{ data: turnosMes }, { data: cobrosMes }, { data: clientes }, { data: profesionales }] =
    await Promise.all([
      supabase
        .from('turnos')
        .select('id, inicio, fin, estado, origen, precio_congelado, profesional_id')
        .gte('inicio', instanteDe(primeroDelMes, '00:00').toISOString())
        .lt('inicio', instanteDe(sumarDias(hoy, 1), '00:00').toISOString()),
      supabase
        .from('cobros')
        .select('monto, medio, anulado, created_at, profesional_id')
        .gte('created_at', instanteDe(primeroDelMes, '00:00').toISOString()),
      supabase.from('clientes').select('id, primera_visita'),
      supabase
        .from('profesionales')
        .select('id, nombre_publico, comision_servicios')
        .eq('activo', true)
        .order('orden'),
    ])

  const ahora = ahoraMs()
  const turnos = turnosMes ?? []
  const cobros = (cobrosMes ?? []).filter((c) => !c.anulado)

  const deHoy = turnos.filter(
    (t) =>
      new Date(t.inicio).getTime() >=
        instanteDe(hoy, '00:00').getTime() &&
      new Date(t.inicio).getTime() < instanteDe(sumarDias(hoy, 1), '00:00').getTime()
  )
  const vivosHoy = deHoy.filter(
    (t) => t.estado !== 'cancelado' && t.estado !== 'ausente'
  )

  const ingresos = cobros.reduce((a, c) => a + Number(c.monto), 0)
  const terminados = turnos.filter((t) => t.estado === 'terminado')
  const ausentes = turnos.filter((t) => t.estado === 'ausente')
  const online = turnos.filter((t) => t.origen === 'online')
  const nuevos = (clientes ?? []).filter(
    (c) => c.primera_visita && c.primera_visita >= primeroDelMes
  )

  const tasaAusencia =
    turnos.length > 0 ? Math.round((ausentes.length / turnos.length) * 100) : 0

  const produccion = (profesionales ?? []).map((p) => {
    const suyos = cobros.filter((c) => c.profesional_id === p.id)
    const monto = suyos.reduce((a, c) => a + Number(c.monto), 0)
    return {
      id: p.id,
      nombre: p.nombre_publico,
      monto,
      comision: (monto * Number(p.comision_servicios)) / 100,
      turnos: turnos.filter((t) => t.profesional_id === p.id).length,
    }
  })
  const mayor = Math.max(1, ...produccion.map((p) => p.monto))

  return (
    <Vista>
      <Panel titulo="Este mes" ayuda={`Del ${primeroDelMes.slice(8)} hasta hoy`}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2px',
            paddingTop: '14px',
            borderTop: '1px solid var(--line-soft)',
          }}
        >
          <Estadistica label="Ingresos" valor={guaranies(ingresos)} />
          <Estadistica
            label="Ticket promedio"
            valor={cobros.length > 0 ? guaranies(ingresos / cobros.length) : '—'}
          />
          <Estadistica label="Turnos" valor={String(turnos.length)} />
          <Estadistica label="Terminados" valor={String(terminados.length)} />
          <Estadistica label="Ausencias" valor={`${tasaAusencia}%`} />
          <Estadistica label="Clientes nuevos" valor={String(nuevos.length)} />
        </div>
      </Panel>

      <div style={{ height: '16px' }} />

      <Rejilla min={330}>
        <Panel
          titulo="Producción por profesional"
          ayuda="Cobros del mes y su comisión"
        >
          {produccion.length === 0 ? (
            <Vacio>No hay profesionales activos.</Vacio>
          ) : (
            produccion.map((p) => (
              <div
                key={p.id}
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
                  <span style={{ fontWeight: 600 }}>{p.nombre}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {guaranies(p.monto)}
                    <span style={{ color: 'var(--ink-2)', fontSize: '12px' }}>
                      {' '}
                      · comisión {guaranies(p.comision)}
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
                      width: `${(p.monto / mayor) * 100}%`,
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
          <Panel titulo="Hoy">
            <Fila>
              <span style={{ flex: 1 }}>Turnos en pie</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {vivosHoy.length}
              </span>
            </Fila>
            <Fila>
              <span style={{ flex: 1 }}>Ya terminados</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {deHoy.filter((t) => t.estado === 'terminado').length}
              </span>
            </Fila>
            <Fila>
              <span style={{ flex: 1 }}>Faltan por atender</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {vivosHoy.filter((t) => new Date(t.inicio).getTime() > ahora).length}
              </span>
            </Fila>
          </Panel>

          <Panel titulo="De dónde vienen los turnos" ayuda="En lo que va del mes">
            <Fila>
              <span style={{ flex: 1 }}>Por el link de reserva</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {online.length}
              </span>
            </Fila>
            <Fila>
              <span style={{ flex: 1 }}>Cargados por el equipo</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {turnos.length - online.length}
              </span>
            </Fila>
          </Panel>
        </div>
      </Rejilla>
    </Vista>
  )
}
