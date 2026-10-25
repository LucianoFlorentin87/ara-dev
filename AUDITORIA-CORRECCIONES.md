# Correcciones de la auditoría

## Cambios

- CSV exclusivo del dueño, con protección contra fórmulas, lista cerrada de tablas y respuesta privada sin caché.
- Alta pública mediante `/registro`, confirmación PKCE en `/auth/callback` y retorno seguro al alta. La recuperación de contraseña utiliza el mismo callback.
- Alta del local en una transacción: dueño, perfil profesional inicial, horarios y catálogo. Validación previa de JSON, días, nombre y precios; 14 días de prueba.
- Claves foráneas compuestas por local en las relaciones existentes entre entidades del negocio. La migración valida los registros anteriores y aborta si encuentra una inconsistencia; no borra ni repara datos automáticamente.
- Las reservas online no aceptan un inicio pasado, incluso si se invocan fuera de la interfaz.
- Pasar una cuenta profesional a recepción/caja revoca su acceso clínico aunque conserve el vínculo con profesionales. La escritura de fichas exige también un paciente permitido.
- WhatsApp real: +595 983 991 460. Se retiraron el equipo ficticio del alta, los botones sin acción del asistente, el buscador global sin implementación y la opción de persistencia de sesión que no se aplicaba.

## Orden obligatorio de publicación

1. Revisar y ensayar en una copia de la base de Ára. El esquema base del repo se instala con `01-esquema.sql` y `04-nota-reserva.sql`; no volver a ejecutar el esquema base en una base existente.
2. Aplicar únicamente `supabase/migrations/20261025010416_auditoria_alta_y_aislamiento.sql` sobre la base existente, usando una transacción. La aplicación anterior sigue compatible con la firma de `crear_local`; el nuevo frontend necesita `completar_alta`.
3. En Supabase Auth, mantener la confirmación de correo y autorizar los dominios explícitos de producción/preview con la ruta `/auth/callback`. Verificar que las plantillas de confirmación y recuperación respeten el destino del enlace y el flujo PKCE. No se cambiaron SMTP, plantillas ni listas de redirección desde este PR.
4. Probar correo real de ensayo: registro → confirmación en el mismo navegador → alta → reserva, y recuperación → nueva contraseña. Comprobar cuota/antibot de Auth y de las RPC públicas.
5. Publicar el frontend después de validar la migración. No fusionar solo por un preview Ready: la base no se migra automáticamente con Vercel.

## Validación reproducible

`npm test` ejecuta PostgreSQL aislado en memoria con PGlite y las extensiones btree_gist/pgcrypto. Instala el esquema y la migración reales; solo sustituye las APIs de plataforma auth/storage por stubs. Comprueba altas, rollback, referencias entre locales, RLS por rol, usuario deshabilitado, CSV y validación de entradas. No comprueba el servicio alojado de Supabase, sus claves, Auth HTTP, correo o Storage HTTP.

También ejecutar `npm run lint`, `npm run build` y `npx tsc --noEmit`.

## Pendientes explícitos

- No se aplicó ninguna migración ni se cambió producción. La conexión disponible de Supabase no incluye el proyecto de Ára.
- La implementación actual del panel elige un solo local por cuenta. El alta impide agregar un segundo local con la misma cuenta hasta que exista selección explícita de local; no cambia cuentas existentes con varios locales.
- Validar matriz de roles y archivos privados contra la base alojada, doble reserva concurrente, caja/stock, backups y límites contra automatización.
- Términos y Privacidad siguen pendientes del texto y datos del responsable del servicio. No se inventó identidad legal ni condiciones comerciales.
