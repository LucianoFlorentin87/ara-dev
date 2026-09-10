import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { Vista, Panel, Fila, Vacio } from '../ui'

const EXPORTABLES = [
  ['clientes', 'Clientes', 'Nombre, contacto, origen y fechas de visita'],
  ['turnos', 'Turnos', 'Con su precio congelado y su estado'],
  ['cobros', 'Cobros', 'Incluye los anulados, con su motivo'],
  ['servicios', 'Servicios', 'El catálogo con precios y duraciones'],
  ['productos', 'Productos', 'Stock, mínimos y costos'],
] as const

export default async function Datos() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña exporta los datos">
          <Vacio>Es información de todo el local.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const { count } = await supabase
    .from('auditoria')
    .select('id', { count: 'exact', head: true })

  return (
    <Vista>
      <Panel
        titulo="Llevate tus datos"
        ayuda="CSV separado por punto y coma, que es lo que abre Excel en Paraguay"
      >
        {EXPORTABLES.map(([clave, titulo, ayuda]) => (
          <Fila key={clave}>
            <span style={{ flex: 1, minWidth: '180px' }}>
              <span style={{ display: 'block', fontWeight: 600, fontSize: '14px' }}>
                {titulo}
              </span>
              <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                {ayuda}
              </span>
            </span>
            <a className="pastilla" href={`/panel/datos/exportar?tabla=${clave}`}>
              Descargar
            </a>
          </Fila>
        ))}
      </Panel>

      <div style={{ height: '16px' }} />

      <Panel titulo="Auditoría" ayuda="Qué se tocó, quién y cuándo">
        <Fila>
          <span style={{ flex: 1 }}>Movimientos registrados</span>
          <span
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {count ?? 0}
          </span>
        </Fila>
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
          Se registran los cambios de precio, los permisos, los cobros, las
          fichas y los cierres de caja. Nadie puede editarla ni borrarla, ni
          siquiera vos: la política solo permite leer.
        </p>
      </Panel>

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        La exportación corre con tu sesión, no con una llave de administrador.
        Eso significa que cada quien se lleva exactamente lo que tiene permitido
        ver: si recepción exportara clientes, no saldría ninguna ficha.
      </p>
    </Vista>
  )
}
