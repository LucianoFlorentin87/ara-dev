/**
 * Conversión entre instantes UTC y la hora de pared en Asunción.
 *
 * Todo se guarda en timestamptz (UTC) y se muestra en America/Asuncion.
 * Paraguay tiene horario de verano, así que el desfase no es constante:
 * restar "3 horas" a mano funciona media parte del año y rompe la otra.
 * Por eso el desfase se pregunta con Intl para cada instante concreto.
 */

export const ZONA = 'America/Asuncion'

/** Milisegundos que hay que sumarle a un instante UTC para leerlo en `zona`. */
function desplazamiento(instante: Date, zona: string): number {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zona,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instante)

  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]))
  const comoSiFueraUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second)
  )
  return comoSiFueraUTC - instante.getTime()
}

/**
 * El instante UTC que corresponde a una hora de pared en Asunción.
 *
 * Dos pasadas: la primera estima el desfase con la hora equivocada, la
 * segunda lo corrige. Hace falta los dos días del año en que el desfase
 * cambia; el resto de los días la segunda pasada no mueve nada.
 */
export function instanteDe(fechaISO: string, hora: string, zona = ZONA): Date {
  const [a, m, d] = fechaISO.split('-').map(Number)
  const [hh, mm] = hora.split(':').map(Number)
  const pared = Date.UTC(a, m - 1, d, hh, mm)

  let t = new Date(pared)
  t = new Date(pared - desplazamiento(t, zona))
  t = new Date(pared - desplazamiento(t, zona))
  return t
}

/** "HH:MM" de un instante, leído en Asunción. */
export function horaDe(instante: Date | string, zona = ZONA): string {
  return new Intl.DateTimeFormat('es-PY', {
    timeZone: zona,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(instante))
}

/** La fecha de hoy en Asunción, como "YYYY-MM-DD". */
export function hoyISO(zona = ZONA): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: zona,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]))
  return `${p.year}-${p.month}-${p.day}`
}

/** Día de la semana (0 = domingo) de una fecha ISO, sin pasar por husos. */
export function diaSemana(fechaISO: string): number {
  const [a, m, d] = fechaISO.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay()
}

/** Corre una fecha ISO n días, sin que el huso la mueva de lugar. */
export function sumarDias(fechaISO: string, n: number): string {
  const [a, m, d] = fechaISO.split('-').map(Number)
  const t = new Date(Date.UTC(a, m - 1, d + n))
  return t.toISOString().slice(0, 10)
}

/**
 * "Miércoles, 9 de septiembre" para el encabezado.
 *
 * La mayúscula se pone acá y no con `text-transform: capitalize`, que en
 * castellano capitaliza cada palabra y deja "9 De Septiembre".
 */
export function fechaLarga(fechaISO: string, zona = ZONA): string {
  const [a, m, d] = fechaISO.split('-').map(Number)
  const texto = new Intl.DateTimeFormat('es-PY', {
    timeZone: zona,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(Date.UTC(a, m - 1, d, 12)))
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function guaranies(monto: number): string {
  return 'Gs. ' + Math.round(monto).toLocaleString('es-PY')
}
