'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BanhoId, ItemCarrinho, Produto } from '@/types'

interface EstadoCarrinho {
  itens: ItemCarrinho[]
  /** Controla o painel lateral da seleção. */
  painelAberto: boolean
  adicionar: (
    produto: Produto,
    opcoes: { banho: BanhoId; quantidade?: number },
  ) => void
  remover: (id: string) => void
  alterarQuantidade: (id: string, quantidade: number) => void
  limpar: () => void
  abrirPainel: () => void
  fecharPainel: () => void
}

/** Chave única por combinação: a mesma peça em banhos diferentes são linhas separadas. */
function montarId(codigo: string, banho: BanhoId): string {
  return [codigo, banho].join('|')
}

export const useCarrinho = create<EstadoCarrinho>()(
  persist(
    (set) => ({
      itens: [],
      painelAberto: false,

      adicionar: (produto, { banho, quantidade = 1 }) =>
        set((estado) => {
          const id = montarId(produto.codigo, banho)
          const existente = estado.itens.find((item) => item.id === id)

          if (existente) {
            return {
              painelAberto: true,
              itens: estado.itens.map((item) =>
                item.id === id
                  ? { ...item, quantidade: item.quantidade + quantidade }
                  : item,
              ),
            }
          }

          const novo: ItemCarrinho = {
            id,
            codigo: produto.codigo,
            slug: produto.slug,
            nome: produto.nome,
            // Só a capa, não a galeria: ver a nota em ItemCarrinho.imagem.
            imagem: produto.fotos[0]?.url ?? '',
            preco: produto.preco,
            quantidade,
            banho,
          }
          return { painelAberto: true, itens: [...estado.itens, novo] }
        }),

      remover: (id) =>
        set((estado) => ({ itens: estado.itens.filter((item) => item.id !== id) })),

      alterarQuantidade: (id, quantidade) =>
        set((estado) => ({
          itens:
            quantidade <= 0
              ? estado.itens.filter((item) => item.id !== id)
              : estado.itens.map((item) =>
                  item.id === id ? { ...item, quantidade } : item,
                ),
        })),

      limpar: () => set({ itens: [] }),
      abrirPainel: () => set({ painelAberto: true }),
      fecharPainel: () => set({ painelAberto: false }),
    }),
    {
      name: 'anastacia-selecao',
      /** O painel aberto não deve sobreviver a um reload. */
      partialize: (estado) => ({ itens: estado.itens }),
    },
  ),
)
