import { description } from '../package.json';
import { parseSelection } from './background/parse-selection';
import { prepareSourceItem } from './background/prepare-source-item';
import { store } from './background/store';
import { updateRootItem } from './background/update-root-item';
import { CONTEXT_MENU_ITEM_NAMES, NOTIFICATION_TYPE_ID_JOINER, PROJECT_INFO } from './constants';
import { copy, createLink, extractEmoji, isEnumItem } from './helpers';
import { SourcesEnum } from './interfaces';

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
