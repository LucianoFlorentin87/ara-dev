import { notFound } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { iniciales } from '@/lib/menu'
import { BotonTema } from '../tema'
import { Reserva, type Servicio } from './reserva'

/** "Malutín 1240, Villa Morra, Asunción" → "Villa Morra · Asunción". */
function zona(direccion: string | null): string | null {
  if (!direccion) return null
  const partes = direccion.split(',').map((p) => p.trim()).filter(Boolean)
  return partes.length > 1 ? partes.slice(1).join(' · ') : partes[0]
}

type LocalPublico = {
  nombre: string
  rubro: string
  direccion: string | null
  instagram: string | null
  zona_horaria: string
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params
  const supabase = await crearClienteServidor()
  const { data } = await supabase.rpc('local_publico', { p_slug: slug })
  const local = (data as LocalPublico[])?.[0]
  return {
    title: local ? `Reservar en ${local.nombre} · Ára` : 'Ára',
  }
}

/**
 * El portal público. Todo lo que muestra sale de funciones `security
 * definer`: nunca toca una tabla, porque RLS no le dejaría y está bien que
 * no le deje. Quien entra acá no tiene sesión.
 */
export default async function Portal({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params
  const supabase = await crearClienteServidor()

  const [{ data: locales }, { data: servicios }] = await Promise.all([
    supabase.rpc('local_publico', { p_slug: slug }),
    supabase.rpc('servicios_publicos', { p_slug: slug }),
  ])

  const local = (locales as LocalPublico[])?.[0]
  if (!local) notFound()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{ borderBottom: '1px solid var(--line-soft)', background: 'var(--surface)' }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '14px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: 0 }}>
            <span
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '13px',
                background: 'var(--brand-solid)',
                display: 'grid',
                placeItems: 'center',
                flex: 'none',
                boxShadow: 'var(--sh-2)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#fff',
                }}
              >
                {iniciales(local.nombre)}
              </span>
            </span>
            <span style={{ minWidth: 0 }}>
              <h1
                style={{
                  display: 'block',
                  fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '16.5px',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  margin: 0,
                }}
              >
                {local.nombre}
              </h1>
              <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-2)' }}>
                {zona(local.direccion) ?? local.instagram ?? ''}
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 'none' }}>
            <BotonTema />
          </div>
        </div>
      </header>

      <Reserva
        slug={slug}
        nombreLocal={local.nombre}
        servicios={(servicios ?? []) as Servicio[]}
      />

      <footer
        style={{
          borderTop: '1px solid var(--line-soft)',
          padding: '18px 22px',
          textAlign: 'center',
          fontSize: '12.5px',
          color: 'var(--ink-2)',
        }}
      >
        Turnos con Ára
      </footer>
    </div>
  )
}
