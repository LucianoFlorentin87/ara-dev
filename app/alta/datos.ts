/**
 * Los datos del alta, copiados de `diseno/Alta.dc.html`.
 *
 * El catálogo inicial por rubro es lo que hace que el local arranque con
 * servicios cargados en vez de una lista vacía. Los precios son los
 * marcadores del diseño: el cliente todavía no pasó los reales.
 */

export const RUBROS_ALTA = [
  { nombre: 'Peluquería', ejemplo: 'cortes, color, peinado', slug: 'peluqueria' },
  { nombre: 'Estética y spa', ejemplo: 'faciales, masajes, láser', slug: 'estetica' },
  { nombre: 'Uñas y pestañas', ejemplo: 'kapping, lifting, cejas', slug: 'unas' },
  { nombre: 'Gimnasio', ejemplo: 'cuotas, clases, rutinas', slug: 'gimnasio' },
  { nombre: 'Odontología', ejemplo: 'odontograma, tratamientos', slug: 'odontologia' },
  { nombre: 'Kinesiología', ejemplo: 'series de sesiones', slug: 'kinesiologia' },
  { nombre: 'Nutrición', ejemplo: 'controles, antropometría', slug: 'nutricion' },
  { nombre: 'Consultorio médico', ejemplo: 'historia clínica, recetas', slug: 'consultorio' },
  { nombre: 'Tatuajes', ejemplo: 'sesiones, señas, diseños', slug: 'tatuajes' },
] as const

export type Servicio = { nombre: string; dur: string; precio: string }

export const CATALOGOS: Record<string, Servicio[]> = {
  Peluquería: [
    { nombre: 'Corte de dama', dur: '45 min', precio: '120.000' },
    { nombre: 'Corte de caballero', dur: '30 min', precio: '90.000' },
    { nombre: 'Color raíz', dur: '150 min', precio: '250.000' },
    { nombre: 'Brushing', dur: '40 min', precio: '90.000' },
    { nombre: 'Alisado', dur: '120 min', precio: '620.000' },
  ],
  'Estética y spa': [
    { nombre: 'Limpieza facial', dur: '60 min', precio: '180.000' },
    { nombre: 'Masaje descontracturante', dur: '60 min', precio: '200.000' },
    { nombre: 'Depilación láser', dur: '45 min', precio: '320.000' },
    { nombre: 'Drenaje linfático', dur: '75 min', precio: '260.000' },
    { nombre: 'Peeling', dur: '50 min', precio: '290.000' },
  ],
  'Uñas y pestañas': [
    { nombre: 'Kapping + diseño', dur: '90 min', precio: '160.000' },
    { nombre: 'Retoque semipermanente', dur: '60 min', precio: '110.000' },
    { nombre: 'Lifting de pestañas', dur: '75 min', precio: '190.000' },
    { nombre: 'Perfilado de cejas', dur: '30 min', precio: '70.000' },
    { nombre: 'Pedicuría', dur: '60 min', precio: '130.000' },
  ],
  Gimnasio: [
    { nombre: 'Cuota mensual libre', dur: 'mensual', precio: '180.000' },
    { nombre: 'Pase semanal', dur: '7 días', precio: '70.000' },
    { nombre: 'Evaluación inicial', dur: '45 min', precio: '90.000' },
    { nombre: 'Clase de funcional', dur: '60 min', precio: '45.000' },
    { nombre: 'Entrenamiento personalizado', dur: '60 min', precio: '120.000' },
  ],
  Odontología: [
    { nombre: 'Consulta y diagnóstico', dur: '30 min', precio: '120.000' },
    { nombre: 'Profilaxis', dur: '45 min', precio: '200.000' },
    { nombre: 'Restauración', dur: '60 min', precio: '350.000' },
    { nombre: 'Endodoncia', dur: '90 min', precio: '700.000' },
    { nombre: 'Control de ortodoncia', dur: '30 min', precio: '150.000' },
  ],
  Kinesiología: [
    { nombre: 'Evaluación inicial', dur: '45 min', precio: '150.000' },
    { nombre: 'Sesión de rehabilitación', dur: '45 min', precio: '120.000' },
    { nombre: 'Terapia manual', dur: '60 min', precio: '160.000' },
    { nombre: 'Paquete de 10 sesiones', dur: '10 turnos', precio: '1.000.000' },
    { nombre: 'Evaluación postural', dur: '40 min', precio: '140.000' },
  ],
  Nutrición: [
    { nombre: 'Primera consulta', dur: '60 min', precio: '250.000' },
    { nombre: 'Control mensual', dur: '30 min', precio: '130.000' },
    { nombre: 'Antropometría', dur: '30 min', precio: '120.000' },
    { nombre: 'Plan deportivo', dur: '60 min', precio: '300.000' },
    { nombre: 'Consulta online', dur: '40 min', precio: '180.000' },
  ],
  'Consultorio médico': [
    { nombre: 'Primera consulta', dur: '30 min', precio: '200.000' },
    { nombre: 'Consulta de control', dur: '20 min', precio: '150.000' },
    { nombre: 'Lectura de estudios', dur: '20 min', precio: '120.000' },
    { nombre: 'Certificado médico', dur: '15 min', precio: '80.000' },
    { nombre: 'Consulta domiciliaria', dur: '45 min', precio: '400.000' },
  ],
  Tatuajes: [
    { nombre: 'Diseño y presupuesto', dur: '30 min', precio: '0' },
    { nombre: 'Fineline', dur: '90 min', precio: '450.000' },
    { nombre: 'Sesión de 3 horas', dur: '180 min', precio: '900.000' },
    { nombre: 'Retoque', dur: '45 min', precio: '150.000' },
    { nombre: 'Cover up', dur: '150 min', precio: '800.000' },
  ],
}

export const PASOS = [
  { n: '1', titulo: 'Rubro', corto: 'Qué hacés', ayuda: 'Elegí un rubro para seguir' },
  { n: '2', titulo: 'El local', corto: 'Nombre y contacto', ayuda: 'El nombre es lo único obligatorio' },
  { n: '3', titulo: 'Horario', corto: 'Cuándo abrís', ayuda: 'Podés cambiarlo después' },
  { n: '4', titulo: 'Servicios', corto: 'Qué ofrecés', ayuda: 'Sacá lo que no ofrecés' },
  { n: '5', titulo: 'Equipo', corto: 'Quién trabaja', ayuda: 'Podés invitar gente después' },
] as const

export const DIAS_BASE = [
  { nombre: 'Lunes', abierto: false, rango: 'Cerrado' },
  { nombre: 'Martes', abierto: true, rango: '09:00 – 19:00' },
  { nombre: 'Miércoles', abierto: true, rango: '09:00 – 19:00' },
  { nombre: 'Jueves', abierto: true, rango: '09:00 – 20:00' },
  { nombre: 'Viernes', abierto: true, rango: '09:00 – 20:00' },
  { nombre: 'Sábado', abierto: true, rango: '08:00 – 17:00' },
  { nombre: 'Domingo', abierto: false, rango: 'Cerrado' },
] as const

export const EQUIPO = [
  { nombre: 'Carla Domínguez', ini: 'CD', mail: 'carla@studiokuna.com.py', rol: 'Dueña', tono: 'brand' },
  { nombre: 'Sofía Ramírez', ini: 'SR', mail: 'sofia@studiokuna.com.py', rol: 'Profesional', tono: 'brand' },
  { nombre: 'Rocío Cabral', ini: 'RC', mail: 'recepcion@studiokuna.com.py', rol: 'Recepción', tono: 'neutro' },
] as const

/** "Studio Kuña" → "studiokuna", igual que en el diseño. */
export function slugDe(nombre: string): string {
  return (nombre || 'tu-local')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '')
}
