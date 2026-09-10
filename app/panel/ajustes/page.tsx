import { redirect } from 'next/navigation'
import { sesionActual } from '@/lib/sesion'
import { crearClienteServidor } from '@/lib/supabase/servidor'
import { Vista, Panel, Fila, Vacio, Rejilla } from '../ui'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default async function Ajustes() {
  const sesion = await sesionActual()
  if (!sesion) redirect('/login')

  if (sesion.rol !== 'dueno') {
    return (
      <Vista>
        <Panel titulo="Solo la dueña ve los ajustes">
          <Vacio>La configuración del local la maneja quien lo administra.</Vacio>
        </Panel>
      </Vista>
    )
  }

  const supabase = await crearClienteServidor()
  const [{ data: local }, { data: horarios }, { data: recursos }, { data: bloqueos }] =
    await Promise.all([
      supabase
        .from('locales')
        .select('nombre, slug, rubro, direccion, telefono_wa, instagram, zona_horaria, moneda, estado, config')
        .eq('id', sesion.localId)
        .maybeSingle(),
      supabase
        .from('horarios')
        .select('dia_semana, hora_inicio, hora_fin')
        .is('profesional_id', null)
        .order('dia_semana'),
      supabase.from('recursos').select('id, nombre, tipo, capacidad, activo').order('nombre'),
      supabase
        .from('bloqueos')
        .select('id, desde, hasta, motivo, profesionales(nombre_publico)')
        .order('desde', { ascending: false })
        .limit(8),
    ])

  const uno = <T,>(x: T | T[] | null): T | null =>
    Array.isArray(x) ? (x[0] ?? null) : x

  const campos = (local?.config as { campos_ficha?: { label: string }[] })?.campos_ficha ?? []

  const dato = (label: string, valor: string | null | undefined) => (
    <Fila key={label}>
      <span style={{ flex: 1, color: 'var(--ink-2)' }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: 'right' }}>{valor || '—'}</span>
    </Fila>
  )

  return (
    <Vista>
      <Rejilla min={330}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel titulo="El local">
            {dato('Nombre', local?.nombre)}
            {dato('Dirección web', local?.slug ? `ara.com.py/${local.slug}` : null)}
            {dato('Rubro', local?.rubro)}
            {dato('Dirección', local?.direccion)}
            {dato('WhatsApp', local?.telefono_wa)}
            {dato('Instagram', local?.instagram)}
            {dato('Zona horaria', local?.zona_horaria)}
            {dato('Moneda', local?.moneda)}
            {dato('Estado', local?.estado)}
          </Panel>

          <Panel
            titulo="Campos de la ficha"
            ayuda="Propios del rubro, definidos en la configuración del local"
          >
            {campos.length === 0 ? (
              <Vacio>Este rubro todavía no tiene campos definidos.</Vacio>
            ) : (
              campos.map((c) => (
                <Fila key={c.label}>
                  <span style={{ flex: 1 }}>{c.label}</span>
                </Fila>
              ))
            )}
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel titulo="Horario de atención">
            {(horarios ?? []).length === 0 ? (
              <Vacio>No hay horario cargado: la agenda va a decir que está cerrado.</Vacio>
            ) : (
              (horarios ?? []).map((h, i) => (
                <Fila key={`${h.dia_semana}-${i}`}>
                  <span style={{ flex: 1, fontWeight: 600 }}>{DIAS[h.dia_semana]}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {h.hora_inicio.slice(0, 5)} a {h.hora_fin.slice(0, 5)}
                  </span>
                </Fila>
              ))
            )}
            {(horarios ?? []).length > 0 && (
              <p
                style={{
                  fontSize: '12.5px',
                  color: 'var(--ink-2)',
                  margin: '12px 0 0',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--line-soft)',
                }}
              >
                Los días que no figuran, el local está cerrado.
              </p>
            )}
          </Panel>

          <Panel titulo="Recursos" ayuda="Sillones, cabinas, consultorios">
            {(recursos ?? []).length === 0 ? (
              <Vacio>No hay recursos cargados.</Vacio>
            ) : (
              (recursos ?? []).map((r) => (
                <Fila key={r.id} tenue={!r.activo}>
                  <span style={{ flex: 1, fontWeight: 600 }}>{r.nombre}</span>
                  <span className="chip">{r.tipo}</span>
                </Fila>
              ))
            )}
          </Panel>

          <Panel titulo="Bloqueos" ayuda="Vacaciones, feriados, ausencias">
            {(bloqueos ?? []).length === 0 ? (
              <Vacio>No hay bloqueos cargados.</Vacio>
            ) : (
              (bloqueos ?? []).map((b) => {
                const pro = uno(b.profesionales) as { nombre_publico: string } | null
                return (
                  <Fila key={b.id}>
                    <span style={{ flex: 1, minWidth: '140px' }}>
                      <span style={{ display: 'block', fontWeight: 600 }}>
                        {b.motivo ?? 'Sin motivo'}
                      </span>
                      <span
                        style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-2)' }}
                      >
                        {pro ? pro.nombre_publico : 'todo el local'}
                      </span>
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                      {new Date(b.desde).toLocaleDateString('es-PY')}
                    </span>
                  </Fila>
                )
              })
            )}
          </Panel>
        </div>
      </Rejilla>

      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          marginTop: '16px',
          lineHeight: 1.55,
        }}
      >
        Todo esto se lee, todavía no se edita. Cambiar el horario del local es
        lo más delicado de la lista: hay turnos ya agendados que dependen de él,
        y el trigger que los valida corre también al cerrarlos.
      </p>
    </Vista>
  )
}
