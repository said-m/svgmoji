export const getPngFromSvg = async ({
  url,
  width = 1080,
}: {
  url: string
  width?: number
}) => {
  const response = await fetch(url)
  const blob = await response.blob()
  const imageUrl = URL.createObjectURL(blob)

  return new Promise<{ data: Blob }>((resolve, reject) => {
    const image = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    image.onload = () => {
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      const height = (width * image.height) / image.width
      canvas.width = width
      canvas.height = height

      ctx.drawImage(image, 0, 0, width, height)

      canvas.toBlob(
        (resultBlob) => {
          if (!resultBlob) {
            reject(new Error('Failed to convert to PNG'))
            return
          }
          resolve({ data: resultBlob })
        },
        'image/png'
      )
    }

    image.src = imageUrl
  })
}
