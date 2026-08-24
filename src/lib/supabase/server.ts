import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { exigirConfig } from '@/lib/supabase/config'

/**
 * Client do Supabase para Server Components, Server Actions e Route Handlers.
 * Lê a sessão dos cookies, então sabe se quem está pedindo é visitante ou a dona
 * da loja logada — é isso que faz as regras de RLS aplicarem o filtro certo.
 */
export async function criarClienteServidor() {
  const { url, chave } = exigirConfig()
  const armazemCookies = await cookies()

  return createServerClient(url, chave, {
    cookies: {
      getAll: () => armazemCookies.getAll(),
      setAll: (cookiesParaGravar) => {
        try {
          cookiesParaGravar.forEach(({ name, value, options }) =>
            armazemCookies.set(name, value, options),
          )
        } catch {
          // Server Components não podem gravar cookies. Quando a renovação da
          // sessão acontece aqui, quem grava de fato é o proxy (src/proxy.ts),
          // então ignorar é o comportamento correto e não perde a sessão.
        }
      },
    },
  })
}
