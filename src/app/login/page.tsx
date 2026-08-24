import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { loja } from '@/config/loja'
import { FormularioLogin } from '@/components/admin/FormularioLogin'

export const metadata: Metadata = {
  title: 'Entrar',
  // Painel interno não deve aparecer no Google.
  robots: { index: false, follow: false },
}

export default function PaginaLogin() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-lilas to-lilas-claro px-5 py-12">
      <div className="w-full max-w-95">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src="/marca/logo-anastacia.png"
            alt={loja.nome}
            width={216}
            height={108}
            priority
            className="h-14 w-auto"
          />
          <p className="font-rotulo text-[11px] tracking-[0.24em] text-dourado uppercase">
            Painel da loja
          </p>
        </div>

        <div className="rounded-2xl border border-dourado/30 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(51,36,63,0.4)] sm:p-8">
          <Suspense fallback={null}>
            <FormularioLogin />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-[13px] text-tinta-suave">
          <Link href="/" className="transition-colors hover:text-roxo">
            ← Voltar para a loja
          </Link>
        </p>
      </div>
    </div>
  )
}
