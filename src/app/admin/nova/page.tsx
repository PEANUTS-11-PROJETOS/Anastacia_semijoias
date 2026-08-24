import type { Metadata } from 'next'
import Link from 'next/link'
import { listarCategorias } from '@/lib/produtos'
import { sugerirCodigo } from '@/lib/admin'
import { FormularioProduto } from '@/components/admin/FormularioProduto'

export const metadata: Metadata = { title: 'Nova peça' }

export default async function PaginaNovaPeca() {
  const categorias = await listarCategorias()
  const codigoSugerido = await sugerirCodigo(categorias[0]?.id ?? 'aneis')

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin"
          className="font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
        >
          ← Peças
        </Link>
        <h1 className="mt-2 font-serifada text-3xl text-tinta">Nova peça</h1>
      </div>

      <FormularioProduto categorias={categorias} codigoSugerido={codigoSugerido} />
    </>
  )
}
