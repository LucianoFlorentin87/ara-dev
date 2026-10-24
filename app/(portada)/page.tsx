import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { RUBROS } from '@/lib/rubros'
import { FAQ_ARRANQUE, FAQ_PRECIOS, PASOS } from '@/lib/marketing'
import { Flecha, ICONOS, Mas, Tilde } from './iconos'
import { PestanasRubros } from './pestanas-rubros'
import { AGENDA_HERO, ESTADISTICAS, ETIQUETA_PORTADA, FILAS, RECALL } from './portada-datos'

export const metadata = {
  title: 'Ára · turnos, fichas y caja en un solo lugar',
  description:
    'Turnos sin doble reserva, reserva online para tus clientes, caja al cierre del día y la ficha de cada persona con su historial.',
}

// Pendiente del cliente: el WhatsApp real. Hoy es el marcador del diseño.
const WA = 'https://wa.me/595981000000'

// Pendiente del cliente: los precios reales. Gs. 150.000 y Gs. 350.000 son
// los marcadores del diseño, igual que en /precios.
const PLANES = [
  {
    nombre: 'Individual',
    para: 'Un profesional trabajando solo',
    precio: 'Gs. 150.000',
    pie: 'por mes · 1 usuario',
    items: [
      '1 usuario',
      'Agenda, clientes y reserva online',
      'Servicios, precios y cobros',
      'Recordatorios por WhatsApp',
      'Reportes básicos de ingresos',
    ],
  },
  {
    nombre: 'Equipo',
    para: 'Varios profesionales, recepción y caja',
    precio: 'Gs. 350.000',
    pie: 'por mes · usuarios ilimitados',
    destacado: true,
    items: [
      'Usuarios ilimitados con roles',
      'Todo lo del plan individual',
      'Caja con corte de efectivo',
      'Stock de productos e insumos',
      'Recall de clientes inactivos',
      'Reportes completos y export a CSV',
    ],
  },
] as const

const COMUNES = [
  'Clientes y turnos ilimitados',
  'Portal del cliente incluido',
  'Actualizaciones incluidas',
  'Soporte por WhatsApp',
  'Configuración del local incluida',
  'Tus datos, siempre exportables',
]

// Los textos salen de /precios, de las preguntas frecuentes y de las cifras
// de la portada: no hay copy nuevo.
const BENEFICIOS = [
  {
    icono: ICONOS.porcentaje,
    titulo: 'Sin comisión por cobro',
    texto:
      'No nos quedamos con un porcentaje de lo que facturás. El sistema registra el cobro, no lo procesa.',
  },
  {
    icono: ICONOS.mensaje,
    titulo: 'Sin costo por mensaje',
    texto:
      'Los recordatorios abren tu WhatsApp con el texto listo, así que no hay proveedor de mensajería que te facture aparte.',
  },
  {
    icono: ICONOS.herramienta,
    titulo: 'Sin costo de instalación',
    texto:
      'La configuración del local, la carga de tu catálogo y la importación de clientes están incluidas.',
  },
  {
    icono: ICONOS.pantalla,
    titulo: 'Sin instalar',
    texto:
      'Se usa desde el navegador, en la computadora del local o desde el celular, y los datos quedan en la nube.',
  },
  {
    icono: ICONOS.billete,
    titulo: 'En guaraníes',
    texto: 'Precios, cobros y reportes en guaraníes, pensado para cómo se trabaja en Paraguay.',
  },
  {
    icono: ICONOS.descarga,
    titulo: 'Tus datos, siempre exportables',
    texto:
      'Si decidís no seguir, tus datos quedan disponibles para exportarlos: no se borran de golpe.',
  },
]

const PREGUNTAS = [
  FAQ_ARRANQUE[2],
  FAQ_ARRANQUE[0],
  FAQ_ARRANQUE[5],
  FAQ_PRECIOS[1],
  FAQ_PRECIOS[3],
  FAQ_ARRANQUE[4],
  FAQ_PRECIOS[4],
]

/* ---------- Maquetas del sistema (HTML real, datos de muestra) ---------- */

function Entra({ i, children, className = 'n-fila' }: { i: number; children: ReactNode; className?: string }) {
  return (
    <div className={`${className} n-entra`} style={{ '--i': i } as CSSProperties}>
      {children}
    </div>
  )
}

function MaquetaAgenda() {
  return (
    <div className="n-ventana">
      <div className="n-ventana-cabeza">
        <span>Agenda · Sofía R.</span>
        <span>Vie 5 sep</span>
      </div>
      {AGENDA_HERO.map((t, i) => (
        <Entra key={t.hora} i={i}>
          <span className="n-hora">{t.hora}</span>
          <span className="n-barra" data-tono={t.tono === 'warm' ? 'calido' : undefined} />
          <span className="n-fila-texto">
            <b>{t.quien}</b>
            <span>{t.que}</span>
          </span>
        </Entra>
      ))}
      <Entra i={3} className="n-aviso">
        <span aria-hidden>⨯</span>
        <span>
          <b>10:30 ya está ocupado.</b> El turno no se guardó: elegí otro horario o
          otra profesional.
        </span>
      </Entra>
    </div>
  )
}

function MaquetaReserva() {
  const horarios: [string, boolean, boolean?][] = [
    ['09:00', false],
    ['09:45', true],
    ['10:30', false],
    ['11:15', true],
    ['13:00', true, true],
    ['13:45', true],
  ]
  return (
    <div className="n-ventana" style={{ width: 'min(300px, 100%)' }}>
      <div className="n-pasos-reserva" aria-hidden>
        <span data-hecho="true" />
        <span data-hecho="true" />
        <span data-hecho="true" />
        <span />
      </div>
      <div className="n-ventana-cabeza">
        <span>Elegí horario</span>
        <span>23:12</span>
      </div>
      <Entra i={0}>
        <span className="n-fila-texto">
          <b>Brushing</b>
          <span>con Andrea G. · sábado</span>
        </span>
      </Entra>
      <div className="n-horarios n-entra" style={{ '--i': 1 } as CSSProperties}>
        {horarios.map(([h, libre, elegido]) => (
          <span key={h} data-libre={libre} data-elegido={elegido ? 'true' : undefined}>
            {h}
          </span>
        ))}
      </div>
      <Entra i={2} className="n-grupo">
        <span
          className="n-boton"
          data-tipo="primario"
          data-chico="true"
          style={{ flex: 1, justifyContent: 'center', marginTop: '10px', borderRadius: '4px' }}
        >
          Confirmar turno
        </span>
      </Entra>
    </div>
  )
}

function MaquetaFicha() {
  const datos = [
    ['Última visita', '04/03 · Color raíz'],
    ['Estilista habitual', 'Sofía R.'],
    ['Alergias', 'Ninguna declarada'],
    ['Paquete', '3 de 5 sesiones'],
  ]
  return (
    <div className="n-ventana">
      <div className="n-ventana-cabeza">
        <span>Ficha · Belén O.</span>
        <span className="n-chip">Peluquería</span>
      </div>
      {datos.map(([k, v], i) => (
        <Entra key={k} i={i} className="n-dato">
          <span>{k}</span>
          <span>{v}</span>
        </Entra>
      ))}
    </div>
  )
}

function MaquetaCaja() {
  const medios = [
    ['Efectivo', 'Gs. 1.240.000'],
    ['Transferencia', 'Gs. 860.000'],
    ['Tarjeta', 'Gs. 450.000'],
  ]
  return (
    <div className="n-ventana">
      <div className="n-ventana-cabeza">
        <span>Cierre de caja · Mirta S.</span>
        <span>20:04</span>
      </div>
      {medios.map(([k, v], i) => (
        <Entra key={k} i={i} className="n-dato">
          <span>{k}</span>
          <span>{v}</span>
        </Entra>
      ))}
      <Entra i={3} className="n-total">
        <span>Total del día</span>
        <b>Gs. 2.550.000</b>
      </Entra>
      <Entra i={4} className="n-aviso">
        <span aria-hidden>✓</span>
        <span>
          <b>Diferencia de efectivo: Gs. 0.</b> Comprobante en PDF listo.
        </span>
      </Entra>
    </div>
  )
}

const MAQUETAS = [MaquetaAgenda, MaquetaReserva, MaquetaFicha, MaquetaCaja]
const LUCES = [
  ['25%', '15%'],
  ['80%', '20%'],
  ['20%', '85%'],
  ['75%', '80%'],
]

/* ---------- Página ---------- */

export default function Portada() {
  return (
    <>
      {/* Hero */}
      <section className="n-hero">
        {/* Cuando llegue la foto del local (pendiente del cliente), va acá
            como fondo, debajo del degradado. */}
        <div className="n-hero-fondo" aria-hidden />
        <div className="n-cont" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '36px' }}>
          <div className="n-hero-grilla">
            <div>
              <span className="n-ojo">Turnos, fichas y caja · Paraguay</span>
              <h1 className="n-hero-titulo">Una nueva forma de manejar tu agenda</h1>
              <p className="n-hero-bajada">
                Turnos sin doble reserva, reserva online para tus clientes, caja al cierre
                del día y la ficha de cada persona con su historial. Se abre en el
                navegador: no instalás nada.
              </p>
              <div className="n-grupo">
                <Link href="/alta" className="n-boton" data-tipo="primario">
                  Probar gratis 14 días <Flecha />
                </Link>
                <Link href="/sistema" className="n-boton" data-tipo="vidrio">
                  Ver por dentro
                </Link>
              </div>
            </div>

            <div className="n-hero-maqueta n-flota">
              <div className="n-ventana" style={{ width: '100%' }}>
                <div className="n-ventana-cabeza">
                  <span>Viernes 5 de septiembre</span>
                  <span className="n-chip" data-tono="claro">
                    Hoy
                  </span>
                </div>
                <div style={{ padding: '4px 6px 10px' }}>
                  <div style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>14 turnos hoy</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--n-ink-3)' }}>
                    3 entraron solos por el link
                  </div>
                </div>
                {AGENDA_HERO.map((t, i) => (
                  <div
                    key={t.hora}
                    className="n-fila n-entra"
                    data-activa={t.destacado}
                    style={{ '--i': i } as CSSProperties}
                  >
                    <span className="n-hora">{t.hora}</span>
                    <span className="n-barra" data-tono={t.tono === 'warm' ? 'calido' : undefined} />
                    <span className="n-fila-texto">
                      <b>{t.quien}</b>
                      <span>{t.que}</span>
                    </span>
                  </div>
                ))}
                <div
                  className="n-aviso n-entra"
                  style={{ '--i': 3, justifyContent: 'space-between' } as CSSProperties}
                >
                  <b>11:00 libre</b>
                  <span className="n-mono" style={{ fontSize: '11px' }}>
                    2 en espera
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="n-hero-cifras">
            {ESTADISTICAS.map(([cifra, pie]) => (
              <div key={cifra} className="n-hero-cifra">
                <strong>{cifra}</strong>
                <span>{pie}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lo que cambia */}
      <section className="n-seccion">
        <div className="n-cont">
          <div className="n-cabeza-seccion" data-reveal>
            <div>
              <span className="n-ojo">Lo que cambia</span>
              <h2 className="n-h2">
                Lo que tu recepción deja de hacer <em>a mano</em>
              </h2>
            </div>
            <p className="n-bajada" style={{ maxWidth: '38ch' }}>
              Cuatro cosas que cambian el día del local. Todas entran en cualquier plan.
            </p>
          </div>

          <div className="n-malla-2">
            {FILAS.map((f, i) => {
              const Maqueta = MAQUETAS[i]
              const [x, y] = LUCES[i]
              return (
                <article key={f.etiqueta} className="n-tarjeta" data-reveal>
                  <div className="n-escena" style={{ '--x': x, '--y': y } as CSSProperties}>
                    <Maqueta />
                  </div>
                  <div className="n-tarjeta-cuerpo">
                    <div className="n-rotulo">{f.etiqueta}</div>
                    <h3 className="n-h3">{f.titulo}</h3>
                    <p className="n-texto">
                      {f.texto[0]}
                      <strong>{f.texto[1]}</strong>
                      {f.texto[2]}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Rubros */}
      <section className="n-seccion">
        <div className="n-cont">
          <div className="n-cabeza-seccion" data-reveal>
            <div>
              <span className="n-ojo">Rubros</span>
              <h2 className="n-h2">
                Pensado para nueve rubros, <em>con la ficha de cada uno</em>
              </h2>
            </div>
            <p className="n-bajada" style={{ maxWidth: '40ch' }}>
              La base es la misma. Lo que cambia es la ficha del cliente y el catálogo de
              servicios, y eso lo configuramos con vos.
            </p>
          </div>
          <PestanasRubros rubros={RUBROS} etiquetas={ETIQUETA_PORTADA} />
        </div>
      </section>

      {/* Cómo arranca */}
      <section className="n-seccion">
        <div className="n-cont">
          <div className="n-cabeza-seccion" data-reveal>
            <div>
              <span className="n-ojo">Cómo arranca</span>
              <h2 className="n-h2">
                Una llamada para empezar, <em>cuatro pasos hasta el primer turno</em>
              </h2>
            </div>
            <div className="n-grupo">
              <Link href="/como-arranca" className="n-boton" data-tipo="vidrio">
                Ver el detalle <Flecha />
              </Link>
            </div>
          </div>

          <div className="n-pasos" data-reveal>
            {PASOS.map((p) => (
              <div key={p.n} className="n-paso">
                <div className="n-paso-num">
                  <span>{p.n.padStart(2, '0')}</span>
                  <span>{p.tiempo}</span>
                </div>
                <h3 className="n-h3">{p.titulo}</h3>
                <p className="n-texto">{p.texto}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="n-seccion">
        <div className="n-cont">
          <div className="n-cabeza-seccion" data-reveal>
            <div>
              <span className="n-ojo">Sin letra chica</span>
              <h2 className="n-h2">
                Lo que no te vamos a cobrar <em>y lo que no tenés que hacer</em>
              </h2>
            </div>
          </div>
          <div className="n-beneficios" data-reveal>
            {BENEFICIOS.map((b) => (
              <div key={b.titulo} className="n-beneficio">
                {b.icono}
                <h3 className="n-h3">{b.titulo}</h3>
                <p className="n-texto">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recall */}
      <section className="n-seccion">
        <div className="n-cont n-recall">
          <div data-reveal>
            <span className="n-ojo">Recall</span>
            <h2 className="n-h2">La plata que ya está en tu base de datos</h2>
            <p className="n-bajada" style={{ marginBottom: '28px' }}>
              El sistema te arma la lista de clientes que no vuelven hace 3, 6 o 12 meses,
              con un botón para escribirles. El mensaje sale listo y abre WhatsApp: sin
              costo por mensaje.
            </p>
            <div className="n-grupo">
              <Link href="/funciones" className="n-boton" data-tipo="primario">
                Ver todas las funciones <Flecha />
              </Link>
            </div>
          </div>

          <div className="n-tarjeta" data-reveal>
            <div className="n-escena" style={{ '--x': '70%', '--y': '30%', aspectRatio: 'auto', minHeight: '340px' } as CSSProperties}>
              <div className="n-ventana">
                <div className="n-ventana-cabeza">
                  <span>Sin volver hace 6 meses</span>
                  <span className="n-chip" data-tono="claro">
                    38
                  </span>
                </div>
                {RECALL.map(([quien, detalle], i) => (
                  <Entra key={quien} i={i}>
                    <span className="n-fila-texto">
                      <b>{quien}</b>
                      <span>{detalle}</span>
                    </span>
                    <span className="n-chip">Escribir</span>
                  </Entra>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="n-seccion" id="precios">
        <div className="n-cont">
          <div className="n-cabeza-seccion" data-reveal>
            <div>
              <span className="n-ojo">Precios</span>
              <h2 className="n-h2">
                Empezás con la prueba, <em>el plan se define después</em>
              </h2>
            </div>
            <p className="n-bajada" style={{ maxWidth: '40ch' }}>
              Se puede cambiar cuando el equipo crece y dar de baja cuando quieras: no hay
              plazo mínimo.
            </p>
          </div>

          <div className="n-planes">
            {PLANES.map((p) => (
              <div
                key={p.nombre}
                className="n-plan"
                data-destacado={'destacado' in p ? 'true' : undefined}
                data-reveal
              >
                <div className="n-plan-cabeza">
                  <h3 className="n-h3" style={{ margin: 0 }}>
                    {p.nombre}
                  </h3>
                  {'destacado' in p && (
                    <span className="n-chip" data-tono="claro">
                      Más elegido
                    </span>
                  )}
                </div>
                <p className="n-texto" style={{ fontSize: '14px' }}>
                  {p.para}
                </p>
                <div className="n-precio">{p.precio}</div>
                <div className="n-mono" style={{ fontSize: '11.5px', color: 'var(--n-ink-3)' }}>
                  {p.pie}
                </div>
                <div className="n-grupo">
                  <Link
                    href="/alta"
                    className="n-boton"
                    data-tipo={'destacado' in p ? 'primario' : 'vidrio'}
                  >
                    Probar gratis 14 días
                  </Link>
                </div>
                <div className="n-rotulo">Incluye</div>
                <ul className="n-tilde">
                  {p.items.map((it) => (
                    <li key={it}>
                      <Tilde />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="n-plan" data-reveal>
              <div className="n-plan-cabeza">
                <h3 className="n-h3" style={{ margin: 0 }}>
                  En los dos planes
                </h3>
              </div>
              <p className="n-texto" style={{ fontSize: '14px', marginBottom: '24px' }}>
                Nada se cobra por módulo
              </p>
              <ul className="n-tilde">
                {COMUNES.map((it) => (
                  <li key={it}>
                    <Tilde />
                    {it}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 'auto', paddingTop: '26px' }}>
                <p className="n-texto" style={{ fontSize: '14px', marginBottom: '14px' }}>
                  ¿Más de un local o un caso raro? Escribinos y lo vemos.
                </p>
                <div className="n-grupo" style={{ margin: 0 }}>
                  <a href={WA} target="_blank" rel="noreferrer" className="n-boton" data-tipo="vidrio">
                    Hablar por WhatsApp <Flecha />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas */}
      <section className="n-seccion">
        <div className="n-cont n-faq">
          <div data-reveal>
            <span className="n-ojo">Preguntas</span>
            <h2 className="n-h2">Lo que nos preguntan antes de empezar</h2>
            <p className="n-bajada">
              ¿No está tu duda?{' '}
              <a href={WA} target="_blank" rel="noreferrer" style={{ color: 'var(--n-ink)' }}>
                Escribinos por WhatsApp
              </a>
              .
            </p>
          </div>
          <div>
            {PREGUNTAS.map((q) => (
              <details key={q.p} className="n-pregunta">
                <summary>
                  {q.p}
                  <span className="n-mas">
                    <Mas />
                  </span>
                </summary>
                <p>{q.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="n-cierre">
        <div className="n-cont">
          <span className="n-ojo">Empezá hoy</span>
          <h2 className="n-h2">¿Qué esperás? Cargá tus servicios hoy</h2>
          <p className="n-bajada">
            14 días completos, sin tarjeta. Te damos de alta el local, cargamos tu catálogo
            y te dejamos la agenda funcionando. Mañana ya tomás turnos desde el link.
          </p>
          <div className="n-grupo">
            <Link href="/alta" className="n-boton" data-tipo="primario">
              Crear mi cuenta de prueba <Flecha />
            </Link>
            <a href={WA} target="_blank" rel="noreferrer" className="n-boton" data-tipo="vidrio">
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
