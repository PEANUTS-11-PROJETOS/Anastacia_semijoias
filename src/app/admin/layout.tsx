import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { loja } from '@/config/loja'
import { sair } from '@/app/admin/acoes'

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s · Painel' },
  robots: { index: false, follow: false },
}

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-lilas-claro">
      <header className="sticky top-0 z-40 border-b border-roxo/10 bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/marca/logo-anastacia.png"
              alt={loja.nome}
              width={216}
              height={108}
              className="h-9 w-auto"
            />
            <span className="font-rotulo text-[10px] tracking-[0.2em] text-dourado uppercase max-sm:hidden">
              Painel
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
            >
              Ver a loja
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

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-5 py-6 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  )
}
