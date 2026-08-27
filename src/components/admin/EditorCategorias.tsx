'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { criarClienteNavegador } from '@/lib/supabase/client'
import {
  definirFotoCategoria,
  removerFotoCategoria,
  renomearCategoria,
  reordenarCategorias,
} from '@/app/admin/acoes'
import { prepararFoto } from '@/lib/imagem'
import { cn } from '@/lib/utils'
import type { CategoriaAdmin } from '@/lib/admin'
import { FotoProduto } from '@/components/loja/FotoProduto'
import { IconeSeta } from '@/components/ui/Icones'

interface Props {
  categorias: CategoriaAdmin[]
}

/**
 * Edição dos círculos da home.
 *
 * A foto vai direto do navegador para o Storage, como no cadastro de peças e
 * pelo mesmo motivo: Server Action tem limite de tamanho de corpo. Só a URL
 * volta para o banco, por Server Action.
 */
export function EditorCategorias({ categorias }: Props) {
  const router = useRouter()

  const entradaRef = useRef<HTMLInputElement>(null)
  /** Qual categoria abriu o seletor de arquivo. */
  const alvoRef = useRef<string | null>(null)

  const [ocupado, setOcupado] = useState<string | null>(null)
  const [salvo, setSalvo] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  function avisarSalvo(id: string) {
    setSalvo(id)
    setTimeout(() => setSalvo((atual) => (atual === id ? null : atual)), 2000)
  }

  async function comTratamento(id: string, tarefa: () => Promise<void>, falha: string) {
    setErro(null)
    setOcupado(id)
    try {
      await tarefa()
      router.refresh()
      avisarSalvo(id)
    } catch (e) {
      setErro(e instanceof Error ? e.message : falha)
    } finally {
      setOcupado(null)
    }
  }

  // --- Nome ------------------------------------------------------------------

  function aoSairDoNome(categoria: CategoriaAdmin, valor: string) {
    const limpo = valor.trim()
    // Sem mudança não há o que gravar — evita uma ida ao banco a cada clique fora.
    if (limpo === categoria.nome) return
    void comTratamento(
      categoria.id,
      () => renomearCategoria(categoria.id, limpo),
      'Não foi possível salvar o nome.',
    )
  }

  // --- Foto ------------------------------------------------------------------

  function escolherFoto(id: string) {
    alvoRef.current = id
    entradaRef.current?.click()
  }

  async function aoEscolherArquivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]
    const id = alvoRef.current
    if (entradaRef.current) entradaRef.current.value = ''
    if (!arquivo || !id) return

    await comTratamento(
      id,
      async () => {
        const preparada = await prepararFoto(arquivo)
        URL.revokeObjectURL(preparada.previa)

        const supabase = criarClienteNavegador()
        const caminho = `categorias/${id}/${crypto.randomUUID()}.${preparada.extensao}`

        const { error } = await supabase.storage
          .from('fotos')
          .upload(caminho, preparada.arquivo, {
            contentType: preparada.arquivo.type,
            upsert: false,
          })
        if (error) throw new Error(error.message)

        const {
          data: { publicUrl },
        } = supabase.storage.from('fotos').getPublicUrl(caminho)

        await definirFotoCategoria(id, publicUrl)
      },
      'Não foi possível enviar a foto.',
    )
  }

  function removerFoto(id: string) {
    void comTratamento(
      id,
      () => removerFotoCategoria(id),
      'Não foi possível remover a foto.',
    )
  }

  // --- Ordem -----------------------------------------------------------------

  function mover(indice: number, direcao: -1 | 1) {
    const destino = indice + direcao
    if (destino < 0 || destino >= categorias.length) return

    const nova = [...categorias]
    ;[nova[indice], nova[destino]] = [nova[destino], nova[indice]]

    void comTratamento(
      categorias[indice].id,
      () => reordenarCategorias(nova.map((c) => c.id)),
      'Não foi possível mudar a ordem.',
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {erro && (
        <p
          role="alert"
          className="rounded-lg bg-[#BA1A1A]/8 p-3 text-[13px] text-[#BA1A1A]"
        >
          {erro}
        </p>
      )}

      <input
        ref={entradaRef}
        type="file"
        accept="image/*"
        onChange={aoEscolherArquivo}
        className="hidden"
      />

      <ul className="flex flex-col gap-3">
        {categorias.map((categoria, indice) => {
          const trabalhando = ocupado === categoria.id

          return (
            <li
              key={categoria.id}
              className={cn(
                'flex flex-wrap items-center gap-4 rounded-2xl border border-roxo/12 bg-white p-4 transition-opacity sm:gap-5 sm:p-5',
                trabalhando && 'opacity-60',
              )}
            >
              {/* Prévia com o mesmo corte redondo da home */}
              <span className="block size-18 shrink-0 rounded-full bg-linear-to-br from-dourado-claro via-dourado to-roxo p-0.5">
                <span className="relative block size-full overflow-hidden rounded-full border-2 border-white">
                  <FotoProduto
                    imagem={categoria.imagem}
                    alt={categoria.nome}
                    sizes="72px"
                  />
                </span>
              </span>

              <div className="flex min-w-45 flex-1 flex-col gap-1.5">
                <label className="flex flex-col gap-1.5">
                  <span className="font-rotulo text-[10px] tracking-[0.14em] text-tinta-suave uppercase">
                    Nome na home
                  </span>
                  <input
                    type="text"
                    defaultValue={categoria.nome}
                    disabled={trabalhando}
                    onBlur={(e) => aoSairDoNome(categoria, e.target.value)}
                    className="rounded-lg border border-roxo/18 bg-lilas-claro px-3.5 py-2.5 font-corpo text-[15px] text-tinta"
                  />
                </label>

                <span className="font-corpo text-[11px] text-tinta-clara">
                  Endereço: /pecas?categoria={categoria.id}
                  {salvo === categoria.id && (
                    <span className="ml-2 font-semibold text-zap-escuro">salvo</span>
                  )}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => escolherFoto(categoria.id)}
                  disabled={trabalhando}
                  className="rounded-xl border border-roxo/25 px-4 py-2.5 font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:bg-roxo/6 disabled:opacity-60"
                >
                  {categoria.imagem ? 'Trocar foto' : 'Adicionar foto'}
                </button>

                {categoria.imagem && (
                  <button
                    type="button"
                    onClick={() => removerFoto(categoria.id)}
                    disabled={trabalhando}
                    className="rounded-xl border border-transparent px-3 py-2.5 font-rotulo text-[11px] tracking-[0.1em] text-tinta-suave uppercase transition-colors hover:text-[#BA1A1A] disabled:opacity-60"
                  >
                    Remover
                  </button>
                )}

                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => mover(indice, -1)}
                    disabled={trabalhando || indice === 0}
                    aria-label={`Mover ${categoria.nome} para cima`}
                    className="flex size-9 items-center justify-center rounded-lg border border-roxo/20 text-roxo transition-colors hover:bg-roxo/6 disabled:opacity-30"
                  >
                    <IconeSeta className="h-4 w-4 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(indice, 1)}
                    disabled={trabalhando || indice === categorias.length - 1}
                    aria-label={`Mover ${categoria.nome} para baixo`}
                    className="flex size-9 items-center justify-center rounded-lg border border-roxo/20 text-roxo transition-colors hover:bg-roxo/6 disabled:opacity-30"
                  >
                    <IconeSeta className="h-4 w-4 rotate-90" />
                  </button>
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-[12px] text-tinta-clara">
        A foto é cortada em círculo a partir do centro, então prefira imagens com a
        peça centralizada. Sem foto, o círculo mostra o selo da marca. O nome muda
        só o rótulo na home — o endereço da categoria continua o mesmo, e os links
        já compartilhados seguem funcionando.
      </p>
    </div>
  )
}
