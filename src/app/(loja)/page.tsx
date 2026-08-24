import Link from 'next/link'
import { imagens, loja } from '@/config/loja'
import { listarCategorias, listarProdutos, produtosEmDestaque } from '@/lib/produtos'
import { linkWhatsApp } from '@/lib/whatsapp'
import { CardProduto } from '@/components/loja/CardProduto'
import { CarrosselDestaque } from '@/components/loja/CarrosselDestaque'
import { FotoProduto } from '@/components/loja/FotoProduto'
import {
  IconeDiamante,
  IconePremio,
  IconeEscudo,
  IconeVerificado,
  IconeWhatsApp,
} from '@/components/ui/Icones'

const garantias = [
  {
    Icone: IconePremio,
    titulo: 'Banho ouro 18k',
    texto: 'Qualidade antialérgica',
  },
  {
    Icone: IconeEscudo,
    titulo: 'Hipoalergênico',
    texto: 'Seguro para peles sensíveis',
  },
  {
    Icone: IconeWhatsApp,
    titulo: 'Atendimento próximo',
    texto: 'Consultora pelo WhatsApp',
  },
]

/** Recarrega do banco a cada 5 min; o painel força a atualização ao salvar. */
export const revalidate = 300

export default async function PaginaInicial() {
  const [categorias, destaques, todos] = await Promise.all([
    listarCategorias(),
    produtosEmDestaque(),
    listarProdutos(),
  ])
  const novidades = todos.slice(0, 4)

  return (
    <>
      {/* ---------------- Categorias ---------------- */}
      <section className="border-b border-dourado/20 bg-linear-to-b from-white to-[#F6F0FB]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 py-8 lg:gap-7 lg:py-11">
          <div className="flex flex-col items-center gap-2 px-5 sm:px-8 lg:px-16">
            <span className="rotulo flex items-center gap-2.5">
              <span className="h-px w-5.5 bg-linear-to-r from-transparent to-dourado" />
              Escolha por categoria
              <span className="h-px w-5.5 bg-linear-to-r from-dourado to-transparent" />
            </span>
          </div>

          <div className="rolagem-limpa flex gap-7 overflow-x-auto px-5 pt-1.5 pb-2.5 sm:px-8 lg:gap-13 lg:px-16">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/pecas?categoria=${categoria.id}`}
                className="flex shrink-0 flex-col items-center gap-4 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="block size-24 rounded-full bg-linear-to-br from-dourado-claro via-dourado to-roxo p-1 shadow-[0_18px_40px_-16px_rgba(51,36,63,0.55)] sm:size-28 lg:size-34.5">
                  <span className="relative block size-full overflow-hidden rounded-full border-[3px] border-white">
                    <FotoProduto
                      imagem={categoria.imagem}
                      alt={categoria.nome}
                      sizes="138px"
                    />
                  </span>
                </span>
                <span className="font-rotulo text-xs font-semibold tracking-[0.18em] whitespace-nowrap text-tinta uppercase sm:text-sm">
                  {categoria.nome}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-16 lg:py-21">
        <div className="flex flex-wrap items-center gap-8 lg:gap-16">
          <div className="flex flex-1 basis-95 flex-col gap-5">
            <span className="rotulo">Nova coleção</span>

            <h1 className="font-serifada text-4xl leading-[1.06] text-tinta sm:text-5xl lg:text-6xl">
              A essência da
              <br />
              <span className="text-roxo italic">elegância</span>
            </h1>

            <p className="font-serifada text-lg text-roxo-medio italic lg:text-xl">
              {loja.slogan}
            </p>

            <p className="max-w-110 text-base leading-relaxed text-tinta-media">
              Peças banhadas a ouro 18k e ródio branco, feitas para acompanhar você em
              cada detalhe do dia, do escritório ao brinde de fim de noite.
            </p>

            <div className="mt-1.5 flex flex-wrap gap-3.5">
              <Link
                href="/pecas"
                className="rounded-lg bg-roxo px-7 py-4 font-rotulo text-[13px] tracking-[0.12em] text-white uppercase transition-colors hover:bg-roxo-escuro"
              >
                Explorar coleção
              </Link>
              <Link
                href="/qualidade"
                className="rounded-lg border border-roxo/30 px-7 py-4 font-rotulo text-[13px] tracking-[0.12em] text-roxo uppercase transition-colors hover:border-roxo hover:bg-roxo/5"
              >
                Nossa qualidade
              </Link>
            </div>
          </div>

          <div className="relative flex-1 basis-95">
            <div className="relative h-90 overflow-hidden rounded-3xl border border-dourado/35 shadow-[0_24px_60px_-30px_rgba(51,36,63,0.45)] sm:h-112 lg:h-140">
              <FotoProduto
                imagem={imagens.capaHome}
                alt="Modelo usando anéis Anastácia Semijoias"
                sizes="(max-width: 1024px) 100vw, 560px"
                prioridade
              />
            </div>

            <div className="absolute bottom-6 -left-1.5 flex items-center gap-3 rounded-xl border border-dourado/35 bg-white/95 px-4.5 py-3.5 shadow-[0_12px_30px_-14px_rgba(51,36,63,0.35)] backdrop-blur-sm">
              <IconeVerificado className="h-6 w-6 text-dourado" />
              <span className="flex flex-col leading-tight">
                <span className="font-rotulo text-[10px] tracking-[0.2em] text-dourado uppercase">
                  Padrão premium
                </span>
                <span className="font-serifada text-[15px] text-tinta">
                  Ouro 18k · Ródio branco
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Garantias ---------------- */}
      <section className="border-y border-roxo/8 bg-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-6 px-5 py-7 sm:px-8 lg:px-16 lg:py-10">
          {garantias.map(({ Icone, titulo, texto }) => (
            <div key={titulo} className="flex flex-1 basis-60 items-center gap-4">
              <Icone className="h-8 w-8 shrink-0 text-dourado" />
              <span className="flex flex-col">
                <span className="font-rotulo text-xs font-semibold tracking-[0.14em] text-tinta uppercase">
                  {titulo}
                </span>
                <span className="text-[13px] text-tinta-suave">{texto}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Peças do mês ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:px-16 lg:py-22">
        <CarrosselDestaque produtos={destaques} />
      </section>

      {/* ---------------- Novidades ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8 lg:px-16 lg:pb-22">
        <div className="mb-7 text-center lg:mb-10">
          <span className="rotulo">Seleção da casa</span>
          <h2 className="mt-2.5 font-serifada text-3xl text-tinta lg:text-4xl">
            Peças que saem sorrindo
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-7">
          {novidades.map((produto) => (
            <CardProduto key={produto.codigo} produto={produto} />
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/pecas"
            className="inline-block rounded-lg border border-roxo/30 px-8 py-4 font-rotulo text-[13px] tracking-[0.12em] text-roxo uppercase transition-colors hover:border-roxo hover:bg-roxo/5"
          >
            Ver a coleção completa
          </Link>
        </div>
      </section>

      {/* ---------------- Chamada WhatsApp ---------------- */}
      <section className="bg-roxo-escuro">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-7 px-5 py-11 sm:px-8 lg:px-16 lg:py-18">
          <div className="flex-1 basis-90">
            <h2 className="mb-3 font-serifada text-2xl text-white lg:text-4xl">
              Atendimento próximo, como joia pede
            </h2>
            <p className="max-w-115 text-[15px] leading-relaxed text-[#CDBEDD]">
              Monte sua seleção e finalize com {loja.consultora} pelo WhatsApp. Sem
              pressa, com todo o cuidado.
            </p>
          </div>

          <a
            href={linkWhatsApp(loja.mensagemContatoDireto)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-zap px-8 py-4.5 font-rotulo text-sm tracking-[0.1em] text-white uppercase transition-colors hover:bg-zap-escuro"
          >
            <IconeWhatsApp className="h-5.5 w-5.5" />
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* ---------------- Assinatura ---------------- */}
      <section className="border-t border-roxo/8 bg-white">
        <div className="mx-auto max-w-180 px-5 py-12 text-center sm:px-8 lg:py-20">
          <IconeDiamante className="mx-auto h-12 w-10 text-dourado" />
          <h2 className="mt-4 mb-4 font-serifada text-3xl text-tinta lg:text-4xl">
            Compromisso com a qualidade
          </h2>
          <p className="text-base leading-relaxed text-tinta-media">
            Cada peça é escolhida com cuidado e passa por conferência antes de chegar até
            você. Qualquer dúvida sobre banho, medidas ou cuidados, é só chamar.
          </p>
        </div>
      </section>
    </>
  )
}
