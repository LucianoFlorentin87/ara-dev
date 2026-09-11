import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { horaDe, guaranies, hoyISO, instanteDe, sumarDias } from '@/lib/tiempo'
import { AbrirCaja } from './abrir'
import { Arqueo } from './arqueo'
import { PanelPorCobrar, type PorCobrar } from './por-cobrar'

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

const MEDIOS: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  qr: 'QR',
  otro: 'Otro',
}

export default async function Caja() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno' && sesion.rol !== 'cajero') {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ ...panel, maxWidth: '460px' }}>
          <h2 style={tituloPanel}>Tu rol no ve la caja</h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-2)', margin: 0 }}>
            La caja la manejan la dueña y quien esté en caja.
          </p>
        </div>
      </div>
    )
  }

  const supabase = await crearClienteServidor()

  const { data: caja } = await supabase
    .from('cajas')
    .select('id, abierta_en, monto_inicial, usuarios!cajas_abierta_por_fkey(nombre)')
    .is('cerrada_en', null)
    .limit(1)
    .maybeSingle()

  if (!caja) {
    return (
      <div style={{ padding: '24px' }}>
        <AbrirCaja />
      </div>
    )
  }

  const hoy = hoyISO()

  const [{ data: cobros }, { data: terminados }] = await Promise.all([
    supabase
      .from('cobros')
      .select('id, monto, medio, concepto, anulado, created_at, clientes(nombre, apellido)')
      .eq('caja_id', caja.id)
      .order('created_at'),
    // Los turnos que ya se atendieron hoy. El que no tenga cobro va a la
    // lista de "Por cobrar": el precio ya lo puso la base al agendar, así
    // que nadie tiene que volver a escribirlo.
    supabase
      .from('turnos')
      .select(
        'id, inicio, precio_congelado, sena_pagada, clientes(nombre, apellido), servicios(nombre), profesionales(nombre_publico)'
      )
      .eq('estado', 'terminado')
      .gte('inicio', instanteDe(hoy, '00:00').toISOString())
      .lt('inicio', instanteDe(sumarDias(hoy, 1), '00:00').toISOString())
      .order('inicio'),
  ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  // Solo los cobros de esos turnos: preguntar por todos los cobros con
  // turno crece con el historial del local y acá no hace falta.
  const { data: cobrados } =
    (terminados ?? []).length > 0
      ? await supabase
          .from('cobros')
          .select('turno_id')
          .eq('anulado', false)
          .in('turno_id', (terminados ?? []).map((t) => t.id))
      : { data: [] as { turno_id: string | null }[] }

  const yaCobrados = new Set((cobrados ?? []).map((c) => c.turno_id))

  // El que ya pagó todo con la seña no debe nada: no va a la lista.
  const pendientes = (terminados ?? [])
    .filter((t) => !yaCobrados.has(t.id))
    .map((t) => ({ t, saldo: Number(t.precio_congelado) - Number(t.sena_pagada ?? 0) }))
    .filter(({ saldo }) => saldo > 0)

  const porCobrar: PorCobrar[] = pendientes.map(({ t, saldo }) => {
    const cli = uno(t.clientes) as { nombre: string; apellido: string | null } | null
    const srv = uno(t.servicios) as { nombre: string } | null
    const pro = uno(t.profesionales) as { nombre_publico: string } | null
    const sena = Number(t.sena_pagada ?? 0)
    return {
      id: t.id,
      hora: horaDe(t.inicio),
      cliente: [cli?.nombre, cli?.apellido].filter(Boolean).join(' '),
      servicio: srv?.nombre ?? 'Turno',
      profesional: pro?.nombre_publico ?? '',
      monto: guaranies(saldo),
      sena: sena > 0 ? guaranies(sena) : null,
    }
  })

  const totalPorCobrar = pendientes.reduce((a, { saldo }) => a + saldo, 0)

  const abrio = uno(caja.usuarios) as { nombre: string } | null
  const validos = (cobros ?? []).filter((c) => !c.anulado)
  const total = validos.reduce((a, c) => a + Number(c.monto), 0)
  const inicial = Number(caja.monto_inicial)

  const porMedio = Object.keys(MEDIOS)
    .map((m) => ({
      clave: m,
      nombre: MEDIOS[m],
      monto: validos
        .filter((c) => c.medio === m)
        .reduce((a, c) => a + Number(c.monto), 0),
    }))
    .filter((m) => m.monto > 0)

  const efectivo = porMedio.find((m) => m.clave === 'efectivo')?.monto ?? 0

  // Saldo corriente de efectivo, que es lo que se cuenta al cerrar. Se
  // recalcula desde el principio en cada fila en vez de arrastrar un
  // acumulador: son los cobros de un turno de caja, no un libro mayor.
  const efectivoHasta = (i: number) =>
    inicial +
    (cobros ?? [])
      .slice(0, i + 1)
      .filter((x) => !x.anulado && x.medio === 'efectivo')
      .reduce((a, x) => a + Number(x.monto), 0)

  const movimientos = (cobros ?? []).map((c, i) => {
    const cli = uno(c.clientes) as { nombre: string; apellido: string | null } | null
    return {
      id: c.id,
      hora: horaDe(c.created_at),
      concepto: c.concepto || 'Cobro',
      cliente: [cli?.nombre, cli?.apellido].filter(Boolean).join(' '),
      medio: MEDIOS[c.medio] ?? c.medio,
      monto: Number(c.monto),
      anulado: c.anulado,
      saldo: efectivoHasta(i),
    }
  })

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        <div style={panel}>
          <div style={{ marginBottom: '4px' }}>
            <div
              style={{
                fontSize: '10.5px',
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                color: 'var(--ink-2)',
              }}
            >
              Turno de caja
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '3px' }}>
              Abierta {horaDe(caja.abierta_en)}
              {abrio ? ` · ${abrio.nombre}` : ''} · inicial {guaranies(inicial)}
            </div>
          </div>

          {movimientos.length === 0 ? (
            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--ink-2)',
                margin: 0,
                paddingTop: '12px',
                borderTop: '1px solid var(--line-soft)',
              }}
            >
              Todavía no se registró ningún cobro en este turno.
            </p>
          ) : (
            movimientos.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 0',
                  borderTop: '1px solid var(--line-soft)',
                  flexWrap: 'wrap',
                  opacity: m.anulado ? 0.5 : 1,
                }}
              >
                <span
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--ink-2)',
                    fontVariantNumeric: 'tabular-nums',
                    width: '44px',
                    flex: 'none',
                  }}
                >
                  {m.hora}
                </span>
                <span style={{ flex: 1, minWidth: '150px' }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 600 }}>
                    {m.concepto}
                    {m.anulado ? ' · anulado' : ''}
                  </span>
                  <span
                    style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                  >
                    {m.cliente}
                  </span>
                </span>
                <span className="chip" data-tono={m.anulado ? 'alerta' : undefined}>
                  {m.medio}
                </span>
                <span
                  style={{
                    fontWeight: m.anulado ? 700 : 600,
                    fontSize: '13.5px',
                    fontVariantNumeric: 'tabular-nums',
                    textDecoration: m.anulado ? 'line-through' : 'none',
                    color: m.anulado ? 'var(--warm-700)' : undefined,
                    flex: 'none',
                    minWidth: '104px',
                    textAlign: 'right',
                  }}
                >
                  {m.anulado ? '− ' : '+ '}
                  {guaranies(m.monto)}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--ink-2)',
                    fontVariantNumeric: 'tabular-nums',
                    flex: 'none',
                    minWidth: '88px',
                    textAlign: 'right',
                  }}
                >
                  {guaranies(m.saldo)}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PanelPorCobrar turnos={porCobrar} total={guaranies(totalPorCobrar)} />

          <div style={panel}>
            <h3 style={tituloPanel}>Total del turno</h3>
            <div
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '32px',
                letterSpacing: '-0.035em',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {guaranies(total)}
            </div>
            <div
              style={{ fontSize: '12.5px', color: 'var(--ink-2)', marginTop: '4px' }}
            >
              {validos.length} {validos.length === 1 ? 'cobro' : 'cobros'}
              {validos.length > 0
                ? ` · ticket promedio ${guaranies(total / validos.length)}`
                : ''}
            </div>

            {porMedio.map((m) => (
              <div
                key={m.clave}
                style={{ padding: '11px 0', borderTop: '1px solid var(--line-soft)' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13.5px',
                  }}
                >
                  <span>{m.nombre}</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {guaranies(m.monto)}
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
                      width: `${total > 0 ? (m.monto / total) * 100 : 0}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'var(--brand)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Arqueo cajaId={caja.id} esperado={inicial + efectivo} />
        </div>
      </div>
    </div>
  )
}
