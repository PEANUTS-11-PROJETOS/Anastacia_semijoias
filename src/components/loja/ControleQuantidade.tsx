'use client'

import { cn } from '@/lib/utils'
import { IconeMais, IconeMenos } from '@/components/ui/Icones'

interface Props {
  quantidade: number
  aoAlterar: (valor: number) => void
  /** Nome da peça, para o leitor de tela saber o que está sendo alterado. */
  rotulo: string
  compacto?: boolean
  /** Abaixo disso o controle não desce (no carrinho, 0 remove o item). */
  minimo?: number
}

export function ControleQuantidade({
  quantidade,
  aoAlterar,
  rotulo,
  compacto = false,
  minimo = 1,
}: Props) {
  const tamanho = compacto ? 'h-7 w-7' : 'h-9 w-9'
  const icone = compacto ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <div className="flex items-center gap-1 rounded-full border border-roxo/15 bg-lilas-claro p-0.5">
      <button
        type="button"
        onClick={() => aoAlterar(quantidade - 1)}
        disabled={quantidade <= minimo}
        aria-label={`Diminuir quantidade de ${rotulo}`}
        className={cn(
          tamanho,
          'flex items-center justify-center rounded-full text-roxo transition-colors hover:bg-white disabled:opacity-35 disabled:hover:bg-transparent',
        )}
      >
        <IconeMenos className={icone} />
      </button>

      <span
        aria-live="polite"
        className={cn(
          'min-w-5 text-center font-rotulo font-semibold text-tinta',
          compacto ? 'text-xs' : 'text-sm',
        )}
      >
        {quantidade}
      </span>

      <button
        type="button"
        onClick={() => aoAlterar(quantidade + 1)}
        aria-label={`Aumentar quantidade de ${rotulo}`}
        className={cn(
          tamanho,
          'flex items-center justify-center rounded-full text-roxo transition-colors hover:bg-white',
        )}
      >
        <IconeMais className={icone} />
      </button>
    </div>
  )
}
