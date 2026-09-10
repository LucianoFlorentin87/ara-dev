'use server'

import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { RUBROS_ALTA, slugDe } from './datos'

export type EstadoAlta = { error: string | null }

/** "45 min" → 45; "mensual" o "10 turnos" no tienen minutos, van con 60. */
function minutosDe(dur: string): number {
  const m = dur.match(/^(\d+)\s*min/)
  return m ? Number(m[1]) : 60
}

/** "1.000.000" → 1000000. Los precios se escriben con puntos de miles. */
function guaraniesDe(precio: string): number {
  const n = Number(precio.replace(/\./g, '').replace(/[^\d]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const HORAS: Record<string, [string, string]> = {
  '09:00 – 19:00': ['09:00', '19:00'],
  '09:00 – 20:00': ['09:00', '20:00'],
  '08:00 – 17:00': ['08:00', '17:00'],
}

// El diseño muestra los rangos por día; acá se traducen a filas de `horarios`.
const RANGOS = ['09:00 – 19:00', '09:00 – 19:00', '09:00 – 19:00', '09:00 – 20:00',
                '09:00 – 20:00', '08:00 – 17:00', '09:00 – 19:00']

export async function darDeAlta(
  _previo: EstadoAlta,
  datos: FormData
): Promise<EstadoAlta> {
  const nombre = String(datos.get('nombre') ?? '').trim()
  if (!nombre) return { error: 'Poné el nombre del local para poder crearlo.' }

  const rubroNombre = String(datos.get('rubro') ?? '')
  const rubro = RUBROS_ALTA.find((r) => r.nombre === rubroNombre)
  if (!rubro) return { error: 'Elegí un rubro.' }

  const supabase = await crearClienteServidor()
  const { data: sesion } = await supabase.auth.getUser()
  if (!sesion.user) redirect('/login?volver=/alta')

  // El nombre para el usuario dueño: lo que tenga el correo antes de la arroba.
  const nombreUsuario =
    sesion.user.user_metadata?.nombre ?? sesion.user.email?.split('@')[0] ?? 'Dueño'

  const { data: localId, error } = await supabase.rpc('crear_local', {
    p_nombre: nombre,
    p_slug: slugDe(nombre),
    p_rubro: rubro.slug,
    p_nombre_usuario: nombreUsuario,
    p_direccion: String(datos.get('direccion') ?? '') || null,
    p_telefono_wa: String(datos.get('telefono') ?? '') || null,
    p_instagram: String(datos.get('instagram') ?? '') || null,
  })

  if (error) return { error: error.message }

  // Horario: `dias` viene como [lun…dom]; en la base el domingo es 0.
  const dias: boolean[] = JSON.parse(String(datos.get('dias') ?? '[]'))
  const horarios = dias.flatMap((abierto, i) => {
    if (!abierto) return []
    const [desde, hasta] = HORAS[RANGOS[i]] ?? ['09:00', '19:00']
    return [
      {
        local_id: localId,
        dia_semana: (i + 1) % 7, // lunes=1 … sábado=6, domingo=0
        hora_inicio: desde,
        hora_fin: hasta,
      },
    ]
  })

  if (horarios.length > 0) await supabase.from('horarios').insert(horarios)

  const servicios: { nombre: string; dur: string; precio: string }[] = JSON.parse(
    String(datos.get('servicios') ?? '[]')
  )
  if (servicios.length > 0) {
    await supabase.from('servicios').insert(
      servicios.map((s, orden) => ({
        local_id: localId,
        nombre: s.nombre,
        duracion_min: minutosDe(s.dur),
        precio: guaraniesDe(s.precio),
        orden,
        activo: true,
        visible_online: true,
      }))
    )
  }

  redirect('/panel')
}
