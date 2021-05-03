import { getPngFromSvg } from './get-png-from-svg';

export const copy = async ({
  value,
  asImage = false,
  isPage = true,
}: {
  value: string;
  asImage?: boolean;
  isPage?: boolean;
}) => {
  if (asImage) {
    if (isPage) {
      return copyImage({
        url: value,
      });
    }

    return copyImageRequest({
      url: value,
    });
  }

  return copyText({
    value,
  });
};

export const copyText = ({
  value,
}: {
  value: string;
}) => new Promise<string>(
  (resolve, reject) => {
    try {
      const textareaEl = document.createElement('textarea');
      textareaEl.textContent = value;

      document.body.appendChild(textareaEl);
      textareaEl.select();

      document.execCommand('copy');

      textareaEl.blur();
      document.body.removeChild(textareaEl);

      resolve(value);
    } catch (error) {
      reject(error);
    }
  },
);

export const copyImageRequest = ({
  url,
}: {
  url: string;
}) => new Promise<Blob>(
  (resolve, reject) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      ([tab]) => {
        if (!tab.id) {
          return reject(
            new Error('Для копирования изображений необходимо иметь активную вкладку'),
          );
        }

        chrome.tabs.sendMessage(
          tab.id,
          {
            name: 'copyImage',
            url,
          },
          (response) => {
            if (!response) {
              return reject('На экспешн не был повешн хэндл');
            }

            if ('error' in response) {
              return reject(`Возникла ошибка при копировании изображения: ${response.error}`);
            }

            resolve(response);
          },
        );
      },
    );
  },
);

export const copyImage = ({
  url,
}: {
  url: string;
}) => new Promise<Blob>(
  (resolve, reject) => {
    if (
      !('write' in navigator.clipboard)
      // @ts-ignore
      || ClipboardItem === undefined
    ) {
      reject(new Error('Браузер не поддерживает функционал копирования в буфер изображений'));
    }

    getPngFromSvg({
      url: url,
    }).then(
      async ({ data: pngBlob }) => {
        try {
          // @ts-ignore
          await navigator.clipboard.write([
            // @ts-ignore
            new ClipboardItem({
              [pngBlob.type]: pngBlob,
            }),
          ]);

          resolve(pngBlob);
        } catch (error) {
          reject(new Error(`Неудачная попытка записи в буфер: ${error}`));
        }
      },
    ).catch(
      error => reject(new Error(`Ошибка при преобразовании изображении: ${error}`)),
    );
  },
);
