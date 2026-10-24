import { MarcoNoche } from '../_noche/marco'

/**
 * Rubros, El sistema, Funciones, Cómo arranca y Precios. Comparten el
 * encabezado y el pie de la portada, con el encabezado fijo arriba.
 * Las páginas no cambian: toman el estilo nuevo a través de los tokens
 * que se redefinen dentro de .noche.
 */
export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return <MarcoNoche>{children}</MarcoNoche>
}
