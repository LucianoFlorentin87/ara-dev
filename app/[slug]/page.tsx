import { notFound } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { Reserva, type Servicio } from './reserva'

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
        style={{
          background: 'var(--brand-solid)',
          color: '#fff',
          padding: '26px 22px 30px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.18,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #fff 1.2px, transparent 0)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(90% 90% at 90% 10%, #000 0%, transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            {local.rubro}
          </div>
          <h1
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(26px, 6vw, 34px)',
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              margin: '6px 0 0',
            }}
          >
            {local.nombre}
          </h1>
          {(local.direccion || local.instagram) && (
            <p style={{ fontSize: '13.5px', opacity: 0.9, margin: '8px 0 0', lineHeight: 1.5 }}>
              {[local.direccion, local.instagram].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </header>

      <main style={{ flex: 1, padding: '22px 22px 48px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Reserva
            slug={slug}
            nombreLocal={local.nombre}
            servicios={(servicios ?? []) as Servicio[]}
          />
        </div>
      </main>

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
