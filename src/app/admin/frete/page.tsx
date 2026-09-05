import type { Metadata } from 'next'
import { obterConfigFrete } from '@/lib/frete'
import { FormularioFrete } from '@/components/admin/FormularioFrete'

export const metadata: Metadata = {
  title: 'Configurações de Frete',
}

export default async function PaginaAdminFrete() {
  const config = await obterConfigFrete()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serifada text-3xl text-tinta">Frete</h1>
        <p className="mt-1 text-[14px] text-tinta-media">
          Gerencie as taxas de entrega para clientes de São Paulo e outros estados.
        </p>
      </div>

      <FormularioFrete configInicial={config} />
    </div>
  )
}
