import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { guaranies, horaDe } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'
import { Movimiento } from './movimiento'

export default async function Stock() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno' && sesion.rol !== 'cajero') {
    return (
      <Vista>
        <Panel titulo="Tu rol no ve el stock">
          <Vacio>El stock lo manejan la dueña y quien esté en caja.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const [{ data: productos }, { data: movimientos }] = await Promise.all([
    supabase
      .from('productos')
      .select('id, nombre, categoria, tipo, stock, stock_minimo, costo, precio_venta, activo')
      .eq('activo', true)
      .order('nombre'),
    supabase
      .from('movimientos_stock')
      .select('id, cantidad, motivo, created_at, productos(nombre)')
      .order('created_at', { ascending: false })
      .limit(15),
  ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const bajos = (productos ?? []).filter(
    (p) => Number(p.stock) <= Number(p.stock_minimo)
  )

  return (
    <Vista>
      <Rejilla min={340}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel
            titulo="Stock"
            ayuda={
              bajos.length > 0
                ? `${bajos.length} ${bajos.length === 1 ? 'producto' : 'productos'} en el mínimo o por debajo`
                : 'Todo por encima del mínimo'
            }
          >
            {(productos ?? []).length === 0 ? (
              <Vacio>No hay productos cargados.</Vacio>
            ) : (
              (productos ?? []).map((p) => {
                const bajo = Number(p.stock) <= Number(p.stock_minimo)
                return (
                  <Fila key={p.id}>
                    <span style={{ flex: 1, minWidth: '150px' }}>
                      <span style={{ display: 'block', fontWeight: 600, fontSize: '14px' }}>
                        {p.nombre}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '11.5px',
                          color: 'var(--ink-2)',
                        }}
                      >
                        {p.categoria} · mínimo {Number(p.stock_minimo)}
                        {p.tipo === 'venta'
                          ? ` · se vende a ${guaranies(Number(p.precio_venta))}`
                          : ' · insumo'}
                      </span>
                    </span>
                    {bajo && (
                      <span className="chip" data-tono="alerta">
                        reponer
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                        fontWeight: 700,
                        fontSize: '17px',
                        fontVariantNumeric: 'tabular-nums',
                        minWidth: '54px',
                        textAlign: 'right',
                        color: bajo ? 'var(--warm-700)' : 'var(--ink)',
                      }}
                    >
                      {Number(p.stock)}
                    </span>
                  </Fila>
                )
              })
            )}
          </Panel>

          <Panel titulo="Últimos movimientos">
            {(movimientos ?? []).length === 0 ? (
              <Vacio>Todavía no se registró ningún movimiento.</Vacio>
            ) : (
              (movimientos ?? []).map((m) => {
                const prod = uno(m.productos) as { nombre: string } | null
                const entra = Number(m.cantidad) > 0
                return (
                  <Fila key={m.id}>
                    <span
                      style={{
                        fontSize: '12.5px',
                        color: 'var(--ink-2)',
                        fontVariantNumeric: 'tabular-nums',
                        width: '44px',
                        flex: 'none',
                      }}
                    >
                      {horaDe(m.created_at)}
                    </span>
                    <span style={{ flex: 1, minWidth: '140px' }}>
                      <span style={{ display: 'block', fontWeight: 600 }}>
                        {prod?.nombre}
                      </span>
                      <span
                        style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                      >
                        {m.motivo}
                      </span>
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: entra ? 'var(--brand)' : 'var(--warm-700)',
                      }}
                    >
                      {entra ? '+' : ''}
                      {Number(m.cantidad)}
                    </span>
                  </Fila>
                )
              })
            )}
          </Panel>
        </div>

        <Panel
          titulo="Mover stock"
          ayuda="El saldo lo recalcula la base, no esta pantalla"
        >
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--line-soft)' }}>
            <Movimiento
              productos={(productos ?? []).map((p) => ({ id: p.id, nombre: p.nombre }))}
            />
          </div>
        </Panel>
      </Rejilla>
    </Vista>
  )
}
