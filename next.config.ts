import type { NextConfig } from 'next'

/**
 * As fotos das peças ficam no Storage do Supabase, ou seja, num domínio externo.
 * O <Image> do Next recusa domínios não declarados, e o site usa <Image fill /> em
 * toda foto de peça — sem isto, qualquer peça com foto quebra em execução.
 *
 * O endereço é derivado da própria variável de ambiente para que configuração e
 * ambiente nunca fiquem fora de sincronia ao trocar de projeto Supabase.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const nextConfig: NextConfig = {
  images: supabaseUrl
    ? {
        remotePatterns: [new URL(`${supabaseUrl}/storage/v1/object/public/**`)],
      }
    : // Sem a variável (ex.: build de CI antes de configurar) não quebramos o build:
      // o site simplesmente não terá fotos remotas.
      undefined,
}

export default nextConfig
