import { MarcoAuth } from '../../marco-auth'
import { NuevaClave } from '../formulario'

export const metadata = { title: 'Nueva contraseña · Ára' }

export default function Nueva() {
  return (
    <MarcoAuth
      titulo="Elegí una contraseña"
      bajada="Va a reemplazar la anterior. Anotala en algún lado."
    >
      <NuevaClave />
    </MarcoAuth>
  )
}
