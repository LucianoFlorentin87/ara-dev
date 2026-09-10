import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { guaranies } from '@/lib/tiempo'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'

const MODULOS: Record<string, string> = {
  caja: 'Caja y arqueo',
  stock: 'Stock de productos',
  recall: 'Recall de clientes',
  reportes: 'Informes',
}

export default async function Suscripcion() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña ve la suscripción">
          <Vacio>Es información de facturación del local.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const [{ data: suscripcion }, { data: usuarios }, { data: planes }] =
    await Promise.all([
      supabase
        .from('suscripciones')
        .select('desde, hasta, estado, ultimo_pago, planes(nombre, precio_mensual, max_usuarios, modulos)')
        .order('desde', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('usuarios').select('id').eq('activo', true),
      supabase.from('planes').select('id, nombre, precio_mensual, max_usuarios').eq('activo', true).order('precio_mensual'),
    ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const plan = uno(suscripcion?.planes ?? null) as
    | { nombre: string; precio_mensual: number; max_usuarios: number | null; modulos: Record<string, unknown> }
    | null

  if (!suscripcion || !plan) {
    return (
      <Vista>
        <Panel titulo="Sin suscripción cargada">
          <Vacio>Este local todavía no tiene un plan asociado.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const cuantos = (usuarios ?? []).length
  const modulos = plan.modulos ?? {}

  return (
    <Vista>
      <Rejilla min={330}>
        <Panel titulo="Tu plan">
          <div
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              letterSpacing: '-0.035em',
              lineHeight: 1,
              paddingTop: '12px',
              borderTop: '1px solid var(--line-soft)',
            }}
          >
            {plan.nombre}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-2)', marginTop: '6px' }}>
            {guaranies(Number(plan.precio_mensual))} por mes
          </div>

          <div style={{ marginTop: '14px' }}>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Estado</span>
              <span style={{ fontWeight: 600 }}>{suscripcion.estado}</span>
            </Fila>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Desde</span>
              <span style={{ fontWeight: 600 }}>
                {new Date(suscripcion.desde + 'T12:00:00Z').toLocaleDateString('es-PY')}
              </span>
            </Fila>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Último pago</span>
              <span style={{ fontWeight: 600 }}>
                {suscripcion.ultimo_pago
                  ? new Date(suscripcion.ultimo_pago + 'T12:00:00Z').toLocaleDateString('es-PY')
                  : '—'}
              </span>
            </Fila>
            <Fila>
              <span style={{ flex: 1, color: 'var(--ink-2)' }}>Usuarios</span>
              <span style={{ fontWeight: 600 }}>
                {cuantos}
                {plan.max_usuarios ? ` de ${plan.max_usuarios}` : ' · sin tope'}
              </span>
            </Fila>
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel titulo="Qué incluye tu plan">
            {Object.keys(MODULOS).map((m) => {
              const v = modulos[m]
              const tiene = v === true || (typeof v === 'string' && v !== 'ninguno')
              return (
                <Fila key={m} tenue={!tiene}>
                  <span style={{ flex: 1 }}>{MODULOS[m]}</span>
                  <span className="chip">
                    {tiene ? (typeof v === 'string' ? v : 'incluido') : 'no incluido'}
                  </span>
                </Fila>
              )
            })}
          </Panel>

          <Panel titulo="Los planes">
            {(planes ?? []).map((p) => (
              <Fila key={p.id} tenue={p.nombre !== plan.nombre}>
                <span style={{ flex: 1, fontWeight: 600 }}>{p.nombre}</span>
                <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                  {p.max_usuarios ? `hasta ${p.max_usuarios}` : 'sin tope'}
                </span>
                <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {guaranies(Number(p.precio_mensual))}
                </span>
              </Fila>
            ))}
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-2)',
                margin: '12px 0 0',
                paddingTop: '12px',
                borderTop: '1px solid var(--line-soft)',
                lineHeight: 1.55,
              }}
            >
              Estos precios son marcadores: el cliente todavía no los definió.
              No hay cobro automático ni pasarela de pago conectada.
            </p>
          </Panel>
        </div>
      </Rejilla>
    </Vista>
  )
}
