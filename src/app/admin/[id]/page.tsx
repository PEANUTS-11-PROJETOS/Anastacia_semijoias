import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buscarPorId } from '@/lib/admin'
import { listarCategorias } from '@/lib/produtos'
import { FormularioProduto } from '@/components/admin/FormularioProduto'
import { BotaoExcluir } from '@/components/admin/BotaoExcluir'

export const metadata: Metadata = { title: 'Editar peça' }

export default async function PaginaEditarPeca({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ nova?: string }>
}) {
  const { id } = await params
  const { nova } = await searchParams

  const [produto, categorias] = await Promise.all([buscarPorId(id), listarCategorias()])
  if (!produto) notFound()

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
          >
            ← Peças
          </Link>
          <h1 className="mt-2 font-serifada text-3xl text-tinta">{produto.nome}</h1>
          <p className="mt-1 text-[13px] text-tinta-suave">{produto.codigo}</p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/pecas/${produto.slug}`}
            target="_blank"
            className="font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
          >
            Ver na loja
          </Link>
          <BotaoExcluir id={produto.id} nome={produto.nome} />
        </div>
      </div>

      {nova && (
        <p className="mb-5 rounded-xl border border-zap/30 bg-zap/8 p-4 text-[14px] text-zap-escuro">
          Peça cadastrada. Agora adicione as fotos, no bloco lá embaixo.
        </p>
      )}

      <FormularioProduto categorias={categorias} produto={produto} />
    </>
  )
}
