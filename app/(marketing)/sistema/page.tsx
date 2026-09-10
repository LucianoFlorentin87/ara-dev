import Link from 'next/link'
import { Contenedor, Seccion, Titulo, Bajada, Tarjeta, Malla } from '../piezas'

export const metadata = {
  title: 'El sistema · Ára',
  description: 'Las cuatro pantallas donde pasa todo: agenda, ficha, caja y el link de reserva.',
}

const PANTALLAS = [
  {
    nombre: 'La agenda del día',
    quien: 'La usan todos, todo el día',
    texto:
      'Una columna por profesional y las horas del local. Los turnos se ven por color: violeta lo normal, durazno lo que vino por el link, punteado lo que sigue sin confirmar.',
    detalle:
      'No deja pisar un turno. Esa regla vive en la base de datos, no en el navegador: es lo único que resiste dos personas agendando en el mismo segundo.',
  },
  {
    nombre: 'La ficha del cliente',
    quien: 'La ve quien atiende',
    texto:
      'Visitas, gasto, cada turno del historial y los campos propios de tu rubro: la fórmula de color, el odontograma, las medidas del socio.',
    detalle:
      'Recepción y caja no la ven. No es una opción que se pueda desmarcar por error: la base no les devuelve esas filas.',
  },
  {
    nombre: 'La caja',
    quien: 'La usa quien cobra',
    texto:
      'Se abre con el efectivo del cajón, cada cobro queda con su medio de pago, y al cerrar se compara con lo que contaste.',
    detalle:
      'Si no cuadra hay que escribir por qué, y eso queda registrado con tu nombre y la hora. Un cobro no se borra nunca: se anula con su motivo.',
  },
  {
    nombre: 'El link de reserva',
    quien: 'Lo usan tus clientes',
    texto:
      'Tu dirección propia muestra tus servicios, tu equipo y los huecos reales de tu agenda. En cuatro pasos queda el turno.',
    detalle:
      'Muestra horarios, nunca el nombre de quien ya tiene ese turno. Y si dos personas eligen el mismo hueco, la segunda ve que se lo ganaron.',
  },
]

export default function Sistema() {
  return (
    <Contenedor>
      <Seccion>
        <Titulo>Cuatro pantallas</Titulo>
        <Bajada>
          El resto del sistema existe para que estas cuatro funcionen. Si
          entendés estas, entendiste Ára.
        </Bajada>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PANTALLAS.map((p) => (
            <Tarjeta key={p.nombre}>
              <Malla min={260}>
                <div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-2)', fontWeight: 600 }}>
                    {p.quien}
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                      fontWeight: 700,
                      fontSize: '23px',
                      letterSpacing: '-0.03em',
                      margin: '4px 0 0',
                    }}
                  >
                    {p.nombre}
                  </h2>
                </div>
                <div>
                  <p style={{ fontSize: '15px', lineHeight: 1.62, margin: '0 0 10px' }}>
                    {p.texto}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: 'var(--ink-2)',
                      margin: 0,
                      paddingTop: '10px',
                      borderTop: '1px solid var(--line-soft)',
                    }}
                  >
                    {p.detalle}
                  </p>
                </div>
              </Malla>
            </Tarjeta>
          ))}
        </div>
      </Seccion>

      <Seccion>
        <Tarjeta tono="brand">
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Titulo tamano="clamp(22px, 3.2vw, 30px)" centrado>
              Y una decisión que no se ve
            </Titulo>
            <Bajada centrado>
              Las reglas del negocio viven en la base de datos, no en la
              aplicación. Aunque alguien escriba directo contra los datos, las
              reglas siguen valiendo.
            </Bajada>
            <Link
              href="/funciones"
              className="boton-primario"
              style={{ width: 'auto', padding: '13px 26px', display: 'inline-block', textDecoration: 'none' }}
            >
              Ver las funciones
            </Link>
          </div>
        </Tarjeta>
      </Seccion>
    </Contenedor>
  )
}
