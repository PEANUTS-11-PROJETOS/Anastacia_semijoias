/**
 * Categoria do catálogo. É texto livre porque as categorias moram no banco e
 * podem ser criadas pelo painel — travar num union de TypeScript significaria
 * ter que editar código toda vez que a loja criar uma linha nova de produto.
 */
export type CategoriaId = string

/** Tipo de banho da peça. */
export type BanhoId = 'ouro18k' | 'rodio'

export interface Categoria {
  id: CategoriaId
  nome: string
  /** Imagem do círculo de categoria na home. Vazio = selo da marca. */
  imagem: string
}

export interface FotoProduto {
  id: string
  url: string
  /** 0 é a foto de capa: a que aparece nos cards e no carrinho. */
  ordem: number
}

export interface Produto {
  /** Identificador no banco. */
  id: string
  /** Código interno usado no pedido do WhatsApp. Ex.: 'ANL-001'. */
  codigo: string
  /** Identificador na URL. Ex.: /pecas/anel-solitario-majestic */
  slug: string
  nome: string
  categoria: CategoriaId
  /** Preço em reais. */
  preco: number
  /** Preço "de" riscado, opcional. */
  precoDe?: number
  /** Galeria, já ordenada. A primeira é a capa. Lista vazia = selo da marca. */
  fotos: FotoProduto[]
  descricao: string
  /** Banhos que a cliente pode escolher. Um só = sem escolha, vira etiqueta fixa. */
  banhos: BanhoId[]
  /** Anel de aro ajustável — abre e fecha para servir em vários dedos. */
  ajustavel?: boolean
  /** Ex.: '45 cm + 5 cm de extensor'. */
  medidas?: string
  /** Ex.: 'Zircônia branca, lapidação princesa'. */
  pedra?: string
  /** Etiqueta no card. Ex.: 'Novo', 'Últimas peças'. */
  selo?: string
  /** Aparece no carrossel "Peças do mês" da home. */
  destaque?: boolean
  /** Sem estoque: continua visível, mas não pode ser adicionada à seleção. */
  esgotado: boolean
  /** false esconde a peça do site sem precisar apagar o cadastro. */
  ativo: boolean
}

export interface ItemCarrinho {
  /** Chave única da combinação produto + banho. */
  id: string
  codigo: string
  slug: string
  nome: string
  /**
   * URL da foto de capa no momento em que a peça foi adicionada.
   *
   * É de propósito um campo simples, e não a galeria inteira: o carrinho fica
   * salvo no navegador da cliente, e mudar o formato invalidaria as seleções já
   * guardadas por aí. Guardando só a capa, quem já tinha peças escolhidas
   * continua com elas depois de qualquer atualização do site.
   */
  imagem: string
  preco: number
  quantidade: number
  banho: BanhoId
}

export interface DadosPedido {
  nome: string
  observacoes: string
}
