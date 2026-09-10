import { MarcoAuth } from '../marco-auth'
import { PedirRecuperacion } from './formulario'

export const metadata = { title: 'Recuperar contraseña · Ára' }

export default function Recuperar() {
  return (
    <MarcoAuth
      titulo="Recuperar contraseña"
      bajada="Te mandamos un enlace para elegir una nueva."
    >
      <PedirRecuperacion />
    </MarcoAuth>
  )
}
