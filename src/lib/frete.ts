import { criarClientePublico } from '@/lib/supabase/publico'
import { fretePadrao } from '@/config/loja'
import type { ConfigFrete } from '@/types'

/**
 * Busca a configuração de frete fixo atualizada.
 * Se o banco estiver offline ou a tabela ainda não existir, usa os valores padrão de loja.ts.
 */
export async function obterConfigFrete(): Promise<ConfigFrete> {
  try {
    const supabase = criarClientePublico()
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'frete')
      .maybeSingle()

    if (error || !data?.valor) {
      return { sp: fretePadrao.sp, foraSp: fretePadrao.foraSp }
    }

    const valor = data.valor as { sp?: number; foraSp?: number }
    return {
      sp: typeof valor.sp === 'number' && valor.sp >= 0 ? valor.sp : fretePadrao.sp,
      foraSp: typeof valor.foraSp === 'number' && valor.foraSp >= 0 ? valor.foraSp : fretePadrao.foraSp,
    }
  } catch {
    return { sp: fretePadrao.sp, foraSp: fretePadrao.foraSp }
  }
}

export interface ResultadoCep {
  ok: true
  cep: string
  logradouro: string
  bairro: string
  cidade: string
  estado: string
  ehSp: boolean
}

export type RespostaConsultaCep =
  | ResultadoCep
  | { ok: false; erro: string }

/**
 * Consulta o endereço e o estado correspondente a um CEP usando a API do ViaCEP.
 */
export async function consultarCep(cepCru: string): Promise<RespostaConsultaCep> {
  const cepLimpo = cepCru.replace(/\D/g, '')

  if (cepLimpo.length !== 8) {
    return { ok: false, erro: 'O CEP precisa ter 8 dígitos.' }
  }

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      headers: { 'Accept': 'application/json' },
    })

    if (!resposta.ok) {
      return { ok: false, erro: 'Não foi possível consultar o CEP no momento.' }
    }

    const dados = await resposta.json()

    if (dados.erro) {
      return { ok: false, erro: 'CEP não encontrado.' }
    }

    const estado = (dados.uf || '').toUpperCase()

    return {
      ok: true,
      cep: dados.cep || cepCru,
      logradouro: dados.logradouro || '',
      bairro: dados.bairro || '',
      cidade: dados.localidade || '',
      estado,
      ehSp: estado === 'SP',
    }
  } catch {
    return { ok: false, erro: 'Erro de conexão ao buscar o CEP.' }
  }
}
