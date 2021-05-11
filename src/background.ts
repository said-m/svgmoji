import { getKeys, isEnumValue } from '@said-m/common';
import isEqual from 'lodash.isequal';
import { description } from '../package.json';
import { parseSelection } from './background/parse-selection';
import { actionOnClick, prepareSourceItem } from './background/prepare-source-item';
import { store } from './background/store';
import { updateRootItem } from './background/update-root-item';
import { updateSourceItemOrder } from './background/update-source-item-order';
import { CONTEXT_MENU_ITEM_NAMES, CONTEXT_MENU_SOURCE_ITEMS, NOTIFICATION_TYPE_ID_JOINER, PROJECT_INFO } from './constants';
import { copy, createLink, extractEmoji, notify } from './helpers';
import { CopyModesEnum, ExtensionStorageInterface, ExtensionStorageSourceItemInterface, SourcesEnum } from './interfaces';

chrome.runtime.onInstalled.addListener(
  details => {
    const currentVersion = chrome.runtime.getManifest().version;
    const previousVersion = details.previousVersion;
    // const reason = details.reason;
    const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
      'sources',
      'sourcePrioritization',
      'contextMenuMode',
      'copyMode',
    ];
    chrome.storage.sync.get(
      requiredStorageKeys,
      (result: Partial<ExtensionStorageInterface>) => {
        const sources: ExtensionStorageInterface['sources'] = result.sources || {};
        store.sourcePrioritization = result.sourcePrioritization || [];
        store.contextMenuMode = result.contextMenuMode
          || store.contextMenuMode;
        store.copyMode = result.copyMode
          || store.copyMode;

        updateSourceItemOrder();

        const updates: Partial<ExtensionStorageInterface> = {};

        if (!result.contextMenuMode) {
          updates.contextMenuMode = store.contextMenuMode;
        }

        if (!result.copyMode) {
          updates.copyMode = store.copyMode;
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
    const copyMode: ExtensionStorageInterface['copyMode'] =
      changes?.copyMode?.newValue;

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

    if (
      copyMode
      && !isEqual(copyMode, store.copyMode)
    ) {
      store.copyMode = copyMode;
    }
  },
);

// Удаление мусора из хранилища
chrome.tabs.onRemoved.addListener(
  tabId => store.tabEmoji.delete(tabId),
);

const setActiveTab = ({
  tabId,
}: {
  tabId: number,
}) => {
  store.activeTabId = tabId;

  updateRootItem({
    tabId: store.activeTabId,
  });
};

// Обновление меню при переключении между вкладками
// так как у них могут быть оставаться активными выделения
chrome.tabs.onActivated.addListener(
  tab => setActiveTab({
    tabId: tab.tabId,
  }),
);

// Трэкаю переключение переключение между окнами,
// чтобы актуализировать активную вкладку
// и таргетиться на выделения на ней
chrome.windows.onFocusChanged.addListener(
  windowId => windowId > -1
    && chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      ([tab]) => setActiveTab({
        tabId: tab.id,
      }),
    ),
);

// Трекинг выделяемого содержимого
chrome.runtime.onMessage.addListener(
  (message, sender) => {
    if (message.name === 'selectionChange') {
      const tabId = sender.tab?.id;

      // Без привязки выделения к вкладке - работать не вариант
      if (!tabId) {
        return;
      }

      const value = message?.value;

      parseSelection({
        tabId,
        value: typeof value === 'string'
          ? value
          : '',
      });
    }
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
      asImage: store.copyMode === CopyModesEnum.image,
      isPage: false,
    }).catch(
      (error) => notify({
        title: 'Ошибка обработки',
        message: error,
        icon: '',
      }),
    );
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
