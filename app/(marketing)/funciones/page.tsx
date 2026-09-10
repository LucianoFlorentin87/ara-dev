import { FUNCIONES } from '@/lib/marketing'
import { Contenedor, Seccion, Titulo, Bajada, Tarjeta, Malla } from '../piezas'

export const metadata = {
  title: 'Funciones · Ára',
  description: 'Las diez funciones de Ára, y lo que deliberadamente no hace.',
}

const NO_HACE = [
  ['No manda mensajes solo', 'Los recordatorios abren WhatsApp con el texto escrito para que lo mandes vos. Sin proveedor de mensajería, sin costo por mensaje, y nada sale sin que alguien lo lea.'],
  ['No factura legalmente', 'Registra cobros y cierra caja, pero no emite documento tributario. Si entra la DNIT, hace falta timbrado y numeración correlativa.'],
  ['No cobra por vos', 'No hay pasarela de pago. La seña y el cobro se registran a mano cuando la plata entra.'],
  ['No decide por vos', 'No sugiere precios, no reasigna turnos ni reordena la agenda. Muestra lo que hay y vos decidís.'],
]

export default function Funciones() {
  return (
    <Contenedor>
      <Seccion>
        <Titulo>Diez funciones</Titulo>
        <Bajada>
          Cada una existe porque un local la necesita todos los días, no porque
          quede bien en una lista.
        </Bajada>

        <Malla min={280}>
          {FUNCIONES.map((f) => (
            <Tarjeta key={f.n} tono={f.tono === 'brand' ? 'brand' : undefined}>
              <div
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  color: 'var(--brand)',
                  marginBottom: '6px',
                }}
              >
                {f.n}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  letterSpacing: '-0.02em',
                  margin: '0 0 6px',
                }}
              >
                {f.titulo}
              </h2>
              <p style={{ fontSize: '14.5px', lineHeight: 1.62, color: 'var(--ink-2)', margin: 0 }}>
                {f.texto}
              </p>
            </Tarjeta>
          ))}
        </Malla>
      </Seccion>

      <Seccion>
        <Titulo tamano="clamp(24px, 3.6vw, 34px)">Lo que no hace</Titulo>
        <Bajada>
          Decirlo de entrada evita descubrirlo el día que importa.
        </Bajada>
        <Malla min={280}>
          {NO_HACE.map(([titulo, texto]) => (
            <Tarjeta key={titulo} tono="warm">
              <h3
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '17px',
                  letterSpacing: '-0.02em',
                  margin: '0 0 6px',
                  color: 'var(--warm-700)',
                }}
              >
                {titulo}
              </h3>
              <p style={{ fontSize: '14.5px', lineHeight: 1.62, margin: 0 }}>{texto}</p>
            </Tarjeta>
          ))}
        </Malla>
      </Seccion>
    </Contenedor>
  )
}
