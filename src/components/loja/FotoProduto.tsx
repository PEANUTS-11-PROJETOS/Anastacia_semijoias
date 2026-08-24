import Image from 'next/image'
import { IconeDiamante } from '@/components/ui/Icones'
import { cn } from '@/lib/utils'

interface Props {
  /** Caminho dentro de /public. Vazio mostra o selo da marca. */
  imagem: string
  alt: string
  className?: string
  /** Dica de largura para o Next escolher o tamanho certo da imagem. */
  sizes?: string
  /** true só na primeira imagem visível da página (melhora o carregamento). */
  prioridade?: boolean
}

/**
 * Foto da peça. Enquanto a foto real não existe, mostra um selo da marca
 * no lugar — assim o catálogo pode ir ao ar antes de todas as fotos ficarem prontas.
 */
export function FotoProduto({
  imagem,
  alt,
  className,
  sizes = '(max-width: 768px) 50vw, 300px',
  prioridade = false,
}: Props) {
  if (!imagem) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-lilas to-lilas-claro',
          className,
        )}
        role="img"
        aria-label={`${alt} — foto em breve`}
      >
        <IconeDiamante className="h-10 w-9 text-dourado opacity-70" />
        <span className="font-rotulo text-[9px] tracking-[0.24em] text-dourado/70 uppercase">
          Foto em breve
        </span>
      </div>
    )
  }

  return (
    <Image
      src={imagem}
      alt={alt}
      fill
      sizes={sizes}
      priority={prioridade}
      className={cn('object-cover', className)}
    />
  )
}
