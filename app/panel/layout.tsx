import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { gruposVisibles, ETIQUETA_ROL, iniciales } from '@/lib/menu'
import { horaDe, hoyISO, instanteDe, sumarDias, ahoraMs } from '@/lib/tiempo'
import { salir } from '@/app/login/acciones'
import { Navegacion } from './navegacion'
import { TituloVista } from './titulo'
import { BarraDia } from './barra-dia'
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

  const hoy = hoyISO()
  const manana = sumarDias(hoy, 1)
  const supabase = await crearClienteServidor()

  // Los contadores del menú y de la barra del día. Cada consulta pasa por
  // RLS: a quien no le corresponde ver algo, le vuelve vacío y el contador
  // no se dibuja. No hay que filtrarlos acá.
  const [
    { data: suscripcion },
    { data: caja },
    { data: turnosHoy },
    { data: turnosManana },
    { data: espera },
    { data: productos },
    { data: clientes },
  ] = await Promise.all([
    supabase.from('suscripciones').select('hasta, estado, planes(nombre)').maybeSingle(),
    supabase.from('cajas').select('abierta_en').is('cerrada_en', null).limit(1).maybeSingle(),
    supabase
      .from('turnos')
      .select('id, inicio, estado')
      .gte('inicio', instanteDe(hoy, '00:00').toISOString())
      .lt('inicio', instanteDe(manana, '00:00').toISOString())
      .not('estado', 'in', '(cancelado,ausente)'),
    supabase
      .from('turnos')
      .select('id')
      .gte('inicio', instanteDe(manana, '00:00').toISOString())
      .lt('inicio', instanteDe(sumarDias(manana, 1), '00:00').toISOString())
      .not('estado', 'in', '(cancelado,ausente)'),
    supabase.from('lista_espera').select('id').eq('resuelto', false),
    supabase.from('productos').select('stock, stock_minimo').eq('activo', true),
    supabase.from('clientes').select('ultima_visita').not('ultima_visita', 'is', null),
  ])

  const plan = suscripcion
    ? Array.isArray(suscripcion.planes)
      ? suscripcion.planes[0]
      : suscripcion.planes
    : null

  const ahora = ahoraMs()
  const deHoy = turnosHoy ?? []
  const enSala = deHoy.filter(
    (t) => t.estado !== 'en_atencion' && new Date(t.inicio).getTime() <= ahora
  ).length
  const atendiendo = deHoy.filter((t) => t.estado === 'en_atencion').length

  const bajos = (productos ?? []).filter(
    (p) => Number(p.stock) <= Number(p.stock_minimo)
  ).length
  const dormidos = (clientes ?? []).filter((c) => {
    const dias = Math.round(
      (new Date(hoy + 'T12:00:00Z').getTime() -
        new Date(c.ultima_visita + 'T12:00:00Z').getTime()) /
        86400000
    )
    return dias >= 45
  }).length

  // Turnos que ya se atendieron hoy y todavía nadie cobró. El precio lo
  // puso la base al agendar, así que el contador es exacto sin que nadie
  // cargue nada.
  //
  // La consulta de cobros va después y solo por los ids de hoy: preguntar
  // por todos los cobros con turno crece con el historial del local, y esto
  // corre en cada vista del panel. Si no terminó nada todavía, ni se pregunta.
  const terminadosHoy = deHoy.filter((t) => t.estado === 'terminado')
  let porCobrar = 0
  if (terminadosHoy.length > 0) {
    const { data: cobrados } = await supabase
      .from('cobros')
      .select('turno_id')
      .eq('anulado', false)
      .in('turno_id', terminadosHoy.map((t) => t.id))
    const yaCobrados = new Set((cobrados ?? []).map((c) => c.turno_id))
    porCobrar = terminadosHoy.filter((t) => !yaCobrados.has(t.id)).length
  }

  const contadores: Record<string, number> = {
    'lista-espera': (espera ?? []).length,
    'sala-espera': enSala + atendiendo,
    comunicacion: (turnosManana ?? []).length,
    stock: bajos,
    recall: dormidos,
    caja: porCobrar,
  }

  const zona = [RUBROS[sesion.local.rubro] ?? sesion.local.rubro]
  if (sesion.local.direccion) {
    const barrio = sesion.local.direccion.split(',')[1]?.trim()
    if (barrio) zona.push(barrio)
  }

  const puedeAgendar =
    sesion.rol === 'dueno' || sesion.rol === 'recepcion' || sesion.rol === 'profesional'

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
        <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--line-soft)' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}
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
              <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}>
                {zona.join(' · ')}
              </span>
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ink-2)"
              strokeWidth="2.2"
              strokeLinecap="round"
              style={{ flex: 'none' }}
              aria-hidden
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <Navegacion
          grupos={gruposVisibles(sesion.rol)}
          contadores={contadores}
          avisos={['stock', 'recall', 'caja']}
        />

        {plan && (
          <div style={{ borderTop: '1px solid var(--line-soft)', padding: '14px 18px' }}>
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
            <div style={{ fontSize: '12.5px', color: 'var(--ink-2)', marginTop: '3px' }}>
              {suscripcion?.hasta
                ? `Vence ${new Date(suscripcion.hasta + 'T12:00:00Z').toLocaleDateString('es-PY')} · `
                : ''}
              <Link href="/panel/suscripcion" style={{ textDecoration: 'none' }}>
                {suscripcion?.hasta ? 'renovar' : 'ver suscripción'}
              </Link>
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
            <label style={{ position: 'relative', display: 'block' }}>
              <span className="solo-lectores">Buscar</span>
              <input
                type="search"
                placeholder="Buscar cliente, turno o cobro"
                className="buscador-panel"
              />
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: 'var(--ink-2)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '1px 5px',
                }}
              >
                ⌘K
              </span>
            </label>

            <Link
              href="/panel/comunicacion"
              className="boton-icono"
              title={`${contadores.comunicacion} turnos mañana`}
              aria-label="Avisos"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M18 15v-4a6 6 0 1 0-12 0v4l-1.5 3h15z" />
                <path d="M10 21h4" />
              </svg>
              {contadores.comunicacion > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    minWidth: '17px',
                    height: '17px',
                    borderRadius: '999px',
                    background: 'var(--warm-solid)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    padding: '0 4px',
                  }}
                >
                  {contadores.comunicacion}
                </span>
              )}
            </Link>

            <BotonTema />

            {puedeAgendar && (
              <Link href="/panel/agenda?nuevo=1" className="boton-nuevo">
                + Nuevo turno
              </Link>
            )}

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
                <span style={{ fontSize: '12.5px', lineHeight: 1.2, textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: 600 }}>{sesion.nombre}</span>
                  <span style={{ display: 'block', color: 'var(--ink-2)' }}>
                    {ETIQUETA_ROL[sesion.rol]}
                  </span>
                </span>
              </button>
            </form>
          </div>
        </header>

        <BarraDia
          cajaAbierta={caja ? horaDe(caja.abierta_en) : null}
          turnosHoy={deHoy.length}
          enSala={enSala}
          porCobrar={porCobrar}
        />

        {children}
      </main>
    </div>
  )
}
