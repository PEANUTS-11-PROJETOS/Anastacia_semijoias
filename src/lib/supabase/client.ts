'use client'

import { createBrowserClient } from '@supabase/ssr'
import { exigirConfig } from '@/lib/supabase/config'

/**
 * Client do Supabase para componentes que rodam no navegador.
 * Usado no login e no envio das fotos direto para o Storage.
 */
export function criarClienteNavegador() {
  const { url, chave } = exigirConfig()
  return createBrowserClient(url, chave)
}
