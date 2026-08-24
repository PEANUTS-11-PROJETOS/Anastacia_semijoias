import { createClient } from '@supabase/supabase-js'
import { exigirConfig } from '@/lib/supabase/config'

/**
 * Client sem sessão, para código que roda fora de uma requisição HTTP —
 * hoje, o generateStaticParams, que é executado no build.
 *
 * Ali não existem cookies para ler, então o client de servidor normal falha.
 * Aqui também não faz falta: no build não há usuário logado, e tudo que
 * precisamos são os dados públicos que o RLS já libera para o visitante.
 */
export function criarClientePublico() {
  const { url, chave } = exigirConfig()
  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
