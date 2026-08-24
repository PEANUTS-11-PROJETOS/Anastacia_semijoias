'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCarrinho } from '@/stores/carrinho'
import { useMontado } from '@/hooks/useMontado'
import { descricaoVariacao, totalPedido, totalPecas } from '@/lib/whatsapp'
import { fmtMoeda } from '@/lib/utils'
import { FotoProduto } from '@/components/loja/FotoProduto'
import { ControleQuantidade } from '@/components/loja/ControleQuantidade'
import { IconeFechar, IconeSacola } from '@/components/ui/Icones'

/**
 * Painel lateral com o resumo da seleção. Abre sozinho quando uma peça é
 * adicionada, dando o retorno visual de que a ação funcionou.
 */
export function PainelSelecao() {
  const montado = useMontado()
  const caminho = usePathname()
  const { itens, painelAberto, fecharPainel, remover, alterarQuantidade } = useCarrinho()

  /* Fecha ao trocar de página e ao apertar Esc. */
  useEffect(() => {
    fecharPainel()
  }, [caminho, fecharPainel])

  useEffect(() => {
    if (!painelAberto) return
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') fecharPainel()
    }
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [painelAberto, fecharPainel])

  if (!montado || !painelAberto) return null

  const total = totalPedido(itens)
  const pecas = totalPecas(itens)

  return (
    <div className="fixed inset-0 z-60 flex justify-end" role="dialog" aria-modal="true" aria-label="Minha seleção">
      <button
        type="button"
        onClick={fecharPainel}
        aria-label="Fechar seleção"
        className="absolute inset-0 bg-roxo-escuro/45 backdrop-blur-[2px]"
      />

      <aside className="animar-subir relative flex h-full w-full max-w-[420px] flex-col bg-lilas-claro shadow-2xl">
        <header className="flex items-center justify-between border-b border-roxo/10 bg-white px-5 py-4">
          <h2 className="font-serifada text-xl text-tinta">
            Minha seleção{' '}
            {pecas > 0 && <span className="text-tinta-suave">({pecas})</span>}
          </h2>
          <button
            type="button"
            onClick={fecharPainel}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-tinta-suave transition-colors hover:bg-roxo/8 hover:text-roxo"
          >
            <IconeFechar className="h-5 w-5" />
          </button>
        </header>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-roxo/10 text-roxo">
              <IconeSacola className="h-7 w-7" />
            </span>
            <p className="text-[15px] leading-relaxed text-tinta-media">
              Sua seleção está vazia. Escolha as peças que gostou e monte seu pedido.
            </p>
            <Link
              href="/pecas"
              onClick={fecharPainel}
              className="rounded-lg bg-roxo px-7 py-3.5 font-rotulo text-xs tracking-[0.12em] text-white uppercase transition-colors hover:bg-roxo-escuro"
            >
              Ver a coleção
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-4 py-4">
              {itens.map((item) => (
                <li
                  key={item.id}
                  className="mb-3 flex gap-3.5 rounded-xl border border-roxo/10 bg-white p-3"
                >
                  <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-lilas">
                    <FotoProduto imagem={item.imagem} alt={item.nome} sizes="80px" />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serifada text-[15px] leading-tight text-tinta">
                        {item.nome}
                      </h3>
                      <button
                        type="button"
                        onClick={() => remover(item.id)}
                        aria-label={`Remover ${item.nome} da seleção`}
                        className="shrink-0 text-tinta-clara transition-colors hover:text-[#BA1A1A]"
                      >
                        <IconeFechar className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-0.5 text-xs text-tinta-suave">
                      {descricaoVariacao(item)}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <ControleQuantidade
                        quantidade={item.quantidade}
                        aoAlterar={(valor) => alterarQuantidade(item.id, valor)}
                        rotulo={item.nome}
                        compacto
                      />
                      <span className="font-serifada text-base text-roxo">
                        {fmtMoeda(item.preco * item.quantidade)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-roxo/10 bg-white px-5 py-4">
              <div className="mb-3.5 flex items-baseline justify-between">
                <span className="text-[15px] text-tinta-media">Total estimado</span>
                <span className="font-serifada text-2xl text-tinta">{fmtMoeda(total)}</span>
              </div>
              <Link
                href="/selecao"
                onClick={fecharPainel}
                className="flex w-full items-center justify-center rounded-lg bg-roxo px-6 py-4 font-rotulo text-[13px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo-escuro"
              >
                Revisar e finalizar
              </Link>
              <button
                type="button"
                onClick={fecharPainel}
                className="mt-2 w-full py-2 font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
              >
                Continuar explorando
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
