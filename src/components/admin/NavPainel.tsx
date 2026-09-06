'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Abas do painel.
 *
 * Categorias é a única rota com seção própria; todo o resto de /admin — a lista,
 * a nova peça, a edição — pertence a Peças. Por isso a regra é essa e não um
 * casamento exato de caminho: editando uma peça, a aba certa continua acesa.
 */
export function NavPainel() {
  const caminho = usePathname()
  const emCategorias = caminho.startsWith('/admin/categorias')
  const emFrete = caminho.startsWith('/admin/frete')
  const emPecas = !emCategorias && !emFrete

  const abas = [
    { href: '/admin', rotulo: 'Peças', ativa: emPecas },
    { href: '/admin/categorias', rotulo: 'Categorias', ativa: emCategorias },
    { href: '/admin/frete', rotulo: 'Frete', ativa: emFrete },
  ]

  return (
    <nav className="flex items-center gap-1 rounded-xl bg-roxo/4 p-1 sm:bg-transparent sm:p-0">
      {abas.map((aba) => (
        <Link
          key={aba.href}
          href={aba.href}
          aria-current={aba.ativa ? 'page' : undefined}
          className={cn(
            'rounded-lg px-3 py-1.5 font-rotulo text-[11px] tracking-[0.1em] uppercase transition-all sm:py-2',
            aba.ativa
              ? 'bg-white font-bold text-roxo shadow-xs sm:bg-roxo/8 sm:shadow-none'
              : 'text-tinta-suave hover:text-roxo',
          )}
        >
          {aba.rotulo}
        </Link>
      ))}
    </nav>
  )
}
