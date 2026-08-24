import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  contagemPorCategoria,
  listarCategorias,
  listarProdutos,
  nomeCategoria,
  produtosPorCategoria,
} from '@/lib/produtos'
import type { Produto } from '@/types'
import { CardProduto } from '@/components/loja/CardProduto'
import { BarraSelecao } from '@/components/loja/BarraSelecao'
import {
  CategoriasVitrine,
  OrdenacaoVitrine,
  type OrdenacaoId,
} from '@/components/loja/FiltrosVitrine'

export const metadata: Metadata = {
  title: 'Coleção',
  description:
    'Todas as semijoias da Anastácia: anéis, brincos, colares, pulseiras e conjuntos banhados a ouro 18k e ródio branco.',
}

/** Aplica a ordenação escolhida sem alterar a lista original. */
function ordenar(lista: Produto[], ordem: OrdenacaoId): Produto[] {
  const copia = [...lista]
  switch (ordem) {
    case 'menor-preco':
      return copia.sort((a, b) => a.preco - b.preco)
    case 'maior-preco':
      return copia.sort((a, b) => b.preco - a.preco)
    case 'novidades':
      return copia.sort((a, b) => Number(Boolean(b.selo)) - Number(Boolean(a.selo)))
    default:
      return copia.sort((a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque)))
  }
}

export default async function PaginaVitrine({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; ordem?: string }>
}) {
  const { categoria = 'todas', ordem = 'destaques' } = await searchParams

  const [filtrados, categorias, contagem, todos] = await Promise.all([
    produtosPorCategoria(categoria),
    listarCategorias(),
    contagemPorCategoria(),
    listarProdutos(),
  ])

  const lista = ordenar(filtrados, ordem as OrdenacaoId)
  const titulo =
    categoria === 'todas' ? 'Toda a coleção' : await nomeCategoria(categoria)

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-9 pb-32 sm:px-8 lg:px-16 lg:pt-16">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5 lg:mb-11">
        <div>
          <span className="rotulo">Coleção</span>
          <h1 className="mt-2.5 mb-3 font-serifada text-3xl text-tinta lg:text-5xl">
            {titulo}
          </h1>
          <p className="max-w-130 text-[15px] leading-relaxed text-tinta-media">
            Uma seleção banhada a ouro 18k e ródio branco, desenhada para refletir sua
            elegância atemporal.
          </p>
        </div>

        <Suspense fallback={null}>
          <OrdenacaoVitrine atual={ordem as OrdenacaoId} />
        </Suspense>
      </div>

      <div className="flex flex-wrap items-start gap-6 lg:gap-11">
        <aside className="w-full lg:sticky lg:top-24 lg:w-53 lg:shrink-0">
          <Suspense fallback={null}>
            <CategoriasVitrine
              atual={categoria}
              categorias={categorias}
              contagem={contagem}
              total={todos.length}
            />
          </Suspense>
        </aside>

        <div className="min-w-70 flex-1">
          {lista.length === 0 ? (
            <p className="rounded-2xl border border-roxo/10 bg-white p-10 text-center text-tinta-media">
              Ainda não há peças nesta categoria. Em breve!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-7">
              {lista.map((produto, indice) => (
                <CardProduto
                  key={produto.codigo}
                  produto={produto}
                  prioridade={indice < 3}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BarraSelecao />
    </div>
  )
}
