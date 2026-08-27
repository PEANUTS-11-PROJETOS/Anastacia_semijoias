import type { Metadata } from 'next'
import { listarCategoriasAdmin } from '@/lib/admin'
import { EditorCategorias } from '@/components/admin/EditorCategorias'

export const metadata: Metadata = { title: 'Categorias' }

export default async function PaginaCategorias() {
  const categorias = await listarCategoriasAdmin()
  const semFoto = categorias.filter((c) => !c.imagem).length

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serifada text-3xl text-tinta">Categorias</h1>
        <p className="mt-1 text-[14px] text-tinta-media">
          Os círculos que aparecem no topo da home
          {semFoto > 0 && ` · ${semFoto} sem foto`}
        </p>
      </div>

      <EditorCategorias categorias={categorias} />
    </>
  )
}
