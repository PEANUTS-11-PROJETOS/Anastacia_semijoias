'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { excluirProduto } from '@/app/admin/acoes'

/**
 * Exclusão em dois passos. Apagar uma peça leva junto as fotos do Storage e não
 * tem volta, então um clique só é pouco — ainda mais num painel usado no celular,
 * onde toque errado é comum.
 */
export function BotaoExcluir({ id, nome }: { id: string; nome: string }) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [apagando, setApagando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function apagar() {
    setApagando(true)
    setErro(null)
    try {
      await excluirProduto(id)
      router.push('/admin')
      router.refresh()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível excluir.')
      setApagando(false)
      setConfirmando(false)
    }
  }

  if (!confirmando) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="font-rotulo text-[11px] tracking-[0.1em] text-tinta-clara uppercase transition-colors hover:text-[#BA1A1A]"
        >
          Excluir
        </button>
        {erro && (
          <span role="alert" className="text-[12px] text-[#BA1A1A]">
            {erro}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2 rounded-xl border border-[#BA1A1A]/30 bg-[#BA1A1A]/6 p-3">
      <span className="text-[13px] text-[#BA1A1A]">
        Excluir <strong>{nome}</strong> e suas fotos? Não tem volta.
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={apagar}
          disabled={apagando}
          className="rounded-lg bg-[#BA1A1A] px-4 py-2 font-rotulo text-[11px] tracking-[0.1em] text-white uppercase disabled:opacity-60"
        >
          {apagando ? 'Excluindo…' : 'Sim, excluir'}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="rounded-lg border border-roxo/25 px-4 py-2 font-rotulo text-[11px] tracking-[0.1em] text-roxo uppercase"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
