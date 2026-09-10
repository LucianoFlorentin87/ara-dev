/**
 * Enlaces de WhatsApp.
 *
 * El sistema no manda mensajes: arma el texto y abre wa.me para que la
 * persona lo revise y lo mande desde su propio número. Sin proveedor de
 * mensajería, sin costo por mensaje, y sin que el local mande nada que no
 * haya leído antes.
 */

/** 0981234567 → 595981234567, que es lo que espera wa.me. */
export function numeroWA(celular: string | null | undefined): string | null {
  if (!celular) return null
  const solo = celular.replace(/\D/g, '')
  if (!solo) return null
  return solo.startsWith('595') ? solo : '595' + solo.replace(/^0/, '')
}

export function enlaceWA(
  celular: string | null | undefined,
  texto?: string
): string | null {
  const n = numeroWA(celular)
  if (!n) return null
  return texto
    ? `https://wa.me/${n}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/${n}`
}
