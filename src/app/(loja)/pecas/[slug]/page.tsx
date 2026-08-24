import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  buscarPorSlug,
  listarSlugs,
  nomeCategoria,
  produtosPorCategoria,
} from '@/lib/produtos'
import { GaleriaProduto } from '@/components/loja/GaleriaProduto'
import { SeletorCompra } from '@/components/loja/SeletorCompra'
import { CardProduto } from '@/components/loja/CardProduto'
import { BarraSelecao } from '@/components/loja/BarraSelecao'
import { IconeEscudo, IconePremio, IconeCaixa } from '@/components/ui/Icones'

/** Recarrega do banco a cada 5 min; o painel força a atualização ao salvar. */
export const revalidate = 300

/**
 * Gera no build as páginas das peças que já existem. Peça cadastrada depois
 * continua funcionando: o Next renderiza sob demanda na primeira visita.
 */
export async function generateStaticParams() {
  const slugs = await listarSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const produto = await buscarPorSlug(slug)
  if (!produto) return { title: 'Peça não encontrada' }

  return {
    title: produto.nome,
    description: produto.descricao,
  }
}

const selos = [
  { Icone: IconePremio, texto: 'Banho de até 10 milésimos' },
  { Icone: IconeEscudo, texto: 'Hipoalergênico, free-níquel' },
  { Icone: IconeCaixa, texto: 'Vai na embalagem da casa' },
]

export default async function PaginaProduto({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const produto = await buscarPorSlug(slug)
  if (!produto) notFound()

  const [mesmaCategoria, nomeDaCategoria] = await Promise.all([
    produtosPorCategoria(produto.categoria),
    nomeCategoria(produto.categoria),
  ])

  const relacionados = mesmaCategoria
    .filter((p) => p.slug !== produto.slug)
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-32 sm:px-8 lg:px-16 lg:pt-10">
      <nav aria-label="Trilha" className="mb-6 flex flex-wrap gap-2 text-[13px] text-tinta-suave">
        <Link href="/pecas" className="transition-colors hover:text-roxo">
          Coleção
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/pecas?categoria=${produto.categoria}`}
          className="transition-colors hover:text-roxo"
        >
          {nomeDaCategoria}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-tinta">{produto.nome}</span>
      </nav>

      <div className="flex flex-wrap items-start gap-8 lg:gap-14">
        <GaleriaProduto
          fotos={produto.fotos}
          nome={produto.nome}
          selo={produto.selo}
          esgotado={produto.esgotado}
        />

        <div className="flex flex-1 basis-80 flex-col gap-5">
          <div>
            <span className="font-rotulo text-[10px] tracking-[0.22em] text-dourado">
              {produto.codigo}
            </span>
            <h1 className="mt-2 font-serifada text-3xl leading-tight text-tinta lg:text-4xl">
              {produto.nome}
            </h1>
          </div>

          <p className="text-[15px] leading-relaxed text-tinta-media">
            {produto.descricao}
          </p>

          <SeletorCompra produto={produto} />

          <ul className="mt-2 flex flex-col gap-3 border-t border-roxo/10 pt-5">
            {selos.map(({ Icone, texto }) => (
              <li key={texto} className="flex items-center gap-3 text-[14px] text-tinta-media">
                <Icone className="h-5 w-5 shrink-0 text-dourado" />
                {texto}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <div className="mb-6 text-center">
            <span className="rotulo">Combina com</span>
            <h2 className="mt-2.5 font-serifada text-2xl text-tinta lg:text-3xl">
              Outras peças de {nomeDaCategoria.toLowerCase()}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7">
            {relacionados.map((item) => (
              <CardProduto key={item.codigo} produto={item} />
            ))}
          </div>
        </section>
      )}

      <BarraSelecao />
    </div>
  )
}
