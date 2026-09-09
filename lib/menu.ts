/**
 * El menú del panel y su filtro por rol.
 *
 * Copiado de `GRUPOS` en `diseno/Panel v4.dc.html`: mismos grupos, mismas
 * etiquetas, mismo orden. Un item sin `roles` lo ve todo el mundo.
 *
 * Esto decide qué se dibuja, no qué se puede leer: lo segundo lo decide RLS
 * en la base. Si alguien escribe una URL a mano no ve datos ajenos aunque el
 * menú no se los ofrezca.
 */

export type Rol = 'dueno' | 'profesional' | 'recepcion' | 'cajero'

export const ETIQUETA_ROL: Record<Rol, string> = {
  dueno: 'Dueño',
  profesional: 'Profesional',
  recepcion: 'Recepción',
  cajero: 'Cajero',
}

export type Item = { label: string; vista: string; roles?: Rol[] }
export type Grupo = { titulo: string; items: Item[] }

export const GRUPOS: Grupo[] = [
  {
    titulo: 'Mi trabajo',
    items: [
      { label: 'Mi día', vista: 'mi-dia', roles: ['profesional'] },
      { label: 'Mi perfil', vista: 'mi-perfil', roles: ['profesional'] },
    ],
  },
  {
    titulo: 'Cuadro de mandos',
    items: [
      { label: 'Indicadores', vista: 'indicadores', roles: ['dueno'] },
      { label: 'Informes', vista: 'informes', roles: ['dueno'] },
    ],
  },
  {
    titulo: 'Turnos',
    items: [
      { label: 'Agenda del día', vista: 'agenda' },
      { label: 'Todos los turnos', vista: 'turnos', roles: ['dueno', 'recepcion'] },
      { label: 'Lista de espera', vista: 'lista-espera', roles: ['dueno', 'recepcion'] },
      { label: 'Sala de espera', vista: 'sala-espera', roles: ['dueno', 'recepcion'] },
    ],
  },
  {
    titulo: 'Clientes',
    items: [
      { label: 'Todos los clientes', vista: 'clientes' },
      { label: 'Comunicación', vista: 'comunicacion', roles: ['dueno', 'recepcion'] },
    ],
  },
  {
    titulo: 'Economía',
    items: [
      { label: 'Caja', vista: 'caja', roles: ['dueno', 'cajero'] },
      { label: 'Servicios y precios', vista: 'servicios', roles: ['dueno'] },
      { label: 'Stock de productos', vista: 'stock', roles: ['dueno', 'cajero'] },
    ],
  },
  {
    titulo: 'Marketing',
    items: [
      { label: 'Recall', vista: 'recall', roles: ['dueno'] },
      { label: 'Reserva online', vista: 'reserva-online', roles: ['dueno', 'recepcion'] },
    ],
  },
  {
    titulo: 'Ajustes',
    items: [
      { label: 'Ajustes del local', vista: 'ajustes', roles: ['dueno'] },
      { label: 'Usuarios y permisos', vista: 'usuarios', roles: ['dueno'] },
      { label: 'Datos (exportar)', vista: 'datos', roles: ['dueno'] },
      { label: 'Suscripción', vista: 'suscripcion', roles: ['dueno'] },
      { label: 'Integraciones', vista: 'integraciones', roles: ['dueno'] },
    ],
  },
]

/** Dónde cae cada rol al iniciar sesión. Del diseño, `USUARIO_POR_ROL`. */
export const INICIO_POR_ROL: Record<Rol, string> = {
  dueno: 'indicadores',
  profesional: 'mi-dia',
  recepcion: 'agenda',
  cajero: 'caja',
}

export function gruposVisibles(rol: Rol): Grupo[] {
  return GRUPOS.map((g) => ({
    titulo: g.titulo,
    items: g.items.filter((it) => !it.roles || it.roles.includes(rol)),
  })).filter((g) => g.items.length > 0)
}

export function itemDe(vista: string): Item | undefined {
  return GRUPOS.flatMap((g) => g.items).find((it) => it.vista === vista)
}

export function puedeVer(rol: Rol, vista: string): boolean {
  const item = itemDe(vista)
  if (!item) return false
  return !item.roles || item.roles.includes(rol)
}

/** Iniciales para el avatar: "Carla Domínguez" → "CD". */
export function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('')
    .toUpperCase()
}
