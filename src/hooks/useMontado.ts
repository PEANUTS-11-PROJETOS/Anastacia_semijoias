'use client'

import { useSyncExternalStore } from 'react'

/** Nunca há mudança para notificar: o valor só difere entre servidor e cliente. */
const semInscricao = () => () => {}
const noCliente = () => true
const noServidor = () => false

/**
 * Retorna false na renderização do servidor e true depois da hidratação.
 *
 * O carrinho fica salvo no localStorage, que não existe no servidor. Sem essa
 * checagem o React reclamaria de diferença entre o HTML do servidor e o do
 * navegador (erro de hidratação) toda vez que houvesse item na seleção.
 */
export function useMontado(): boolean {
  return useSyncExternalStore(semInscricao, noCliente, noServidor)
}
