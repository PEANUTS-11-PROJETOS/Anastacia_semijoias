import Image from 'next/image'
import Link from 'next/link'
import { loja } from '@/config/loja'
import { linkWhatsApp } from '@/lib/whatsapp'

export function Rodape() {
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-roxo-escuro">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-5 px-5 py-11 text-center sm:px-8 lg:px-16 lg:py-16">
        <Image
          src="/marca/logo-anastacia-claro.png"
          alt={loja.nome}
          width={240}
          height={120}
          className="h-16 w-auto lg:h-[70px]"
        />

        <p className="font-serifada text-base text-[#CDBEDD] italic">{loja.slogan}</p>

        <nav className="mt-1 flex flex-wrap justify-center gap-6" aria-label="Rodapé">
          <Link href="/qualidade" className="text-sm text-[#CDBEDD] transition-colors hover:text-dourado-claro">
            Nossa qualidade
          </Link>
          <Link href="/pecas" className="text-sm text-[#CDBEDD] transition-colors hover:text-dourado-claro">
            Coleção
          </Link>
          <a
            href={linkWhatsApp(loja.mensagemContatoDireto)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#CDBEDD] transition-colors hover:text-dourado-claro"
          >
            WhatsApp
          </a>
        </nav>

        <p className="mt-2 text-xs text-[#8B7C9C]">
          © {ano} {loja.nome}. Elegância em cada detalhe.
        </p>
      </div>
    </footer>
  )
}
