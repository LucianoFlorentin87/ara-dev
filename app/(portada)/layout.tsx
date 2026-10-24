import { MarcoNoche } from '../_noche/marco'

/** La portada: el encabezado flota sobre el hero. */
export default function PortadaLayout({ children }: LayoutProps<'/'>) {
  return <MarcoNoche flotante>{children}</MarcoNoche>
}
