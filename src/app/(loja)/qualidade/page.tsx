import type { Metadata } from 'next'
import Link from 'next/link'
import { loja } from '@/config/loja'
import { linkWhatsApp } from '@/lib/whatsapp'
import {
  IconeBrilho,
  IconeCaixa,
  IconeDiamante,
  IconeEscudo,
  IconeGota,
} from '@/components/ui/Icones'

export const metadata: Metadata = {
  title: 'Nossa qualidade',
  description:
    'Banho de ouro 18k de até 10 milésimos, tecnologia free-níquel e cuidados essenciais para suas semijoias durarem.',
}

const cuidados = [
  {
    Icone: IconeGota,
    titulo: 'Evite produtos químicos',
    texto:
      'Retire suas joias antes do banho, piscina, mar, perfumes e cosméticos.',
  },
  {
    Icone: IconeBrilho,
    titulo: 'Limpeza suave',
    texto: 'Use a flanela mágica ou água corrente com sabão neutro.',
  },
  {
    Icone: IconeCaixa,
    titulo: 'Armazenamento adequado',
    texto:
      'Guarde as peças individualmente em local seco para evitar atrito e oxidação.',
  },
]

export default function PaginaQualidade() {
  return (
    <>
      {/* Abertura */}
      <section className="relative flex min-h-90 items-center justify-center overflow-hidden bg-linear-to-b from-lilas to-lilas-claro lg:min-h-125">
        <div className="relative z-10 flex flex-col items-center px-5 text-center sm:px-8 lg:px-16">
          <IconeDiamante className="mb-5 h-12 w-10 text-dourado" />
          <h1 className="mb-4 max-w-155 font-serifada text-3xl leading-tight text-tinta lg:text-5xl">
            Excelência em cada detalhe
          </h1>
          <p className="max-w-130 text-base leading-relaxed text-tinta-media">
            Peças de durabilidade impecável e beleza atemporal, unindo tecnologia de banho
            de ponta a um design sofisticado.
          </p>
        </div>
      </section>

      {/* Cartões */}
      <section className="mx-auto max-w-[1240px] px-5 py-11 sm:px-8 lg:px-16 lg:py-20">
        <div className="flex flex-wrap gap-4.5 lg:gap-6">
          <div className="relative flex-2 basis-95 overflow-hidden rounded-3xl border border-roxo/12 bg-white p-7 lg:p-12">
            <div className="absolute -top-15 -right-15 h-50 w-50 rounded-full bg-dourado/10 blur-3xl" />
            <IconeDiamante className="h-10 w-9 text-dourado" />
            <h2 className="mt-4 mb-3 font-serifada text-2xl text-tinta lg:text-3xl">
              Banho de ouro 18k
            </h2>
            <p className="mb-4.5 max-w-115 text-[15px] leading-relaxed text-tinta-media">
              Camada generosa de até 10 milésimos de ouro 18k ou ródio branco, garantindo
              brilho superior e resistência incomparável ao uso diário.
            </p>
            <span className="inline-block rounded-full bg-roxo/10 px-4 py-2 font-rotulo text-[11px] tracking-[0.16em] text-roxo uppercase">
              Padrão premium
            </span>
          </div>

          <div className="flex flex-1 basis-65 flex-col justify-center rounded-3xl border border-roxo/14 bg-lilas p-6 lg:p-9">
            <IconeEscudo className="h-9 w-9 text-roxo" />
            <h2 className="mt-3.5 mb-2.5 font-serifada text-2xl text-tinta">
              Hipoalergênico
            </h2>
            <p className="text-sm leading-relaxed text-tinta-media">
              Tecnologia free-níquel: base segura e confortável para peles sensíveis, sem
              metais pesados no processo.
            </p>
          </div>
        </div>

        {/* Cuidados */}
        <div className="mt-4.5 rounded-3xl border border-roxo/12 bg-white p-7 lg:mt-6 lg:p-11">
          <h2 className="mb-6 font-serifada text-2xl text-tinta lg:text-3xl">
            Cuidados essenciais
          </h2>
          <div className="grid gap-5 lg:grid-cols-3 lg:gap-8">
            {cuidados.map(({ Icone, titulo, texto }) => (
              <div key={titulo} className="flex gap-4">
                <Icone className="mt-0.5 h-6 w-6 shrink-0 text-dourado" />
                <span>
                  <span className="block font-rotulo text-[13px] font-bold tracking-[0.06em] text-tinta uppercase">
                    {titulo}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-tinta-media">
                    {texto}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fechamento */}
      <section className="border-t border-roxo/8 bg-white">
        <div className="mx-auto max-w-180 px-5 py-12 text-center sm:px-8 lg:py-20">
          <IconeDiamante className="mx-auto h-12 w-10 text-dourado" />
          <h2 className="mt-4 mb-4 font-serifada text-3xl text-tinta lg:text-5xl">
            Compromisso com a qualidade
          </h2>
          <p className="mb-7 text-base leading-relaxed text-tinta-media">
            Cada peça é escolhida com cuidado e passa por conferência antes de chegar até
            você. Qualquer dúvida sobre banho, medidas ou cuidados, é só falar com{' '}
            {loja.consultora}.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link
              href="/pecas"
              className="rounded-lg bg-roxo px-7 py-4 font-rotulo text-[13px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo-escuro"
            >
              Ver as peças
            </Link>
            <a
              href={linkWhatsApp(loja.mensagemContatoDireto)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-roxo/30 px-7 py-4 font-rotulo text-[13px] tracking-[0.1em] text-roxo uppercase transition-colors hover:bg-roxo/5"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
