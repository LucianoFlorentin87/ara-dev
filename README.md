# Turnalia — paquete de entrega para desarrollo

Sistema de gestión de turnos multi-rubro para Paraguay: peluquerías, estética, uñas,
gimnasios, odontología, kinesiología, nutrición, consultorios médicos y tatuajes.

**El sistema se llama Ára.** Turnalia era el nombre de trabajo y quedó en los
nombres de archivo (`turnalia.css`, el token `turnalia:tema`, el dominio de
ejemplo del SQL). Eso es renombrado pendiente, no una decisión abierta.
En texto visible va con tilde, **Ára**; en identificadores técnicos, `ara`.

---

## Qué hay en este paquete

```
handoff-turnalia/
├── README.md                    ← este archivo
├── DESPLIEGUE.md                ← paso a paso: Supabase + GitHub + Vercel
├── diseno/                      ← 21 diseños HTML + tokens compartidos
│   ├── turnalia.css             ← TODO el color y la sombra viven acá
│   ├── Landing v4.dc.html       ← página principal
│   ├── Panel v4.dc.html         ← el panel del staff, 18 vistas
│   ├── Portal v4.dc.html        ← lo que ve el cliente
│   └── ...
└── supabase/
    ├── 01-esquema.sql           ← 22 tablas, triggers, RLS, funciones públicas
    ├── 02-datos-ejemplo.sql     ← Studio Kuña con equipo, catálogo y turnos
    └── 03-pruebas.sql           ← verifica las 9 reglas, RLS por rol y el portal
```

---

## Sobre los archivos de diseño

Los `.dc.html` de `diseno/` son **referencias de diseño**, no código de producción.
Abren en el navegador y se navegan entre sí, pero no tienen backend: los datos son
literales en el archivo y nada se guarda.

**La tarea no es copiar ese HTML.** Es recrear estos diseños en un stack real
(Next.js, Remix, Astro, lo que decidas) consumiendo Supabase. El HTML te dice
exactamente cómo tiene que verse y comportarse cada pantalla; el SQL te dice
qué datos hay detrás.

Lo único que se puede copiar tal cual es `turnalia.css`: son los tokens de color,
y respetarlos garantiza que la implementación se vea como el diseño.

### Fidelidad: alta

Colores, tipografía, espaciado y estados finales. Recrealo fiel al pixel.
No hay una etapa de diseño visual pendiente.

---

## Stack recomendado

| Capa | Elección | Por qué |
| --- | --- | --- |
| Framework | **Next.js (App Router)** | El que mejor soporta Vercel; server components para el panel, estático para las 12 páginas de marketing |
| Hosting | **Vercel** | Deploy por push, preview por rama, dominio propio gratis |
| Base | **Supabase** (región São Paulo) | Postgres real con RLS, auth y storage. La región importa: ~30 ms desde Asunción contra ~130 de Virginia |
| Auth | **Supabase Auth** | Email + password para el staff. Para el cliente ver "Decisiones pendientes" |
| Archivos | **Supabase Storage**, bucket privado | Radiografías y fotos de evolución no pueden ser públicas |
| Fuentes | Outfit + Manrope (Google Fonts) | Ya referenciadas en los diseños |

**No hace falta** cron, colas ni proveedor de mensajería: los recordatorios abren
`wa.me` con el texto armado desde el navegador.

---

## El sistema visual

Todo vive en `diseno/turnalia.css`. Copialo al proyecto y no hardcodees colores.

### La regla que más se rompe

Hay dos familias de tokens y **no son intercambiables**:

- **`--brand-solid` / `--warm-solid` / `--neutral-solid`** — rellenos que llevan
  texto blanco encima. Valen **lo mismo en tema claro y oscuro**. Si un fondo
  lleva `color: #fff`, tiene que usar uno de estos.
- **`--brand` / `--warm-700` / `--ink`** — para texto y bordes. **Sí se invierten**:
  `--brand` es `#6A2BE0` en claro y `#A985FF` en oscuro.

Usar `--brand` como relleno con texto blanco funciona en claro y **se rompe en oscuro**
(lila claro con letra blanca, ilegible). Es el error más fácil de cometer.

### Valores

| Token | Claro | Oscuro |
| --- | --- | --- |
| `--brand-solid` | `#6A2BE0` | `#6A2BE0` (fijo) |
| `--brand` | `#6A2BE0` | `#A985FF` |
| `--warm-solid` | `#8F4512` | `#8F4512` (fijo) |
| `--warm-700` | `#8F4512` | `#FFC79C` |
| `--neutral-solid` | `#4B4463` | `#4B4463` (fijo) |
| `--bg` | `#FAF8FF` | `#120C22` |
| `--surface` | `#FFFFFF` | `#1B1435` |
| `--ink` | `#1A1030` | `#F1ECFF` |
| `--ink-2` | `#5D5379` | `#A79CC8` |
| `--line` | `#DDD2F5` | `#342A5C` |

**Tipografía.** Outfit 700 para títulos (`letter-spacing: -0.03em`), Manrope 400/600/700
para texto. Nada por debajo de 12px; los botones nunca menos de 44px de alto.

**Radios.** 12 / 20 / 30 / 42 px (`--r-sm` a `--r-xl`), y 999px en botones y píldoras.

**Sombras.** `--sh-1` (reposo), `--sh-2` (hover y elementos elevados), `--sh-3` (modales, hero).

**Tema.** Se guarda en `localStorage` bajo `turnalia:tema` y se aplica con
`document.documentElement.dataset.theme = 'dark'`.

**Animación.** El revelado al scroll es CSS puro (`animation-timeline: view()`),
sin JavaScript. Donde el navegador no lo soporta, el contenido simplemente se ve.
No lo reemplaces por una librería de scroll.

---

## Las pantallas

### Sitio público (12 páginas, estáticas)

| Archivo | Ruta sugerida | Qué es |
| --- | --- | --- |
| `Landing v4` | `/` | Hero a sangre con foto de fondo y degradado violeta, panel de agenda flotando, 4 filas alternadas imagen/texto, bloque de recall, píldoras de rubro, CTA grande |
| `Rubros` | `/rubros` | Hub con selector de 9 rubros que cambia ficha, catálogo y agenda de ejemplo |
| `Landing <rubro>` ×9 | `/peluqueria`, `/estetica`, … | Una por rubro. **Mismo componente, distinta data**: en el diseño es un archivo parametrizado por la prop `rubro`. Implementalo como ruta dinámica con un objeto de contenido por rubro |
| `Sistema` | `/sistema` | Las 4 pantallas del producto explicadas |
| `Funciones` | `/funciones` | Las 10 funciones, más una sección de lo que el sistema **no** hace |
| `Arranque` | `/como-arranca` | 4 pasos de puesta en marcha, requisitos, FAQ |
| `Precios` | `/precios` | Planes Individual y Equipo, incluido en ambos, FAQ de pago |

### Aplicación

| Archivo | Ruta | Qué es |
| --- | --- | --- |
| `Alta` | `/crear-cuenta` | 5 pasos: rubro → datos del local → horario → catálogo precargado → equipo. El slug se genera en vivo desde el nombre |
| `Panel v4` | `/panel` | El panel del staff, **18 vistas**. Ver abajo |
| `Portal v4` | `/[slug]` | Portal del cliente: reserva en 3 pasos, sus turnos, historial, sus datos |
| `Portal Movil` | — | El portal en un iPhone. **No es una pantalla nueva**: es el mismo portal, documentando el comportamiento en celular (hit targets ≥46px) |

### Las 18 vistas del panel

Agrupadas en el menú lateral. **El menú se filtra por rol**: cada uno ve solo su grupo.

**Mi trabajo** (solo profesional)
- `Mi día` — sus turnos con la nota que necesita antes de empezar, su producción del mes con comisión calculada, aviso de hueco libre con gente en espera
- `Mi perfil` — su horario dentro del horario del local, sus servicios y precios, su presentación pública, su link propio, su comisión **en solo lectura**

**Cuadro de mandos** (solo dueño): `Indicadores`, `Informes`

**Turnos**: `Agenda del día` (todos), `Todos los turnos`, `Lista de espera`, `Sala de espera` (dueño y recepción)

**Clientes**: `Todos los clientes` (todos), `Comunicación` (dueño y recepción)

**Economía**: `Caja` (dueño y cajero), `Servicios y precios` (dueño), `Stock` (dueño y cajero)

**Marketing** (dueño): `Recall`, `Reserva online`

**Ajustes** (dueño): `Ajustes del local`, `Usuarios y permisos`, `Datos`, `Suscripción`, `Integraciones`

Cada rol entra a una vista distinta al iniciar sesión: dueño a Indicadores, profesional
a Mi día, recepción a la Agenda, cajero a Caja. **La recepción nunca ve ingresos.**

---

## Las 9 reglas de negocio

Están implementadas en `supabase/01-esquema.sql` como constraints y triggers.
**No las muevas al frontend**: si viven solo en el cliente, se saltean.

1. **Dos turnos no pueden pisarse** — constraint de exclusión GiST sobre `profesional_id` + rango. Es lo único que resiste dos personas agendando en el mismo segundo
2. **El recurso tampoco** — misma constraint sobre `recurso_id` (cabina, sillón, consultorio)
3. **El `fin` lo calcula la base** — trigger que suma la duración del servicio. Si lo mandara el frontend, se podría pedir un turno de un minuto para colarse en un hueco
4. **El precio se congela al agendar** — un cambio de precios no altera turnos existentes
5. **El turno cae dentro del horario** — vale también para el mostrador: si el profesional está de vacaciones, no se le agenda ni a mano
6. **Solo se agenda lo que el profesional hace** — lo pide la vista Mi perfil
7. **El cobro descuenta stock** — en la misma transacción
8. **La sesión del paquete se descuenta sola** — al pasar el turno a `terminado`
9. **Todo cambio sensible queda auditado** — precios, permisos, cobros anulados, fichas

---

## Permisos (RLS)

RLS activo en las 22 tablas. Resumen; el detalle está en el SQL.

| Tabla | Dueño | Profesional | Recepción | Cajero |
| --- | --- | --- | --- | --- |
| `turnos` | todo | los suyos | todos | lectura |
| `clientes` | todo | los que atendió | todos | lectura |
| `fichas` | todo | los que atendió | **sin acceso** | **sin acceso** |
| `archivos` | todo | los que atendió | **sin acceso** | **sin acceso** |
| `cobros` | todo | los propios | sin acceso | crea y lee |
| `cajas` | todo | sin acceso | sin acceso | abre y cierra |
| `servicios` | todo | lectura | lectura | lectura |
| `productos` | todo | lectura | sin acceso | crea y lee |
| `auditoria` | lectura | — | — | — |

**Tres casos especiales**, resueltos con funciones `security definer` en el SQL,
sin abrir tablas:

- **Reserva online** — pública. `servicios_publicos()`, `profesionales_publicos()`,
  `huecos_libres()` y `reservar_online()` devuelven exactamente lo que el portal
  necesita. `huecos_libres()` devuelve horarios, nunca el nombre de otro cliente
- **Cliente en su portal** — entra por celular verificado, no como usuario del local
- **Alta de un local** — `crear_local()`. Es el huevo y la gallina: hasta que exista
  la fila en `usuarios`, `mi_local()` es null y ninguna política deja escribir, ni
  siquiera en `locales`. La función crea el local y deja como dueño a quien está
  logueado; de ahí en adelante el alta sigue por las policies normales

Las rutas de Storage (`{local_id}/{cliente_id}/…`) se filtran con el mismo criterio
que la tabla `archivos`: el `local_id` aísla el local y el `cliente_id` decide quién
entra. Aislar solo por local dejaría a recepción bajarse una radiografía con URL firmada.

---

## Interacciones y estados

- **Transiciones**: 180–220 ms, `cubic-bezier(.2,.7,.3,1)`. Nunca `transition: all`
- **Hover en tarjetas**: `translateY(-3px)` + sombra un escalón arriba
- **Hover en botones**: fondo un tono más oscuro + `translateY(-2px)`
- **Foco**: `outline: 2px solid var(--brand); outline-offset: 2px`. No lo saques
- **Colores de estado del turno**: violeta = normal, durazno = vino por el link o necesita atención, gris = pendiente o inactivo

### Estados que el diseño **no** cubre y hay que resolver

- Local recién creado, sin turnos ni clientes (empty states)
- Error de conexión
- Búsqueda sin resultados
- Carga inicial del panel (skeleton)
- Formularios con validación fallida

---

## Datos de la demo

Local ficticio **Studio Kuña**, peluquería en Villa Morra.
Equipo: **Carla Domínguez** (dueña), **Sofía Ramírez** (colorista),
**Andrea Giménez** (corte y peinado), **Mauro Duarte** (barbería),
**Rocío Cabral** (recepción), **Mirta Sosa** (caja).

Mantené estos nombres si agregás pantallas: aparecen en los 21 archivos.

---

## Pendientes del cliente

No los inventes. Están como marcadores en todo el diseño:

| Qué | Marcador actual |
| --- | --- |
| Precios | Gs. 150.000 (Individual) y Gs. 350.000 (Equipo) |
| WhatsApp | `595981000000` |
| Fotos | 12 espacios vacíos (`<image-slot>` en los diseños) |

---

## Decisiones pendientes

1. **Cómo entra el cliente al portal.** El diseño asume celular + código por WhatsApp.
   El OTP por SMS de Supabase **tiene costo por mensaje**. Alternativas: link mágico
   por email, o código que genera el propio local desde el panel. **Definilo antes
   de programar el portal.**
2. **Varias sedes.** El modelo lo soporta agregando una tabla `empresas` encima de
   `locales`. Decidilo ahora aunque no se use: agregarlo después obliga a migrar
   todas las políticas RLS.
3. **Facturación legal.** Si entra la DNIT, `cobros` necesita timbrado, punto de
   expedición y numeración correlativa. Cambia la tabla y la pantalla de caja.
4. **Campos de ficha por rubro.** `fichas.datos` es `jsonb` y `locales.config` guarda
   el esquema. Está definido para peluquería en los datos de ejemplo; faltan los
   otros 8 rubros.
5. **Baja de un local.** ¿Los datos se borran, se archivan o quedan en solo lectura?
   Hoy el diseño solo promete que son exportables.
6. **¿La recepción debe ver las fichas?** El diseño dice que no. Si en el negocio real
   la recepción carga datos clínicos, esa política cambia.
7. **¿El profesional negocia su comisión?** Hoy la ve pero no la edita.

---

## Por dónde empezar

1. Leé `DESPLIEGUE.md` y dejá Supabase + Vercel andando con el esquema cargado
2. Abrí `diseno/Landing v4.dc.html` y `diseno/Panel v4.dc.html` en el navegador
   para ver qué se está construyendo
3. Arrancá por el **panel**, no por el marketing: es donde está toda la complejidad
4. Dentro del panel, arrancá por la **agenda del día**: si esa vista funciona bien
   con las constraints de choque, el resto es más fácil
