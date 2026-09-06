import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { loja } from '@/config/loja'
import { sair } from '@/app/admin/acoes'
import { NavPainel } from '@/components/admin/NavPainel'

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s · Painel' },
  robots: { index: false, follow: false },
}

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-lilas-claro">
      <header className="sticky top-0 z-40 border-b border-roxo/10 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-2.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Image
                src="/marca/logo-anastacia.png"
                alt={loja.nome}
                width={216}
                height={108}
                priority
                className="h-8 w-auto sm:h-9"
              />
              <span className="font-rotulo text-[10px] tracking-[0.2em] text-dourado uppercase">
                Painel
              </span>
            </Link>

            {/* Ações no mobile alinhadas à direita da logo */}
            <div className="flex items-center gap-2 sm:hidden">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-1 rounded-lg border border-roxo/15 bg-roxo/5 px-2.5 py-1 font-rotulo text-[10px] font-semibold tracking-[0.1em] text-roxo uppercase transition-colors hover:border-dourado hover:text-dourado"
              >
                Ver loja ↗
              </Link>
              <form action={sair}>
                <button
                  type="submit"
                  className="rounded-lg px-2 py-1 font-rotulo text-[10px] tracking-[0.1em] text-tinta-suave uppercase transition-colors hover:text-[#BA1A1A]"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center justify-center overflow-x-auto">
            <NavPainel />
          </div>

          {/* Ações no desktop */}
          <div className="hidden items-center gap-4 sm:flex">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
            >
              Ver a loja ↗
            </Link>
            <form action={sair}>
              <button
                type="submit"
                className="font-rotulo text-[11px] tracking-[0.1em] text-tinta-suave uppercase transition-colors hover:text-[#BA1A1A]"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-5 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  )
}
