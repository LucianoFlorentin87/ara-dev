'use server'

import { crearClienteServidor } from '@/lib/supabase/servidor'

/**
 * Todo el portal pasa por las funciones `security definer` del esquema.
 * Nunca lee tablas: RLS no le deja, y así tiene que ser. `huecos_libres()`
 * devuelve horarios y nunca el nombre de quien ya tiene ese turno.
 */

export type Profesional = {
  id: string
  nombre_publico: string
  especialidad: string | null
  anios_oficio: number | null
  bio: string | null
  slug: string | null
}

export type Hueco = { inicio: string; fin: string }

export async function profesionalesPara(
  slug: string,
  servicio: string
): Promise<Profesional[]> {
  const supabase = await crearClienteServidor()
  const { data } = await supabase.rpc('profesionales_publicos', {
    p_slug: slug,
    p_servicio: servicio,
  })
  return (data ?? []) as Profesional[]
}

export async function huecosPara(
  slug: string,
  servicio: string,
  profesional: string,
  fecha: string
): Promise<Hueco[]> {
  const supabase = await crearClienteServidor()
  const { data } = await supabase.rpc('huecos_libres', {
    p_slug: slug,
    p_servicio: servicio,
    p_profesional: profesional,
    p_fecha: fecha,
  })
  return (data ?? []) as Hueco[]
}

export type Resultado = { error: string | null; turno: string | null }

export async function reservar(
  slug: string,
  servicio: string,
  profesional: string,
  inicio: string,
  nombre: string,
  celular: string,
  nota: string | null
): Promise<Resultado> {
  if (!nombre.trim()) return { error: 'Escribí tu nombre.', turno: null }
  const soloNumeros = celular.replace(/\D/g, '')
  if (soloNumeros.length < 9) {
    return { error: 'Ese celular parece incompleto.', turno: null }
  }

  const supabase = await crearClienteServidor()
  const comunes = {
    p_slug: slug,
    p_servicio: servicio,
    p_profesional: profesional,
    p_inicio: inicio,
    p_nombre: nombre.trim(),
    p_celular: soloNumeros,
  }

  let { data, error } = await supabase.rpc('reservar_online', {
    ...comunes,
    p_nota: nota?.trim() || null,
  })

  // `p_nota` lo agrega supabase/04-nota-reserva.sql. Si esa migración
  // todavía no corrió, PostgREST no encuentra la función con ese parámetro
  // (PGRST202) y la reserva igual tiene que entrar: se reintenta con la
  // firma vieja y se pierde la nota. Este bloque se puede sacar cuando la
  // migración esté aplicada en todos lados.
  if (error?.code === 'PGRST202') {
    ;({ data, error } = await supabase.rpc('reservar_online', comunes))
  }

  if (error) {
    // Alguien tomó ese horario entre que se cargó la lista y se apretó el
    // botón. Es exactamente lo que la constraint de exclusión existe para
    // resolver, y pasa más de lo que parece con dos personas reservando.
    if (error.code === '23P01') {
      return {
        error: 'Justo te ganaron ese horario. Elegí otro, se actualizó la lista.',
        turno: null,
      }
    }
    if (error.code === 'P0001') return { error: error.message, turno: null }
    return { error: 'No se pudo reservar. Probá de nuevo.', turno: null }
  }

  return { error: null, turno: data as string }
}
