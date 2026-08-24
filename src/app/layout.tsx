import type { Metadata, Viewport } from 'next'
import { Libre_Caslon_Text, Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import { loja } from '@/config/loja'
import './globals.css'

/**
 * Layout raiz: só o essencial que vale para o site inteiro (fontes, idioma,
 * metadados). O cabeçalho e o rodapé da loja ficam em (loja)/layout.tsx, porque
 * o painel /admin não deve herdá-los.
 */

const serifada = Libre_Caslon_Text({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--fonte-serifada',
  display: 'swap',
})

const corpo = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--fonte-corpo',
  display: 'swap',
})

const rotulo = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--fonte-rotulo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${loja.nome} — Semijoias banhadas a ouro 18k`,
    template: `%s · ${loja.nome}`,
  },
  description:
    'Semijoias banhadas a ouro 18k e ródio branco, hipoalergênicas. Monte sua seleção e finalize o pedido pelo WhatsApp com atendimento próximo.',
  openGraph: {
    title: `${loja.nome} — Semijoias banhadas a ouro 18k`,
    description: loja.slogan,
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport: Viewport = {
  themeColor: '#6E4B8E',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${serifada.variable} ${corpo.variable} ${rotulo.variable}`}
    >
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  )
}
