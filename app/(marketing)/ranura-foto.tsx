/**
 * Los 12 espacios de foto que el diseño deja vacíos.
 *
 * El cliente todavía no entregó las imágenes. En vez de poner una foto de
 * stock que después haya que buscar y reemplazar, la ranura dice qué foto
 * va ahí. Cuando lleguen, se cambia este componente por un <Image> y
 * aparecen todas de una.
 */
export function RanuraFoto({
  descripcion,
  radio = '0',
}: {
  descripcion: string
  radio?: string
}) {
  return (
    <div
      role="img"
      aria-label={`Espacio para foto: ${descripcion}`}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radio,
        background:
          'repeating-linear-gradient(135deg, var(--surface-2) 0 14px, var(--line-soft) 14px 28px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
    >
      <span
        style={{
          fontSize: '12.5px',
          color: 'var(--ink-2)',
          textAlign: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '999px',
          padding: '7px 16px',
          maxWidth: '90%',
        }}
      >
        {descripcion}
      </span>
    </div>
  )
}
