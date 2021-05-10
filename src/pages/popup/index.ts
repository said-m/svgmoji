import { ExtensionStorageInterface } from '../../interfaces';
import '../../styles/_common.scss';
import Popup from './popup.svelte';

(() => {
  const rootContainer = document.getElementById('root');

  if (!rootContainer) {
    return console.error('Не найден элемент для вставки содержимого страницы');
  }

  const popup = new Popup({
    target: rootContainer,
  });

  const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
    'history',
    'sources',
    'sourcePrioritization',
    'contextMenuMode',
    'copyMode',
  ];

  chrome.storage.sync.get(
    requiredStorageKeys,
    (result: Partial<ExtensionStorageInterface>) => {
      popup.$set({
        history: result.history || [],
      });

      popup.$set({
        sources: result.sources,
      });

      popup.$set({
        sourcePrioritization: result.sourcePrioritization,
      });

      popup.$set({
        contextMenuMode: result.contextMenuMode,
      });

      popup.$set({
        copyMode: result.copyMode,
      });
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
      const copyMode: ExtensionStorageInterface['copyMode'] =
        changes?.copyMode?.newValue;


      if (history) {
        popup.$set({
          history,
        });
      }

      if (sources) {
        popup.$set({
          sources,
        });
      }

      if (sourcePrioritization) {
        popup.$set({
          sourcePrioritization,
        });
      }

      if (contextMenuMode) {
        popup.$set({
          contextMenuMode,
        });
      }

      if (copyMode) {
        popup.$set({
          copyMode,
        });
      }
    },
  );
})();
