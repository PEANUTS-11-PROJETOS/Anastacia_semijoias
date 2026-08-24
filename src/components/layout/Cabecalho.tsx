'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCarrinho } from '@/stores/carrinho'
import { useMontado } from '@/hooks/useMontado'
import { totalPecas } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import { IconeSacola } from '@/components/ui/Icones'

const links = [
  { href: '/', rotulo: 'Início' },
  { href: '/pecas', rotulo: 'Peças' },
  { href: '/qualidade', rotulo: 'Qualidade' },
] as const

export function Cabecalho() {
  const caminho = usePathname()
  const montado = useMontado()
  const itens = useCarrinho((estado) => estado.itens)
  const abrirPainel = useCarrinho((estado) => estado.abrirPainel)

  const quantidade = montado ? totalPecas(itens) : 0

  return (
    <header className="sticky top-0 z-40 border-b border-roxo/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-2.5 px-5 py-2.5 sm:px-8 md:py-4 lg:px-16">
        <Link href="/" className="flex items-center" aria-label="Anastácia Semijoias, ir para o início">
          <Image
            src="/marca/logo-anastacia.png"
            alt="Anastácia Semijoias"
            width={216}
            height={108}
            priority
            className="h-11 w-auto sm:h-12 md:h-16"
          />
        </Link>

        <nav
          className="order-3 flex w-full justify-center gap-5 border-t border-roxo/8 pt-1 sm:gap-7 md:order-none md:w-auto md:border-0 md:pt-0 lg:gap-10"
          aria-label="Navegação principal"
        >
          {links.map((link) => {
            const ativo =
              link.href === '/' ? caminho === '/' : caminho.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={ativo ? 'page' : undefined}
                className="flex flex-col items-center gap-1.5 py-1 font-rotulo text-[11px] font-semibold tracking-[0.16em] text-roxo-escuro uppercase transition-colors hover:text-roxo sm:text-xs"
              >
                {link.rotulo}
                <span
                  className={cn(
                    'block h-0.5 w-full rounded-full transition-colors',
                    ativo ? 'bg-dourado' : 'bg-transparent',
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={abrirPainel}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-roxo transition-colors hover:bg-roxo/8"
          aria-label={
            quantidade > 0
              ? `Minha seleção, ${quantidade} ${quantidade === 1 ? 'peça' : 'peças'}`
              : 'Minha seleção, vazia'
          }
        >
          <IconeSacola className="h-[22px] w-[22px]" />
          {quantidade > 0 && (
            <span className="absolute top-0.5 right-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-dourado px-1 font-rotulo text-[10px] font-bold text-white">
              {quantidade}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
