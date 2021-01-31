import { getKeys, isEnumValue } from '@said-m/common';
import isEqual from 'lodash.isequal';
import { description } from '../package.json';
import { parseSelection } from './background/parse-selection';
import { actionOnClick, prepareSourceItem } from './background/prepare-source-item';
import { store } from './background/store';
import { updateRootItem } from './background/update-root-item';
import { updateSourceItemOrder } from './background/update-source-item-order';
import { CONTEXT_MENU_ITEM_NAMES, CONTEXT_MENU_SOURCE_ITEMS, NOTIFICATION_TYPE_ID_JOINER, PROJECT_INFO } from './constants';
import { copy, createLink, extractEmoji } from './helpers';
import { ExtensionStorageInterface, ExtensionStorageSourceItemInterface, SourcesEnum } from './interfaces';

chrome.runtime.onInstalled.addListener(
  details => {
    const currentVersion = chrome.runtime.getManifest().version;
    const previousVersion = details.previousVersion;
    // const reason = details.reason;
    const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
      'sources',
      'sourcePrioritization',
      'contextMenuMode',
    ];
    chrome.storage.sync.get(
      requiredStorageKeys,
      (result: Partial<ExtensionStorageInterface>) => {
        const sources: ExtensionStorageInterface['sources'] = result.sources || {};
        store.sourcePrioritization = result.sourcePrioritization || [];
        store.contextMenuMode = result.contextMenuMode
          || store.contextMenuMode;

        updateSourceItemOrder();

        const updates: Partial<ExtensionStorageInterface> = {};

        if (!result.contextMenuMode) {
          updates.contextMenuMode = store.contextMenuMode;
        }

        const oldNewSources = getKeys(sources).filter(
          thisItem => sources[thisItem]?.isNew,
        );

        const newSources = Object.values(SourcesEnum).filter(
          thisItem => !sources[thisItem],
        );

        if (
          newSources.length
          || (
            oldNewSources.length
            && currentVersion !== previousVersion
          )
        ) {
          updates.sources = {
            ...Object.fromEntries(
              Object.entries(sources).map(
                ([
                  thisItemType,
                  thisItem,
                ]) => [
                  thisItemType,
                  {
                    ...thisItem,
                    isNew: false,
                  },
                ],
              ),
            ),
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
          };
        }

        if (newSources.length) {
          updates.sourcePrioritization = [
            ...store.sourcePrioritization.filter(
              thisItem => !newSources.includes(thisItem),
            ),
            ...newSources,
          ];
        }

        if (!Object.keys(updates).length) {
          return;
        }

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

chrome.storage.onChanged.addListener(
  changes => {
    const sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'] =
      changes?.sourcePrioritization?.newValue;
    const contextMenuMode: ExtensionStorageInterface['contextMenuMode'] =
      changes?.contextMenuMode?.newValue;

    if (
      sourcePrioritization
      && !isEqual(sourcePrioritization, store.sourcePrioritization)
    ) {
      store.sourcePrioritization = sourcePrioritization;

      updateSourceItemOrder();
    }

    if (
      contextMenuMode
      && !isEqual(contextMenuMode, store.contextMenuMode)
    ) {
      store.contextMenuMode = contextMenuMode;

      updateSourceItemOrder();
    }
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
      !isEnumValue(type, SourcesEnum)
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

// использую, чтобы закидывать ненужные вложенные пункты
chrome.contextMenus.create({
  id: CONTEXT_MENU_ITEM_NAMES.placeholder,
  title: `${PROJECT_INFO.name} - ${description}`,
  visible: false,
  enabled: false,
});

chrome.contextMenus.create({
  id: CONTEXT_MENU_ITEM_NAMES.root,
  title: `${PROJECT_INFO.name} - ${description}`,
  contexts: ['selection'],
  visible: false,
  onclick: (item, tab) => {
    const tabId = tab?.id;

    if (!tabId) {
      return;
    }

    actionOnClick({
      type: store.sourcePrioritization[0],
      tabId,
    });
  },
});

Object.values(CONTEXT_MENU_SOURCE_ITEMS).forEach(
  thisItem => chrome.contextMenus.create(
    prepareSourceItem({
      type: thisItem,
      parentId: CONTEXT_MENU_ITEM_NAMES.root,
    }),
  ),
);
