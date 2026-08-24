import type { Metadata } from 'next'
import { Selecao } from '@/components/loja/Selecao'

export const metadata: Metadata = {
  title: 'Minha seleção',
  description:
    'Revise as peças escolhidas e envie seu pedido pronto para o WhatsApp da consultora.',
}

export default function PaginaSelecao() {
  return <Selecao />
}
