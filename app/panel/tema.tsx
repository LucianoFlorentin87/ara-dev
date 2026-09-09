'use client'

/**
 * Alterna el tema y lo guarda en localStorage bajo `ara:tema`.
 *
 * Sin estado de React a propósito: el icono y el título son fijos, así que
 * el componente nunca necesita saber en qué tema está. La fuente de verdad
 * es el atributo data-theme del <html>, que el guion del layout ya dejó
 * puesto antes del primer pintado.
 */
export function BotonTema() {
  function alternar() {
    const raiz = document.documentElement
    const seraOscuro = raiz.dataset.theme !== 'dark'

    if (seraOscuro) raiz.dataset.theme = 'dark'
    else delete raiz.dataset.theme

    try {
      localStorage.setItem('ara:tema', seraOscuro ? 'dark' : 'light')
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className="boton-icono"
      title="Cambiar tema"
      aria-label="Cambiar tema"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  )
}
