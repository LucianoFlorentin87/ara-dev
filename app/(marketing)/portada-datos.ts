/**
 * El contenido de la portada, tal como está en `diseno/Landing v4.dc.html`.
 * Ahí va escrito dentro del markup; acá se separa para que la página quede
 * legible, pero los textos no se tocan.
 */

export const ESTADISTICAS = [
  ['14 días', 'de prueba, sin tarjeta ni compromiso'],
  ['9 rubros', 'un sistema, la ficha de cada uno'],
  ['Sin instalar', 'en la compu del local y en el celular'],
  ['En guaraníes', 'precios, cobros y reportes'],
] as const

export type Fila = {
  tono: 'brand' | 'warm'
  etiqueta: string
  titulo: string
  texto: [string, string, string]
  foto: string
  invertida: boolean
}

/** El `texto` viene partido en tres porque el del medio va en negrita. */
export const FILAS: Fila[] = [
  {
    tono: 'brand',
    etiqueta: 'Agenda',
    titulo: 'Dos turnos nunca más en el mismo horario',
    texto: [
      'Cada servicio tiene su duración real y cada profesional su columna. Si el horario ya está tomado, el sistema ',
      'no lo deja guardar',
      '. También reserva la cabina, el sillón o el consultorio, no solo a la persona.',
    ],
    foto: 'Foto: la agenda abierta en el mostrador',
    invertida: false,
  },
  {
    tono: 'warm',
    etiqueta: 'Reserva online',
    titulo: 'Un link en tu Instagram y los turnos entran solos',
    texto: [
      'El cliente elige servicio, profesional y horario libre desde el celular, ',
      'también a las once de la noche',
      '. El turno cae directo en tu agenda y nadie tiene que cargarlo a mano.',
    ],
    foto: 'Foto: cliente reservando desde el celular',
    invertida: true,
  },
  {
    tono: 'brand',
    etiqueta: 'Ficha e historial',
    titulo: 'Nadie tiene que acordarse de nada',
    texto: [
      'La fórmula de color, la alergia declarada, el odontograma, las sesiones que quedan del paquete. Cada rubro tiene ',
      'sus propios campos',
      ', con fotos y notas de cada visita.',
    ],
    foto: 'Foto: profesional con la ficha del cliente',
    invertida: false,
  },
  {
    tono: 'warm',
    etiqueta: 'Caja y números',
    titulo: 'Cerrás el día y sabés cuánto entró',
    texto: [
      'Corte de efectivo con la diferencia calculada, medios de pago separados y comprobante en PDF. Al final del mes ves la ',
      'producción de cada profesional',
      ' sin armar una planilla.',
    ],
    foto: 'Foto: cierre de caja al final del día',
    invertida: true,
  },
]

/** Los tres del recall. En el diseño son fijos; acá también: es una muestra. */
export const RECALL = [
  ['Belén O.', 'Última visita: 04/03 · Color raíz'],
  ['Kevin M.', 'Última visita: 19/02 · Corte'],
  ['Silvia A.', 'Última visita: 28/01 · Alisado'],
] as const

/** El turno del día que se ve en la tarjeta flotante del hero. */
export const AGENDA_HERO = [
  { hora: '09:00', quien: 'Marcos A.', que: 'Corte + barba', tono: 'brand' as const, destacado: false },
  { hora: '10:30', quien: 'Lucía B.', que: 'Color raíz · en atención', tono: 'brand' as const, destacado: true },
  { hora: '13:00', quien: 'Rocío C.', que: 'Brushing · reserva online', tono: 'warm' as const, destacado: false },
]

/** Las etiquetas de las pastillas de rubro, más largas que el nombre corto. */
export const ETIQUETA_PORTADA: Record<string, string> = {
  peluqueria: 'Peluquería y barbería',
  estetica: 'Estética y spa',
  unas: 'Uñas y pestañas',
  gimnasios: 'Gimnasios',
  odontologia: 'Odontología',
  kinesiologia: 'Kinesiología',
  nutricion: 'Nutrición',
  consultorios: 'Consultorios médicos',
  tatuajes: 'Tatuajes',
}
