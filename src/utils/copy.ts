import { getPngFromSvg } from './get-png-from-svg'

export const copy = async ({
  value,
  asImage = false,
}: {
  value: string
  asImage?: boolean
}) => {
  if (asImage) {
    return copyImage({ url: value })
  }
  return copyText({ value })
}

export const copyText = async ({ value }: { value: string }) => {
  await navigator.clipboard.writeText(value)
  return value
}

export const copyImage = async ({ url }: { url: string }) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    if (!blob.type.startsWith('image/svg')) {
      const data = [new ClipboardItem({ [blob.type]: blob })]
      await navigator.clipboard.write(data)
      return blob
    }

    const { data: pngBlob } = await getPngFromSvg({ url })
    const data = [new ClipboardItem({ [pngBlob.type]: pngBlob })]
    await navigator.clipboard.write(data)
    return pngBlob
  } catch (error) {
    throw new Error(`Failed to copy image: ${error}`)
  }
}
