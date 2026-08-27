import { criarClienteServidor } from '@/lib/supabase/server'
import type { BanhoId, Produto } from '@/types'

/**
 * Leitura do catálogo pelo painel.
 *
 * Diferente de src/lib/produtos.ts em um ponto essencial: usa o client COM
 * sessão. É isso que faz o RLS liberar também as peças desligadas — o visitante
 * só enxerga ativo = true, a dona da loja enxerga tudo.
 */

const CAMPOS = `
  id, codigo, slug, nome, categoria_id, preco, preco_de, descricao, banhos,
  ajustavel, medidas, pedra, selo, destaque, esgotado, ativo,
  produto_fotos ( id, url, ordem )
`

interface LinhaProduto {
  id: string
  codigo: string
  slug: string
  nome: string
  categoria_id: string
  preco: string | number
  preco_de: string | number | null
  descricao: string
  banhos: string[]
  ajustavel: boolean
  medidas: string | null
  pedra: string | null
  selo: string | null
  destaque: boolean
  esgotado: boolean
  ativo: boolean
  produto_fotos: { id: string; url: string; ordem: number }[] | null
}

function paraNumero(valor: string | number | null): number | undefined {
  if (valor === null) return undefined
  const n = typeof valor === 'number' ? valor : Number(valor)
  return Number.isFinite(n) ? n : undefined
}

function converter(linha: LinhaProduto): Produto {
  return {
    id: linha.id,
    codigo: linha.codigo,
    slug: linha.slug,
    nome: linha.nome,
    categoria: linha.categoria_id,
    preco: paraNumero(linha.preco) ?? 0,
    precoDe: paraNumero(linha.preco_de),
    descricao: linha.descricao,
    banhos: (linha.banhos as BanhoId[]) ?? [],
    ajustavel: linha.ajustavel,
    medidas: linha.medidas ?? undefined,
    pedra: linha.pedra ?? undefined,
    selo: linha.selo ?? undefined,
    destaque: linha.destaque,
    esgotado: linha.esgotado,
    ativo: linha.ativo,
    fotos: (linha.produto_fotos ?? []).sort((a, b) => a.ordem - b.ordem),
  }
}

/** Todas as peças, inclusive as ocultas. Mais recentes primeiro. */
export async function listarTudo(): Promise<Produto[]> {
  const supabase = await criarClienteServidor()
  const { data, error } = await supabase
    .from('produtos')
    .select(CAMPOS)
    .order('criado_em', { ascending: false })

  if (error) throw new Error(`Falha ao carregar as peças: ${error.message}`)
  return (data as LinhaProduto[]).map(converter)
}

export async function buscarPorId(id: string): Promise<Produto | undefined> {
  const supabase = await criarClienteServidor()
  const { data, error } = await supabase
    .from('produtos')
    .select(CAMPOS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Falha ao carregar a peça: ${error.message}`)
  return data ? converter(data as LinhaProduto) : undefined
}

/** Categoria como o painel precisa dela: com a ordem, que a loja não usa. */
export interface CategoriaAdmin {
  id: string
  nome: string
  /** URL da foto do círculo. Vazio = o site mostra o selo da marca. */
  imagem: string
  ordem: number
}

export async function listarCategoriasAdmin(): Promise<CategoriaAdmin[]> {
  const supabase = await criarClienteServidor()
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nome, imagem_url, ordem')
    .order('ordem', { ascending: true })

  if (error) throw new Error(`Falha ao carregar as categorias: ${error.message}`)
  return (data ?? []).map((c) => ({
    id: c.id as string,
    nome: c.nome as string,
    imagem: (c.imagem_url as string | null) ?? '',
    ordem: c.ordem as number,
  }))
}

/**
 * Sugere o próximo código livre da categoria. Ex.: se existe ANL-112,
 * devolve ANL-113. Poupa a dona da loja de conferir a lista toda vez.
 */
export async function sugerirCodigo(categoriaId: string): Promise<string> {
  const prefixos: Record<string, string> = {
    aneis: 'ANL',
    brincos: 'BRC',
    colares: 'COL',
    pulseiras: 'PUL',
    conjuntos: 'CJT',
    rivieras: 'RIV',
  }
  const prefixo = prefixos[categoriaId] ?? categoriaId.slice(0, 3).toUpperCase()

  const supabase = await criarClienteServidor()
  const { data } = await supabase
    .from('produtos')
    .select('codigo')
    .like('codigo', `${prefixo}-%`)

  const maior = (data ?? []).reduce((max, linha) => {
    const numero = Number(String(linha.codigo).split('-')[1])
    return Number.isFinite(numero) && numero > max ? numero : max
  }, 0)

  return `${prefixo}-${String(maior + 1).padStart(3, '0')}`
}
