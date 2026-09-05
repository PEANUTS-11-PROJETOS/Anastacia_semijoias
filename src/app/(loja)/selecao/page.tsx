import type { Metadata } from 'next'
import { obterConfigFrete } from '@/lib/frete'
import { Selecao } from '@/components/loja/Selecao'

export const metadata: Metadata = {
  title: 'Minha seleção',
  description:
    'Revise as peças escolhidas e envie seu pedido pronto para o WhatsApp da consultora.',
}

export const revalidate = 0

export default async function PaginaSelecao() {
  const configFrete = await obterConfigFrete()
  return <Selecao configFrete={configFrete} />
}

