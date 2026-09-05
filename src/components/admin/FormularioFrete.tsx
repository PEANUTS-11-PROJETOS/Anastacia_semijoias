'use client'

import { useState } from 'react'
import { salvarConfigFrete } from '@/app/admin/acoes'
import type { ConfigFrete } from '@/types'
import { IconeVerificado } from '@/components/ui/Icones'

interface Props {
  configInicial: ConfigFrete
}

export function FormularioFrete({ configInicial }: Props) {
  const [sp, setSp] = useState<number | string>(configInicial.sp)
  const [foraSp, setForaSp] = useState<number | string>(configInicial.foraSp)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function aoSalvar(evento: React.FormEvent) {
    evento.preventDefault()
    setErro(null)
    setSucesso(false)
    setSalvando(true)

    const valorSp = typeof sp === 'string' ? parseFloat(sp.replace(',', '.')) : sp
    const valorForaSp = typeof foraSp === 'string' ? parseFloat(foraSp.replace(',', '.')) : foraSp

    if (isNaN(valorSp) || valorSp < 0) {
      setErro('Informe um valor válido para o frete de São Paulo.')
      setSalvando(false)
      return
    }

    if (isNaN(valorForaSp) || valorForaSp < 0) {
      setErro('Informe um valor válido para o frete Fora de SP.')
      setSalvando(false)
      return
    }

    const resultado = await salvarConfigFrete({ sp: valorSp, foraSp: valorForaSp })

    if (!resultado.ok) {
      setErro(resultado.erro)
      setSalvando(false)
      return
    }

    setSucesso(true)
    setSalvando(false)
    setTimeout(() => setSucesso(false), 4000)
  }

  return (
    <form onSubmit={aoSalvar} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-roxo/10 bg-white p-6 shadow-[0_1px_3px_rgba(51,36,63,0.05)] sm:p-8">
        <h2 className="mb-2 font-serifada text-2xl text-tinta">Configurações de Frete Fixo</h2>
        <p className="mb-6 text-[14px] leading-relaxed text-tinta-media">
          Defina os valores de frete cobrados na finalização do pedido. O site identifica
          automaticamente o estado da cliente através do CEP digitado e aplica a taxa correspondente.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Frete SP */}
          <div className="flex flex-col gap-2 rounded-xl border border-roxo/10 bg-lilas-claro/50 p-5">
            <span className="font-rotulo text-[11px] font-semibold tracking-[0.14em] text-roxo uppercase">
              São Paulo (SP)
            </span>
            <span className="text-[13px] text-tinta-suave">
              Aplicado para todos os CEPs do estado de São Paulo.
            </span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-serifada text-[15px] text-tinta-suave">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sp}
                onChange={(e) => setSp(e.target.value)}
                required
                className="w-full rounded-lg border border-roxo/20 bg-white py-3 pr-3.5 pl-10 font-corpo text-[16px] text-tinta focus:border-roxo focus:outline-none"
              />
            </div>
          </div>

          {/* Frete Fora de SP */}
          <div className="flex flex-col gap-2 rounded-xl border border-roxo/10 bg-lilas-claro/50 p-5">
            <span className="font-rotulo text-[11px] font-semibold tracking-[0.14em] text-roxo uppercase">
              Fora de SP (Demais Estados)
            </span>
            <span className="text-[13px] text-tinta-suave">
              Aplicado para CEPs de outros estados (RJ, MG, PR, etc.).
            </span>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-serifada text-[15px] text-tinta-suave">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={foraSp}
                onChange={(e) => setForaSp(e.target.value)}
                required
                className="w-full rounded-lg border border-roxo/20 bg-white py-3 pr-3.5 pl-10 font-corpo text-[16px] text-tinta focus:border-roxo focus:outline-none"
              />
            </div>
          </div>
        </div>

        {erro && (
          <p role="alert" className="mt-5 rounded-lg bg-[#BA1A1A]/8 p-3.5 text-[13px] text-[#BA1A1A]">
            {erro}
          </p>
        )}

        {sucesso && (
          <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-[#1fa855]/10 p-3.5 text-[13px] font-medium text-[#17864a]">
            <IconeVerificado className="h-5 w-5 shrink-0 text-[#1fa855]" />
            Valores de frete salvos com sucesso e já ativos na loja!
          </div>
        )}

        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            disabled={salvando}
            className="rounded-xl bg-roxo px-8 py-4 font-rotulo text-[13px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo-escuro disabled:opacity-60"
          >
            {salvando ? 'Salvando…' : 'Salvar valores de frete'}
          </button>
        </div>
      </div>
    </form>
  )
}
