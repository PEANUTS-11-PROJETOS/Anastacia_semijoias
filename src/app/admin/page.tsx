import Link from 'next/link'
import { listarTudo } from '@/lib/admin'
import { listarCategorias } from '@/lib/produtos'
import { ListaAdmin } from '@/components/admin/ListaAdmin'
import { IconeMais } from '@/components/ui/Icones'

export default async function PaginaAdmin() {
  const [produtos, categorias] = await Promise.all([listarTudo(), listarCategorias()])

  const ocultas = produtos.filter((p) => !p.ativo).length
  const esgotadas = produtos.filter((p) => p.esgotado).length
  const semFoto = produtos.filter((p) => p.fotos.length === 0).length

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serifada text-3xl text-tinta">Peças</h1>
          <p className="mt-1 text-[14px] text-tinta-media">
            {produtos.length} cadastradas
            {ocultas > 0 && ` · ${ocultas} ocultas`}
            {esgotadas > 0 && ` · ${esgotadas} esgotadas`}
            {semFoto > 0 && ` · ${semFoto} sem foto`}
          </p>
        </div>

        <Link
          href="/admin/nova"
          className="flex items-center gap-2 rounded-xl bg-roxo px-5 py-3.5 font-rotulo text-[12px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo-escuro"
        >
          <IconeMais className="h-4.5 w-4.5" />
          Nova peça
        </Link>
      </div>

      <ListaAdmin produtos={produtos} categorias={categorias} />
    </>
  )
}
