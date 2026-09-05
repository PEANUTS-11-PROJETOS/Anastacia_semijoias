'use client'

import { useState } from 'react'
import { banhos as rotulosBanho } from '@/config/loja'
import { useCarrinho } from '@/stores/carrinho'
import { linkDuvidaPeca } from '@/lib/whatsapp'
import { cn, fmtMoeda } from '@/lib/utils'
import type { BanhoId, Produto } from '@/types'
import { ControleQuantidade } from '@/components/loja/ControleQuantidade'
import { IconeAjustavel, IconeSacola, IconeWhatsApp } from '@/components/ui/Icones'

interface Props {
  produto: Produto
}

/** Escolha de variações + adicionar à seleção. */
export function SeletorCompra({ produto }: Props) {
  const adicionar = useCarrinho((estado) => estado.adicionar)

  const [banho, setBanho] = useState<BanhoId>(produto.banhos[0])
  const [quantidade, setQuantidade] = useState(1)

  function aoAdicionar() {
    if (produto.esgotado) return
    adicionar(produto, { banho, quantidade })
    setQuantidade(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        {produto.precoDe && (
          <span className="text-base text-tinta-clara line-through">
            {fmtMoeda(produto.precoDe)}
          </span>
        )}
        <span className="font-serifada text-3xl text-roxo">
          {fmtMoeda(produto.preco)}
        </span>
      </div>

      {/* Banho */}
      {produto.banhos.length > 1 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-rotulo text-[11px] tracking-[0.14em] text-tinta-suave uppercase">
            Escolha o banho
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {produto.banhos.map((opcao) => (
              <button
                key={opcao}
                type="button"
                onClick={() => setBanho(opcao)}
                aria-pressed={banho === opcao}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition-colors',
                  banho === opcao
                    ? 'border-roxo bg-roxo/8 font-semibold text-roxo'
                    : 'border-roxo/20 bg-white text-tinta-media hover:border-roxo/45',
                )}
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ background: rotulosBanho[opcao].cor }}
                />
                {rotulosBanho[opcao].nome}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="text-[15px] text-tinta-media">
          Banho{' '}
          <span className="font-semibold text-tinta">
            {rotulosBanho[produto.banhos[0]].nome}
          </span>
        </p>
      )}

      {/* Aro ajustável — não há numeração a escolher */}
      {produto.ajustavel && (
        <div className="flex items-start gap-3 rounded-xl border border-dourado/30 bg-dourado/6 p-4">
          <IconeAjustavel className="mt-0.5 h-5 w-5 shrink-0 text-dourado" />
          <span>
            <span className="block font-rotulo text-[11px] font-semibold tracking-[0.14em] text-tinta uppercase">
              Aro ajustável
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-tinta-media">
              A peça abre e fecha com delicadeza para servir em qualquer dedo. Não é
              preciso saber o seu número.
            </span>
          </span>
        </div>
      )}

      {/* Quantidade + ações / Estado Esgotado */}
      {produto.esgotado ? (
        <div className="flex flex-col gap-3.5 rounded-2xl border border-roxo/15 bg-white/70 p-5 shadow-[0_10px_30px_-15px_rgba(51,36,63,0.1)]">
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-tinta/85 px-3 py-1 font-rotulo text-[10px] tracking-[0.18em] text-white uppercase backdrop-blur-sm">
              Esgotado
            </span>
            <span className="font-serifada text-base text-tinta">
              Peça indisponível no momento
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-tinta-media">
            Esta peça não pode ser adicionada à seleção agora. Você pode consultar previsão de reposição ou encomendar com nossa consultora.
          </p>
          <a
            href={linkDuvidaPeca(produto.nome, produto.codigo)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-xl border border-zap/40 bg-zap/5 px-7 py-3.5 font-rotulo text-[13px] tracking-[0.1em] text-zap-escuro uppercase transition-colors hover:bg-zap/12"
          >
            <IconeWhatsApp className="h-5 w-5" />
            Consultar reposição no WhatsApp
          </a>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3.5">
            <ControleQuantidade
              quantidade={quantidade}
              aoAlterar={setQuantidade}
              rotulo={produto.nome}
            />

            <button
              type="button"
              onClick={aoAdicionar}
              className="flex flex-1 basis-55 items-center justify-center gap-2.5 rounded-xl bg-roxo px-7 py-4 font-rotulo text-[13px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo-escuro"
            >
              <IconeSacola className="h-5 w-5" />
              Adicionar à seleção
            </button>
          </div>

          <a
            href={linkDuvidaPeca(produto.nome, produto.codigo)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-xl border border-zap/40 px-7 py-3.5 font-rotulo text-[13px] tracking-[0.1em] text-zap-escuro uppercase transition-colors hover:bg-zap/8"
          >
            <IconeWhatsApp className="h-5 w-5" />
            Tirar dúvida sobre esta peça
          </a>
        </>
      )}
    </div>
  )
}
