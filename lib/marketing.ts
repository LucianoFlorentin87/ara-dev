/**
 * Contenido de las páginas de marketing.
 *
 * Extraído con un script de los .dc.html de `diseno/`, no transcrito a
 * mano: los textos son exactamente los que se diseñaron. Los iconos se
 * descartaron; el resto va tal cual.
 */

export const FUNCIONES = [
  {
    "n": "01",
    "titulo": "Agenda sin doble reserva",
    "texto": "Turnos por profesional y por recurso: sillón, cabina, camilla o consultorio. Si el horario ya está tomado, el sistema no lo deja guardar.",
    "tono": "brand"
  },
  {
    "n": "02",
    "titulo": "Reserva online",
    "texto": "Un link para compartir por WhatsApp o Instagram. El cliente elige servicio, profesional y horario libre, y el turno entra directo a tu agenda.",
    "tono": "warm"
  },
  {
    "n": "03",
    "titulo": "Ficha e historial",
    "texto": "Datos, notas, fotos y todo lo que se le hizo al cliente, con el detalle propio de tu rubro. Nadie tiene que acordarse de nada.",
    "tono": "brand"
  },
  {
    "n": "04",
    "titulo": "Caja y cobros",
    "texto": "Apertura y cierre de turno, corte de efectivo con la diferencia calculada, medios de pago y comprobante en PDF de cada cobro.",
    "tono": "brand"
  },
  {
    "n": "05",
    "titulo": "Servicios y precios",
    "texto": "Tu catálogo con duración y precio, usado en la agenda, en la reserva online y en el cobro. Un solo lugar donde actualizarlo.",
    "tono": "warm"
  },
  {
    "n": "06",
    "titulo": "Recordatorios por WhatsApp",
    "texto": "El mensaje sale armado y abre WhatsApp listo para enviar. Sin proveedor de mensajería de por medio ni costo por mensaje.",
    "tono": "brand"
  },
  {
    "n": "07",
    "titulo": "Recall de inactivos",
    "texto": "Lista de clientes que no vuelven hace 3, 6 o 12 meses, con un botón para escribirles. La plata que ya está en tu base de datos.",
    "tono": "warm"
  },
  {
    "n": "08",
    "titulo": "Reportes de ingresos",
    "texto": "Facturación del período, producción por profesional y servicios más vendidos. Todo exportable a CSV para tu contador.",
    "tono": "brand"
  },
  {
    "n": "09",
    "titulo": "Equipo con roles",
    "texto": "Cuatro roles con permisos configurables: dueño, profesional, recepción y cajero. La recepción no entra a los ingresos si no querés.",
    "tono": "brand"
  },
  {
    "n": "10",
    "titulo": "Stock de productos",
    "texto": "Insumos y productos de venta con stock mínimo y aviso cuando se está por terminar. Se descuenta al cobrar.",
    "tono": "warm"
  }
]

export const PASOS = [
  {
    "n": "1",
    "tiempo": "20 minutos",
    "titulo": "Nos contás cómo trabajás",
    "texto": "Una llamada o un WhatsApp. Con eso definimos la configuración del local.",
    "items": [
      "Rubro y tipo de atención",
      "Cuántos profesionales y qué horarios",
      "Cabinas, sillones o consultorios"
    ]
  },
  {
    "n": "2",
    "tiempo": "El mismo día",
    "titulo": "Cargamos tu catálogo y tu equipo",
    "texto": "Lo hacemos nosotros, no te dejamos una planilla para llenar.",
    "items": [
      "Servicios con precio y duración",
      "Usuarios con su rol y permisos",
      "Tus clientes, si los tenés en una planilla"
    ]
  },
  {
    "n": "3",
    "tiempo": "Día siguiente",
    "titulo": "Compartís tu link de reserva",
    "texto": "Lo pegás en Instagram y WhatsApp, y los turnos empiezan a entrar solos.",
    "items": [
      "Link listo para tu bio",
      "El cliente elige servicio y horario",
      "El turno cae directo en tu agenda"
    ]
  },
  {
    "n": "4",
    "tiempo": "Cuando quieras",
    "titulo": "Nosotros seguimos atrás",
    "texto": "El soporte no termina cuando arrancás. Ajustamos lo que haga falta.",
    "items": [
      "Soporte por WhatsApp",
      "Cambios de precios o servicios",
      "Ayuda para leer tus reportes"
    ]
  }
]

export const FAQ_ARRANQUE = [
  {
    "p": "¿Cuánto tarda la puesta en marcha?",
    "r": "El mismo día de la llamada te dejamos el local configurado con tus servicios y tu equipo. Si tenés una lista de clientes en planilla, la importamos también."
  },
  {
    "p": "¿Tengo que capacitar a mi gente?",
    "r": "Les mostramos el sistema en una videollamada corta. La agenda y el cobro se aprenden en el primer día de uso; lo demás lo van descubriendo."
  },
  {
    "p": "¿Puedo probarlo antes de decidir?",
    "r": "Sí. Son 14 días completos sin tarjeta y con el local ya cargado, así que probás con tus propios servicios y precios, no con datos de ejemplo."
  },
  {
    "p": "¿Qué pasa cuando termina la prueba?",
    "r": "Te contactamos para definir el plan. Si decidís no seguir, tus datos quedan disponibles para exportarlos: no se borran de golpe."
  },
  {
    "p": "¿Y si se corta internet?",
    "r": "La agenda del día se puede imprimir o dejar abierta en el celular. Cuando vuelve la conexión, cargás lo que pasó. No perdés el historial."
  },
  {
    "p": "¿Necesito instalar algo o tener un servidor?",
    "r": "No. Se usa desde el navegador, en la computadora del local o desde el celular, y los datos quedan en la nube. Del mantenimiento nos ocupamos nosotros."
  }
]

export const FAQ_PRECIOS = [
  {
    "p": "¿Cómo se paga?",
    "r": "Por transferencia o depósito, mes a mes. Te avisamos unos días antes del vencimiento y te pasamos el comprobante."
  },
  {
    "p": "¿Hay plazo mínimo?",
    "r": "No. Es mes a mes y podés dar de baja cuando quieras. No hay penalidad ni contrato de permanencia."
  },
  {
    "p": "¿Puedo cambiar de plan?",
    "r": "Sí, cuando quieras. Si sumás gente pasás a Equipo y se ajusta desde el mes siguiente; si te quedás solo, al revés."
  },
  {
    "p": "¿El precio sube con más clientes?",
    "r": "No. Los clientes y los turnos son ilimitados en los dos planes. Lo único que cambia entre planes es la cantidad de usuarios del sistema y los módulos de caja, stock y recall."
  },
  {
    "p": "¿Emiten factura legal?",
    "r": "Todavía no. El sistema genera comprobante interno en PDF de cada cobro, pero la factura la seguís haciendo por tu vía habitual."
  }
]
