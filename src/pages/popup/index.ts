import isEqual from 'lodash.isequal';
import { ContextMenuModesEnum, ExtensionStorageHistoryItemInterface, ExtensionStorageInterface } from '../../interfaces';
import { createContextMenuMode } from './context-menu-mode';
import { createHistoryList } from './history-list';
import styles from './popup.module.scss';
import { createSourcePrioritization } from './source-prioritization';
import { popupStore } from './store';

(() => {
  const rootContainer = document.getElementById('root');

  if (!rootContainer) {
    return console.error('Не найден элемент для вставки содержимого страницы');
  }

  // history

  const historyWrapEl = document.createElement('div');
  historyWrapEl.classList.add(styles.wrap);

  const historyTitleEl = document.createElement('h2');
  historyTitleEl.innerText = 'Recently copied emojis';
  historyWrapEl.append(historyTitleEl);

  const historyEl = document.createElement('div');
  historyEl.innerText = 'loading...';
  historyWrapEl.append(historyEl);

  rootContainer.append(historyWrapEl);

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

  const sourcesWrapEl = document.createElement('div');
  sourcesWrapEl.classList.add(styles.wrap);

  const sourcesTitleEl = document.createElement('h2');
  sourcesTitleEl.innerText = 'Sources';
  sourcesWrapEl.append(sourcesTitleEl);

  const sourcesEl = document.createElement('div');
  sourcesEl.innerText = 'loading...';
  sourcesWrapEl.append(sourcesEl);

  rootContainer.append(sourcesWrapEl);

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

  // context menu mode

  const contextMenuModeWrapEl = document.createElement('div');
  contextMenuModeWrapEl.classList.add(styles.wrap);

  const contextMenuModeTitleEl = document.createElement('h2');
  contextMenuModeTitleEl.innerText = 'Context menu mode';
  contextMenuModeWrapEl.append(contextMenuModeTitleEl);

  const contextMenuModeEl = document.createElement('div');
  contextMenuModeEl.innerText = 'loading...';
  contextMenuModeWrapEl.append(contextMenuModeEl);

  rootContainer.append(contextMenuModeWrapEl);

  const updateContextMenuMode = ({
    mode,
  }: {
    mode: ContextMenuModesEnum,
  }) => {
    contextMenuModeEl.innerText = '';

    contextMenuModeEl.append(
      createContextMenuMode({
        mode,
      }),
    );
  };

  // loading

  const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
    'history',
    'sources',
    'sourcePrioritization',
    'contextMenuMode',
  ];

  chrome.storage.sync.get(
    requiredStorageKeys,
    (result: Partial<ExtensionStorageInterface>) => {
      if (result.history) {
        updateHistory({
          items: result.history,
        });
      }

      if (
        result.sources
        || result.sourcePrioritization
      ) {
        popupStore.sources = result.sources
          || popupStore.sources;
        popupStore.sourcePrioritization = result.sourcePrioritization
          || popupStore.sourcePrioritization;

        updateSources({
          items: popupStore.sources,
          order: popupStore.sourcePrioritization,
        });
      }

      if (result.contextMenuMode) {
        updateContextMenuMode({
          mode: result.contextMenuMode,
        });
      }
    },
  );

  chrome.storage.onChanged.addListener(
    changes => {
      const history: ExtensionStorageInterface['history'] = changes?.history?.newValue;
      const sources: ExtensionStorageInterface['sources'] = changes?.sources?.newValue;
      const sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'] =
        changes?.sourcePrioritization?.newValue;
      const contextMenuMode: ExtensionStorageInterface['contextMenuMode'] =
        changes?.contextMenuMode?.newValue;

      const shouldUpdate = {
        history: !!history,
        sources: sources
          && !isEqual(sources, popupStore.sources),
        sourcePrioritization: sourcePrioritization
          && !isEqual(sourcePrioritization, popupStore.sourcePrioritization),
        contextMenuMode: contextMenuMode
          && !isEqual(contextMenuMode, popupStore.contextMenuMode),
      };

      if (shouldUpdate.history) {
        updateHistory({
          items: history,
        });
      }

      if (shouldUpdate.sources) {
        popupStore.sources = sources;
      }

      if (shouldUpdate.sourcePrioritization) {
        popupStore.sourcePrioritization = sourcePrioritization;
      }

      if (
        shouldUpdate.sources
        || shouldUpdate.sourcePrioritization
      ) {
        updateSources({
          items: popupStore.sources,
          order: popupStore.sourcePrioritization,
        });
      }

      if (shouldUpdate.contextMenuMode) {
        popupStore.contextMenuMode = contextMenuMode;

        updateContextMenuMode({
          mode: popupStore.contextMenuMode,
        });
      }
    },
  );
})();
