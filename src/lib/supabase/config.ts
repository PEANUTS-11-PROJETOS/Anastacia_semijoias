/**
 * Endereço e chave pública do Supabase.
 *
 * A chave "publishable" (sb_publishable_...) é feita para ficar visível no navegador —
 * quem protege o banco são as regras de RLS, não o segredo da chave. A chave
 * "secret"/service_role nunca deve aparecer neste projeto.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/** Erro claro em vez de "fetch failed" três camadas abaixo. */
export function exigirConfig(): { url: string; chave: string } {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      'Supabase não configurado. Copie .env.example para .env.local e preencha ' +
        'NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    )
  }
  return { url: SUPABASE_URL, chave: SUPABASE_KEY }
}
