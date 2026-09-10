import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { gruposVisibles, ETIQUETA_ROL, iniciales } from '@/lib/menu'
import { salir } from '@/app/login/acciones'
import { Navegacion } from './navegacion'
import { TituloVista } from './titulo'
import { BotonTema } from '../tema'

const RUBROS: Record<string, string> = {
  peluqueria: 'Peluquería',
  estetica: 'Estética',
  unas: 'Uñas',
  gimnasio: 'Gimnasio',
  odontologia: 'Odontología',
  kinesiologia: 'Kinesiología',
  nutricion: 'Nutrición',
  consultorio: 'Consultorio',
  tatuajes: 'Tatuajes',
}

export default async function PanelLayout({ children }: LayoutProps<'/panel'>) {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  // Solo la dueña puede leer la suscripción: para el resto la política no
  // deja pasar nada y el pie del menú simplemente no se dibuja.
  const supabase = await crearClienteServidor()
  const { data: suscripcion } = await supabase
    .from('suscripciones')
    .select('hasta, estado, planes(nombre)')
    .maybeSingle()

  const plan = suscripcion
    ? (Array.isArray(suscripcion.planes) ? suscripcion.planes[0] : suscripcion.planes)
    : null

  const zona = [RUBROS[sesion.local.rubro] ?? sesion.local.rubro]
  if (sesion.local.direccion) {
    const barrio = sesion.local.direccion.split(',')[1]?.trim()
    if (barrio) zona.push(barrio)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '250px minmax(0, 1fr)',
        minHeight: '100vh',
      }}
    >
      <aside
        style={{
          borderRight: '1px solid var(--line-soft)',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div
          style={{
            padding: '16px 18px 14px',
            borderBottom: '1px solid var(--line-soft)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '9px',
                background: 'var(--brand-solid)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.1"
                strokeLinecap="round"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M8 3v4M16 3v4M3 11h18" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                letterSpacing: '-0.025em',
              }}
            >
              Ára
            </span>
          </div>

          <div className="selector-local">
            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {sesion.local.nombre}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  color: 'var(--ink-2)',
                }}
              >
                {zona.join(' · ')}
              </span>
            </span>
          </div>
        </div>

        <Navegacion grupos={gruposVisibles(sesion.rol)} />

        {plan && (
          <div
            style={{
              borderTop: '1px solid var(--line-soft)',
              padding: '14px 18px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: 'var(--ink-2)',
              }}
            >
              Plan {plan.nombre}
            </div>
            <div
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-2)',
                marginTop: '3px',
              }}
            >
              {suscripcion?.hasta
                ? `Vence ${new Date(suscripcion.hasta).toLocaleDateString('es-PY')}`
                : 'Suscripción activa'}
            </div>
          </div>
        )}
      </aside>

      <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            borderBottom: '1px solid var(--line-soft)',
            padding: '11px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            position: 'sticky',
            top: 0,
            zIndex: 8,
            backdropFilter: 'blur(14px)',
            background: 'color-mix(in oklab, var(--bg) 84%, transparent)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '9px',
              minWidth: 0,
              fontSize: '12.5px',
              color: 'var(--ink-2)',
            }}
          >
            <span>{sesion.local.nombre}</span>
            <span>/</span>
            <TituloVista />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BotonTema />
            <form action={salir}>
              <button type="submit" className="boton-salir" title="Salir">
                <span
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '999px',
                    background: 'var(--brand-solid)',
                    color: '#fff',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {iniciales(sesion.nombre)}
                </span>
                <span
                  style={{
                    fontSize: '12.5px',
                    lineHeight: 1.2,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ display: 'block', fontWeight: 600 }}>
                    {sesion.nombre}
                  </span>
                  <span style={{ display: 'block', color: 'var(--ink-2)' }}>
                    {ETIQUETA_ROL[sesion.rol]}
                  </span>
                </span>
              </button>
            </form>
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
