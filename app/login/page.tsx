import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { Formulario } from './formulario'

const ventajas = [
  'Turnos sin doble reserva',
  'Reserva online para tus clientes',
  'Caja al cierre del día',
]

export default async function Login() {
  if (await sesionActual()) redirect('/panel')

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 28px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'var(--brand-solid)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--sh-1)',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.1"
                strokeLinecap="round"
                aria-hidden
              >
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M8 3v4M16 3v4M3 11h18" />
                <circle cx="12" cy="16" r="1.6" fill="#fff" stroke="none" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                letterSpacing: '-0.025em',
              }}
            >
              Ára
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              margin: '0 0 8px',
            }}
          >
            Entrar al panel
          </h1>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--ink-2)',
              margin: '0 0 26px',
            }}
          >
            Con tu usuario del local. Cada rol ve solo lo que le corresponde.
          </p>

          <Formulario />
        </div>
      </div>

      <div
        style={{
          background: 'var(--brand-solid)',
          color: '#fff',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
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
            maskImage:
              'radial-gradient(90% 90% at 90% 10%, #000 0%, transparent 70%)',
          }}
        />
        <div style={{ position: 'relative', maxWidth: '420px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              opacity: 0.85,
              marginBottom: '18px',
            }}
          >
            Ára · gestión de turnos
          </div>
          <div
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 3.4vw, 40px)',
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              marginBottom: '26px',
            }}
          >
            Tu agenda, tus fichas y tu caja, en un solo lugar.
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {ventajas.map((v) => (
              <div
                key={v}
                style={{
                  background: 'rgba(255,255,255,.14)',
                  borderRadius: 'var(--r-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  style={{ flex: 'none' }}
                  aria-hidden
                >
                  <path d="m4 12.5 5 5L20 6.5" />
                </svg>
                <span style={{ fontSize: '14px' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
