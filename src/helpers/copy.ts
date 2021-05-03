import { store } from '../background/store';

export const copy = async ({
  value,
  asImage = false,
}: {
  value: string;
  asImage?: boolean;
}) => {
  if (asImage) {
    return copyImage({
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

export const copyImage = ({
  url,
}: {
  url: string;
}) => new Promise<Blob>(
  (resolve, reject) => {
    chrome.tabs.sendMessage(
      store.activeTabId,
      {
        name: 'copyImage',
        url,
      },
      (response) => {
        if (!response) {
          return reject('Странная ошибка');
        }

        if ('error' in response) {
          return reject(response);
        }

        resolve(response);
      },
    );
  },
);
