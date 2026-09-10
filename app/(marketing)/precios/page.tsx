import Link from 'next/link'
import { FAQ_PRECIOS } from '@/lib/marketing'
import { Contenedor, Seccion, Titulo, Bajada, Tarjeta, Malla, Pregunta } from '../piezas'

export const metadata = {
  title: 'Precios · Ára',
  description: 'Dos planes: Individual y Equipo. Todo incluido en los dos.',
}

const PLANES = [
  {
    nombre: 'Individual',
    precio: 'Gs. 150.000',
    para: 'Trabajás solo o sola',
    incluye: ['Un usuario', 'Agenda, fichas y clientes', 'Reserva online con tu link', 'Informes básicos'],
    destacado: false,
  },
  {
    nombre: 'Equipo',
    precio: 'Gs. 350.000',
    para: 'Tenés gente atendiendo',
    incluye: [
      'Usuarios sin tope',
      'Todo lo del plan Individual',
      'Caja con arqueo y cierre',
      'Stock de productos',
      'Recall de clientes',
      'Informes completos',
    ],
    destacado: true,
  },
]

const EN_LOS_DOS = [
  'Turnos sin doble reserva',
  'Ficha adaptada a tu rubro',
  'Reserva online para tus clientes',
  'Recordatorios por WhatsApp',
  'Tus datos exportables cuando quieras',
  'Sin costo por mensaje',
]

export default function Precios() {
  return (
    <Contenedor>
      <Seccion>
        <Titulo centrado>Dos planes</Titulo>
        <Bajada centrado>
          Por mes, sin permanencia. La diferencia es cuánta gente atiende, no
          cuántas funciones te dejan usar.
        </Bajada>

        <Malla min={300}>
          {PLANES.map((p) => (
            <Tarjeta key={p.nombre} tono={p.destacado ? 'brand' : undefined}>
              <div style={{ fontSize: '13px', color: 'var(--ink-2)', fontWeight: 600 }}>
                {p.para}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '26px',
                  letterSpacing: '-0.03em',
                  margin: '4px 0 2px',
                }}
              >
                {p.nombre}
              </h2>
              <div
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '34px',
                  letterSpacing: '-0.035em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {p.precio}
                <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink-2)' }}>
                  {' '}
                  por mes
                </span>
              </div>

              <div style={{ marginTop: '16px' }}>
                {p.incluye.map((i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      padding: '7px 0',
                      fontSize: '14.5px',
                    }}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--brand)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      style={{ flex: 'none', marginTop: '2px' }}
                      aria-hidden
                    >
                      <path d="m4 12.5 5 5L20 6.5" />
                    </svg>
                    {i}
                  </div>
                ))}
              </div>

              <Link
                href="/como-arranca"
                className="boton-primario"
                style={{ marginTop: '18px', display: 'block', textAlign: 'center', textDecoration: 'none' }}
              >
                Empezar
              </Link>
            </Tarjeta>
          ))}
        </Malla>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--ink-2)',
            textAlign: 'center',
            margin: '18px 0 0',
            lineHeight: 1.6,
          }}
        >
          Estos precios todavía no son definitivos: los define el cliente antes
          de salir a la venta.
        </p>
      </Seccion>

      <Seccion>
        <Titulo tamano="clamp(24px, 3.6vw, 32px)">En los dos planes</Titulo>
        <Malla min={230}>
          {EN_LOS_DOS.map((t) => (
            <Tarjeta key={t}>
              <p style={{ fontSize: '15px', margin: 0, lineHeight: 1.5 }}>{t}</p>
            </Tarjeta>
          ))}
        </Malla>
      </Seccion>

      <Seccion>
        <Titulo tamano="clamp(24px, 3.6vw, 32px)">Sobre el pago</Titulo>
        <div style={{ marginTop: '10px' }}>
          {FAQ_PRECIOS.map((f) => (
            <Pregunta key={f.p} p={f.p} r={f.r} />
          ))}
        </div>
      </Seccion>
    </Contenedor>
  )
}
