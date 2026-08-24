'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FotoProduto as Foto } from '@/types'
import { FotoProduto } from '@/components/loja/FotoProduto'

interface Props {
  fotos: Foto[]
  nome: string
  /** Etiqueta sobreposta, ex.: 'Novo'. */
  selo?: string
  esgotado?: boolean
}

/**
 * Galeria da página da peça: foto grande + miniaturas.
 * Com zero ou uma foto, some com as miniaturas e vira uma imagem simples.
 */
export function GaleriaProduto({ fotos, nome, selo, esgotado }: Props) {
  const [atual, setAtual] = useState(0)
  const foto = fotos[atual]

  return (
    <div className="flex flex-1 basis-80 flex-col gap-3">
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-roxo/10 bg-lilas-claro">
        <FotoProduto
          key={foto?.id ?? 'vazia'}
          imagem={foto?.url ?? ''}
          alt={nome}
          sizes="(max-width: 1024px) 100vw, 520px"
          prioridade
          className={cn('animar-surgir', esgotado && 'opacity-70 grayscale-[35%]')}
        />

        {esgotado && (
          <span className="absolute top-4 left-4 rounded-full bg-tinta/85 px-3 py-1.5 font-rotulo text-[10px] tracking-[0.18em] text-white uppercase backdrop-blur-sm">
            Esgotado
          </span>
        )}
        {!esgotado && selo && (
          <span className="absolute top-4 left-4 rounded-full bg-roxo px-3 py-1.5 font-rotulo text-[10px] tracking-[0.18em] text-white uppercase">
            {selo}
          </span>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="rolagem-limpa flex gap-2.5 overflow-x-auto pb-1">
          {fotos.map((item, indice) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAtual(indice)}
              aria-label={`Ver foto ${indice + 1} de ${fotos.length}`}
              aria-current={indice === atual}
              className={cn(
                'relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                indice === atual
                  ? 'border-roxo'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <FotoProduto imagem={item.url} alt="" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
