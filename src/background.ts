import { description } from '../package.json';
import { parseSelection } from './background/parse-selection';
import { prepareSourceItem } from './background/prepare-source-item';
import { store } from './background/store';
import { updateRootItem } from './background/update-root-item';
import { CONTEXT_MENU_ITEM_NAMES, NOTIFICATION_TYPE_ID_JOINER, PROJECT_INFO } from './constants';
import { copy, createLink, extractEmoji, isEnumItem } from './helpers';
import { ExtensionStorageInterface, ExtensionStorageSourceItemInterface, SourcesEnum } from './interfaces';

chrome.runtime.onInstalled.addListener(
  details => {
    // const currentVersion = chrome.runtime.getManifest().version;
    // const previousVersion = details.previousVersion;
    // const reason = details.reason;

    const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
      'sources',
      'sourcePrioritization',
    ];
    chrome.storage.sync.get(
      requiredStorageKeys,
      (result: Partial<ExtensionStorageInterface>) => {
        const sources: ExtensionStorageInterface['sources'] = result.sources || {};
        const sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'] =
          result.sourcePrioritization || [];

        const newSources = Object.values(SourcesEnum).filter(
          thisItem => !sources[thisItem],
        );

        if (!newSources.length) {
          return;
        }

        const updates: Partial<ExtensionStorageInterface> = {
          sources: {
            ...sources,
            ...Object.fromEntries(
              newSources.map(
                (thisItem): [SourcesEnum, ExtensionStorageSourceItemInterface] => [
                  thisItem,
                  {
                    type: thisItem,
                    isNew: true,
                    isDisabled: false,
                  },
                ],
              ),
            ),
          },
          sourcePrioritization: [
            ...sourcePrioritization.filter(
              thisItem => !newSources.includes(thisItem),
            ),
            ...newSources,
          ],
        };

        console.log('Обновление хранилища:', updates);

        chrome.storage.sync.set(updates);
      },
    );

    // switch (reason) {
    //   case 'install':
    //       break;
    //   case 'update':
    //       break;
    //   case 'chrome_update':
    //   case 'shared_module_update':
    //   default:
    //       break;
    // }
  },
);

// Удаление мусора из хранилища
chrome.tabs.onRemoved.addListener(
  tabId => store.tabEmoji.delete(tabId),
);

// Обновление меню при переключении между вкладками
// так как у них могут быть активны выделения
chrome.tabs.onActivated.addListener(
  tab => {
    store.activeTabId = tab.tabId;

    updateRootItem({
      tabId: store.activeTabId,
    });
  },
);

// Трекинг выделяемого содержимого
chrome.runtime.onMessage.addListener(
  (request, sender) => {
    const tabId = sender.tab?.id;

    // Без привязки выделения к вкладке - работать не вариант
    if (!tabId) {
      return;
    }

    const value = request?.value;

    parseSelection({
      tabId,
      value: typeof value === 'string'
        ? value
        : '',
    });
  },
);

// Взаимодействие с оповещением
chrome.notifications.onClicked.addListener(
  id => {
    // для оповещений копирования emoji использую их же в качестве id
    // с префиксом из наименования источника данных
    const [type, emoji] = id.split(NOTIFICATION_TYPE_ID_JOINER);

    if (
      !isEnumItem(type, SourcesEnum)
      || !extractEmoji(emoji)
    ) {
      return;
    }

    copy({
      value: createLink({
        emoji,
        type,
      }),
    });
  },
);


chrome.contextMenus.create({
  id: CONTEXT_MENU_ITEM_NAMES.root,
  title: `${PROJECT_INFO.name} - ${description}`,
  contexts: ['selection'],
  visible: false,
});

[
  CONTEXT_MENU_ITEM_NAMES.twemoji,
  CONTEXT_MENU_ITEM_NAMES.noto,
].forEach(
  thisItem => chrome.contextMenus.create(
    prepareSourceItem({
      type: thisItem,
      parentId: CONTEXT_MENU_ITEM_NAMES.root,
    }),
  ),
);
