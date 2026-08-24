'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fmtMoeda } from '@/lib/utils'
import type { Produto } from '@/types'
import { FotoProduto } from '@/components/loja/FotoProduto'

interface Props {
  produtos: Produto[]
}

const INTERVALO = 4500

/** Vitrine rotativa das peças em destaque, como no projeto original. */
export function CarrosselDestaque({ produtos }: Props) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)

  useEffect(() => {
    if (pausado || produtos.length <= 1) return
    const relogio = setInterval(
      () => setIndice((atual) => (atual + 1) % produtos.length),
      INTERVALO,
    )
    return () => clearInterval(relogio)
  }, [pausado, produtos.length])

  if (produtos.length === 0) return null

  const peca = produtos[indice]

  return (
    <div
      className="flex flex-wrap overflow-hidden rounded-3xl border border-dourado/30 bg-linear-to-br from-lilas to-lilas-claro"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <Link
        href={`/pecas/${peca.slug}`}
        className="relative min-h-80 flex-1 basis-75 overflow-hidden"
      >
        <FotoProduto
          key={peca.slug}
          imagem={peca.fotos[0]?.url ?? ''}
          alt={peca.nome}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="animar-surgir"
        />
      </Link>

      <div className="flex flex-1 basis-85 flex-col justify-center gap-4 p-7 sm:p-10 lg:p-14">
        <span className="rotulo">Peças do mês</span>

        <h2 className="font-serifada text-2xl leading-tight text-tinta sm:text-3xl lg:text-4xl">
          {peca.nome}
        </h2>

        <p className="max-w-95 text-[15px] leading-relaxed text-tinta-media">
          {peca.descricao}
        </p>

        <span className="font-serifada text-2xl text-roxo">{fmtMoeda(peca.preco)}</span>

        <div>
          <Link
            href={`/pecas/${peca.slug}`}
            className="inline-block rounded-lg bg-roxo px-7 py-3.5 font-rotulo text-[13px] tracking-[0.12em] text-white uppercase transition-colors hover:bg-roxo-escuro"
          >
            Ver esta peça
          </Link>
        </div>

        <div className="mt-2 flex gap-2.5" role="tablist" aria-label="Peças em destaque">
          {produtos.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={i === indice}
              aria-label={item.nome}
              onClick={() => setIndice(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === indice ? 'w-6.5 bg-roxo' : 'w-2.5 bg-roxo/25 hover:bg-roxo/45'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
