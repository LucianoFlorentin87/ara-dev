'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { registrar } from './acciones'

export function Registro() {
  const [estado, accion, pendiente] = useActionState(registrar, { error: null, enviado: false })
  if (estado.enviado) return (
    <div role="status">
      <p>Revisá tu correo y seguí el enlace de confirmación en este navegador para continuar con tu local. Si ya tenés cuenta, podés ingresar.</p>
      <Link href="/login?volver=/alta">Ya tengo cuenta: ingresar</Link>
    </div>
  )
  return (
    <form action={accion}>
      <label htmlFor="nombre">Tu nombre</label>
      <input className="campo" id="nombre" name="nombre" required maxLength={100} autoComplete="name" />
      <label htmlFor="email">Correo</label>
      <input className="campo" id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
      <label htmlFor="clave">Contraseña</label>
      <input className="campo" id="clave" name="clave" type="password" required minLength={8} maxLength={128} autoComplete="new-password" />
      <p style={{ fontSize: '13px' }}>Al menos 8 caracteres. La prueba dura 14 días y no pide tarjeta.</p>
      {estado.error && <p className="aviso-error" role="alert">{estado.error}</p>}
      <button className="boton-primario" disabled={pendiente}>{pendiente ? 'Creando cuenta…' : 'Crear mi cuenta'}</button>
      <p><Link href="/login?volver=/alta">Ya tengo cuenta: ingresar</Link></p>
      <Link href="/">Volver al inicio</Link>
    </form>
  )
}
