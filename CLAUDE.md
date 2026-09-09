# Instrucciones para Claude Code — Turnalia

Contexto permanente del proyecto. Leelo antes de escribir código.

## Qué es esto

Sistema de gestión de turnos multi-rubro para Paraguay (peluquerías, estética, uñas,
gimnasios, odontología, kinesiología, nutrición, consultorios médicos, tatuajes).
El diseño está terminado: 21 pantallas en `diseno/`. La base está definida en
`supabase/01-esquema.sql`. Falta programar la aplicación.

Leé `README.md` para el detalle de las pantallas y `DESPLIEGUE.md` para la infraestructura.

## Reglas que no se negocian

**Los tokens de color.** Todo el color vive en `diseno/turnalia.css`. Nunca hardcodees
un hex. Y respetá la separación: `--brand-solid` / `--warm-solid` / `--neutral-solid`
son rellenos con texto blanco que valen igual en tema claro y oscuro; `--brand`,
`--warm-700` e `--ink` son para texto y bordes y sí se invierten. Usar `--brand` como
fondo con letra blanca se rompe en modo oscuro.

**Las reglas de negocio viven en la base.** Las 9 reglas están en el SQL como
constraints y triggers. No las dupliques en el frontend ni las muevas ahí. En
particular, nunca mandes `fin` ni `precio` al crear un turno: los calcula la base.

**RLS siempre activo.** Ninguna consulta del frontend decide qué puede ver alguien.
Si necesitás datos que la política no deja pasar, la respuesta es una función
`security definer`, no desactivar RLS.

**`service_role` nunca en el cliente.** Solo en server actions o route handlers.

**Fechas en `timestamptz`.** Guardar en UTC, mostrar en `America/Asuncion`.
Paraguay tiene horario de verano.

**Plata en `numeric(12,2)`.** Nunca float.

## Fidelidad del diseño

Alta. Los `.dc.html` tienen colores, tipografía, espaciado y estados finales.
Recrealos fiel al pixel. No hay etapa de diseño visual pendiente y no hace falta
"mejorar" nada: si algo parece raro, preguntá antes de cambiarlo.

Los archivos de `diseno/` son referencia, no código a copiar. La excepción es
`turnalia.css`, que se copia tal cual.

## Datos de la demo

Local ficticio **Studio Kuña**. Equipo: Carla Domínguez (dueña), Sofía Ramírez,
Andrea Giménez, Mauro Duarte (profesionales), Rocío Cabral (recepción),
Mirta Sosa (caja). Mantené esos nombres.

## Pendientes del cliente — no inventar

Precios reales (Gs. 150.000 / 350.000 son marcadores), WhatsApp real
(hoy `595981000000`) y las fotos (12 espacios vacíos en el diseño).

**El nombre ya está decidido: Ára.** Lo que todavía dice `turnalia` —el CSS,
el token del tema, el dominio de ejemplo en el SQL— es deuda de renombrado,
no una decisión abierta. En texto visible va con tilde: **Ára**. En
identificadores técnicos (carpetas, slugs, nombres de archivo) va `ara`.

## Orden de trabajo sugerido

1. Supabase andando con esquema y datos de ejemplo
2. Auth y el layout del panel con el menú filtrado por rol
3. Agenda del día — la vista más compleja; si funciona con las constraints de
   choque, el resto es más fácil
4. Ficha del cliente y cobro
5. El resto de las vistas del panel
6. Portal del cliente
7. Las 12 páginas de marketing (estáticas, lo más simple, dejalas para el final)

@AGENTS.md
