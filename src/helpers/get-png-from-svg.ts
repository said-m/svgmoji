
export const getPngFromSvg = ({
  url,
}: {
  url: string;
}) => new Promise<{
  data: Blob,
}>(
  async (resolve, reject) => {
    const resultType = 'image/png';

    const imageResponse = await fetch(url);
    const imageBlob = await imageResponse.blob();

    if (imageBlob.type === resultType) {
      return resolve({
        data: imageBlob,
      });
    }

    const imageBase64 = URL.createObjectURL(imageBlob);

    const canvasEl = document.createElement('canvas');
    const canvasContext = canvasEl.getContext('2d');
    const imageEl = new Image();

    imageEl.onload = async () => {
      if (!canvasContext) {
        return reject(
          new Error('Не удалось инициализировать холст для преобразования изображения'),
        );
      }

      const imageHeight = imageEl.height;
      const imageWidth = imageEl.width;

      const renderWidth = 1080;
      const renderHeight = renderWidth * imageHeight / imageWidth;

      canvasEl.width = renderWidth;
      canvasEl.height = renderHeight;

      canvasContext.drawImage(imageEl, 0, 0, renderWidth, renderHeight);

      canvasEl.toBlob(
        async (resultBlob) => {
          if (!resultBlob) {
            return reject(new Error('Не удалось преобразовать изображение в png'));
          }

          resolve({
            data: resultBlob,
          });
        },
        resultType,
      );
    };

    imageEl.src = imageBase64;
  },
);
