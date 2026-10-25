/** Los enlaces de autenticación solo pueden volver a estos recorridos. */
export function destinoAuth(valor: unknown, defecto = '/panel'): string {
  return valor === '/alta' || valor === '/recuperar/nueva' || valor === '/panel'
    ? valor
    : defecto
}
