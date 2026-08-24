import Link from 'next/link'
import { IconeDiamante } from '@/components/ui/Icones'

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex max-w-140 flex-col items-center gap-5 px-5 py-24 text-center">
      <IconeDiamante className="h-12 w-10 text-dourado" />
      <h1 className="font-serifada text-3xl text-tinta lg:text-4xl">
        Não encontramos esta página
      </h1>
      <p className="text-[15px] leading-relaxed text-tinta-media">
        A peça pode ter saído da coleção ou o link veio incompleto. Veja o que temos
        disponível agora.
      </p>
      <Link
        href="/pecas"
        className="rounded-xl bg-roxo px-8 py-4 font-rotulo text-[13px] tracking-[0.12em] text-white uppercase transition-colors hover:bg-roxo-escuro"
      >
        Ver a coleção
      </Link>
    </div>
  )
}
