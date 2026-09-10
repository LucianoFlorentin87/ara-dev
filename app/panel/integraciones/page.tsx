import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { Vista, Panel, Vacio } from '../ui'

export default async function Integraciones() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña ve las integraciones">
          <Vacio>Son ajustes del local.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const { data: local } = await supabase
    .from('locales')
    .select('telefono_wa, instagram, slug')
    .eq('id', sesion.localId)
    .maybeSingle()

  const piezas: [string, string, string][] = [
    [
      'WhatsApp',
      local?.telefono_wa
        ? `Andando · ${local.telefono_wa}`
        : 'Falta cargar el número',
      'Los recordatorios y los avisos de recall abren wa.me con el texto ya escrito. No hay proveedor de mensajería ni costo por mensaje, y nada sale sin que alguien lo lea antes.',
    ],
    [
      'Instagram',
      local?.instagram ? `Cargado · ${local.instagram}` : 'Sin cargar',
      'Se usa como dato de contacto en el portal. No hay publicación automática.',
    ],
    [
      'Reserva online',
      `Preparada · ara.com.py/${local?.slug}`,
      'Las funciones públicas ya están en la base y probadas. Falta construir el portal y contratar el dominio.',
    ],
    [
      'Archivos',
      'Bucket privado creado',
      'Radiografías, fotos de evolución y consentimientos. Se sirven con URL firmada y solo los ve quien atendió a esa persona.',
    ],
    [
      'Pagos',
      'Sin conectar',
      'No hay pasarela. Los cobros se registran a mano y la suscripción no se cobra sola.',
    ],
    [
      'Facturación legal',
      'Sin resolver',
      'Si entra la DNIT hacen falta timbrado, punto de expedición y numeración correlativa. Eso cambia la tabla de cobros y la pantalla de caja.',
    ],
  ]

  return (
    <Vista>
      <Panel titulo="Con qué se conecta Ára">
        {piezas.map(([nombre, estado, detalle]) => (
          <div
            key={nombre}
            style={{ padding: '13px 0', borderTop: '1px solid var(--line-soft)' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                alignItems: 'baseline',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '14px' }}>{nombre}</span>
              <span className="chip">{estado}</span>
            </div>
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-2)',
                margin: '4px 0 0',
                lineHeight: 1.55,
              }}
            >
              {detalle}
            </p>
          </div>
        ))}
      </Panel>

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        Ára no necesita cron, colas ni un proveedor de mensajería. Es una
        decisión de diseño, no una carencia: menos piezas que puedan fallar un
        lunes a la mañana.
      </p>
    </Vista>
  )
}
