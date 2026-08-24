import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase/config'

/**
 * Proteção do painel.
 *
 * ⚠️ No Next.js 16 este arquivo se chama `proxy.ts` e exporta `proxy`.
 * O nome antigo (`middleware.ts` / `export function middleware`) está
 * descontinuado — a maioria dos tutoriais de Supabase ainda ensina a forma velha.
 *
 * Além de barrar quem não tem sessão, esta função renova o token a cada
 * navegação: como Server Components não podem gravar cookies, se ninguém
 * renovasse aqui a dona da loja seria deslogada sozinha de tempos em tempos.
 *
 * Isto NÃO é a única proteção: cada Server Action confere a sessão de novo, e o
 * RLS do banco é a barreira final. O proxy só cuida da navegação.
 */
export async function proxy(request: NextRequest) {
  let resposta = NextResponse.next({ request })

  // Sem configuração não há como validar sessão — deixa passar para a página
  // mostrar o erro de configuração em vez de um redirecionamento confuso.
  if (!SUPABASE_URL || !SUPABASE_KEY) return resposta

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesParaGravar) => {
        cookiesParaGravar.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
        resposta = NextResponse.next({ request })
        cookiesParaGravar.forEach(({ name, value, options }) =>
          resposta.cookies.set(name, value, options),
        )
      },
    },
  })

  // getUser() valida o token no servidor do Supabase. getSession() apenas lê o
  // cookie, que é forjável — por isso não serve para decidir acesso.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const caminho = request.nextUrl.pathname

  if (!user && caminho.startsWith('/admin')) {
    const destino = request.nextUrl.clone()
    destino.pathname = '/login'
    // Guarda para onde a pessoa queria ir, para voltar lá depois de entrar.
    destino.searchParams.set('destino', caminho)
    return NextResponse.redirect(destino)
  }

  if (user && caminho === '/login') {
    const destino = request.nextUrl.clone()
    destino.pathname = '/admin'
    destino.search = ''
    return NextResponse.redirect(destino)
  }

  return resposta
}

export const config = {
  // Só as rotas que precisam de sessão. O site da loja não passa por aqui, o
  // que evita uma checagem de rede em toda visita de cliente.
  matcher: ['/admin/:path*', '/login'],
}
