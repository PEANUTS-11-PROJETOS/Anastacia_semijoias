'use client'

import Link from 'next/link'
import { banhos as rotulosBanho } from '@/config/loja'
import { useCarrinho } from '@/stores/carrinho'
import { cn, fmtMoeda } from '@/lib/utils'
import type { Produto } from '@/types'
import { FotoProduto } from '@/components/loja/FotoProduto'
import { IconeMais, IconeSeta } from '@/components/ui/Icones'

interface Props {
  produto: Produto
  prioridade?: boolean
}

/** Peça com mais de um banho precisa da página de detalhe para a cliente escolher. */
export function precisaEscolher(produto: Produto): boolean {
  return produto.banhos.length > 1
}

export function CardProduto({ produto, prioridade = false }: Props) {
  const adicionar = useCarrinho((estado) => estado.adicionar)
  const escolher = precisaEscolher(produto)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-roxo/10 bg-white shadow-[0_1px_3px_rgba(51,36,63,0.05)] transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(51,36,63,0.45)]">
      {produto.esgotado ? (
        <span className="absolute top-3.5 left-3.5 z-10 rounded-full bg-tinta/85 px-2.5 py-1 font-rotulo text-[9px] tracking-[0.18em] text-white uppercase backdrop-blur-sm">
          Esgotado
        </span>
      ) : produto.selo ? (
        <span className="absolute top-3.5 left-3.5 z-10 rounded-full bg-roxo px-2.5 py-1 font-rotulo text-[9px] tracking-[0.18em] text-white uppercase">
          {produto.selo}
        </span>
      ) : null}

      <Link
        href={`/pecas/${produto.slug}`}
        className="relative block aspect-4/5 overflow-hidden bg-lilas-claro"
      >
        <FotoProduto
          imagem={produto.fotos[0]?.url ?? ''}
          alt={produto.nome}
          prioridade={prioridade}
          className={cn(
            'transition-transform duration-500 group-hover:scale-105',
            produto.esgotado && 'opacity-75 grayscale-[25%]',
          )}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 font-rotulo text-[10px] tracking-[0.22em] text-dourado">
          {produto.codigo}
        </span>

        <h3 className="font-serifada text-lg leading-snug text-tinta">
          <Link href={`/pecas/${produto.slug}`} className="hover:text-roxo">
            {produto.nome}
          </Link>
        </h3>

        <p className="mt-1 mb-4 text-[13px] text-tinta-suave">
          {produto.banhos.map((b) => rotulosBanho[b].nome).join(' ou ')}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="flex flex-col">
            {produto.precoDe && (
              <span className="text-xs text-tinta-clara line-through">
                {fmtMoeda(produto.precoDe)}
              </span>
            )}
            <span className="font-serifada text-xl text-roxo">
              {fmtMoeda(produto.preco)}
            </span>
          </span>

          {produto.esgotado || escolher ? (
            <Link
              href={`/pecas/${produto.slug}`}
              aria-label={
                produto.esgotado
                  ? `Ver detalhes de ${produto.nome} (esgotado)`
                  : `Escolher opções de ${produto.nome}`
              }
              className={cn(
                'flex h-10.5 w-10.5 items-center justify-center rounded-full text-white transition-colors',
                produto.esgotado
                  ? 'bg-tinta/50 hover:bg-tinta/80'
                  : 'bg-roxo hover:bg-roxo-escuro',
              )}
            >
              <IconeSeta className="h-5 w-5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => adicionar(produto, { banho: produto.banhos[0] })}
              aria-label={`Adicionar ${produto.nome} à seleção`}
              className="flex h-10.5 w-10.5 items-center justify-center rounded-full bg-roxo text-white transition-colors hover:bg-roxo-escuro"
            >
              <IconeMais className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

