'use server'

import { revalidatePath } from 'next/cache'
import { criarClienteServidor } from '@/lib/supabase/server'
import { esquemaProduto, validarPrecoDe, type EntradaProduto } from '@/lib/esquemas'

/**
 * Ações do painel.
 *
 * Toda ação começa conferindo a sessão. O proxy.ts já barra a navegação para
 * /admin, mas Server Action é um endereço invocável diretamente — sem esta
 * segunda checagem, a proteção seria só de fachada. O RLS do banco é a terceira
 * camada, e a única que não depende de eu ter lembrado de escrever a checagem.
 */
async function exigirSessao() {
  const supabase = await criarClienteServidor()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado.')
  return supabase
}

/** Limpa o cache das páginas que mostram catálogo, para a mudança aparecer já. */
function atualizarVitrine(slug?: string) {
  revalidatePath('/')
  revalidatePath('/pecas')
  if (slug) revalidatePath(`/pecas/${slug}`)
  revalidatePath('/admin')
}

export type Resultado =
  | { ok: true; id: string; slug: string }
  | { ok: false; erro: string }

/** Cria ou atualiza uma peça. Sem id = criação. */
export async function salvarProduto(
  entrada: EntradaProduto,
  id?: string,
): Promise<Resultado> {
  let supabase
  try {
    supabase = await exigirSessao()
  } catch {
    return { ok: false, erro: 'Sua sessão expirou. Entre novamente.' }
  }

  const validado = esquemaProduto.safeParse(entrada)
  if (!validado.success) {
    const primeiro = validado.error.issues[0]
    return { ok: false, erro: primeiro?.message ?? 'Dados inválidos.' }
  }

  const dados = validado.data
  const erroPreco = validarPrecoDe(dados)
  if (erroPreco) return { ok: false, erro: erroPreco }

  const { data, error } = id
    ? await supabase.from('produtos').update(dados).eq('id', id).select('id, slug').single()
    : await supabase.from('produtos').insert(dados).select('id, slug').single()

  if (error) {
    // 23505 = violação de índice único. Traduzir ajuda muito mais que o texto cru.
    if (error.code === '23505') {
      const campo = error.message.includes('slug') ? 'endereço (slug)' : 'código'
      return { ok: false, erro: `Já existe outra peça com este ${campo}.` }
    }
    return { ok: false, erro: `Não foi possível salvar: ${error.message}` }
  }

  atualizarVitrine(data.slug as string)
  return { ok: true, id: data.id as string, slug: data.slug as string }
}

/** Liga/desliga a visibilidade da peça no site. */
export async function alternarAtivo(id: string, ativo: boolean) {
  const supabase = await exigirSessao()
  const { error } = await supabase.from('produtos').update({ ativo }).eq('id', id)
  if (error) throw new Error(error.message)
  atualizarVitrine()
}

/** Marca a peça como esgotada (continua visível, mas não entra na seleção). */
export async function alternarEsgotado(id: string, esgotado: boolean) {
  const supabase = await exigirSessao()
  const { error } = await supabase.from('produtos').update({ esgotado }).eq('id', id)
  if (error) throw new Error(error.message)
  atualizarVitrine()
}

export async function excluirProduto(id: string) {
  const supabase = await exigirSessao()

  // Apaga as fotos do Storage antes da peça: com a linha já removida em cascata,
  // os arquivos ficariam órfãos ocupando espaço para sempre.
  const { data: fotos } = await supabase
    .from('produto_fotos')
    .select('url')
    .eq('produto_id', id)

  const caminhos = (fotos ?? [])
    .map((f) => caminhoNoBucket(f.url as string))
    .filter((c): c is string => c !== null)

  if (caminhos.length > 0) {
    await supabase.storage.from('fotos').remove(caminhos)
  }

  const { error } = await supabase.from('produtos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  atualizarVitrine()
}

/** Extrai 'produtos/xxx/yyy.webp' de uma URL pública do Storage. */
function caminhoNoBucket(url: string): string | null {
  const marca = '/storage/v1/object/public/fotos/'
  const posicao = url.indexOf(marca)
  return posicao === -1 ? null : url.slice(posicao + marca.length)
}

/** Registra no banco uma foto que o navegador acabou de enviar ao Storage. */
export async function registrarFoto(produtoId: string, url: string, ordem: number) {
  const supabase = await exigirSessao()
  const { error } = await supabase
    .from('produto_fotos')
    .insert({ produto_id: produtoId, url, ordem })
  if (error) throw new Error(error.message)
  atualizarVitrine()
}

export async function removerFoto(fotoId: string) {
  const supabase = await exigirSessao()

  const { data: foto } = await supabase
    .from('produto_fotos')
    .select('url')
    .eq('id', fotoId)
    .maybeSingle()

  if (foto) {
    const caminho = caminhoNoBucket(foto.url as string)
    if (caminho) await supabase.storage.from('fotos').remove([caminho])
  }

  const { error } = await supabase.from('produto_fotos').delete().eq('id', fotoId)
  if (error) throw new Error(error.message)
  atualizarVitrine()
}

/** Reordena a galeria. A foto de ordem 0 é a capa. */
export async function reordenarFotos(idsNaOrdem: string[]) {
  const supabase = await exigirSessao()

  await Promise.all(
    idsNaOrdem.map((id, ordem) =>
      supabase.from('produto_fotos').update({ ordem }).eq('id', id),
    ),
  )
  atualizarVitrine()
}

export async function sair() {
  const supabase = await criarClienteServidor()
  await supabase.auth.signOut()
  revalidatePath('/admin')
}
