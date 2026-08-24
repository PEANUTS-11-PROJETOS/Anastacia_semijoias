import { Cabecalho } from '@/components/layout/Cabecalho'
import { Rodape } from '@/components/layout/Rodape'
import { BotaoWhatsApp } from '@/components/layout/BotaoWhatsApp'
import { PainelSelecao } from '@/components/loja/PainelSelecao'

/** Moldura do site público: cabeçalho, rodapé, carrinho e contato. */
export default function LayoutLoja({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cabecalho />
      <main className="flex-1">{children}</main>
      <Rodape />
      <BotaoWhatsApp />
      <PainelSelecao />
    </>
  )
}
