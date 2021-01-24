import { ExtensionStorageHistoryItemInterface, ExtensionStorageInterface } from '../../interfaces';
import { createHistoryList } from './history-list';
import styles from './popup.module.scss';
import { createSourcePrioritization } from './source-prioritization';

(() => {
  const rootContainer = document.getElementById('root');

  if (!rootContainer) {
    return console.error('Не найден элемент для вставки содержимого страницы');
  }

  // history

  const historyWrap = document.createElement('div');
  historyWrap.classList.add(styles.wrap);

  const historyTitleEl = document.createElement('h2');
  historyTitleEl.innerText = 'Recently copied emojis';
  historyWrap.append(historyTitleEl);

  const historyEl = document.createElement('div');
  historyEl.innerText = 'loading...';
  historyWrap.append(historyEl);

  rootContainer.append(historyWrap);

  const updateHistory = ({
    items,
  }: {
    items: Array<ExtensionStorageHistoryItemInterface>,
  }) => {
    historyEl.innerText = '';

    historyEl.append(
      createHistoryList({
        items,
      }),
    );
  };

  // sources

  const sourcesWrap = document.createElement('div');
  sourcesWrap.classList.add(styles.wrap);

  const sourcesTitleEl = document.createElement('h2');
  sourcesTitleEl.innerText = 'Sources';
  sourcesWrap.append(sourcesTitleEl);

  const sourcesEl = document.createElement('div');
  sourcesEl.innerText = 'loading...';
  sourcesWrap.append(sourcesEl);

  rootContainer.append(sourcesWrap);

  const updateSources = ({
    items,
    order,
  }: {
    items: ExtensionStorageInterface['sources'],
    order: ExtensionStorageInterface['sourcePrioritization'],
  }) => {
    sourcesEl.innerText = '';

    sourcesEl.append(
      createSourcePrioritization({
        items,
        order,
      }),
    );
  };

  // loading

  const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
    'history',
    'sources',
    'sourcePrioritization',
  ];

  chrome.storage.sync.get(
    requiredStorageKeys,
    (result: Partial<ExtensionStorageInterface>) => {
      const history: ExtensionStorageInterface['history'] = result.history || [];
      const sources: ExtensionStorageInterface['sources'] = result.sources || {};
      const sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'] =
        result.sourcePrioritization || [];

      updateHistory({
        items: history,
      });

      updateSources({
        items: sources,
        order: sourcePrioritization,
      });
    },
  );

  chrome.storage.onChanged.addListener(
    changes => {
      const history: ExtensionStorageInterface['history'] = changes?.history?.newValue || [];
      const sources: ExtensionStorageInterface['sources'] = changes?.sources?.newValue || {};
      const sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'] =
        changes?.sourcePrioritization?.newValue || [];

      updateHistory({
        items: history,
      });

      updateSources({
        items: sources,
        order: sourcePrioritization,
      });
    },
  );
})();
