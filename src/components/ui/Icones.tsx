import type { SVGProps } from 'react'

/**
 * Ícones em SVG inline. O protótipo usava a fonte Material Symbols via CDN;
 * em SVG não há requisição externa nem "pulo" de layout no carregamento.
 */
type Props = SVGProps<SVGSVGElement>

const base: Props = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconeSacola(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M4.5 7.5h15l-1.1 12.1a1.5 1.5 0 0 1-1.5 1.4H7.1a1.5 1.5 0 0 1-1.5-1.4L4.5 7.5Z" />
      <path d="M8.75 10V6.75a3.25 3.25 0 0 1 6.5 0V10" />
    </svg>
  )
}

export function IconeBusca(p: Props) {
  return (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export function IconeCoracao(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
    </svg>
  )
}

export function IconeWhatsApp(p: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.36c0-4.54 3.7-8.23 8.23-8.23a8.23 8.23 0 0 1 0 16.44Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.24-.85.84-.85 2.04s.87 2.37 1 2.53c.12.16 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.19.2-.58.2-1.08.14-1.19-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  )
}

export function IconeMais(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconeMenos(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconeFechar(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconeLixeira(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12.1A1.5 1.5 0 0 0 8.5 20.5h7A1.5 1.5 0 0 0 17 19.1L18 7" />
      <path d="M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7" />
    </svg>
  )
}

export function IconeVerificado(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="m12 3 2.2 1.7 2.7-.3 1 2.6 2.4 1.3-.8 2.6.8 2.6-2.4 1.3-1 2.6-2.7-.3L12 21l-2.2-1.7-2.7.3-1-2.6L3.7 15l.8-2.6-.8-2.6L6.1 8.5l1-2.6 2.7.3L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function IconePremio(p: Props) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.8-1.3 6.4 4.8-2.4 4.8 2.4-1.3-6.4" />
    </svg>
  )
}

export function IconeEscudo(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v5.5c0 4.3 2.9 8.2 7 9.5 4.1-1.3 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-3.7" />
    </svg>
  )
}

export function IconeDiamante(p: Props) {
  return (
    <svg viewBox="0 0 48 56" fill="none" aria-hidden {...p}>
      <polygon
        points="15,3 33,3 45,19 24,53 3,19"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M3 19 H45 M15 3 L24 19 M33 3 L24 19 M24 19 V53"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  )
}

export function IconeGota(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.5c3.2 3.6 5.5 6.6 5.5 9.4a5.5 5.5 0 0 1-11 0c0-2.8 2.3-5.8 5.5-9.4Z" />
    </svg>
  )
}

export function IconeBrilho(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18l-1.8-5.4L4.7 10.8 10.2 9 12 3.5Z" />
      <path d="M18.5 3.5v3M17 5h3" />
    </svg>
  )
}

export function IconeCaixa(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 8h17v11.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V8Z" />
      <path d="M2.5 4.5h19V8h-19zM10 12h4" />
    </svg>
  )
}

export function IconePlay(p: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M8.5 5.5 18.5 12l-10 6.5v-13Z" />
    </svg>
  )
}

export function IconeSeta(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconeMenu(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconeAjustavel(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M8.6 6.6a6.5 6.5 0 1 0 6.8 0" />
      <path d="M9.2 4 7 6.8l3 1.9M14.8 4 17 6.8l-3 1.9" />
    </svg>
  )
}

export function IconeCaminhao(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}

export function IconeLocalizacao(p: Props) {
  return (
    <svg {...base} {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

