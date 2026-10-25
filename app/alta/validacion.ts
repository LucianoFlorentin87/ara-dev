import { RUBROS_ALTA, slugDe } from './datos'

type ServicioAlta = { nombre: string; duracion_min: number; precio: number }
type HorarioAlta = { dia_semana: number; hora_inicio: string; hora_fin: string }
export type AltaValidada = {
  nombre: string; slug: string; rubro: string; direccion: string | null
  telefono: string | null; instagram: string | null
  horarios: HorarioAlta[]; servicios: ServicioAlta[]
}

export function validarAlta(datos: FormData): AltaValidada {
  const nombre = String(datos.get('nombre') ?? '').trim()
  const slug = slugDe(nombre)
  if (!nombre || nombre.length > 100 || !/^[a-z0-9-]{3,40}$/.test(slug)) {
    throw new Error('El nombre debe generar un link de entre 3 y 40 letras o números.')
  }
  const rubro = RUBROS_ALTA.find((r) => r.nombre === datos.get('rubro'))
  if (!rubro) throw new Error('Elegí un rubro.')
  const opcional = (clave: string, limite: number) => {
    const valor = String(datos.get(clave) ?? '').trim()
    if (valor.length > limite) throw new Error(`Revisá el campo ${clave}: es demasiado largo.`)
    return valor || null
  }
  let dias: unknown, servicios: unknown
  try {
    dias = JSON.parse(String(datos.get('dias') ?? ''))
    servicios = JSON.parse(String(datos.get('servicios') ?? ''))
  } catch { throw new Error('No se pudo leer el horario o el catálogo. Revisalos y probá de nuevo.') }
  if (!Array.isArray(dias) || dias.length !== 7 || dias.some((d) => typeof d !== 'boolean') || !dias.some(Boolean)) {
    throw new Error('Elegí al menos un día de apertura en un horario válido.')
  }
  if (!Array.isArray(servicios) || servicios.length < 1 || servicios.length > 100) {
    throw new Error('Elegí entre 1 y 100 servicios.')
  }
  const catalogo = servicios.map((s): ServicioAlta => {
    if (!s || typeof s !== 'object' || typeof s.nombre !== 'string' || typeof s.dur !== 'string' || typeof s.precio !== 'string') {
      throw new Error('Revisá los datos de los servicios.')
    }
    const nombre = s.nombre.trim()
    const duracion = s.dur.match(/^(\d+)\s*min$/)
    const minutos = duracion ? Number(duracion[1]) : 60
    if (!nombre || nombre.length > 100 || minutos < 1 || minutos > 1440 || !/^(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(s.precio)) {
      throw new Error('Revisá el nombre, duración y precio de cada servicio. Usá guaraníes enteros.')
    }
    const precio = Number(s.precio.replace(/\./g, ''))
    if (!Number.isSafeInteger(precio) || precio > 9999999999) throw new Error('El precio de un servicio es demasiado alto.')
    return { nombre, duracion_min: minutos, precio }
  })
  const rangos = [['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '20:00'], ['09:00', '20:00'], ['08:00', '17:00'], ['09:00', '19:00']]
  return {
    nombre, slug, rubro: rubro.slug, direccion: opcional('direccion', 300),
    telefono: opcional('telefono', 30), instagram: opcional('instagram', 100),
    horarios: dias.flatMap((abierto, i) => abierto ? [{ dia_semana: (i + 1) % 7, hora_inicio: rangos[i][0], hora_fin: rangos[i][1] }] : []),
    servicios: catalogo,
  }
}
