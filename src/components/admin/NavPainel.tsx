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

  const abas = [
    { href: '/admin', rotulo: 'Peças', ativa: !emCategorias },
    { href: '/admin/categorias', rotulo: 'Categorias', ativa: emCategorias },
  ]

  return (
    <nav className="flex items-center gap-1">
      {abas.map((aba) => (
        <Link
          key={aba.href}
          href={aba.href}
          aria-current={aba.ativa ? 'page' : undefined}
          className={cn(
            'rounded-lg px-3 py-2 font-rotulo text-[11px] tracking-[0.1em] uppercase transition-colors',
            aba.ativa
              ? 'bg-roxo/8 text-roxo'
              : 'text-tinta-suave hover:text-roxo',
          )}
        >
          {aba.rotulo}
        </Link>
      ))}
    </nav>
  )
}
