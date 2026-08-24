'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { alternarAtivo, alternarEsgotado } from '@/app/admin/acoes'
import { cn, fmtMoeda } from '@/lib/utils'
import type { Categoria, Produto } from '@/types'
import { FotoProduto } from '@/components/loja/FotoProduto'
import { IconeBusca } from '@/components/ui/Icones'

interface Props {
  produtos: Produto[]
  categorias: Categoria[]
}

export function ListaAdmin({ produtos, categorias }: Props) {
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [salvando, iniciarTransicao] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return produtos.filter((p) => {
      const casaCategoria = categoria === 'todas' || p.categoria === categoria
      const casaBusca =
        !termo ||
        p.nome.toLowerCase().includes(termo) ||
        p.codigo.toLowerCase().includes(termo)
      return casaCategoria && casaBusca
    })
  }, [produtos, busca, categoria])

  /** Alterna e recarrega os dados do servidor para a lista refletir a verdade. */
  function alternar(acao: () => Promise<void>) {
    setErro(null)
    iniciarTransicao(async () => {
      try {
        await acao()
        router.refresh()
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível salvar.')
      }
    })
  }

  return (
    <div className={cn(salvando && 'pointer-events-none opacity-60')}>
      {/* Busca e filtro */}
      <div className="mb-5 flex flex-wrap gap-3">
        <label className="relative flex min-w-55 flex-1 items-center">
          <IconeBusca className="pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-tinta-clara" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou código"
            aria-label="Buscar peça"
            className="w-full rounded-xl border border-roxo/15 bg-white py-3 pr-4 pl-10.5 font-corpo text-[15px] text-tinta"
          />
        </label>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Filtrar por categoria"
          className="cursor-pointer rounded-xl border border-roxo/15 bg-white px-3.5 py-3 font-corpo text-[15px] text-roxo"
        >
          <option value="todas">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      {erro && (
        <p role="alert" className="mb-4 rounded-lg bg-[#BA1A1A]/8 p-3 text-[13px] text-[#BA1A1A]">
          {erro}
        </p>
      )}

      <p className="mb-3 text-[13px] text-tinta-suave">
        {filtrados.length} {filtrados.length === 1 ? 'peça' : 'peças'}
        {filtrados.length !== produtos.length && ` de ${produtos.length}`}
      </p>

      {filtrados.length === 0 ? (
        <p className="rounded-2xl border border-roxo/10 bg-white p-10 text-center text-tinta-media">
          Nenhuma peça encontrada.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtrados.map((produto) => (
            <li
              key={produto.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-roxo/10 bg-white p-3 sm:p-4"
            >
              <Link
                href={`/admin/${produto.id}`}
                className="relative block h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-lilas"
              >
                <FotoProduto
                  imagem={produto.fotos[0]?.url ?? ''}
                  alt={produto.nome}
                  sizes="72px"
                />
              </Link>

              <div className="min-w-45 flex-1">
                <Link href={`/admin/${produto.id}`} className="group">
                  <span className="font-rotulo text-[10px] tracking-[0.18em] text-dourado">
                    {produto.codigo}
                  </span>
                  <h2 className="font-serifada text-lg leading-tight text-tinta group-hover:text-roxo">
                    {produto.nome}
                  </h2>
                </Link>
                <p className="mt-0.5 text-[13px] text-tinta-suave">
                  {fmtMoeda(produto.preco)}
                  {produto.fotos.length === 0 && ' · sem foto'}
                </p>
              </div>

              {/* Alternadores de 1 clique: o caso comum é este, não editar tudo. */}
              <div className="flex shrink-0 gap-2">
                <Alternador
                  ligado={!produto.esgotado}
                  rotuloLigado="Em estoque"
                  rotuloDesligado="Esgotado"
                  descricao={`estoque de ${produto.nome}`}
                  aoClicar={() =>
                    alternar(() => alternarEsgotado(produto.id, !produto.esgotado))
                  }
                />
                <Alternador
                  ligado={produto.ativo}
                  rotuloLigado="Visível"
                  rotuloDesligado="Oculta"
                  descricao={`visibilidade de ${produto.nome}`}
                  aoClicar={() => alternar(() => alternarAtivo(produto.id, !produto.ativo))}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Alternador({
  ligado,
  rotuloLigado,
  rotuloDesligado,
  descricao,
  aoClicar,
}: {
  ligado: boolean
  rotuloLigado: string
  rotuloDesligado: string
  descricao: string
  aoClicar: () => void
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-pressed={ligado}
      aria-label={`Alternar ${descricao}. Agora: ${ligado ? rotuloLigado : rotuloDesligado}`}
      className={cn(
        'rounded-full border px-3.5 py-2 font-rotulo text-[10px] tracking-[0.1em] uppercase transition-colors',
        ligado
          ? 'border-zap/35 bg-zap/8 text-zap-escuro hover:bg-zap/15'
          : 'border-tinta-clara/40 bg-tinta-clara/10 text-tinta-suave hover:bg-tinta-clara/20',
      )}
    >
      {ligado ? rotuloLigado : rotuloDesligado}
    </button>
  )
}
