import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { enlaceWA } from '@/lib/whatsapp'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'
import { Anotar, Resolver } from './formulario'

export default async function ListaEspera() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno' && sesion.rol !== 'recepcion') {
    return (
      <Vista>
        <Panel titulo="Tu rol no ve la lista de espera">
          <Vacio>La manejan la dueña y recepción.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const [{ data: espera }, { data: clientes }, { data: servicios }, { data: profesionales }, { data: local }] =
    await Promise.all([
      supabase
        .from('lista_espera')
        .select('id, created_at, resuelto, clientes(id, nombre, apellido, celular), servicios(nombre), profesionales(nombre_publico)')
        .eq('resuelto', false)
        .order('created_at'),
      supabase.from('clientes').select('id, nombre, apellido').order('nombre').limit(200),
      supabase.from('servicios').select('id, nombre').eq('activo', true).order('orden'),
      supabase.from('profesionales').select('id, nombre_publico').eq('activo', true).order('orden'),
      supabase.from('locales').select('nombre').eq('id', sesion.localId).maybeSingle(),
    ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const nombreLocal = local?.nombre ?? 'el local'

  return (
    <Vista>
      <Rejilla min={330}>
        <Panel
          titulo="Esperando un lugar"
          ayuda={`${(espera ?? []).length} personas · a quién avisar cuando se libere un hueco`}
        >
          {(espera ?? []).length === 0 ? (
            <Vacio>No hay nadie esperando.</Vacio>
          ) : (
            (espera ?? []).map((e) => {
              const cli = uno(e.clientes) as
                | { id: string; nombre: string; apellido: string | null; celular: string | null }
                | null
              const srv = uno(e.servicios) as { nombre: string } | null
              const pro = uno(e.profesionales) as { nombre_publico: string } | null
              const texto = `Hola ${cli?.nombre ?? ''}, te escribimos de ${nombreLocal}: se nos liberó un lugar. ¿Te sirve? Avisanos y te lo reservamos.`
              const wa = enlaceWA(cli?.celular, texto)

              return (
                <Fila key={e.id}>
                  <span style={{ flex: 1, minWidth: '150px' }}>
                    {cli ? (
                      <Link
                        href={`/panel/clientes/${cli.id}`}
                        style={{ display: 'block', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {[cli.nombre, cli.apellido].filter(Boolean).join(' ')}
                      </Link>
                    ) : (
                      <span style={{ display: 'block', fontWeight: 600 }}>Sin cliente</span>
                    )}
                    <span
                      style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                    >
                      {srv?.nombre ?? 'cualquier servicio'}
                      {pro ? ` · con ${pro.nombre_publico}` : ' · con cualquiera'}
                    </span>
                  </span>
                  {wa && (
                    <a
                      className="pastilla"
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Avisar
                    </a>
                  )}
                  <Resolver id={e.id} />
                </Fila>
              )
            })
          )}
        </Panel>

        <Panel titulo="Anotar a alguien">
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--line-soft)' }}>
            <Anotar
              clientes={(clientes ?? []).map((c) => ({
                id: c.id,
                nombre: [c.nombre, c.apellido].filter(Boolean).join(' '),
              }))}
              servicios={(servicios ?? []).map((s) => ({ id: s.id, nombre: s.nombre }))}
              profesionales={(profesionales ?? []).map((p) => ({
                id: p.id,
                nombre: p.nombre_publico,
              }))}
            />
          </div>
        </Panel>
      </Rejilla>
    </Vista>
  )
}
