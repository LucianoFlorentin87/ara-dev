/** Texto seguro para Excel/LibreOffice, además del escape propio de CSV. */
export function celdaCsv(valor: unknown): string {
  if (valor === null || valor === undefined) return ''
  let texto = String(valor)
  // Solo los textos son entrada no confiable; los números conservan su tipo.
  if (typeof valor === 'string' && /^[\s\u0000-\u001f]*[=+@-]/u.test(texto)) {
    texto = "'" + texto
  }
  return /[";\r\n]/.test(texto) ? '"' + texto.replace(/"/g, '""') + '"' : texto
}
