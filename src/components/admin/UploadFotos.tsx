'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { criarClienteNavegador } from '@/lib/supabase/client'
import { registrarFoto, removerFoto, reordenarFotos } from '@/app/admin/acoes'
import { prepararFoto } from '@/lib/imagem'
import { cn } from '@/lib/utils'
import type { FotoProduto } from '@/types'
import { IconeFechar, IconeMais } from '@/components/ui/Icones'

interface Props {
  produtoId: string
  fotos: FotoProduto[]
}

/**
 * Envio das fotos direto do navegador para o Storage.
 *
 * Não passa por Server Action de propósito: elas têm limite de tamanho de corpo,
 * e mandar várias fotos junto estouraria. Aqui o arquivo vai direto ao Storage
 * (autenticado, com o RLS do bucket valendo) e só a URL é registrada no banco.
 */
export function UploadFotos({ produtoId, fotos }: Props) {
  const router = useRouter()
  const entradaRef = useRef<HTMLInputElement>(null)

  const [enviando, setEnviando] = useState(false)
  const [progresso, setProgresso] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  async function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(evento.target.files ?? [])
    if (arquivos.length === 0) return

    setErro(null)
    setEnviando(true)

    const supabase = criarClienteNavegador()
    let ordem = fotos.length

    try {
      for (const [indice, arquivo] of arquivos.entries()) {
        setProgresso(`Enviando ${indice + 1} de ${arquivos.length}…`)

        const preparada = await prepararFoto(arquivo)
        URL.revokeObjectURL(preparada.previa)

        const nome = `${crypto.randomUUID()}.${preparada.extensao}`
        const caminho = `produtos/${produtoId}/${nome}`

        const { error: erroUpload } = await supabase.storage
          .from('fotos')
          .upload(caminho, preparada.arquivo, {
            contentType: preparada.arquivo.type,
            upsert: false,
          })

        if (erroUpload) throw new Error(erroUpload.message)

        const {
          data: { publicUrl },
        } = supabase.storage.from('fotos').getPublicUrl(caminho)

        await registrarFoto(produtoId, publicUrl, ordem)
        ordem += 1
      }

      router.refresh()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível enviar as fotos.')
    } finally {
      setEnviando(false)
      setProgresso('')
      if (entradaRef.current) entradaRef.current.value = ''
    }
  }

  async function definirCapa(fotoId: string) {
    setErro(null)
    const nova = [fotoId, ...fotos.filter((f) => f.id !== fotoId).map((f) => f.id)]
    try {
      await reordenarFotos(nova)
      router.refresh()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível trocar a capa.')
    }
  }

  async function excluir(fotoId: string) {
    setErro(null)
    try {
      await removerFoto(fotoId)
      router.refresh()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível remover a foto.')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => entradaRef.current?.click()}
          disabled={enviando}
          className="flex items-center gap-2 rounded-xl border border-roxo/25 px-5 py-3 font-rotulo text-[12px] tracking-[0.1em] text-roxo uppercase transition-colors hover:bg-roxo/6 disabled:opacity-60"
        >
          <IconeMais className="h-4.5 w-4.5" />
          {fotos.length === 0 ? 'Adicionar fotos' : 'Adicionar mais'}
        </button>

        {enviando && <span className="text-[13px] text-tinta-media">{progresso}</span>}
      </div>

      <input
        ref={entradaRef}
        type="file"
        accept="image/*"
        multiple
        onChange={aoEscolher}
        className="hidden"
      />

      {erro && (
        <p role="alert" className="rounded-lg bg-[#BA1A1A]/8 p-3 text-[13px] text-[#BA1A1A]">
          {erro}
        </p>
      )}

      {fotos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-roxo/25 p-6 text-center text-[14px] text-tinta-suave">
          Sem fotos ainda. Enquanto isso, o site mostra o selo da marca no lugar.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {fotos.map((foto, indice) => (
            <li
              key={foto.id}
              className={cn(
                'relative h-30 w-24 overflow-hidden rounded-xl border-2 bg-lilas',
                indice === 0 ? 'border-dourado' : 'border-roxo/12',
              )}
            >
              <Image
                src={foto.url}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />

              {indice === 0 && (
                <span className="absolute inset-x-0 top-0 bg-dourado/90 py-0.5 text-center font-rotulo text-[8px] tracking-[0.12em] text-white uppercase">
                  Capa
                </span>
              )}

              <button
                type="button"
                onClick={() => excluir(foto.id)}
                aria-label="Remover foto"
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-tinta-suave transition-colors hover:bg-white hover:text-[#BA1A1A]"
              >
                <IconeFechar className="h-3.5 w-3.5" />
              </button>

              {indice !== 0 && (
                <button
                  type="button"
                  onClick={() => definirCapa(foto.id)}
                  className="absolute inset-x-0 bottom-0 bg-tinta/75 py-1 text-center font-rotulo text-[8px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo"
                >
                  Usar de capa
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-[12px] text-tinta-clara">
        A foto de capa é a que aparece na vitrine. As fotos são reduzidas
        automaticamente antes do envio, então pode mandar direto do celular.
      </p>
    </div>
  )
}
