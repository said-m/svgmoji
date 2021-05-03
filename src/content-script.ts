import { copyImage } from './helpers';

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
      copyImage({
        url: message.url,
      }).then(
        (imageBlob) => sendResponse({
          data: imageBlob,
        }),
      ).catch(
        error => sendResponse({
          error,
        }),
      );

      return true;
    }
  },
);
