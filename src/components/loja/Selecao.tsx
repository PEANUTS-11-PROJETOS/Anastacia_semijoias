'use client'

import { useState } from 'react'
import Link from 'next/link'
import { fretePadrao, loja } from '@/config/loja'
import { useCarrinho } from '@/stores/carrinho'
import { useMontado } from '@/hooks/useMontado'
import {
  descricaoVariacao,
  linkPedido,
  montarMensagemPedido,
  totalPecas,
  totalPedido,
} from '@/lib/whatsapp'
import { fmtMoeda } from '@/lib/utils'
import { consultarCep } from '@/lib/frete'
import type { ConfigFrete, DadosPedido } from '@/types'
import { FotoProduto } from '@/components/loja/FotoProduto'
import { ControleQuantidade } from '@/components/loja/ControleQuantidade'
import {
  IconeMais,
  IconeSacola,
  IconeFechar,
  IconeWhatsApp,
  IconeCaminhao,
  IconeLocalizacao,
  IconeVerificado,
} from '@/components/ui/Icones'

const NUMERO_EXEMPLO = '5500000000000'

const etapas = [
  { numero: 1, rotulo: 'Escolha' },
  { numero: 2, rotulo: 'Revise' },
  { numero: 3, rotulo: 'WhatsApp' },
]

interface Props {
  configFrete?: ConfigFrete
}

export function Selecao({ configFrete = fretePadrao }: Props) {
  const montado = useMontado()
  const { itens, remover, alterarQuantidade, limpar } = useCarrinho()

  const [nome, setNome] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [verPrevia, setVerPrevia] = useState(false)

  // Endereço e Frete
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erroCep, setErroCep] = useState<string | null>(null)
  const [freteCalculado, setFreteCalculado] = useState<{
    valor: number
    tipo: 'sp' | 'fora_sp'
    regiao: string
  } | null>(null)

  function formatarCep(valor: string): string {
    const digitos = valor.replace(/\D/g, '').slice(0, 8)
    if (digitos.length <= 5) return digitos
    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`
  }

  async function executarBuscaCep(cepParaBuscar: string) {
    const digitos = cepParaBuscar.replace(/\D/g, '')
    if (digitos.length !== 8) {
      setErroCep('Digite o CEP completo com 8 números.')
      return
    }

    setBuscandoCep(true)
    setErroCep(null)

    const resultado = await consultarCep(digitos)
    setBuscandoCep(false)

    if (!resultado.ok) {
      setErroCep(resultado.erro)
      setFreteCalculado(null)
      return
    }

    setLogradouro(resultado.logradouro)
    setBairro(resultado.bairro)
    setCidade(resultado.cidade)
    setEstado(resultado.estado)

    const ehSp = resultado.ehSp
    const valor = ehSp ? configFrete.sp : configFrete.foraSp
    const tipo = ehSp ? 'sp' : 'fora_sp'
    const regiao = ehSp ? 'São Paulo (SP)' : `${resultado.cidade} - ${resultado.estado} (Fora de SP)`

    setFreteCalculado({ valor, tipo, regiao })
  }

  function aoDigitarCep(e: React.ChangeEvent<HTMLInputElement>) {
    const formatado = formatarCep(e.target.value)
    setCep(formatado)

    const digitos = formatado.replace(/\D/g, '')
    if (digitos.length === 8) {
      executarBuscaCep(digitos)
    } else if (digitos.length < 8) {
      setFreteCalculado(null)
      setErroCep(null)
    }
  }

  /* Enquanto o localStorage não foi lido, não dá para saber se há itens. */
  if (!montado) {
    return <div className="min-h-100" aria-busy="true" />
  }

  if (itens.length === 0) {
    return (
      <div className="mx-auto flex max-w-140 flex-col items-center gap-5 px-5 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-roxo/10 text-roxo">
          <IconeSacola className="h-9 w-9" />
        </span>
        <h1 className="font-serifada text-3xl text-tinta">Sua seleção está vazia</h1>
        <p className="text-[15px] leading-relaxed text-tinta-media">
          Escolha as peças que gostou na coleção. Quando terminar, é aqui que você monta
          o pedido e envia para {loja.consultora} pelo WhatsApp.
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

  const dados: DadosPedido = {
    nome,
    observacoes,
    endereco: cep.trim()
      ? {
          cep: cep.trim(),
          logradouro: logradouro.trim(),
          numero: numero.trim(),
          complemento: complemento.trim() || undefined,
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          estado: estado.trim(),
        }
      : undefined,
    valorFrete: freteCalculado ? freteCalculado.valor : undefined,
    tipoFrete: freteCalculado ? freteCalculado.tipo : undefined,
  }

  const subtotal = totalPedido(itens)
  const total = subtotal + (freteCalculado?.valor ?? 0)
  const pecas = totalPecas(itens)
  const numeroFaltando = loja.whatsapp === NUMERO_EXEMPLO

  return (
    <div className="mx-auto max-w-[1120px] px-5 pt-9 pb-20 sm:px-8 lg:px-16 lg:pt-16">
      {/* Etapas */}
      <ol className="mb-8 flex flex-wrap justify-center gap-5 sm:gap-10 lg:mb-12 lg:gap-14">
        {etapas.map((etapa) => {
          const atual = etapa.numero === 2
          return (
            <li
              key={etapa.numero}
              aria-current={atual ? 'step' : undefined}
              className={`flex items-center gap-2.5 font-rotulo text-xs tracking-[0.12em] uppercase ${
                atual ? 'font-semibold text-tinta' : 'text-tinta-suave'
              }`}
            >
              <span
                className={`flex h-6.5 w-6.5 items-center justify-center rounded-full font-bold ${
                  atual ? 'bg-roxo text-white' : 'bg-lilas-borda text-roxo'
                }`}
              >
                {etapa.numero}
              </span>
              {etapa.rotulo}
            </li>
          )
        })}
      </ol>

      <div className="mb-8 text-center lg:mb-12">
        <h1 className="mb-3 font-serifada text-3xl text-tinta lg:text-5xl">Sua seleção</h1>
        <p className="mx-auto max-w-130 text-[15px] leading-relaxed text-tinta-media">
          Revise as peças escolhidas e informe seu endereço para calcularmos a taxa fixa de entrega.
          Ao enviar, o pedido chega pronto no WhatsApp de {loja.consultora}.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-6 lg:gap-10">
        {/* Lista de peças */}
        <div className="flex min-w-70 flex-1 basis-105 flex-col gap-4">
          {itens.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-2xl border border-roxo/12 bg-white p-4"
            >
              <Link
                href={`/pecas/${item.slug}`}
                className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-lilas"
              >
                <FotoProduto imagem={item.imagem} alt={item.nome} sizes="96px" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serifada text-lg leading-tight text-tinta">
                    <Link href={`/pecas/${item.slug}`} className="hover:text-roxo">
                      {item.nome}
                    </Link>
                  </h2>
                  <button
                    type="button"
                    onClick={() => remover(item.id)}
                    aria-label={`Remover ${item.nome}`}
                    className="shrink-0 text-tinta-clara transition-colors hover:text-[#BA1A1A]"
                  >
                    <IconeFechar className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-1 text-[13px] text-tinta-suave">
                  {descricaoVariacao(item)} · {item.codigo}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <ControleQuantidade
                    quantidade={item.quantidade}
                    aoAlterar={(valor) => alterarQuantidade(item.id, valor)}
                    rotulo={item.nome}
                  />
                  <span className="font-serifada text-lg text-roxo">
                    {fmtMoeda(item.preco * item.quantidade)}
                  </span>
                </div>
              </div>
            </article>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <Link
              href="/pecas"
              className="flex items-center gap-2 py-2 font-rotulo text-xs tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
            >
              <IconeMais className="h-4.5 w-4.5" />
              Continuar explorando
            </Link>
            <button
              type="button"
              onClick={limpar}
              className="py-2 font-rotulo text-xs tracking-[0.1em] text-tinta-clara uppercase transition-colors hover:text-[#BA1A1A]"
            >
              Esvaziar seleção
            </button>
          </div>
        </div>

        {/* Resumo do pedido e Endereço */}
        <div className="min-w-70 flex-1 basis-80 lg:sticky lg:top-24 lg:max-w-105">
          <div className="rounded-2xl border border-dourado/30 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(51,36,63,0.4)] lg:p-8">
            <h2 className="mb-5 border-b border-roxo/12 pb-4 font-serifada text-2xl text-tinta">
              Detalhes do pedido
            </h2>

            <div className="mb-6 flex flex-col gap-5">
              {/* Nome */}
              <label className="flex flex-col gap-1.5">
                <span className="font-rotulo text-[11px] tracking-[0.14em] text-tinta-suave uppercase">
                  Seu nome
                </span>
                <input
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  placeholder="Como gostaria de ser chamada?"
                  className="rounded-lg border border-roxo/18 bg-lilas-claro px-3.5 py-3 font-corpo text-[15px] text-tinta placeholder:text-tinta-clara"
                />
              </label>

              {/* Bloco de Frete e Endereço */}
              <div className="flex flex-col gap-3 rounded-xl border border-roxo/12 bg-white p-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <IconeCaminhao className="h-5 w-5 text-dourado" />
                  <span className="font-rotulo text-[11px] font-semibold tracking-[0.14em] text-tinta uppercase">
                    Entrega & Frete Fixo
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={cep}
                      onChange={aoDigitarCep}
                      placeholder="CEP (ex: 01310-100)"
                      maxLength={9}
                      className="w-full rounded-lg border border-roxo/18 bg-lilas-claro px-3.5 py-2.5 font-corpo text-[14px] text-tinta placeholder:text-tinta-clara"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => executarBuscaCep(cep)}
                    disabled={buscandoCep}
                    className="rounded-lg bg-roxo/10 px-4 py-2.5 font-rotulo text-[11px] font-semibold tracking-[0.1em] text-roxo uppercase transition-colors hover:bg-roxo/20 disabled:opacity-50"
                  >
                    {buscandoCep ? 'Buscando…' : 'Buscar'}
                  </button>
                </div>

                {erroCep && (
                  <p role="alert" className="text-[12px] text-[#BA1A1A]">
                    {erroCep}
                  </p>
                )}

                {/* Retorno de Frete Calculado */}
                {freteCalculado && (
                  <div className="animar-subir flex items-center justify-between rounded-lg bg-[#1fa855]/10 p-3 text-[13px] text-[#17864a]">
                    <span className="flex items-center gap-2 font-medium">
                      <IconeVerificado className="h-4.5 w-4.5 text-[#1fa855]" />
                      Frete {freteCalculado.tipo === 'sp' ? 'SP' : 'Fora de SP'}
                    </span>
                    <span className="font-serifada text-[15px] font-bold">
                      {fmtMoeda(freteCalculado.valor)}
                    </span>
                  </div>
                )}

                {/* Campos adicionais de endereço quando o CEP é preenchido */}
                {cidade && estado && (
                  <div className="animar-subir mt-1 flex flex-col gap-2.5 border-t border-roxo/8 pt-3 text-[13px]">
                    <div className="flex items-center gap-1.5 text-tinta-media">
                      <IconeLocalizacao className="h-4 w-4 text-dourado shrink-0" />
                      <span className="font-medium text-tinta">{cidade} - {estado}</span>
                      {bairro && <span className="text-tinta-suave">({bairro})</span>}
                    </div>

                    <input
                      type="text"
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      placeholder="Rua / Avenida"
                      className="w-full rounded-lg border border-roxo/18 bg-lilas-claro px-3 py-2 text-[13px] text-tinta placeholder:text-tinta-clara"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Número (ex: 120)"
                        className="rounded-lg border border-roxo/18 bg-lilas-claro px-3 py-2 text-[13px] text-tinta placeholder:text-tinta-clara"
                      />
                      <input
                        type="text"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        placeholder="Apto / Bloco (opcional)"
                        className="rounded-lg border border-roxo/18 bg-lilas-claro px-3 py-2 text-[13px] text-tinta placeholder:text-tinta-clara"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Observações */}
              <label className="flex flex-col gap-1.5">
                <span className="font-rotulo text-[11px] tracking-[0.14em] text-tinta-suave uppercase">
                  Observações (opcional)
                </span>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(evento) => setObservacoes(evento.target.value)}
                  placeholder="Ex.: é para presente, preciso de embalagem especial"
                  className="resize-none rounded-lg border border-roxo/18 bg-lilas-claro px-3.5 py-2.5 font-corpo text-[14px] text-tinta placeholder:text-tinta-clara"
                />
              </label>
            </div>

            {/* Resumo financeiro */}
            <div className="mb-5 flex flex-col gap-2.5 border-t border-roxo/12 pt-4.5">
              <div className="flex items-baseline justify-between text-[14px] text-tinta-media">
                <span>Subtotal ({pecas} {pecas === 1 ? 'peça' : 'peças'})</span>
                <span>{fmtMoeda(subtotal)}</span>
              </div>

              <div className="flex items-baseline justify-between text-[14px] text-tinta-media">
                <span>Frete fixo</span>
                <span>
                  {freteCalculado ? (
                    <span className="font-semibold text-tinta">
                      {fmtMoeda(freteCalculado.valor)}
                    </span>
                  ) : (
                    <span className="text-xs text-tinta-suave">A calcular pelo CEP</span>
                  )}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-roxo/8 pt-2">
                <span className="font-medium text-[15px] text-tinta">Total estimado</span>
                <span className="font-serifada text-2xl text-roxo">{fmtMoeda(total)}</span>
              </div>
            </div>

            {numeroFaltando && (
              <p
                role="alert"
                className="mb-4 rounded-lg border border-[#BA1A1A]/25 bg-[#BA1A1A]/6 p-3 text-[13px] leading-relaxed text-[#BA1A1A]"
              >
                <strong>Falta configurar o WhatsApp.</strong> Abra{' '}
                <code className="font-mono">src/config/loja.ts</code> e troque o número em{' '}
                <code className="font-mono">whatsapp</code>. Este aviso some sozinho
                depois disso.
              </p>
            )}

            <a
              href={linkPedido(itens, dados)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-zap px-6 py-4 font-rotulo text-sm tracking-[0.08em] text-white uppercase transition-colors hover:bg-zap-escuro shadow-[0_12px_24px_-10px_rgba(31,168,85,0.4)]"
            >
              <IconeWhatsApp className="h-5.5 w-5.5" />
              Enviar para {loja.consultora}
            </a>

            <p className="mt-3.5 text-center text-xs text-tinta-clara">
              Você será direcionada ao WhatsApp com o pedido e endereço já escritos. Nada é cobrado
              aqui no site.
            </p>

            <button
              type="button"
              onClick={() => setVerPrevia((atual) => !atual)}
              aria-expanded={verPrevia}
              className="mt-3 w-full py-2 font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase transition-colors hover:text-dourado"
            >
              {verPrevia ? 'Ocultar mensagem' : 'Ver a mensagem que será enviada'}
            </button>

            {verPrevia && (
              <pre className="animar-subir mt-2 max-h-70 overflow-auto rounded-lg bg-lilas-claro p-3.5 font-corpo text-[13px] leading-relaxed whitespace-pre-wrap text-tinta-media">
                {montarMensagemPedido(itens, dados)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

