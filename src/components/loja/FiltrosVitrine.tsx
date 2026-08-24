'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Categoria } from '@/types'

export const ordenacoes = [
  { id: 'destaques', rotulo: 'Destaques' },
  { id: 'menor-preco', rotulo: 'Menor preço' },
  { id: 'maior-preco', rotulo: 'Maior preço' },
  { id: 'novidades', rotulo: 'Novidades' },
] as const

export type OrdenacaoId = (typeof ordenacoes)[number]['id']

/** Monta a URL preservando os outros filtros já aplicados. */
function montarUrl(parametros: URLSearchParams, chave: string, valor: string, padrao: string) {
  const novos = new URLSearchParams(parametros.toString())
  if (valor === padrao) novos.delete(chave)
  else novos.set(chave, valor)
  const consulta = novos.toString()
  return consulta ? `/pecas?${consulta}` : '/pecas'
}

/**
 * Seletor de ordenação.
 * O estado mora na URL (?categoria=aneis&ordem=menor-preco), então a página
 * filtrada pode ser enviada pronta para a cliente pelo WhatsApp.
 */
export function OrdenacaoVitrine({ atual }: { atual: OrdenacaoId }) {
  const router = useRouter()
  const parametros = useSearchParams()

  return (
    <label className="flex items-center gap-2.5 text-sm text-tinta-media">
      Ordenar
      <select
        value={atual}
        onChange={(evento) =>
          router.push(montarUrl(parametros, 'ordem', evento.target.value, 'destaques'), {
            scroll: false,
          })
        }
        className="cursor-pointer rounded-lg border border-roxo/20 bg-white px-3 py-2.5 font-corpo text-sm text-roxo"
      >
        {ordenacoes.map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </label>
  )
}

interface PropsCategorias {
  atual: string
  /** Vêm do banco pela página — este componente roda no navegador e não consulta. */
  categorias: Categoria[]
  contagem: Record<string, number>
  total: number
}

/** Coluna de categorias no desktop, faixa rolável de pílulas no celular. */
export function CategoriasVitrine({
  atual,
  categorias,
  contagem,
  total,
}: PropsCategorias) {
  const parametros = useSearchParams()

  const itens = [
    { id: 'todas', nome: 'Todas as peças', quantidade: total },
    ...categorias.map((c) => ({
      id: c.id,
      nome: c.nome,
      quantidade: contagem[c.id] ?? 0,
    })),
  ]

  return (
    <nav
      aria-label="Filtrar por categoria"
      className="rolagem-limpa -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-3.5 lg:overflow-visible lg:px-0"
    >
      <h3 className="mb-2 hidden border-b border-dourado/30 pb-3 font-rotulo text-[11px] tracking-[0.22em] text-dourado uppercase lg:block">
        Categorias
      </h3>

      {itens.map((item) => {
        const ativo = item.id === atual
        return (
          <Link
            key={item.id}
            href={montarUrl(parametros, 'categoria', item.id, 'todas')}
            scroll={false}
            aria-current={ativo ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors',
              'lg:rounded-none lg:border-0 lg:px-0 lg:py-0',
              ativo
                ? 'border-roxo bg-roxo text-white lg:bg-transparent lg:font-semibold lg:text-roxo'
                : 'border-roxo/20 bg-white text-tinta-media hover:border-roxo/50 lg:bg-transparent lg:hover:text-roxo',
            )}
          >
            {item.nome}
            <span
              className={cn(
                'text-[13px] lg:ml-auto',
                ativo ? 'text-white/70 lg:text-roxo/60' : 'text-tinta-clara',
              )}
            >
              {item.quantidade}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
