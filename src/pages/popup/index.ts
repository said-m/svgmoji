import { ExtensionStorageInterface } from '../../interfaces';
import { createHistoryList } from './history-list';
import styles from './popup.module.scss';

(() => {
  const rootContainer = document.getElementById('root');

  if (!rootContainer) {
    return console.error('Не найден элемент для вставки содержимого страницы');
  }

  const historyWrap = document.createElement('div');
  historyWrap.classList.add(styles.wrap);

  const titleEl = document.createElement('h2');
  titleEl.innerText = 'Recently copied emojis';
  historyWrap.append(titleEl);

  const historyEl = document.createElement('div');
  historyEl.innerText = 'loading...';
  historyWrap.append(historyEl);

  const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
    'history',
  ];

  chrome.storage.sync.get(
    requiredStorageKeys,
    (result: Partial<ExtensionStorageInterface>) => {
      const history = result.history || [];
      historyEl.innerText = '';

      historyEl.append(
        createHistoryList({
          items: history,
        }),
      );
    },
  );

  chrome.storage.onChanged.addListener(
    changes => {
      const history: ExtensionStorageInterface['history']  = changes?.history?.newValue || [];

      historyEl.innerText = '';

      historyEl.append(
        createHistoryList({
          items: history,
        }),
      );
    },
  );

  rootContainer.append(historyWrap);
})();
