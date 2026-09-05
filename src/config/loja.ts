/**
 * Configuração central da loja.
 * Praticamente tudo que muda com frequência (contato, textos, frete) está aqui.
 */
export const loja = {
  nome: 'Anastácia Semijoias',
  slogan: 'Nosso legado, semijoias para você brilhar.',

  /**
   * Número que recebe os pedidos, no formato internacional, só dígitos:
   * 55 (Brasil) + DDD + número.
   */
  whatsapp: '5511970644324' as string,

  /** Nome que aparece nos textos de atendimento. */
  consultora: 'nossa consultora',

  instagram: 'https://instagram.com/',

  /** Mostrado no rodapé e na página de qualidade. */
  cidade: 'Brasil',

  /**
   * Texto que abre a conversa quando a cliente clica no botão flutuante
   * do WhatsApp sem ter nada na seleção.
   */
  mensagemContatoDireto:
    'Olá! Vim pelo site da Anastácia Semijoias e gostaria de tirar uma dúvida.',
} as const

/**
 * Fotos grandes do site, que não são de nenhuma peça específica.
 * Salve o arquivo em public/marca/ e escreva o caminho aqui.
 * Deixe '' para o site mostrar o selo da marca no lugar.
 */
export const imagens = {
  /** Foto ao lado do título "A essência da elegância", na home. Ideal: retrato 4:5. */
  capaHome: '/marca/capa-home.jpg',
} as const

/** Rótulos dos banhos, usados no site e na mensagem do pedido. */
export const banhos = {
  ouro18k: { nome: 'Ouro 18k', cor: '#D4AF37' },
  rodio: { nome: 'Ródio branco', cor: '#E2E8F0' },
} as const

/** Valores padrão de frete caso não haja valor customizado no banco de dados. */
export const fretePadrao = {
  /** Frete fixo para o estado de São Paulo (SP) em reais. */
  sp: 15.0,
  /** Frete fixo para fora de São Paulo (demais estados do Brasil) em reais. */
  foraSp: 25.0,
} as const

