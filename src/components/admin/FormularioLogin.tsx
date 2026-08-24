'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { criarClienteNavegador } from '@/lib/supabase/client'

export function FormularioLogin() {
  const router = useRouter()
  const parametros = useSearchParams()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault()
    setErro(null)
    setEnviando(true)

    const supabase = criarClienteNavegador()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      // A mensagem do Supabase vem em inglês e é genérica de propósito (não
      // revela se o e-mail existe). Traduzimos mantendo essa discrição.
      setErro(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : `Não foi possível entrar: ${error.message}`,
      )
      setEnviando(false)
      return
    }

    // O destino guardado pelo proxy quando a pessoa tentou abrir /admin direto.
    const destino = parametros.get('destino') ?? '/admin'
    router.push(destino)
    router.refresh()
  }

  return (
    <form onSubmit={entrar} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="font-rotulo text-[11px] tracking-[0.14em] text-tinta-suave uppercase">
          E-mail
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="rounded-lg border border-roxo/18 bg-lilas-claro px-3.5 py-3 font-corpo text-[15px] text-tinta"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-rotulo text-[11px] tracking-[0.14em] text-tinta-suave uppercase">
          Senha
        </span>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          autoComplete="current-password"
          className="rounded-lg border border-roxo/18 bg-lilas-claro px-3.5 py-3 font-corpo text-[15px] text-tinta"
        />
      </label>

      {erro && (
        <p role="alert" className="rounded-lg bg-[#BA1A1A]/8 p-3 text-[13px] text-[#BA1A1A]">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-xl bg-roxo px-6 py-4 font-rotulo text-[13px] tracking-[0.1em] text-white uppercase transition-colors hover:bg-roxo-escuro disabled:opacity-60"
      >
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
