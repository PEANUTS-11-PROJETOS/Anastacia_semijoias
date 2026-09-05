import { banhos, loja } from '@/config/loja'
import type { DadosPedido, ItemCarrinho } from '@/types'
import { fmtMoeda } from '@/lib/utils'

/** Soma de um item (preço x quantidade). */
export function subtotalItem(item: ItemCarrinho): number {
  return item.preco * item.quantidade
}

/** Total da seleção. */
export function totalPedido(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, item) => soma + subtotalItem(item), 0)
}

/** Quantidade total de peças (soma das quantidades, não dos itens distintos). */
export function totalPecas(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, item) => soma + item.quantidade, 0)
}

/** Descreve as variações escolhidas. Ex.: "Ouro 18k" */
export function descricaoVariacao(item: ItemCarrinho): string {
  return banhos[item.banho].nome
}

/**
 * Monta a mensagem do pedido já formatada para o WhatsApp.
 * O * do WhatsApp deixa o texto em negrito no aplicativo.
 */
export function montarMensagemPedido(
  itens: ItemCarrinho[],
  dados: DadosPedido,
): string {
  const linhas: string[] = []

  linhas.push(`*NOVO PEDIDO - ${loja.nome}*`)
  linhas.push('')

  if (dados.nome.trim()) {
    linhas.push(`*Cliente:* ${dados.nome.trim()}`)
  }

  if (dados.endereco && dados.endereco.cep) {
    const end = dados.endereco
    linhas.push(`*CEP:* ${end.cep} (${end.cidade} - ${end.estado})`)
    if (end.logradouro.trim()) {
      const complementoStr = end.complemento?.trim() ? `, ${end.complemento.trim()}` : ''
      const bairroStr = end.bairro.trim() ? ` - ${end.bairro.trim()}` : ''
      linhas.push(`*Endereço:* ${end.logradouro.trim()}, ${end.numero.trim() || 'S/N'}${complementoStr}${bairroStr}`)
    }
  }

  linhas.push('')
  linhas.push('*Peças selecionadas:*')
  itens.forEach((item, indice) => {
    linhas.push(`${indice + 1}. ${item.nome} (${item.codigo})`)
    linhas.push(`   ${descricaoVariacao(item)}`)
    linhas.push(
      `   ${item.quantidade} x ${fmtMoeda(item.preco)} = ${fmtMoeda(subtotalItem(item))}`,
    )
  })

  const subtotal = totalPedido(itens)
  linhas.push('')
  linhas.push(`*Subtotal das peças:* ${fmtMoeda(subtotal)}`)

  if (typeof dados.valorFrete === 'number' && dados.valorFrete >= 0) {
    const regiao = dados.tipoFrete === 'sp' ? 'São Paulo - SP' : 'Fora de SP'
    linhas.push(`*Frete fixo (${regiao}):* ${fmtMoeda(dados.valorFrete)}`)
    linhas.push(`*Total estimado:* ${fmtMoeda(subtotal + dados.valorFrete)}`)
  } else {
    linhas.push('*Frete:* A calcular / confirmar no WhatsApp')
    linhas.push(`*Total estimado:* ${fmtMoeda(subtotal)}`)
  }

  linhas.push(`*Total de peças:* ${totalPecas(itens)}`)

  if (dados.observacoes.trim()) {
    linhas.push('')
    linhas.push(`*Observações:* ${dados.observacoes.trim()}`)
  }

  linhas.push('')
  linhas.push('Enviado pelo site')

  return linhas.join('\n')
}

/** Link wa.me com a mensagem já preenchida. */
export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

/** Link do pedido completo, pronto para o botão de finalizar. */
export function linkPedido(itens: ItemCarrinho[], dados: DadosPedido): string {
  return linkWhatsApp(montarMensagemPedido(itens, dados))
}

/** Link de conversa avulsa, para dúvidas sobre uma peça específica. */
export function linkDuvidaPeca(nome: string, codigo: string): string {
  return linkWhatsApp(
    `Olá! Tenho interesse na peça *${nome}* (${codigo}). Pode me contar mais?`,
  )
}
