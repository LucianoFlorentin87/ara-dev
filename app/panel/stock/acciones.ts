'use server'

import { revalidatePath } from 'next/cache'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { sesionActual } from '@/lib/sesion'

export type EstadoStock = { error: string | null; ok: boolean }

/**
 * Registra un movimiento de stock.
 *
 * No toca `productos.stock`: eso lo hace el trigger de la regla 7 al
 * insertar el movimiento. Así el saldo siempre es la suma de su historia
 * y no un número que alguien pudo haber pisado.
 */
export async function moverStock(
  _previo: EstadoStock,
  datos: FormData
): Promise<EstadoStock> {
  const sesion = await sesionActual()
  if (!sesion) return { error: 'Se cerró la sesión. Volvé a entrar.', ok: false }

  const producto = String(datos.get('producto') ?? '')
  const signo = String(datos.get('signo') ?? 'entrada')
  const motivo = String(datos.get('motivo') ?? '').trim()
  const bruto = Number(String(datos.get('cantidad') ?? '').replace(/\./g, ''))

  if (!producto) return { error: 'Elegí un producto.', ok: false }
  if (!Number.isFinite(bruto) || bruto <= 0) {
    return { error: 'La cantidad tiene que ser mayor a cero.', ok: false }
  }

  const cantidad = signo === 'salida' ? -bruto : bruto

  const supabase = await crearClienteServidor()
  const { error } = await supabase.from('movimientos_stock').insert({
    local_id: sesion.localId,
    producto_id: producto,
    cantidad,
    motivo: motivo || (signo === 'salida' ? 'salida' : 'entrada'),
    usuario_id: sesion.usuarioId,
  })

  if (error) {
    if (error.code === '42501') {
      return { error: 'Tu rol no puede mover stock.', ok: false }
    }
    return { error: 'No se pudo registrar el movimiento.', ok: false }
  }

  revalidatePath('/panel/stock')
  return { error: null, ok: true }
}
