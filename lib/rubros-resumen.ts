/**
 * El resumen por rubro de `diseno/Rubros.dc.html`: cómo se trabaja, qué
 * guarda la ficha, un catálogo de ejemplo y la agenda de un día.
 *
 * Es distinto de `lib/rubros.ts`, que trae el contenido largo de las nueve
 * landings. Acá va lo que se ve en la comparativa de /rubros.
 *
 * Generado del diseño, no escrito a mano.
 */

export type RubroResumen = {
  slug: string
  nombre: string
  posesivo: string
  bullets: string[]
  ficha: string[]
  servicios: { nombre: string; dur: string; precio: string }[]
  miniAgenda: { hora: string; cliente: string; servicio: string; online: boolean }[]
}

export const RUBROS_RESUMEN: RubroResumen[] = [
  {
    "slug": "peluqueria",
    "nombre": "Peluquería",
    "posesivo": "una peluquería",
    "bullets": [
      "Cada servicio con su duración: el corte ocupa 30 minutos y el color, dos horas y media.",
      "Producción por estilista en el reporte, para liquidar comisiones sin planilla aparte.",
      "La ficha guarda la fórmula de color y qué se hizo en cada visita."
    ],
    "ficha": [
      "Fórmula de color",
      "Tipo de cabello",
      "Alergias",
      "Profesional habitual",
      "Fotos antes y después",
      "Frecuencia de raíz"
    ],
    "servicios": [
      {
        "nombre": "Corte",
        "dur": "30 min",
        "precio": "Gs. 90.000"
      },
      {
        "nombre": "Corte + barba",
        "dur": "60 min",
        "precio": "Gs. 110.000"
      },
      {
        "nombre": "Color raíz",
        "dur": "150 min",
        "precio": "Gs. 250.000"
      },
      {
        "nombre": "Alisado",
        "dur": "120 min",
        "precio": "Gs. 620.000"
      }
    ],
    "miniAgenda": [
      {
        "hora": "09:00",
        "cliente": "Marcos A.",
        "servicio": "Corte + barba",
        "online": false
      },
      {
        "hora": "10:30",
        "cliente": "Lucía B.",
        "servicio": "Color raíz",
        "online": false
      },
      {
        "hora": "13:00",
        "cliente": "Rocío C.",
        "servicio": "Brushing · reserva online",
        "online": true
      }
    ]
  },
  {
    "slug": "estetica",
    "nombre": "Estética y spa",
    "posesivo": "un centro de estética",
    "bullets": [
      "Las cabinas y camillas se reservan como recurso, no solo el profesional.",
      "Paquetes de sesiones con pagos parciales y el saldo pendiente siempre a la vista.",
      "Fotos de evolución y consentimientos firmados en la ficha."
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
    "miniAgenda": [
      {
        "hora": "09:30",
        "cliente": "Sofía R.",
        "servicio": "Limpieza facial · reserva online",
        "online": true
      },
      {
        "hora": "11:00",
        "cliente": "Andrea G.",
        "servicio": "Masaje descontracturante",
        "online": false
      },
      {
        "hora": "14:00",
        "cliente": "Paola N.",
        "servicio": "Láser · sesión 4 de 8",
        "online": false
      }
    ]
  },
  {
    "slug": "unas",
    "nombre": "Uñas y pestañas",
    "posesivo": "un estudio de uñas",
    "bullets": [
      "Turnos cortos y encadenados: la agenda muestra los huecos reales del día.",
      "Aviso de retoque a las tres semanas del último servicio, listo para enviar.",
      "Diseños, colores y preferencias guardados por clienta."
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
    "miniAgenda": [
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
      }
    ]
  },
  {
    "slug": "gimnasios",
    "nombre": "Gimnasios",
    "posesivo": "un gimnasio",
    "bullets": [
      "Cuotas mensuales con vencimiento y lista de socios en mora, sin planilla.",
      "Clases con cupo limitado y lista de espera cuando se llena.",
      "Rutinas y medidas del socio con el historial de cada control."
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
    "miniAgenda": [
      {
        "hora": "07:00",
        "cliente": "Clase de funcional",
        "servicio": "14 de 16 lugares · online",
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
      }
    ]
  },
  {
    "slug": "odontologia",
    "nombre": "Odontología",
    "posesivo": "un consultorio odontológico",
    "bullets": [
      "Odontograma de 32 piezas con estado y nota por diente.",
      "Planes de tratamiento con presupuesto, cuotas y saldo en tiempo real.",
      "Radiografías, recetas y consentimientos adjuntos a la ficha."
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
    "miniAgenda": [
      {
        "hora": "08:00",
        "cliente": "Ramón E.",
        "servicio": "Endodoncia · sesión 2 de 3",
        "online": false
      },
      {
        "hora": "09:30",
        "cliente": "Elena F.",
        "servicio": "Profilaxis · reserva online",
        "online": true
      },
      {
        "hora": "11:00",
        "cliente": "Hugo M.",
        "servicio": "Control de ortodoncia · online",
        "online": true
      }
    ]
  },
  {
    "slug": "kinesiologia",
    "nombre": "Kinesiología",
    "posesivo": "un centro de kinesiología",
    "bullets": [
      "Series de sesiones con control de asistencia y sesiones restantes.",
      "Evolución escrita por sesión y alta del paciente cuando termina el tratamiento.",
      "Órdenes médicas y derivaciones adjuntas a la ficha."
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
    "miniAgenda": [
      {
        "hora": "08:00",
        "cliente": "Óscar V.",
        "servicio": "Rodilla · sesión 5 de 10",
        "online": false
      },
      {
        "hora": "09:00",
        "cliente": "Mirta S.",
        "servicio": "Cervicalgia · sesión 2 de 8",
        "online": false
      },
      {
        "hora": "10:00",
        "cliente": "Fabián R.",
        "servicio": "Evaluación postural · online",
        "online": true
      }
    ]
  },
  {
    "slug": "nutricion",
    "nombre": "Nutrición",
    "posesivo": "un consultorio de nutrición",
    "bullets": [
      "Peso, medidas y composición con el historial de cada control.",
      "Plan alimentario adjunto a la ficha y visible en el portal del paciente.",
      "Recordatorio del próximo control según la frecuencia que definís."
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
    "miniAgenda": [
      {
        "hora": "08:30",
        "cliente": "Gabriela L.",
        "servicio": "Primera consulta · online",
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
        "servicio": "Antropometría · online",
        "online": true
      }
    ]
  },
  {
    "slug": "consultorios",
    "nombre": "Consultorios médicos",
    "posesivo": "un consultorio médico",
    "bullets": [
      "Agenda por profesional y por consultorio, con feriados y vacaciones bloqueados de verdad.",
      "Historia clínica con notas de evolución, diagnóstico y recetas en PDF.",
      "Portal del paciente para ver sus turnos y su historial sin llamar."
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
    "miniAgenda": [
      {
        "hora": "08:00",
        "cliente": "Teresa A.",
        "servicio": "Consulta clínica",
        "online": false
      },
      {
        "hora": "08:30",
        "cliente": "Carlos O.",
        "servicio": "Control de presión · online",
        "online": true
      },
      {
        "hora": "09:15",
        "cliente": "María I.",
        "servicio": "Primera consulta · online",
        "online": true
      }
    ]
  },
  {
    "slug": "tatuajes",
    "nombre": "Tatuajes",
    "posesivo": "un estudio de tatuajes",
    "bullets": [
      "Presupuesto por sesión con seña cobrada al momento de reservar.",
      "Referencias y diseños guardados en la ficha del cliente.",
      "Consentimiento y cuidados posteriores firmados desde el celular."
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
    "miniAgenda": [
      {
        "hora": "11:00",
        "cliente": "Bruno S.",
        "servicio": "Sesión 2 · brazo",
        "online": false
      },
      {
        "hora": "14:00",
        "cliente": "Ariel C.",
        "servicio": "Diseño y presupuesto · online",
        "online": true
      },
      {
        "hora": "16:00",
        "cliente": "Dana R.",
        "servicio": "Fineline · reserva online",
        "online": true
      }
    ]
  }
]
