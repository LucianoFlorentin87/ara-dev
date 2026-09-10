import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { horaDe, guaranies } from '@/lib/tiempo'
import { AbrirCaja } from './abrir'
import { Arqueo } from './arqueo'

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

  const { data: cobros } = await supabase
    .from('cobros')
    .select('id, monto, medio, concepto, anulado, created_at, clientes(nombre, apellido)')
    .eq('caja_id', caja.id)
    .order('created_at')

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

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
                <span className="chip">{m.medio}</span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: '13.5px',
                    fontVariantNumeric: 'tabular-nums',
                    textDecoration: m.anulado ? 'line-through' : 'none',
                  }}
                >
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
