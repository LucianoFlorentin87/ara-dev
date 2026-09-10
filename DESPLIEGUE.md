# Despliegue: Supabase + GitHub + Vercel

Paso a paso, desde cero hasta una URL funcionando. Unos 30 minutos.

---

## Estado actual (ya hecho)

| | |
| --- | --- |
| Organización | `Ára`, plan gratuito |
| Proyecto | `ara-dev`, AWS `sa-east-1` (São Paulo) |
| URL | `https://jvtqkkxvydvkhjceomhv.supabase.co` |
| Esquema | `01`, `02` y `03` corridos: 22 tablas, 44 políticas, 38 pruebas en verde |
| Cuenta de la dueña | `dueno@studiokuna.com.py`, confirmada y con contraseña |
| Aplicación | Next 16.3, los 7 puntos del orden de trabajo construidos |
| Despliegue | **nada desplegado**: corre solo en `localhost:3000` |

### Qué está construido

Login, panel con menú filtrado por rol y sus **20 vistas**, agenda con
creación y estados de turno, ficha del cliente, cobros, caja con arqueo,
portal público de reserva y las 6 páginas de marketing (los 9 rubros son
una sola ruta).

**Lo que falta y por qué**, para no confundirlo con un olvido:

- **Portal del cliente logueado** (mis turnos, mi ficha) — depende de la
  decisión 1 del README: cómo entra el cliente. No está tomada.
- **Edición** en Servicios, Ajustes y Usuarios: hoy leen. Cambiar un precio
  no toca los turnos ya agendados y eso hay que decirlo en pantalla; y dar
  de alta usuarios toca Supabase Auth, no solo la tabla.
- **Sala de espera** deduce quién llegó por la hora: el esquema no tiene
  marca de llegada.
- **Egresos de caja**: no hay tabla, y meterlos como cobros negativos es una
  decisión de modelo.
- **Fidelidad al pixel** de las páginas de marketing: están con la estructura
  y los textos del diseño, extraídos con un script, pero no recreadas
  elemento por elemento.

### Una decisión de rutas

`DESPLIEGUE` proponía `/peluqueria` para la landing de rubro, pero `/[slug]`
es el portal de un local: un local con el slug `peluqueria` chocaría con la
landing. Los rubros quedaron en `/rubros/[rubro]`.

Falta crear `sofia@`, `recepcion@` y `caja@studiokuna.com.py` para poder probar
el menú filtrado por rol; sin ellas, 14 comprobaciones de `03-pruebas.sql`
quedan en *sin probar* (no en verde, a propósito).

**Sobre los links por email.** El `Site URL` del proyecto apunta a
`http://localhost:3000`, que es lo que corresponde mientras se desarrolla. Al
desplegar hay que cambiarlo o los links de recuperación seguirán mandando a
una máquina local. Y ojo con las invitaciones: son de un solo uso y los
escáneres de enlaces de Gmail suelen consumirlas antes que la persona, con lo
que llegan como `otp_expired`. Para cuentas de prueba conviene
**Create new user** con contraseña y *Auto Confirm*, que no depende del correo.

---

## 1. Supabase

### 1.1 Crear el proyecto

1. Entrá a [supabase.com](https://supabase.com) → **New project**
2. **Region: `South America (São Paulo)`** — no es un detalle. Desde Asunción son
   unos 30 ms contra 130 de Virginia, y la agenda se recarga todo el tiempo.
   Esto **no se puede cambiar después** sin migrar el proyecto entero
3. Guardá la contraseña de la base en un lugar seguro

### 1.2 Cargar el esquema

1. En el panel de Supabase: **SQL Editor** → **New query**
2. Pegá el contenido completo de `supabase/01-esquema.sql`
3. **Run**

Si termina sin error, ya tenés las 22 tablas, los triggers, las políticas RLS
y las funciones públicas de reserva.

### 1.3 Crear la cuenta

Con **una** alcanza para entrar. En **Authentication → Users → Add user**:

- **Create new user** con tu email y una contraseña, marcando *Auto Confirm User*, o
- **Send invitation** a tu email, y ponés la contraseña desde el link que te llega

Esa cuenta entra al panel como **Carla Domínguez**, la dueña de la demo. El local
es ficticio; vos hacés de ella.

Los otros tres roles son opcionales y sirven para probar que el menú se filtra
por rol. Cuando los quieras, creá estas cuentas y volvé a correr el paso 1.4:

| Email | Rol |
| --- | --- |
| `sofia@studiokuna.com.py` | profesional |
| `recepcion@studiokuna.com.py` | recepción |
| `caja@studiokuna.com.py` | cajero |

Los UUID **no** hace falta copiarlos: el script los busca por email.

> **Si el dashboard de Supabase se rompe** con `Failed to execute 'insertBefore'`,
> es el Traductor de Google chocando con React. Desactivalo para el sitio:
> el icono de traducción en la barra de direcciones → **Nunca traducir
> supabase.com**. Es un choque conocido de cualquier SPA con la traducción
> automática, no un problema del proyecto.

### 1.4 Cargar los datos de ejemplo

Pegá `supabase/02-datos-ejemplo.sql` entero en el SQL Editor y **Run**.

Si falta alguno de los cuatro usuarios, el script corta con un mensaje que
te dice cuál. Creá el que falte y volvé a correrlo.

Ya tenés Studio Kuña con equipo, horarios, catálogo, clientes, productos y
tres turnos en el próximo día hábil.

### 1.5 Comprobar que las reglas funcionan

Pegá `supabase/03-pruebas.sql` entero en el SQL Editor y ejecutalo. Corre las
9 reglas, RLS con los cuatro roles y las funciones públicas del portal, y
devuelve una tabla: **todas las filas tienen que decir `ok`**.

Todo pasa dentro de una transacción que termina en `rollback`, así que no deja
nada en la base. Se puede correr las veces que haga falta.

Si falla `R1 dos turnos no se pisan`, lo más probable es que no haya quedado
instalada la extensión `btree_gist`.

### 1.6 Anotar las claves

**Project Settings → API**:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → **nunca en el frontend**. Solo en server actions o route handlers

---

## 2. El proyecto

```bash
npx create-next-app@latest turnalia --typescript --tailwind --app
cd turnalia
npm install @supabase/supabase-js @supabase/ssr
```

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

La tercera **no** lleva `NEXT_PUBLIC_`: ese prefijo es lo que hace que Next la
meta en el bundle del navegador. Sin prefijo, solo existe en el servidor.

### La conexión

Tres archivos. La diferencia entre ellos es de dónde sale la sesión, y por eso
no son intercambiables.

`lib/supabase/cliente.ts` — para componentes con `'use client'`:

```ts
import { createBrowserClient } from '@supabase/ssr'

export function crearCliente() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`lib/supabase/servidor.ts` — para server components, server actions y route
handlers. Lee la sesión de las cookies, así que RLS ve al usuario real:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function crearClienteServidor() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (nuevas) => {
          // Desde un server component esto tira: no se pueden escribir
          // cookies durante el render. El middleware ya refrescó la sesión.
          try {
            nuevas.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
```

`proxy.ts` en la raíz — refresca el token en cada request. Sin esto la
sesión se vence sola y el panel empieza a devolver vacío en vez de error.

**Se llama `proxy.ts`, no `middleware.ts`.** Next 16 deprecó ese nombre; es el
mismo mecanismo, y la función exportada ahora se llama `proxy`. Si venís de un
tutorial más viejo, `npx @next/codemod@canary middleware-to-proxy .` lo migra.

El archivo está escrito en el proyecto. Los dos detalles que no son obvios:

**`setAll` recibe un segundo argumento, `headers`,** y hay que volcarlo en la
respuesta. Son cabeceras anti-caché (`Cache-Control: private, no-store` y
compañía). Sin ellas, un CDN puede guardar una respuesta que trae la cookie de
sesión de alguien y servírsela a otra persona. Los tutoriales de `@supabase/ssr`
anteriores a la 0.12 no lo mencionan porque el argumento no existía.

**La llamada que refresca es `getClaims()`,** y va temprano en el handler, antes
de generar cualquier respuesta. Si el refresco termina después de que la
respuesta ya salió, la sesión nueva no se puede escribir y se pierde.

El cliente con `service_role` va aparte y **nunca** se importa desde un archivo
con `'use client'`. Solo hace falta para lo que tiene que saltear RLS a
propósito, como sembrar un local desde un script:

```ts
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function crearClienteAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
```

`npm i server-only` hace que el build falle si alguna vez ese archivo termina
importado desde el navegador. Es barato y te ahorra el peor error posible.

### Probar que conecta

Antes de escribir una pantalla, un server component que traiga los turnos del
día. Si esto imprime tres turnos de Studio Kuña, el circuito entero funciona
—cookies, RLS, timestamptz—:

```ts
const supabase = await crearClienteServidor()
const { data, error } = await supabase
  .from('turnos')
  .select('inicio, estado, clientes(nombre), servicios(nombre)')
  .order('inicio')
console.log(error ?? data)
```

Si devuelve `[]` sin error, casi siempre es que el usuario logueado no tiene
fila en `usuarios`: `mi_local()` da null y RLS filtra todo. Si devuelve error
de permisos, revisá que el middleware esté corriendo.

Copiá `diseno/turnalia.css` a `app/turnalia.css` e importalo en el layout raíz.
Las fuentes van con `next/font`:

```ts
import { Outfit, Manrope } from 'next/font/google'
const outfit = Outfit({ subsets: ['latin'], weight: ['400','500','600','700'] })
const manrope = Manrope({ subsets: ['latin'], weight: ['400','500','600','700'] })
```

### Estructura sugerida

```
app/
├── (marketing)/          ← estático, se cachea
│   ├── page.tsx                    /
│   ├── rubros/page.tsx
│   ├── [rubro]/page.tsx            /peluqueria, /estetica, ...
│   ├── sistema/page.tsx
│   ├── funciones/page.tsx
│   ├── como-arranca/page.tsx
│   └── precios/page.tsx
├── (app)/
│   ├── panel/
│   │   ├── layout.tsx              ← menú lateral filtrado por rol
│   │   ├── mi-dia/page.tsx
│   │   ├── agenda/page.tsx
│   │   └── ...                     ← 18 vistas
│   └── crear-cuenta/page.tsx
├── [slug]/page.tsx                 ← portal del cliente
└── turnalia.css
```

Las 9 páginas de rubro son **una sola ruta dinámica** con un objeto de contenido
por rubro, igual que en el diseño.

---

## 3. GitHub

```bash
git init
git add .
git commit -m "Turnalia: esquema y estructura inicial"
gh repo create turnalia --private --source=. --push
```

Sin `gh`: creá el repo en github.com y después

```bash
git remote add origin git@github.com:TU-USUARIO/turnalia.git
git push -u origin main
```

**Verificá que `.env.local` esté en `.gitignore`.** Next.js lo pone por defecto,
pero confirmalo antes del primer push.

---

## 4. Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import** tu repo
2. Framework: Next.js (lo detecta solo)
3. **Environment Variables** — agregá las dos de `.env.local`
4. **Deploy**

Cada push a `main` despliega a producción. Cada rama tiene su URL de preview.

### Dominio propio

**Settings → Domains** → agregá el dominio y seguí las instrucciones de DNS.
Para un `.com.py` se gestiona con NIC Paraguay.

---

## 5. Después del primer deploy

### Redirect URLs de Supabase

**Authentication → URL Configuration**:
- Site URL: tu dominio de producción
- Redirect URLs: agregá `https://*-tu-proyecto.vercel.app/**` para que los
  previews también funcionen

### Storage

El bucket `archivos` ya se crea en el esquema, privado y con sus políticas.
Las rutas de archivo tienen que empezar con el `local_id`:

```
archivos/{local_id}/{cliente_id}/{uuid}.jpg
```

La política valida ese primer segmento. Servílos siempre con URL firmada
(`createSignedUrl`), nunca públicas: hay radiografías y fotos de evolución ahí.

### Backups

El plan Pro de Supabase trae backup diario. Para datos clínicos conviene además
un export semanal propio: el historial de un consultorio no se recupera de ningún lado.

---

## Costos aproximados (septiembre 2026)

| | Gratis | Pago |
| --- | --- | --- |
| Supabase | 500 MB, 2 proyectos, pausa a los 7 días sin uso | Pro US$25/mes: 8 GB, sin pausa, backups diarios |
| Vercel | Hobby, uso personal | Pro US$20/mes, necesario si es comercial |

Para desarrollo alcanza el gratuito. Para el primer cliente real: Supabase Pro sí o sí
(la pausa por inactividad mataría una peluquería un lunes a la mañana), Vercel Pro
cuando el uso sea comercial.

---

## Errores frecuentes

**"new row violates row-level security policy"** — el usuario autenticado no tiene
fila en `usuarios`, o tiene un rol que no puede escribir en esa tabla.
Probá `select mi_local(), mi_rol();` con ese usuario.

**"conflicting key value violates exclusion constraint"** — la regla de doble
reserva funcionando. Capturá el error y mostrá "ese horario ya está tomado",
no el mensaje de Postgres.

**Los turnos aparecen una hora corridos** — estás guardando `timestamp` en vez de
`timestamptz`, o convirtiendo en el cliente. Todo va en UTC y se muestra en
`America/Asuncion`. Paraguay tiene horario de verano: sin `timestamptz`, dos veces
al año se corre todo.

**El profesional ve turnos que no son suyos** — falta la fila en `profesionales`
enlazada a su `usuarios.id`. `mi_profesional()` devuelve null y la política
no filtra como debería.
