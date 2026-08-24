'use client'

import { usePathname } from 'next/navigation'
import { loja } from '@/config/loja'
import { linkWhatsApp } from '@/lib/whatsapp'
import { IconeWhatsApp } from '@/components/ui/Icones'

/**
 * Botão flutuante de contato direto — para dúvidas, não para o pedido.
 * O pedido sai pela seleção.
 *
 * Fica escondido na vitrine (onde a barra fixa inferior já leva ao WhatsApp e
 * ocuparia o mesmo canto) e na seleção (para não competir com o botão de
 * finalizar, que é a ação principal da página).
 */
export function BotaoWhatsApp() {
  const caminho = usePathname()
  const escondido = caminho.startsWith('/selecao') || caminho.startsWith('/pecas')
  if (escondido) return null

  return (
    <a
      href={linkWhatsApp(loja.mensagemContatoDireto)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tirar dúvida no WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-zap text-white shadow-[0_14px_30px_-10px_rgba(31,168,85,0.6)] transition-colors hover:bg-zap-escuro sm:right-5.5 sm:bottom-5.5 sm:h-14.5 sm:w-14.5"
    >
      <IconeWhatsApp className="h-7 w-7" />
    </a>
  )
}
