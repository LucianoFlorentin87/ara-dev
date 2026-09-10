import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { iniciales } from '@/lib/menu'
import {
  instanteDe,
  horaDe,
  hoyISO,
  diaSemana,
  sumarDias,
  fechaLarga,
  guaranies,
} from '@/lib/tiempo'
import { Grilla, type Profesional } from './grilla'
import { NuevoTurno } from './nuevo-turno'

const PX = 52 / 30 // píxeles por minuto: una fila de 52px cada 30 min

type Fila = { hora_inicio: string; hora_fin: string }

function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function deMinutos(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default async function Agenda({
  searchParams,
}: PageProps<'/panel/agenda'>) {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  const params = await searchParams
  const pedida = typeof params.fecha === 'string' ? params.fecha : ''
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(pedida) ? pedida : hoyISO()
  const dow = diaSemana(fecha)

  const supabase = await crearClienteServidor()

  // Horario del local ese día. profesional_id null = el del local.
  const { data: horarios } = await supabase
    .from('horarios')
    .select('hora_inicio, hora_fin')
    .is('profesional_id', null)
    .eq('dia_semana', dow)
    .order('hora_inicio')

  const ventanas = (horarios ?? []) as Fila[]

  const navegacion = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      <Link
        className="pastilla"
        href={`/panel/agenda?fecha=${sumarDias(fecha, -1)}`}
        aria-label="Día anterior"
      >
        ‹
      </Link>
      <Link className="pastilla" href="/panel/agenda" data-activo={fecha === hoyISO()}>
        Hoy
      </Link>
      <Link
        className="pastilla"
        href={`/panel/agenda?fecha=${sumarDias(fecha, 1)}`}
        aria-label="Día siguiente"
      >
        ›
      </Link>
      <span
        style={{
          fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
          fontWeight: 600,
          fontSize: '15px',
          letterSpacing: '-0.02em',
          marginLeft: '6px',
        }}
      >
        {fechaLarga(fecha)}
      </span>
    </div>
  )

  if (ventanas.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>{navegacion}</div>
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line-soft)',
            borderRadius: '20px',
            boxShadow: 'var(--sh-1)',
            padding: '40px 32px',
            maxWidth: '520px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '-0.03em',
              margin: '0 0 8px',
            }}
          >
            El local está cerrado
          </h2>
          <p
            style={{
              fontSize: '14.5px',
              lineHeight: 1.6,
              color: 'var(--ink-2)',
              margin: 0,
            }}
          >
            No hay horario cargado para este día. Se define en Ajustes del local.
          </p>
        </div>
      </div>
    )
  }

  const desdeMin = Math.min(...ventanas.map((v) => aMinutos(v.hora_inicio)))
  const hastaMin = Math.max(...ventanas.map((v) => aMinutos(v.hora_fin)))

  const horas: string[] = []
  for (let m = desdeMin; m < hastaMin; m += 30) horas.push(deMinutos(m))

  const inicioGrilla = instanteDe(fecha, deMinutos(desdeMin))

  const [
    { data: profesionales },
    { data: turnos },
    { data: espera },
    { data: clientes },
    { data: servicios },
  ] = await Promise.all([
      supabase
        .from('profesionales')
        .select('id, nombre_publico, orden')
        .eq('activo', true)
        .order('orden'),
      supabase
        .from('turnos')
        .select(
          'id, inicio, fin, estado, origen, precio_congelado, profesional_id, clientes(nombre, apellido), servicios(nombre)'
        )
        .gte('inicio', instanteDe(fecha, '00:00').toISOString())
        .lt('inicio', instanteDe(sumarDias(fecha, 1), '00:00').toISOString())
        .not('estado', 'in', '(cancelado,ausente)')
        .order('inicio'),
      supabase
        .from('lista_espera')
        .select('id, clientes(nombre, apellido), servicios(nombre)')
        .eq('resuelto', false)
        .limit(6),
      supabase
        .from('clientes')
        .select('id, nombre, apellido')
        .order('nombre')
        .limit(200),
      supabase
        .from('servicios')
        .select('id, nombre, duracion_min')
        .eq('activo', true)
        .order('orden'),
    ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const columnas: Profesional[] = (profesionales ?? []).map((p) => {
    const suyos = (turnos ?? []).filter((t) => t.profesional_id === p.id)
    const minutos = suyos.reduce(
      (acc, t) =>
        acc + (new Date(t.fin).getTime() - new Date(t.inicio).getTime()) / 60000,
      0
    )

    return {
      id: p.id,
      nombre: p.nombre_publico,
      iniciales: iniciales(p.nombre_publico),
      carga:
        suyos.length === 0
          ? 'sin turnos'
          : `${suyos.length} ${suyos.length === 1 ? 'turno' : 'turnos'} · ${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, '0')}`,
      bloques: suyos.map((t) => {
        const cli = uno(t.clientes) as { nombre: string; apellido: string | null } | null
        const srv = uno(t.servicios) as { nombre: string } | null
        const desde =
          (new Date(t.inicio).getTime() - inicioGrilla.getTime()) / 60000
        const dur =
          (new Date(t.fin).getTime() - new Date(t.inicio).getTime()) / 60000

        return {
          id: t.id,
          cliente: [cli?.nombre, cli?.apellido].filter(Boolean).join(' '),
          servicio: srv?.nombre ?? '',
          rango: `${horaDe(t.inicio)}–${horaDe(t.fin)}`,
          precio: guaranies(Number(t.precio_congelado)),
          top: desde * PX + 2,
          alto: dur * PX - 4,
          // El durazno es "vino por el link"; el punteado, "todavía sin
          // confirmar". Si es online y encima está pendiente, gana el origen:
          // es la distinción que le importa a quien mira la agenda.
          tipo:
            t.origen === 'online'
              ? ('online' as const)
              : t.estado === 'pendiente'
                ? ('pendiente' as const)
                : ('confirmado' as const),
        }
      }),
    }
  })

  // La línea de "ahora" solo tiene sentido si estamos mirando hoy y el
  // local está abierto en este momento.
  const ahora = new Date()
  const minutosAhora = (ahora.getTime() - inicioGrilla.getTime()) / 60000
  const esHoy = fecha === hoyISO()
  const lineaAhora =
    esHoy && minutosAhora >= 0 && minutosAhora <= hastaMin - desdeMin
      ? minutosAhora * PX
      : null

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        {navegacion}
        <NuevoTurno
          fecha={fecha}
          clientes={(clientes ?? []).map((c) => ({
            id: c.id,
            nombre: [c.nombre, c.apellido].filter(Boolean).join(' '),
          }))}
          profesionales={(profesionales ?? []).map((p) => ({
            id: p.id,
            nombre: p.nombre_publico,
          }))}
          servicios={(servicios ?? []).map((s) => ({
            id: s.id,
            nombre: s.nombre,
            detalle: `${s.duracion_min} min`,
          }))}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 236px',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        <div>
          <Grilla
            horas={horas}
            profesionales={columnas}
            lineaAhora={lineaAhora}
            horaAhora={horaDe(ahora)}
          />
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line-soft)',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: 'var(--sh-1)',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--fuente-titulos), Outfit, sans-serif',
              fontWeight: 600,
              fontSize: '14.5px',
              letterSpacing: '-0.01em',
              margin: '0 0 8px',
            }}
          >
            Lista de espera
          </h3>
          {(espera ?? []).length === 0 ? (
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.5,
                color: 'var(--ink-2)',
                margin: 0,
                paddingTop: '10px',
                borderTop: '1px solid var(--line-soft)',
              }}
            >
              Nadie esperando un lugar.
            </p>
          ) : (
            (espera ?? []).map((e) => {
              const cli = uno(e.clientes) as { nombre: string; apellido: string | null } | null
              const srv = uno(e.servicios) as { nombre: string } | null
              return (
                <div
                  key={e.id}
                  style={{
                    padding: '10px 0',
                    borderTop: '1px solid var(--line-soft)',
                    fontSize: '13px',
                  }}
                >
                  {[cli?.nombre, cli?.apellido].filter(Boolean).join(' ')}
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      color: 'var(--ink-2)',
                    }}
                  >
                    {srv?.nombre ?? 'Cualquier servicio'}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
