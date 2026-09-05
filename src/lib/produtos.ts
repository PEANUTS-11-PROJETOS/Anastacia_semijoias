import { criarClientePublico } from '@/lib/supabase/publico'
import type { BanhoId, Categoria, Produto } from '@/types'
import { categoriasFallback, produtosFallback } from '@/data/fallback'

/**
 * Leitura do catálogo.
 *
 * Busca do Supabase e, caso o banco esteja inacessível (ex: projeto pausado ou
 * sem internet), utiliza os dados locais de fallback para manter o catálogo
 * navegável.
 */

/** Formato cru vindo do Postgres (snake_case). */
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

const CAMPOS = `
  id, codigo, slug, nome, categoria_id, preco, preco_de, descricao, banhos,
  ajustavel, medidas, pedra, selo, destaque, esgotado, ativo,
  produto_fotos ( id, url, ordem )
`

/** numeric do Postgres chega como string — sem isto os totais viram concatenação. */
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

export async function listarProdutos(): Promise<Produto[]> {
  try {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('produtos')
      .select(CAMPOS)
      .order('criado_em', { ascending: true })

    if (error) throw error
    if (!data || data.length === 0) return produtosFallback
    return (data as LinhaProduto[]).map(converter)
  } catch (err) {
    console.warn('Usando produtos locais (fallback):', (err as Error)?.message || err)
    return produtosFallback
  }
}

/**
 * Só os endereços das peças, para o generateStaticParams.
 * Usa o client sem cookies porque roda no build, fora de qualquer requisição.
 */
export async function listarSlugs(): Promise<string[]> {
  try {
    const supabase = criarClientePublico()
    const { data, error } = await supabase.from('produtos').select('slug')

    if (error) throw error
    return (data ?? []).map((linha) => linha.slug as string)
  } catch (err) {
    console.warn('Usando slugs locais (fallback):', (err as Error)?.message || err)
    return produtosFallback.map((p) => p.slug)
  }
}

export async function buscarPorSlug(slug: string): Promise<Produto | undefined> {
  try {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('produtos')
      .select(CAMPOS)
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    if (data) return converter(data as LinhaProduto)
    return produtosFallback.find((p) => p.slug === slug)
  } catch (err) {
    console.warn(`Usando busca por slug local para "${slug}":`, (err as Error)?.message || err)
    return produtosFallback.find((p) => p.slug === slug)
  }
}

export async function produtosPorCategoria(categoria?: string): Promise<Produto[]> {
  try {
    const supabase = criarClientePublico()
    let consulta = supabase.from('produtos').select(CAMPOS)

    if (categoria && categoria !== 'todas') {
      consulta = consulta.eq('categoria_id', categoria)
    }

    const { data, error } = await consulta.order('criado_em', { ascending: true })
    if (error) throw error
    if (!data || data.length === 0) {
      if (!categoria || categoria === 'todas') return produtosFallback
      return produtosFallback.filter((p) => p.categoria === categoria)
    }
    return (data as LinhaProduto[]).map(converter)
  } catch (err) {
    console.warn(`Usando categoria local para "${categoria}":`, (err as Error)?.message || err)
    if (!categoria || categoria === 'todas') return produtosFallback
    return produtosFallback.filter((p) => p.categoria === categoria)
  }
}

/** Peças marcadas como destaque; se não houver nenhuma, as 6 primeiras. */
export async function produtosEmDestaque(): Promise<Produto[]> {
  const todos = await listarProdutos()
  const marcados = todos.filter((p) => p.destaque)
  return marcados.length > 0 ? marcados : todos.slice(0, 6)
}

export async function listarCategorias(): Promise<Categoria[]> {
  try {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome, imagem_url')
      .order('ordem', { ascending: true })

    if (error) throw error
    if (!data || data.length === 0) return categoriasFallback
    return (data ?? []).map((c) => ({
      id: c.id as string,
      nome: c.nome as string,
      imagem: (c.imagem_url as string | null) ?? '',
    }))
  } catch (err) {
    console.warn('Usando categorias locais (fallback):', (err as Error)?.message || err)
    return categoriasFallback
  }
}

/** Quantas peças em cada categoria, para o contador dos filtros. */
export async function contagemPorCategoria(): Promise<Record<string, number>> {
  const todos = await listarProdutos()
  return todos.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] ?? 0) + 1
    return acc
  }, {})
}

/** Nome de exibição da categoria. Ex.: 'aneis' -> 'Anéis' */
export async function nomeCategoria(id: string): Promise<string> {
  const categorias = await listarCategorias()
  return categorias.find((c) => c.id === id)?.nome ?? 'Peças'
}

