'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { salvarProduto } from '@/app/admin/acoes'
import { esquemaProduto, type EntradaProduto, type SaidaProduto } from '@/lib/esquemas'
import { banhos as rotulosBanho } from '@/config/loja'
import { cn, slugify } from '@/lib/utils'
import type { BanhoId, Categoria, Produto } from '@/types'
import { UploadFotos } from '@/components/admin/UploadFotos'

interface Props {
  categorias: Categoria[]
  /** Ausente = cadastro novo. */
  produto?: Produto
  /** Código sugerido para peça nova. */
  codigoSugerido?: string
}

export function FormularioProduto({ categorias, produto, codigoSugerido }: Props) {
  const router = useRouter()
  const editando = Boolean(produto)

  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const [slugTocado, setSlugTocado] = useState(editando)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  // Três parâmetros de propósito: o que o formulário guarda (EntradaProduto) é
  // diferente do que sai validado (SaidaProduto), porque o esquema tem valores
  // padrão e transformações. Com um só, o TypeScript reclama do resolver.
  } = useForm<EntradaProduto, unknown, SaidaProduto>({
    resolver: zodResolver(esquemaProduto),
    defaultValues: produto
      ? {
          codigo: produto.codigo,
          slug: produto.slug,
          nome: produto.nome,
          categoria_id: produto.categoria,
          preco: produto.preco,
          preco_de: produto.precoDe ?? null,
          descricao: produto.descricao,
          banhos: produto.banhos,
          ajustavel: produto.ajustavel ?? false,
          medidas: produto.medidas ?? '',
          pedra: produto.pedra ?? '',
          selo: produto.selo ?? '',
          destaque: produto.destaque ?? false,
          esgotado: produto.esgotado,
          ativo: produto.ativo,
        }
      : {
          codigo: codigoSugerido ?? '',
          slug: '',
          nome: '',
          categoria_id: categorias[0]?.id ?? '',
          preco: undefined,
          preco_de: null,
          descricao: '',
          banhos: ['ouro18k'],
          ajustavel: false,
          medidas: '',
          pedra: '',
          selo: '',
          destaque: false,
          esgotado: false,
          ativo: true,
        },
  })

  // useWatch em vez de watch(): o watch() devolve uma função nova a cada
  // render, que o React Compiler não consegue memoizar com segurança.
  const banhosEscolhidos = useWatch({ control, name: 'banhos' }) ?? []
  const categoriaAtual = useWatch({ control, name: 'categoria_id' })

  /** Enquanto ninguém mexeu no endereço, ele acompanha o nome. */
  function aoDigitarNome(evento: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTocado) setValue('slug', slugify(evento.target.value))
  }

  function alternarBanho(banho: BanhoId) {
    const atual = banhosEscolhidos as BanhoId[]
    const novo = atual.includes(banho)
      ? atual.filter((b) => b !== banho)
      : [...atual, banho]
    setValue('banhos', novo, { shouldValidate: true })
  }

  async function aoSalvar(dados: SaidaProduto) {
    setErroGeral(null)
    const resultado = await salvarProduto(dados, produto?.id)

    if (!resultado.ok) {
      setErroGeral(resultado.erro)
      return
    }

    if (editando) {
      router.refresh()
    } else {
      // Peça nova vai para a edição, onde as fotos podem ser enviadas.
      router.push(`/admin/${resultado.id}?nova=1`)
    }
  }

  const aneis = categoriaAtual === 'aneis'

  return (
    <form onSubmit={handleSubmit(aoSalvar)} className="flex flex-col gap-6">
      <Bloco titulo="Identificação">
        <Campo rotulo="Nome da peça" erro={errors.nome?.message}>
          <input
            {...register('nome', { onChange: aoDigitarNome })}
            className={entrada}
            placeholder="Ex.: Brinco Argola Cravejada"
          />
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Categoria" erro={errors.categoria_id?.message}>
            <select {...register('categoria_id')} className={entrada}>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo
            rotulo="Código"
            erro={errors.codigo?.message}
            dica="Aparece no pedido do WhatsApp."
          >
            <input {...register('codigo')} className={entrada} />
          </Campo>
        </div>

        <Campo
          rotulo="Endereço no site"
          erro={errors.slug?.message}
          dica="Vira o link da peça. Preenche sozinho pelo nome."
        >
          <input
            {...register('slug', { onChange: () => setSlugTocado(true) })}
            className={entrada}
          />
        </Campo>
      </Bloco>

      <Bloco titulo="Preço">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Preço (R$)" erro={errors.preco?.message}>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              {...register('preco', { valueAsNumber: true })}
              className={entrada}
              placeholder="149.90"
            />
          </Campo>

          <Campo
            rotulo='Preço "de" (opcional)'
            erro={errors.preco_de?.message}
            dica="Aparece riscado ao lado. Deixe vazio se não houver promoção."
          >
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              {...register('preco_de', {
                setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
              })}
              className={entrada}
            />
          </Campo>
        </div>
      </Bloco>

      <Bloco titulo="Detalhes da peça">
        <Campo rotulo="Descrição" erro={errors.descricao?.message}>
          <textarea
            {...register('descricao')}
            rows={4}
            className={cn(entrada, 'resize-y')}
            placeholder="O que a cliente precisa saber sobre esta peça."
          />
        </Campo>

        <Campo
          rotulo="Banho"
          erro={errors.banhos?.message}
          dica="Marque os dois para a cliente poder escolher."
        >
          <div className="flex flex-wrap gap-2.5">
            {(Object.keys(rotulosBanho) as BanhoId[]).map((banho) => {
              const marcado = (banhosEscolhidos as BanhoId[]).includes(banho)
              return (
                <button
                  key={banho}
                  type="button"
                  onClick={() => alternarBanho(banho)}
                  aria-pressed={marcado}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition-colors',
                    marcado
                      ? 'border-roxo bg-roxo/8 font-semibold text-roxo'
                      : 'border-roxo/20 bg-white text-tinta-media hover:border-roxo/45',
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ background: rotulosBanho[banho].cor }}
                  />
                  {rotulosBanho[banho].nome}
                </button>
              )
            })}
          </div>
        </Campo>

        {aneis && (
          <Marcador
            {...register('ajustavel')}
            rotulo="Aro ajustável"
            dica="Abre e fecha para servir em qualquer dedo."
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            rotulo="Medidas (opcional)"
            erro={errors.medidas?.message}
            dica="Ex.: 45 cm + 5 cm de extensor"
          >
            <input {...register('medidas')} className={entrada} />
          </Campo>

          <Campo
            rotulo="Pedra / cravação (opcional)"
            erro={errors.pedra?.message}
            dica="Ex.: Zircônia branca, lapidação princesa"
          >
            <input {...register('pedra')} className={entrada} />
          </Campo>
        </div>
      </Bloco>

      <Bloco titulo="Como aparece na loja">
        <Campo
          rotulo="Etiqueta (opcional)"
          erro={errors.selo?.message}
          dica="Ex.: Novo, Últimas peças. Aparece sobre a foto."
        >
          <input {...register('selo')} className={entrada} />
        </Campo>

        <div className="flex flex-col gap-3">
          <Marcador
            {...register('destaque')}
            rotulo="Peça do mês"
            dica="Entra no carrossel da página inicial."
          />
          <Marcador
            {...register('esgotado')}
            rotulo="Esgotada"
            dica="Continua na vitrine, mas não pode ser adicionada à seleção."
          />
          <Marcador
            {...register('ativo')}
            rotulo="Visível no site"
            dica="Desmarque para esconder sem apagar o cadastro."
          />
        </div>
      </Bloco>

      {editando && produto && (
        <Bloco titulo="Fotos">
          <UploadFotos produtoId={produto.id} fotos={produto.fotos} />
        </Bloco>
      )}

      {erroGeral && (
        <p role="alert" className="rounded-lg bg-[#BA1A1A]/8 p-3.5 text-[14px] text-[#BA1A1A]">
          {erroGeral}
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-roxo/10 bg-lilas-claro/95 px-5 py-4 backdrop-blur-sm sm:-mx-8 sm:px-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-roxo px-6 py-4 font-rotulo text-[13px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo-escuro disabled:opacity-60 sm:flex-none sm:px-10"
        >
          {isSubmitting ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar peça'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="rounded-xl border border-roxo/25 px-6 py-4 font-rotulo text-[13px] tracking-[0.1em] text-roxo uppercase transition-colors hover:bg-roxo/6"
        >
          Voltar
        </button>
      </div>

      {!editando && (
        <p className="-mt-2 text-[13px] text-tinta-suave">
          As fotos são adicionadas logo depois de cadastrar — a peça precisa existir
          antes para as imagens ficarem ligadas a ela.
        </p>
      )}
    </form>
  )
}

/* ---------------------------------------------------------------- auxiliares */

const entrada =
  'w-full rounded-lg border border-roxo/18 bg-lilas-claro px-3.5 py-3 font-corpo text-[15px] text-tinta'

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-roxo/10 bg-white p-5 sm:p-6">
      <h2 className="font-rotulo text-[11px] tracking-[0.18em] text-dourado uppercase">
        {titulo}
      </h2>
      {children}
    </section>
  )
}

function Campo({
  rotulo,
  dica,
  erro,
  children,
}: {
  rotulo: string
  dica?: string
  erro?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-rotulo text-[11px] tracking-[0.12em] text-tinta-suave uppercase">
        {rotulo}
      </span>
      {children}
      {dica && !erro && <span className="text-[12px] text-tinta-clara">{dica}</span>}
      {erro && (
        <span role="alert" className="text-[12px] text-[#BA1A1A]">
          {erro}
        </span>
      )}
    </label>
  )
}

/** Checkbox com rótulo e explicação, encaminhando o ref do react-hook-form. */
function Marcador({
  rotulo,
  dica,
  ref,
  ...resto
}: React.ComponentProps<'input'> & { rotulo: string; dica?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        ref={ref}
        {...resto}
        className="mt-0.5 h-4.5 w-4.5 shrink-0 accent-roxo"
      />
      <span>
        <span className="block text-[15px] text-tinta">{rotulo}</span>
        {dica && <span className="block text-[12px] text-tinta-clara">{dica}</span>}
      </span>
    </label>
  )
}
