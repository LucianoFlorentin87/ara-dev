/**
 * Los nueve rubros con todo el contenido de su landing.
 *
 * Extraídos con un script del objeto RUBROS de los `Landing <rubro>.dc.html`,
 * no transcritos a mano. Las nueve landings son un mismo componente
 * parametrizado, igual que en el diseño.
 */

export type Rubro = {
  slug: string
  nombre: string
  posesivo: string
  etiqueta: string
  titular: string
  bajada: string
  turnosHoy: string
  notaAgenda: string
  tituloProblemas: string
  tituloReserva: string
  textoReserva: string
  cierre: string
  problemas: { antes: string; titulo: string; texto: string }[]
  ficha: string[]
  servicios: { nombre: string; dur: string; precio: string }[]
  agenda: { hora: string; cliente: string; servicio: string; online: boolean }[]
  faq: { p: string; r: string }[]
}

export const RUBROS: Rubro[] = [
  {
    "slug": "peluqueria",
    "nombre": "Peluquería",
    "posesivo": "tu peluquería",
    "etiqueta": "Para peluquerías y barberías",
    "titular": "La agenda de tu peluquería, sin cuaderno",
    "bajada": "Cada servicio con su duración real, una columna por estilista y la fórmula de color de cada clienta guardada. Sin instalar nada.",
    "turnosHoy": "14 turnos hoy",
    "notaAgenda": "3 entraron solos por el link",
    "tituloProblemas": "El cuaderno del mostrador ya no da",
    "tituloReserva": "Un link en tu Instagram y los turnos entran solos",
    "textoReserva": "La clienta elige corte o color, elige a su estilista y ve los horarios que quedan libres. El turno cae directo en la agenda, con la duración correcta según el servicio.",
    "cierre": "Cargá tus servicios hoy y mañana tomás turnos desde el link",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "Dos clientas al mismo horario",
        "texto": "El color ocupa dos horas y media y el corte treinta minutos. El sistema conoce cada duración, así que no deja agendar encima ni dejar el sillón vacío."
      },
      {
        "antes": "Antes",
        "titulo": "¿Qué fórmula le hicimos?",
        "texto": "La fórmula, el tono y qué se le hizo la última vez quedan en la ficha. Cualquier estilista abre el turno y lo ve, aunque no la haya atendido nunca."
      },
      {
        "antes": "Antes",
        "titulo": "La planilla de comisiones",
        "texto": "La producción de cada estilista sale calculada al cierre del mes, con su porcentaje. No hay que sumar tickets a mano."
      }
    ],
    "ficha": [
      "Fórmula de color",
      "Tipo de cabello",
      "Alergias",
      "Estilista habitual",
      "Fotos antes y después",
      "Frecuencia de raíz"
    ],
    "servicios": [
      {
        "nombre": "Corte de dama",
        "dur": "45 min",
        "precio": "Gs. 120.000"
      },
      {
        "nombre": "Color raíz",
        "dur": "150 min",
        "precio": "Gs. 250.000"
      },
      {
        "nombre": "Balayage",
        "dur": "210 min",
        "precio": "Gs. 780.000"
      },
      {
        "nombre": "Brushing",
        "dur": "40 min",
        "precio": "Gs. 90.000"
      }
    ],
    "agenda": [
      {
        "hora": "09:00",
        "cliente": "Marcos A.",
        "servicio": "Corte + barba",
        "online": false
      },
      {
        "hora": "10:30",
        "cliente": "Lucía B.",
        "servicio": "Color raíz · en atención",
        "online": false
      },
      {
        "hora": "13:00",
        "cliente": "Rocío C.",
        "servicio": "Brushing · reserva online",
        "online": true
      },
      {
        "hora": "15:30",
        "cliente": "Diego T.",
        "servicio": "Corte",
        "online": false
      }
    ],
    "faq": [
      {
        "p": "¿Puedo tener precios distintos por estilista?",
        "r": "Sí. Un mismo servicio puede tener un precio por profesional, y el sistema usa el que corresponda cuando se agenda con esa persona."
      },
      {
        "p": "¿Sirve para liquidar comisiones?",
        "r": "El reporte de producción muestra lo facturado por cada estilista en el período, con su porcentaje aplicado. Se exporta a CSV para pasarlo a tu planilla de sueldos."
      },
      {
        "p": "¿Qué pasa con las clientas que vienen sin turno?",
        "r": "Se cargan en el momento desde el mostrador y quedan en la agenda igual. La sala de espera muestra quién está esperando y desde cuándo."
      }
    ]
  },
  {
    "slug": "estetica",
    "nombre": "Estética y spa",
    "posesivo": "tu centro de estética",
    "etiqueta": "Para centros de estética y spa",
    "titular": "Cabinas, paquetes y evolución, en un solo lugar",
    "bajada": "Las camillas se reservan como recurso, los paquetes de sesiones llevan su propio saldo y las fotos de evolución quedan en la ficha.",
    "turnosHoy": "11 turnos hoy",
    "notaAgenda": "2 cabinas ocupadas ahora",
    "tituloProblemas": "El problema no son los turnos: son las cabinas",
    "tituloReserva": "Que reserven la sesión sin llamar al local",
    "textoReserva": "La clienta elige el tratamiento y ve los horarios en los que hay cabina libre y profesional disponible. Si es parte de un paquete, el sistema descuenta la sesión sola.",
    "cierre": "Ordená las cabinas y los paquetes esta semana",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "Dos tratamientos, una sola camilla",
        "texto": "El sistema reserva la cabina además del profesional. Si la camilla está ocupada, ese horario no se ofrece, aunque la esteticista esté libre."
      },
      {
        "antes": "Antes",
        "titulo": "¿Cuántas sesiones le quedan?",
        "texto": "Los paquetes llevan su cuenta: sesiones usadas, sesiones restantes y el saldo si pagó en partes. Está a la vista al abrir el turno."
      },
      {
        "antes": "Antes",
        "titulo": "El antes y después perdido",
        "texto": "Las fotos de cada sesión y los consentimientos firmados quedan en la ficha, ordenados por fecha, no en el celular de quien atendió."
      }
    ],
    "ficha": [
      "Tipo de piel",
      "Tratamientos activos",
      "Sesiones restantes",
      "Contraindicaciones",
      "Fotos de evolución",
      "Consentimientos"
    ],
    "servicios": [
      {
        "nombre": "Limpieza facial",
        "dur": "60 min",
        "precio": "Gs. 180.000"
      },
      {
        "nombre": "Masaje descontracturante",
        "dur": "60 min",
        "precio": "Gs. 200.000"
      },
      {
        "nombre": "Depilación láser",
        "dur": "45 min",
        "precio": "Gs. 320.000"
      },
      {
        "nombre": "Drenaje linfático",
        "dur": "75 min",
        "precio": "Gs. 260.000"
      }
    ],
    "agenda": [
      {
        "hora": "09:30",
        "cliente": "Sofía R.",
        "servicio": "Limpieza facial · cabina 1",
        "online": true
      },
      {
        "hora": "11:00",
        "cliente": "Andrea G.",
        "servicio": "Masaje · cabina 2",
        "online": false
      },
      {
        "hora": "14:00",
        "cliente": "Paola N.",
        "servicio": "Láser · sesión 4 de 8",
        "online": false
      },
      {
        "hora": "16:00",
        "cliente": "Belén O.",
        "servicio": "Drenaje · reserva online",
        "online": true
      }
    ],
    "faq": [
      {
        "p": "¿Puedo vender paquetes de sesiones?",
        "r": "Sí. Definís cuántas sesiones incluye y a qué precio. El sistema descuenta una por visita, muestra las restantes y lleva el saldo si la clienta paga en cuotas."
      },
      {
        "p": "¿Cómo manejo las cabinas?",
        "r": "Cada cabina o camilla se carga como un recurso. Un turno ocupa profesional y cabina a la vez, así que no se puede sobrevender el espacio."
      },
      {
        "p": "¿Se pueden guardar fotos de evolución?",
        "r": "Sí, en la ficha de cada clienta, con fecha. Es la forma de mostrar el resultado de un tratamiento largo cuando la clienta duda de si funcionó."
      }
    ]
  },
  {
    "slug": "unas",
    "nombre": "Uñas y pestañas",
    "posesivo": "tu estudio de uñas",
    "etiqueta": "Para estudios de uñas, cejas y pestañas",
    "titular": "Turnos cortos, agenda llena, retoques a tiempo",
    "bajada": "La agenda muestra los huecos reales entre turno y turno, y el aviso de retoque sale solo a las tres semanas del último servicio.",
    "turnosHoy": "16 turnos hoy",
    "notaAgenda": "5 entraron solos por el link",
    "tituloProblemas": "Cuando los turnos son cortos, cada hueco cuesta",
    "tituloReserva": "Que elijan el diseño y el horario desde Instagram",
    "textoReserva": "La clienta entra desde tu perfil, elige el servicio, ve los huecos reales del día y reserva. Los turnos cortos se encadenan sin dejar espacios muertos.",
    "cierre": "Llená los huecos de esta semana",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "Media hora perdida entre turnos",
        "texto": "Con turnos de treinta y sesenta minutos, la agenda queda con huecos que no se ven. El sistema los muestra y los ofrece en la reserva online."
      },
      {
        "antes": "Antes",
        "titulo": "La clienta que no vuelve a tiempo",
        "texto": "A las tres semanas del kapping, el sistema te arma el mensaje de retoque. Abrís WhatsApp y lo mandás: no hay que revisar la agenda vieja."
      },
      {
        "antes": "Antes",
        "titulo": "¿Qué diseño le gustó?",
        "texto": "Colores, largo, diseño y las fotos del último trabajo quedan en su ficha. Se repite lo que le gustó sin preguntar de nuevo."
      }
    ],
    "ficha": [
      "Último diseño",
      "Colores usados",
      "Alergias a productos",
      "Frecuencia de retoque",
      "Fotos del trabajo",
      "Largo preferido"
    ],
    "servicios": [
      {
        "nombre": "Kapping + diseño",
        "dur": "90 min",
        "precio": "Gs. 160.000"
      },
      {
        "nombre": "Retoque semipermanente",
        "dur": "60 min",
        "precio": "Gs. 110.000"
      },
      {
        "nombre": "Lifting de pestañas",
        "dur": "75 min",
        "precio": "Gs. 190.000"
      },
      {
        "nombre": "Perfilado de cejas",
        "dur": "30 min",
        "precio": "Gs. 70.000"
      }
    ],
    "agenda": [
      {
        "hora": "08:30",
        "cliente": "Camila D.",
        "servicio": "Kapping + diseño",
        "online": false
      },
      {
        "hora": "10:00",
        "cliente": "Julia M.",
        "servicio": "Lifting · reserva online",
        "online": true
      },
      {
        "hora": "11:30",
        "cliente": "Tamara R.",
        "servicio": "Retoque · reserva online",
        "online": true
      },
      {
        "hora": "15:00",
        "cliente": "Nadia V.",
        "servicio": "Perfilado de cejas",
        "online": false
      }
    ],
    "faq": [
      {
        "p": "¿El aviso de retoque se manda solo?",
        "r": "El sistema arma la lista y el texto. Vos apretás enviar y sale de tu propio WhatsApp, con tu número. Así no hay costo por mensaje ni un número desconocido escribiéndoles."
      },
      {
        "p": "¿Puedo trabajar sola sin recepción?",
        "r": "Sí, el plan Individual está pensado para eso: vos atendés y la reserva online hace de recepción. Los turnos entran mientras trabajás."
      },
      {
        "p": "¿Cómo cobro la seña de un diseño largo?",
        "r": "Podés pedir seña obligatoria en los servicios que superen una duración. El saldo pendiente queda registrado y se cobra al terminar."
      }
    ]
  },
  {
    "slug": "gimnasios",
    "nombre": "Gimnasios",
    "posesivo": "tu gimnasio",
    "etiqueta": "Para gimnasios y estudios de entrenamiento",
    "titular": "Cuotas al día, clases con cupo, socios que vuelven",
    "bajada": "Vencimientos de cuota, lista de morosos, clases con cupo y lista de espera, y las medidas de cada socio con su historial.",
    "turnosHoy": "6 clases hoy",
    "notaAgenda": "2 con lista de espera",
    "tituloProblemas": "La planilla de cuotas no escala",
    "tituloReserva": "Que reserven su lugar en la clase desde el celular",
    "textoReserva": "El socio ve las clases del día, el cupo que queda y reserva su lugar. Si está completo entra en lista de espera, y si alguien cancela el sistema te dice a quién ofrecerle el lugar.",
    "cierre": "Ordená las cuotas antes de fin de mes",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "Nadie sabe quién debe",
        "texto": "Cada cuota tiene su vencimiento y el sistema arma la lista de socios en mora, con un botón para escribirles. No hay que revisar la planilla socio por socio."
      },
      {
        "antes": "Antes",
        "titulo": "La clase se llenó y nadie avisó",
        "texto": "Las clases tienen cupo. Cuando se completa, los siguientes entran en lista de espera y se les avisa si se libera un lugar."
      },
      {
        "antes": "Antes",
        "titulo": "El socio que se va sin decir nada",
        "texto": "El sistema te muestra quién dejó de venir aunque tenga la cuota paga. Son los que se dan de baja el mes siguiente si nadie los llama."
      }
    ],
    "ficha": [
      "Plan y vencimiento",
      "Objetivo",
      "Medidas y peso",
      "Rutina actual",
      "Aptitud física",
      "Asistencia del mes"
    ],
    "servicios": [
      {
        "nombre": "Cuota mensual libre",
        "dur": "mensual",
        "precio": "Gs. 180.000"
      },
      {
        "nombre": "Pase semanal",
        "dur": "7 días",
        "precio": "Gs. 70.000"
      },
      {
        "nombre": "Evaluación inicial",
        "dur": "45 min",
        "precio": "Gs. 90.000"
      },
      {
        "nombre": "Entrenamiento personalizado",
        "dur": "60 min",
        "precio": "Gs. 120.000"
      }
    ],
    "agenda": [
      {
        "hora": "07:00",
        "cliente": "Funcional",
        "servicio": "14 de 16 lugares",
        "online": true
      },
      {
        "hora": "09:00",
        "cliente": "Iván C.",
        "servicio": "Evaluación inicial",
        "online": false
      },
      {
        "hora": "18:00",
        "cliente": "Spinning",
        "servicio": "Completo · 3 en espera",
        "online": true
      },
      {
        "hora": "19:30",
        "cliente": "Laura P.",
        "servicio": "Cambio de rutina",
        "online": false
      }
    ],
    "faq": [
      {
        "p": "¿Maneja cuotas mensuales, no solo turnos?",
        "r": "Sí. La cuota es un servicio con vencimiento: el sistema sabe cuándo vence cada socio, quién está al día y quién debe, y te deja escribirle a los morosos en un paso."
      },
      {
        "p": "¿Puedo limitar el cupo de una clase?",
        "r": "Sí, cada clase tiene su cupo. Cuando se llena, las reservas siguientes van a lista de espera y se avisa automáticamente si alguien cancela."
      },
      {
        "p": "¿Sirve para llevar rutinas?",
        "r": "La ficha guarda la rutina actual, las medidas y el historial de cada control, así se ve la evolución del socio sin depender del cuaderno del profesor."
      }
    ]
  },
  {
    "slug": "odontologia",
    "nombre": "Odontología",
    "posesivo": "tu consultorio odontológico",
    "etiqueta": "Para consultorios odontológicos",
    "titular": "Odontograma, presupuesto y saldo en la misma ficha",
    "bajada": "Las 32 piezas con estado y nota, planes de tratamiento con cuotas y saldo en tiempo real, y las radiografías adjuntas.",
    "turnosHoy": "12 turnos hoy",
    "notaAgenda": "2 controles de ortodoncia",
    "tituloProblemas": "El tratamiento largo es donde se pierde la plata",
    "tituloReserva": "Que confirmen o pidan turno sin llamar",
    "textoReserva": "El paciente ve sus turnos, confirma el próximo y pide uno nuevo desde el celular. La recepción deja de perder la mañana devolviendo llamadas.",
    "cierre": "Ordená los planes de tratamiento este mes",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "¿En qué pieza quedamos?",
        "texto": "El odontograma de 32 piezas guarda el estado y la nota de cada diente, con la fecha. Se abre desde el turno y se ve en qué quedó la sesión anterior."
      },
      {
        "antes": "Antes",
        "titulo": "El presupuesto que nadie sigue",
        "texto": "El plan de tratamiento lleva su presupuesto, las cuotas acordadas y el saldo actualizado. Se ve cuánto falta cobrar y cuántas sesiones quedan."
      },
      {
        "antes": "Antes",
        "titulo": "Pacientes que abandonan a mitad",
        "texto": "El sistema marca los tratamientos empezados sin próxima cita y te deja escribirles. Son los que vuelven recién cuando duele."
      }
    ],
    "ficha": [
      "Odontograma",
      "Historia médica",
      "Plan de tratamiento",
      "Saldo del plan",
      "Radiografías",
      "Recetas"
    ],
    "servicios": [
      {
        "nombre": "Consulta y diagnóstico",
        "dur": "30 min",
        "precio": "Gs. 120.000"
      },
      {
        "nombre": "Profilaxis",
        "dur": "45 min",
        "precio": "Gs. 200.000"
      },
      {
        "nombre": "Restauración",
        "dur": "60 min",
        "precio": "Gs. 350.000"
      },
      {
        "nombre": "Endodoncia",
        "dur": "90 min",
        "precio": "Gs. 700.000"
      }
    ],
    "agenda": [
      {
        "hora": "08:00",
        "cliente": "Ramón E.",
        "servicio": "Endodoncia · sesión 2 de 3",
        "online": false
      },
      {
        "hora": "09:30",
        "cliente": "Elena F.",
        "servicio": "Profilaxis · en atención",
        "online": false
      },
      {
        "hora": "11:00",
        "cliente": "Hugo M.",
        "servicio": "Control de ortodoncia",
        "online": true
      },
      {
        "hora": "14:30",
        "cliente": "Silvia A.",
        "servicio": "Restauración 26",
        "online": true
      }
    ],
    "faq": [
      {
        "p": "¿Incluye odontograma?",
        "r": "Sí, de 32 piezas, con estado y nota por diente y el historial de cada cambio. Es parte de la ficha, no un módulo aparte."
      },
      {
        "p": "¿Puedo cobrar un tratamiento en cuotas?",
        "r": "El plan de tratamiento lleva presupuesto, cuotas y saldo. Cada pago se registra y el saldo se actualiza, así que se ve cuánto falta en cualquier momento."
      },
      {
        "p": "¿Se pueden adjuntar radiografías?",
        "r": "Sí, radiografías, estudios y consentimientos quedan adjuntos a la ficha del paciente, ordenados por fecha."
      }
    ]
  },
  {
    "slug": "kinesiologia",
    "nombre": "Kinesiología",
    "posesivo": "tu centro de kinesiología",
    "etiqueta": "Para kinesiología y fisioterapia",
    "titular": "Series de sesiones con la evolución escrita",
    "bajada": "Cada tratamiento con sus sesiones, la asistencia controlada, la evolución por sesión y la orden médica adjunta.",
    "turnosHoy": "15 sesiones hoy",
    "notaAgenda": "4 tratamientos por terminar",
    "tituloProblemas": "El paciente que falta rompe la serie",
    "tituloReserva": "Que reserven sus sesiones de la semana de una vez",
    "textoReserva": "El paciente ve las sesiones que le quedan del tratamiento y reserva las de la semana en un paso. Menos llamadas y menos series que quedan a medias.",
    "cierre": "Ordená los tratamientos en curso",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "¿Cuántas sesiones lleva?",
        "texto": "La serie lleva su cuenta: sesiones hechas, sesiones restantes y asistencia. Se ve al abrir el turno, sin buscar en la ficha de papel."
      },
      {
        "antes": "Antes",
        "titulo": "La evolución que quedó en la cabeza",
        "texto": "Cada sesión tiene su nota de evolución con fecha. Si el paciente cambia de kinesiólogo o vuelve en un año, el historial está escrito."
      },
      {
        "antes": "Antes",
        "titulo": "Series que quedan sin terminar",
        "texto": "El sistema marca los tratamientos con sesiones pendientes y sin próxima cita, así se los puede llamar antes de que abandonen."
      }
    ],
    "ficha": [
      "Diagnóstico",
      "Sesiones restantes",
      "Evolución por sesión",
      "Orden médica",
      "Derivación",
      "Alta"
    ],
    "servicios": [
      {
        "nombre": "Evaluación inicial",
        "dur": "45 min",
        "precio": "Gs. 150.000"
      },
      {
        "nombre": "Sesión de rehabilitación",
        "dur": "45 min",
        "precio": "Gs. 120.000"
      },
      {
        "nombre": "Terapia manual",
        "dur": "60 min",
        "precio": "Gs. 160.000"
      },
      {
        "nombre": "Paquete de 10 sesiones",
        "dur": "10 turnos",
        "precio": "Gs. 1.000.000"
      }
    ],
    "agenda": [
      {
        "hora": "08:00",
        "cliente": "Óscar V.",
        "servicio": "Rodilla · sesión 5 de 10",
        "online": false
      },
      {
        "hora": "09:00",
        "cliente": "Mirta S.",
        "servicio": "Cervicalgia · 2 de 8",
        "online": false
      },
      {
        "hora": "10:00",
        "cliente": "Fabián R.",
        "servicio": "Evaluación postural",
        "online": true
      },
      {
        "hora": "16:00",
        "cliente": "Rosa A.",
        "servicio": "Terapia manual",
        "online": true
      }
    ],
    "faq": [
      {
        "p": "¿Puedo vender paquetes de sesiones?",
        "r": "Sí. Definís cuántas sesiones incluye el tratamiento y el sistema descuenta una por visita, lleva la asistencia y avisa cuando se está terminando la serie."
      },
      {
        "p": "¿Dónde queda la orden médica?",
        "r": "Adjunta a la ficha del paciente, junto con la derivación y los estudios. No hay que buscar el papel en el archivo."
      },
      {
        "p": "¿Se puede dar de alta a un paciente?",
        "r": "Sí. Al cerrar el tratamiento queda con fecha de alta y el historial completo, disponible si vuelve más adelante."
      }
    ]
  },
  {
    "slug": "nutricion",
    "nombre": "Nutrición",
    "posesivo": "tu consultorio de nutrición",
    "etiqueta": "Para consultorios de nutrición",
    "titular": "Controles, medidas y planes en un solo historial",
    "bajada": "Peso, medidas y composición con el historial de cada control, el plan alimentario adjunto y el recordatorio del próximo turno.",
    "turnosHoy": "9 turnos hoy",
    "notaAgenda": "3 primeras consultas",
    "tituloProblemas": "El paciente abandona entre el control y el siguiente",
    "tituloReserva": "Que reserven su control sin depender de tu agenda",
    "textoReserva": "El paciente pide su control desde el celular y recibe el recordatorio antes del turno. Menos ausencias y menos meses sin volver.",
    "cierre": "Ordená los controles de este mes",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "¿Cuánto bajó desde marzo?",
        "texto": "Cada control guarda peso, medidas y composición con fecha. La evolución se ve en un historial, no hay que sumar planillas de distintos meses."
      },
      {
        "antes": "Antes",
        "titulo": "El plan que quedó en un PDF perdido",
        "texto": "El plan alimentario queda adjunto a la ficha y visible en el portal del paciente, así que lo tiene siempre a mano en el celular."
      },
      {
        "antes": "Antes",
        "titulo": "El control que nunca se agendó",
        "texto": "El sistema avisa cuando pasó el tiempo que definiste entre controles y te deja escribirle al paciente antes de que se pierda del todo."
      }
    ],
    "ficha": [
      "Peso y medidas",
      "Antropometría",
      "Plan alimentario",
      "Objetivo",
      "Patologías",
      "Próximo control"
    ],
    "servicios": [
      {
        "nombre": "Primera consulta",
        "dur": "60 min",
        "precio": "Gs. 250.000"
      },
      {
        "nombre": "Control mensual",
        "dur": "30 min",
        "precio": "Gs. 130.000"
      },
      {
        "nombre": "Antropometría",
        "dur": "30 min",
        "precio": "Gs. 120.000"
      },
      {
        "nombre": "Plan deportivo",
        "dur": "60 min",
        "precio": "Gs. 300.000"
      }
    ],
    "agenda": [
      {
        "hora": "08:30",
        "cliente": "Gabriela L.",
        "servicio": "Primera consulta",
        "online": true
      },
      {
        "hora": "09:30",
        "cliente": "Nicolás F.",
        "servicio": "Control mensual",
        "online": false
      },
      {
        "hora": "11:00",
        "cliente": "Verónica P.",
        "servicio": "Antropometría",
        "online": true
      },
      {
        "hora": "15:00",
        "cliente": "Alan G.",
        "servicio": "Control deportivo",
        "online": false
      }
    ],
    "faq": [
      {
        "p": "¿Puedo ver la evolución de un paciente?",
        "r": "Sí. Cada control queda con fecha, peso y medidas, así que la ficha muestra la evolución completa desde la primera consulta."
      },
      {
        "p": "¿El paciente puede ver su plan?",
        "r": "Sí, desde el portal. El plan alimentario queda adjunto a su ficha y accesible desde su celular, sin que tengas que reenviarlo por WhatsApp."
      },
      {
        "p": "¿Sirve si atiendo online?",
        "r": "Sí. Cargás la consulta online como un servicio más y el turno funciona igual: recordatorio, ficha e historial."
      }
    ]
  },
  {
    "slug": "consultorios",
    "nombre": "Consultorios médicos",
    "posesivo": "tu consultorio médico",
    "etiqueta": "Para consultorios y centros médicos",
    "titular": "Agenda por profesional y por consultorio",
    "bajada": "Feriados y vacaciones bloqueados de verdad, historia clínica con notas de evolución y recetas en PDF, y portal para el paciente.",
    "turnosHoy": "22 turnos hoy",
    "notaAgenda": "3 consultorios en uso",
    "tituloProblemas": "La recepción se pasa la mañana al teléfono",
    "tituloReserva": "Que pidan y confirmen el turno sin llamar",
    "textoReserva": "El paciente ve los horarios libres del profesional que busca, pide el turno y lo confirma desde el celular. La recepción atiende a quien está en el mostrador.",
    "cierre": "Liberá el teléfono de la recepción",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "Dos médicos, un consultorio",
        "texto": "El consultorio se reserva como recurso además del profesional. Con tres médicos y dos salas, el sistema no deja agendar lo que no entra."
      },
      {
        "antes": "Antes",
        "titulo": "El profesional se toma vacaciones",
        "texto": "Los días bloqueados desaparecen de la reserva online y de la agenda. Nadie agenda un turno para una semana en que el médico no está."
      },
      {
        "antes": "Antes",
        "titulo": "La historia clínica en papel",
        "texto": "Notas de evolución, diagnósticos, recetas en PDF y estudios adjuntos, ordenados por fecha en la ficha del paciente."
      }
    ],
    "ficha": [
      "Historia clínica",
      "Notas de evolución",
      "Diagnósticos",
      "Recetas",
      "Estudios adjuntos",
      "Obra social"
    ],
    "servicios": [
      {
        "nombre": "Primera consulta",
        "dur": "30 min",
        "precio": "Gs. 200.000"
      },
      {
        "nombre": "Consulta de control",
        "dur": "20 min",
        "precio": "Gs. 150.000"
      },
      {
        "nombre": "Lectura de estudios",
        "dur": "20 min",
        "precio": "Gs. 120.000"
      },
      {
        "nombre": "Certificado médico",
        "dur": "15 min",
        "precio": "Gs. 80.000"
      }
    ],
    "agenda": [
      {
        "hora": "08:00",
        "cliente": "Teresa A.",
        "servicio": "Consulta clínica · sala 1",
        "online": false
      },
      {
        "hora": "08:30",
        "cliente": "Carlos O.",
        "servicio": "Control de presión",
        "online": true
      },
      {
        "hora": "09:15",
        "cliente": "María I.",
        "servicio": "Primera consulta",
        "online": true
      },
      {
        "hora": "10:00",
        "cliente": "Pedro B.",
        "servicio": "Resultados de estudios",
        "online": false
      }
    ],
    "faq": [
      {
        "p": "¿Maneja varios profesionales y consultorios?",
        "r": "Sí. Cada profesional tiene su agenda y su horario, y cada consultorio se reserva como recurso, así que no se puede agendar sin sala disponible."
      },
      {
        "p": "¿Emite recetas?",
        "r": "Genera la receta en PDF desde la consulta, con los datos del profesional y del paciente, lista para imprimir o enviar."
      },
      {
        "p": "¿El paciente puede ver su historial?",
        "r": "Desde el portal ve sus turnos y lo que vos habilites de su historial. Las notas clínicas privadas no se muestran."
      }
    ]
  },
  {
    "slug": "tatuajes",
    "nombre": "Tatuajes",
    "posesivo": "tu estudio de tatuajes",
    "etiqueta": "Para estudios de tatuajes",
    "titular": "Señas cobradas, sesiones agendadas, diseños guardados",
    "bajada": "Presupuesto por sesión con seña al reservar, referencias en la ficha del cliente y el consentimiento firmado desde el celular.",
    "turnosHoy": "5 sesiones hoy",
    "notaAgenda": "2 señadas por el link",
    "tituloProblemas": "La sesión que se cae sin seña es plata perdida",
    "tituloReserva": "Que dejen la seña al reservar el diseño",
    "textoReserva": "El cliente elige la sesión, ve tus horarios libres y queda registrado con la seña que definiste. Si no aparece, la seña ya está cobrada.",
    "cierre": "Cobrá la seña antes de bloquear la agenda",
    "problemas": [
      {
        "antes": "Antes",
        "titulo": "Bloqueás tres horas y no viene",
        "texto": "Los servicios largos pueden exigir seña obligatoria al reservar. El horario se bloquea recién cuando la seña está registrada."
      },
      {
        "antes": "Antes",
        "titulo": "Las referencias en el chat",
        "texto": "El diseño acordado, la zona, el tamaño y las fotos de referencia quedan en la ficha del cliente, no perdidas en una conversación de Instagram."
      },
      {
        "antes": "Antes",
        "titulo": "El consentimiento en papel",
        "texto": "El consentimiento y los cuidados posteriores se firman y se envían desde el celular, y quedan guardados con la fecha de la sesión."
      }
    ],
    "ficha": [
      "Diseño acordado",
      "Zona y tamaño",
      "Sesiones previstas",
      "Seña cobrada",
      "Consentimiento",
      "Cuidados enviados"
    ],
    "servicios": [
      {
        "nombre": "Diseño y presupuesto",
        "dur": "30 min",
        "precio": "sin cargo"
      },
      {
        "nombre": "Fineline",
        "dur": "90 min",
        "precio": "Gs. 450.000"
      },
      {
        "nombre": "Sesión de 3 horas",
        "dur": "180 min",
        "precio": "Gs. 900.000"
      },
      {
        "nombre": "Retoque",
        "dur": "45 min",
        "precio": "Gs. 150.000"
      }
    ],
    "agenda": [
      {
        "hora": "11:00",
        "cliente": "Bruno S.",
        "servicio": "Sesión 2 · brazo",
        "online": false
      },
      {
        "hora": "14:00",
        "cliente": "Ariel C.",
        "servicio": "Diseño · reserva online",
        "online": true
      },
      {
        "hora": "16:00",
        "cliente": "Dana R.",
        "servicio": "Fineline · señado",
        "online": true
      },
      {
        "hora": "18:30",
        "cliente": "Kevin M.",
        "servicio": "Retoque",
        "online": false
      }
    ],
    "faq": [
      {
        "p": "¿Puedo pedir seña obligatoria?",
        "r": "Sí, y podés definir a partir de qué duración o en qué servicios se exige. El turno queda reservado cuando la seña está registrada."
      },
      {
        "p": "¿Dónde guardo las referencias del diseño?",
        "r": "En la ficha del cliente, con las fotos, la zona, el tamaño y las sesiones previstas. Todo junto y con fecha."
      },
      {
        "p": "¿Sirve para un estudio con varios tatuadores?",
        "r": "Sí. Cada tatuador tiene su agenda, su catálogo de precios y su producción, y el cliente puede elegir con quién se tatúa."
      }
    ]
  }
]

export function rubroPorSlug(s: string): Rubro | undefined {
  return RUBROS.find((r) => r.slug === s)
}
