import { z } from 'zod'

/**
 * Regras de validação da peça.
 *
 * O MESMO esquema é usado no formulário (para avisar a pessoa na hora) e dentro
 * da Server Action (para valer de verdade). Validar só no navegador não protege
 * nada: uma Server Action pode ser chamada direto, sem passar pela tela.
 */

/**
 * Aceita texto, vazio, null ou ausente, e sempre devolve texto ou null.
 *
 * O `nullish()` importa: a saída do esquema precisa continuar sendo uma entrada
 * válida para ele mesmo. É o que permite validar duas vezes — no formulário e de
 * novo dentro da Server Action — sem que o segundo passe reprove o resultado do
 * primeiro.
 */
const textoOpcional = z
  .string()
  .trim()
  .max(200)
  .nullish()
  .transform((v) => (v ? v : null))

export const esquemaProduto = z.object({
  codigo: z
    .string()
    .trim()
    .min(2, 'Informe o código da peça.')
    .max(20, 'Código muito longo.')
    .regex(/^[A-Za-z0-9-]+$/, 'Use apenas letras, números e hífen.'),

  slug: z
    .string()
    .trim()
    .min(2, 'Informe o endereço da peça.')
    .max(80)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Use apenas letras minúsculas sem acento, números e hífen.',
    ),

  nome: z.string().trim().min(2, 'Informe o nome da peça.').max(120),

  categoria_id: z.string().trim().min(1, 'Escolha uma categoria.'),

  preco: z
    .number({ message: 'Informe o preço.' })
    .positive('O preço precisa ser maior que zero.')
    .max(999999),

  preco_de: z
    .number()
    .positive()
    .max(999999)
    .nullable()
    .optional()
    .transform((v) => v ?? null),

  descricao: z.string().trim().max(2000).default(''),

  banhos: z
    .array(z.enum(['ouro18k', 'rodio']))
    .min(1, 'Escolha pelo menos um banho.'),

  ajustavel: z.boolean().default(false),
  medidas: textoOpcional,
  pedra: textoOpcional,
  selo: textoOpcional,
  destaque: z.boolean().default(false),
  esgotado: z.boolean().default(false),
  ativo: z.boolean().default(true),
})

/** O que o formulário entrega (antes das transformações). */
export type EntradaProduto = z.input<typeof esquemaProduto>
/** O que chega no banco (depois das transformações). */
export type SaidaProduto = z.output<typeof esquemaProduto>

/**
 * Preço "de" precisa ser maior que o preço atual, senão o desconto riscado
 * fica sem sentido na tela. Fica separado do esquema porque é uma regra entre
 * dois campos, não de um campo só.
 */
export function validarPrecoDe(dados: {
  preco: number
  preco_de: number | null
}): string | null {
  if (dados.preco_de !== null && dados.preco_de <= dados.preco) {
    return 'O preço "de" precisa ser maior que o preço atual.'
  }
  return null
}
