import { criarClientePublico } from '@/lib/supabase/publico'
import type { BanhoId, Categoria, Produto } from '@/types'

/**
 * Leitura do catálogo.
 *
 * Substitui o antigo src/data/produtos.ts. Os nomes das funções foram mantidos
 * para que as páginas continuassem iguais — a única diferença é que agora são
 * assíncronas.
 *
 * Quem filtra peça desligada é o RLS do banco, não este arquivo: o visitante
 * simplesmente não recebe as linhas com ativo = false.
 *
 * Usa de propósito o client SEM cookies. O catálogo é público e igual para
 * todo mundo, então ler a sessão só serviria para tornar toda página dinâmica
 * e obrigar uma consulta ao banco a cada visita. Sem cookies, o Next consegue
 * gerar as páginas antecipadamente e revalidar de tempos em tempos.
 * O painel /admin, que precisa enxergar peça desligada, usa o client com sessão.
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
  const supabase = criarClientePublico()
  const { data, error } = await supabase
    .from('produtos')
    .select(CAMPOS)
    .order('criado_em', { ascending: true })

  if (error) throw new Error(`Falha ao listar peças: ${error.message}`)
  return (data as LinhaProduto[]).map(converter)
}

/**
 * Só os endereços das peças, para o generateStaticParams.
 * Usa o client sem cookies porque roda no build, fora de qualquer requisição.
 */
export async function listarSlugs(): Promise<string[]> {
  const supabase = criarClientePublico()
  const { data, error } = await supabase.from('produtos').select('slug')

  if (error) {
    // Não vale derrubar o build inteiro por isso: sem a lista, as páginas
    // passam a ser geradas sob demanda na primeira visita.
    console.warn(`Não foi possível pré-gerar as páginas das peças: ${error.message}`)
    return []
  }
  return data.map((linha) => linha.slug as string)
}

export async function buscarPorSlug(slug: string): Promise<Produto | undefined> {
  const supabase = criarClientePublico()
  const { data, error } = await supabase
    .from('produtos')
    .select(CAMPOS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(`Falha ao buscar a peça: ${error.message}`)
  return data ? converter(data as LinhaProduto) : undefined
}

export async function produtosPorCategoria(categoria?: string): Promise<Produto[]> {
  const supabase = criarClientePublico()
  let consulta = supabase.from('produtos').select(CAMPOS)

  if (categoria && categoria !== 'todas') {
    consulta = consulta.eq('categoria_id', categoria)
  }

  const { data, error } = await consulta.order('criado_em', { ascending: true })
  if (error) throw new Error(`Falha ao listar a categoria: ${error.message}`)
  return (data as LinhaProduto[]).map(converter)
}

/** Peças marcadas como destaque; se não houver nenhuma, as 6 primeiras. */
export async function produtosEmDestaque(): Promise<Produto[]> {
  const todos = await listarProdutos()
  const marcados = todos.filter((p) => p.destaque)
  return marcados.length > 0 ? marcados : todos.slice(0, 6)
}

export async function listarCategorias(): Promise<Categoria[]> {
  const supabase = criarClientePublico()
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nome, imagem_url')
    .order('ordem', { ascending: true })

  if (error) throw new Error(`Falha ao listar categorias: ${error.message}`)
  return (data ?? []).map((c) => ({
    id: c.id as string,
    nome: c.nome as string,
    imagem: (c.imagem_url as string | null) ?? '',
  }))
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
