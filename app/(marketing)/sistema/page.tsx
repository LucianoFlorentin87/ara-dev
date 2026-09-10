import Link from 'next/link'
import { RanuraFoto } from '../ranura-foto'

export const metadata = {
  title: 'El sistema · Ára',
  description:
    'No hay módulos que se compren aparte ni versiones distintas según el puesto. Todos entran al mismo sistema y cada uno ve lo que le corresponde.',
}

const titulo = {
  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
  fontWeight: 700,
  letterSpacing: '-0.035em',
} as const

const h2 = {
  ...titulo,
  fontSize: 'clamp(24px, 2.8vw, 33px)',
  lineHeight: 1.12,
  letterSpacing: '-0.03em',
  margin: '0 0 14px',
} as const

const parrafo = {
  fontSize: '16.5px',
  lineHeight: 1.65,
  color: 'var(--ink-2)',
  margin: '0 0 18px',
} as const

const dosColumnas = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
  gap: '44px',
  alignItems: 'center',
} as const

const rotulo = {
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  padding: '6px 13px',
  borderRadius: '999px',
  marginBottom: '16px',
} as const

const tarjetaLado = {
  background: 'var(--surface)',
  border: '1px solid var(--line-soft)',
  borderRadius: 'var(--r-lg)',
  boxShadow: 'var(--sh-2)',
  padding: '22px 24px',
  minWidth: 0,
} as const

const filaDato = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '12px 0',
  borderTop: '1px solid var(--line-soft)',
} as const

function Pildoras({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {items.map((x) => (
        <span key={x} className="pildora">
          {x}
        </span>
      ))}
    </div>
  )
}

const AGENDA = [
  { hora: '09:00', cliente: 'Marcos A.', servicio: 'Corte + barba · Diego', estado: 'Confirmado', tono: 'brand' },
  { hora: '10:30', cliente: 'Lucía B.', servicio: 'Color raíz · Sofía', estado: 'En atención', tono: 'brand' },
  { hora: '13:00', cliente: 'Rocío C.', servicio: 'Brushing · Sofía', estado: 'Por el link', tono: 'warm' },
  { hora: '15:30', cliente: 'Diego T.', servicio: 'Corte · Diego', estado: 'Pendiente', tono: 'neutro' },
] as const

const FICHA = [
  ['Última visita', '12/08 · Color raíz'],
  ['Profesional habitual', 'Sofía'],
  ['Frecuencia de raíz', 'Cada 6 semanas'],
] as const

const CAJA = [
  ['Efectivo', 'Gs. 1.920.000'],
  ['Tarjeta', 'Gs. 1.260.000'],
  ['Transferencia', 'Gs. 300.000'],
] as const

const ROLES = [
  ['Dueño', 'Todo: reportes, precios, usuarios, caja y configuración del local.'],
  ['Profesional', 'Su agenda, las fichas de sus clientes y su propia producción.'],
  ['Recepción', 'Turnos de todo el local, clientes y confirmaciones. Sin ver ingresos.'],
  ['Cajero', 'Cobros, apertura y cierre de caja, comprobantes del turno.'],
] as const

export default function Sistema() {
  return (
    <>
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '52px 26px 0' }}>
        <div style={{ maxWidth: '800px' }}>
          <span
            style={{
              ...rotulo,
              fontSize: '12px',
              color: 'var(--brand)',
              background: 'var(--brand-50)',
              border: '1px solid var(--brand-100)',
              padding: '7px 14px',
              marginBottom: '22px',
            }}
          >
            El sistema por dentro
          </span>
          <h1
            style={{
              ...titulo,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 1.04,
              margin: '0 0 18px',
            }}
          >
            Cuatro pantallas y todos usan la misma
          </h1>
          <p
            style={{
              fontSize: '18.5px',
              lineHeight: 1.6,
              color: 'var(--ink-2)',
              margin: '0 0 26px',
            }}
          >
            No hay módulos que se compren aparte ni versiones distintas según el puesto.
            Todos entran al mismo sistema y cada uno{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>
              ve lo que le corresponde
            </strong>
            .
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/panel" className="cta-solido">
              Entrar a la demo del panel
            </Link>
            <Link href="/studiokuna" className="cta-suave">
              Ver el portal del cliente
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '44px 26px 0' }}>
        <div
          style={{
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
            border: '1px solid var(--line-soft)',
            boxShadow: 'var(--sh-3)',
            aspectRatio: '16 / 8',
            position: 'relative',
          }}
        >
          <RanuraFoto descripcion="Captura del panel — o foto del mostrador con la pantalla" />
        </div>
      </section>

      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '68px 26px 0' }}>
        {/* Pantalla 1 · Agenda */}
        <div style={{ ...dosColumnas, marginBottom: '60px' }}>
          <div>
            <span
              style={{
                ...rotulo,
                color: 'var(--brand)',
                background: 'var(--brand-50)',
                border: '1px solid var(--brand-100)',
              }}
            >
              Pantalla 1 · Agenda
            </span>
            <h2 style={h2}>La pantalla donde se pasa el día</h2>
            <p style={parrafo}>
              Una columna por profesional, la duración real de cada servicio y los huecos
              libres a la vista. Arrastrás un turno para moverlo y el sistema revisa que
              el horario esté libre antes de soltarlo.
            </p>
            <Pildoras
              items={[
                'Vista día y semana',
                'Bloqueo de horarios',
                'Cabinas y sillones',
                'Estados del turno',
              ]}
            />
          </div>

          <div style={{ ...tarjetaLado, padding: '20px 22px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '.11em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                }}
              >
                Viernes 5 · 14 turnos
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: 'var(--warm-700)',
                  background: 'var(--warm-50)',
                  padding: '4px 11px',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                3 por el link
              </span>
            </div>
            {AGENDA.map((a) => (
              <div
                key={a.hora}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--ink-2)',
                    width: '44px',
                    flex: 'none',
                  }}
                >
                  {a.hora}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: '4px',
                    height: '32px',
                    borderRadius: '999px',
                    flex: 'none',
                    background:
                      a.tono === 'warm'
                        ? 'var(--warm-solid)'
                        : a.tono === 'neutro'
                          ? 'var(--line)'
                          : 'var(--brand-solid)',
                  }}
                />
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {a.cliente}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '12.5px',
                      color: 'var(--ink-2)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {a.servicio}
                  </span>
                </span>
                <span className="chip-estado" data-tono={a.tono}>
                  {a.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pantalla 2 · Ficha */}
        <div style={{ ...dosColumnas, marginBottom: '60px' }}>
          <div style={{ order: 2 }}>
            <div style={tarjetaLado}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '13px',
                  marginBottom: '18px',
                }}
              >
                <span
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '999px',
                    background: 'var(--brand-solid)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    flex: 'none',
                  }}
                >
                  LB
                </span>
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 700,
                      fontSize: '17px',
                    }}
                  >
                    Lucía B.
                  </span>
                  <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-2)' }}>
                    Cliente desde marzo 2024 · 18 visitas
                  </span>
                </span>
              </div>
              {FICHA.map(([k, v]) => (
                <div key={k} style={filaDato}>
                  <span style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>{k}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
              <div style={filaDato}>
                <span style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>
                  Fórmula y alergias
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--brand)',
                    fontWeight: 600,
                    textAlign: 'right',
                  }}
                >
                  Solo dentro del sistema
                </span>
              </div>
            </div>
          </div>

          <div style={{ order: 1 }}>
            <span
              style={{
                ...rotulo,
                color: 'var(--warm-700)',
                background: 'var(--warm-50)',
                border: '1px solid var(--warm)',
              }}
            >
              Pantalla 2 · Ficha
            </span>
            <h2 style={h2}>Todo lo que hay que saber, antes de empezar</h2>
            <p style={parrafo}>
              El profesional abre la ficha desde el turno y ve el historial completo: qué
              se hizo, con qué producto, qué dijo el cliente la última vez. Los campos son{' '}
              <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>los de tu rubro</strong>,
              no una lista genérica.
            </p>
            <Pildoras
              items={[
                'Historial de visitas',
                'Fotos y archivos',
                'Notas privadas',
                'Saldos y paquetes',
              ]}
            />
          </div>
        </div>

        {/* Pantalla 3 · Caja */}
        <div style={dosColumnas}>
          <div>
            <span
              style={{
                ...rotulo,
                color: 'var(--brand)',
                background: 'var(--brand-50)',
                border: '1px solid var(--brand-100)',
              }}
            >
              Pantalla 3 · Caja
            </span>
            <h2 style={h2}>Cerrás el turno y la diferencia ya está calculada</h2>
            <p style={parrafo}>
              Se abre caja al empezar, se cobra desde el turno y al cierre el sistema
              compara lo que registró con lo que contás en el cajón. Si hay diferencia,{' '}
              <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>
                queda anotada con el motivo
              </strong>
              .
            </p>
            <Pildoras
              items={[
                'Corte de efectivo',
                'Medios de pago',
                'Comprobante PDF',
                'Producción por profesional',
              ]}
            />
          </div>

          <div style={tarjetaLado}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '.11em',
                textTransform: 'uppercase',
                color: 'var(--ink-2)',
              }}
            >
              Cierre del turno
            </span>
            <div
              style={{
                ...titulo,
                fontSize: '30px',
                letterSpacing: '-0.03em',
                margin: '8px 0 18px',
              }}
            >
              Gs. 3.480.000
            </div>
            {CAJA.map(([medio, monto]) => (
              <div key={medio} style={filaDato}>
                <span style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>{medio}</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{monto}</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginTop: '14px',
                padding: '13px 16px',
                borderRadius: 'var(--r-sm)',
                background: 'var(--warm-50)',
                border: '1px dashed var(--warm)',
              }}
            >
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--warm-700)' }}>
                Diferencia contada
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warm-700)' }}>
                − Gs. 20.000
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pantalla 4 · Equipo */}
      <section style={{ maxWidth: '1220px', margin: '0 auto', padding: '68px 26px 0' }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--line-soft)',
            borderRadius: 'var(--r-xl)',
            padding: '42px 34px',
          }}
        >
          <span
            style={{
              ...rotulo,
              color: 'var(--brand)',
              background: 'var(--surface)',
              border: '1px solid var(--brand-100)',
            }}
          >
            Pantalla 4 · Equipo
          </span>
          <h2
            style={{
              ...titulo,
              fontSize: 'clamp(26px, 3.4vw, 38px)',
              lineHeight: 1.1,
              margin: '0 0 12px',
            }}
          >
            Cada uno ve lo suyo
          </h2>
          <p
            style={{
              fontSize: '16.5px',
              lineHeight: 1.65,
              color: 'var(--ink-2)',
              margin: '0 0 26px',
              maxWidth: '62ch',
            }}
          >
            Cuatro roles con permisos configurables. La recepción no entra a los reportes
            de ingresos si no querés, y cada profesional ve su agenda y sus clientes.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
              gap: '16px',
            }}
          >
            {ROLES.map(([rol, texto]) => (
              <div
                key={rol}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: 'var(--r-md)',
                  padding: '22px',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                    fontWeight: 700,
                    fontSize: '17px',
                    margin: '0 0 7px',
                  }}
                >
                  {rol}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--ink-2)',
                    margin: 0,
                  }}
                >
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section style={{ padding: '72px 26px 0' }}>
        <div
          style={{
            maxWidth: '1220px',
            margin: '0 auto',
            borderRadius: 'var(--r-xl)',
            background: 'var(--brand-solid)',
            color: '#fff',
            padding: '56px 34px',
            boxShadow: 'var(--sh-3)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.22,
              backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1.2px, transparent 0)',
              backgroundSize: '24px 24px',
              maskImage: 'radial-gradient(75% 75% at 50% 0%, #000 0%, transparent 72%)',
            }}
          />
          <div style={{ position: 'relative', maxWidth: '660px', margin: '0 auto' }}>
            <h2
              style={{
                ...titulo,
                fontSize: 'clamp(28px, 4.2vw, 46px)',
                lineHeight: 1.08,
                margin: '0 0 16px',
              }}
            >
              Entrá a la demo y tocá todo
            </h2>
            <p
              style={{
                fontSize: '17.5px',
                lineHeight: 1.6,
                margin: '0 0 30px',
                color: 'rgba(255,255,255,.9)',
              }}
            >
              Está cargada con datos de ejemplo. Movés turnos, abrís fichas, cerrás caja:
              nada de lo que toques rompe nada.
            </p>
            <div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Link href="/panel" className="cta-blanco">
                Abrir la demo del panel
              </Link>
              <Link href="/studiokuna" className="cta-linea">
                Ver el portal del cliente
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
