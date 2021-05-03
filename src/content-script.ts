import { getPngFromSvg } from './helpers';

document.addEventListener(
  'selectionchange',
  () => {
    chrome.runtime.sendMessage({
      name: 'selectionChange',
      value: window.getSelection()?.toString(),
    });
  },
);

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (
      message
      && message.name === 'copyImage'
      && typeof message.url === 'string'
    ) {
      if (
        !('write' in navigator.clipboard)
        // @ts-ignore
        || ClipboardItem === undefined
      ) {
        sendResponse({
          error: new Error('Браузер не поддерживает функционал копирования в буфер изображений'),
        });
      }

      getPngFromSvg({
        url: message.url,
      }).then(
        async ({ data: pngBlob }) => {
          // @ts-ignore
          await navigator.clipboard.write([
            // @ts-ignore
            new ClipboardItem({
              [pngBlob.type]: pngBlob,
            }),
          ]);

          sendResponse({
            data: pngBlob,
          });
        },
      ).catch(
        error => sendResponse({
          error,
        }),
      );

      return true;
    }
  },
);
