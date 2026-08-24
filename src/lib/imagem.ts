/**
 * Redimensiona a foto no próprio navegador, antes de enviar.
 *
 * Uma foto de celular sai com 8 a 12 MB e 4000 px de largura. Enviar isso pelo
 * 4G demora e enche o Storage à toa, e o site nunca mostra a peça maior que
 * ~1400 px. Passando pelo canvas, o arquivo cai para ~200 KB.
 */

const LARGURA_MAXIMA = 1400
const QUALIDADE = 0.82

export interface FotoPreparada {
  arquivo: Blob
  extensao: 'webp' | 'jpg'
  largura: number
  altura: number
  /** Para mostrar a prévia antes do envio. Lembre de revogar depois. */
  previa: string
}

/** WebP tem melhor compressão, mas nem todo navegador antigo exporta. */
function suportaWebp(): boolean {
  try {
    const teste = document.createElement('canvas')
    return teste.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

export async function prepararFoto(arquivo: File): Promise<FotoPreparada> {
  const bitmap = await criarBitmap(arquivo)

  const escala = Math.min(1, LARGURA_MAXIMA / Math.max(bitmap.width, bitmap.height))
  const largura = Math.round(bitmap.width * escala)
  const altura = Math.round(bitmap.height * escala)

  const canvas = document.createElement('canvas')
  canvas.width = largura
  canvas.height = altura

  const contexto = canvas.getContext('2d')
  if (!contexto) throw new Error('Não foi possível processar a imagem neste navegador.')

  contexto.imageSmoothingQuality = 'high'
  contexto.drawImage(bitmap, 0, 0, largura, altura)
  if ('close' in bitmap) bitmap.close()

  const webp = suportaWebp()
  const tipo = webp ? 'image/webp' : 'image/jpeg'

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, tipo, QUALIDADE),
  )
  if (!blob) throw new Error('Não foi possível preparar a imagem.')

  return {
    arquivo: blob,
    extensao: webp ? 'webp' : 'jpg',
    largura,
    altura,
    previa: URL.createObjectURL(blob),
  }
}

/**
 * createImageBitmap já aplica a orientação EXIF; sem isso, foto tirada de lado
 * no celular sobe deitada. O <img> é reserva para navegadores sem suporte.
 */
async function criarBitmap(arquivo: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(arquivo, { imageOrientation: 'from-image' })
    } catch {
      // cai para o caminho do <img>
    }
  }

  const url = URL.createObjectURL(arquivo)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}
