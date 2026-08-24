'use client'

import Link from 'next/link'
import { useCarrinho } from '@/stores/carrinho'
import { useMontado } from '@/hooks/useMontado'
import { totalPecas, totalPedido } from '@/lib/whatsapp'
import { fmtMoeda } from '@/lib/utils'
import { IconeSacola, IconeWhatsApp } from '@/components/ui/Icones'

/**
 * Barra fixa no rodapé da vitrine com o resumo da seleção.
 * Só aparece quando há peças escolhidas — barra vazia só ocupa espaço.
 */
export function BarraSelecao() {
  const montado = useMontado()
  const itens = useCarrinho((estado) => estado.itens)

  if (!montado || itens.length === 0) return null

  const pecas = totalPecas(itens)

  return (
    <div className="animar-subir fixed inset-x-0 bottom-0 z-45 border-t border-dourado/30 bg-white/95 shadow-[0_-10px_30px_-18px_rgba(51,36,63,0.35)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-16">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-roxo/10 text-roxo max-sm:hidden">
            <IconeSacola className="h-5.5 w-5.5" />
          </span>
          <span className="flex flex-col">
            <span className="text-[13px] text-tinta-suave">
              {pecas} {pecas === 1 ? 'peça na seleção' : 'peças na seleção'}
            </span>
            <span className="font-serifada text-lg text-tinta sm:text-xl">
              Total: {fmtMoeda(totalPedido(itens))}
            </span>
          </span>
        </div>

        <Link
          href="/selecao"
          className="flex shrink-0 items-center gap-2.5 rounded-xl bg-zap px-5 py-3.5 font-rotulo text-[13px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-zap-escuro sm:px-7"
        >
          <IconeWhatsApp className="h-5 w-5" />
          <span className="max-sm:hidden">Finalizar no WhatsApp</span>
          <span className="sm:hidden">Finalizar</span>
        </Link>
      </div>
    </div>
  )
}
