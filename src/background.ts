import { isPlainObject } from '@said-m/common';
import { description } from '../package.json';
import { CONTEXT_MENU_ITEM_NAMES, HISTORY_LENGTH, NOTIFICATION_TYPE_ID_JOINER, PROJECT_INFO, SOURCES } from './constants';
import { clipboardWrite, getEmojiFromString, isEnumItem, linkForEmoji, notify } from './helpers';
import { ExtensionStorageHistoryItemInterface, ExtensionStorageInterface, SourcesEnum } from './interfaces';
import favicon from './static/favicon.ico';

const tabStore: Map<number, string> = new Map();
let activeTabId: number;

const updateContextMenuItem = ({
  tabId,
}: {
  tabId: number;
}) => {
  // Контекстное меню должно быть актуально для активной вкладки
  if (activeTabId !== tabId) {
    return;
  }

  const emoji = tabStore.get(tabId);

  chrome.contextMenus.update(
    CONTEXT_MENU_ITEM_NAMES.root,
    emoji
      ? {
        visible: true,
        title: `${PROJECT_INFO.name} - generate link to image for "${emoji}"`,
      }
      : {
        visible: false,
      },
  );
};

// Удаление мусора из хранилища
chrome.tabs.onRemoved.addListener(
  tabId => tabStore.delete(tabId),
);

// Обновление меню при переключении между вкладками
// так как у них могут быть активны выделения
chrome.tabs.onActivated.addListener(
  tab => {
    activeTabId = tab.tabId;

    updateContextMenuItem({
      tabId: activeTabId,
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

    if (!activeTabId) {
      activeTabId = tabId;
    }

    const value = request?.value;

    // Нет выделения - тож результат
    if (typeof value !== 'string') {
      tabStore.set(tabId, '');

      return updateContextMenuItem({
        tabId,
      });
    }

    const emoji = getEmojiFromString(value);

    // Отсутствие эмодзи в выделении - аналогично отствию выделения
    if (!emoji) {
      tabStore.set(tabId, '');

      return updateContextMenuItem({
        tabId,
      });
    }

    // Профит!
    tabStore.set(tabId, emoji);
    updateContextMenuItem({
      tabId,
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
      || !getEmojiFromString(emoji)
    ) {
      return;
    }

    clipboardWrite({
      value: linkForEmoji({
        emoji,
        type,
      }),
    });
  },
);

const prepareSourceContextMenuItem = ({
  type,
  parentId,
}: {
  type: SourcesEnum,
  parentId: string;
}): chrome.contextMenus.CreateProperties => ({
  id: type,
  parentId,
  title: SOURCES[type].title,
  contexts: ['selection'],
  onclick: async (item, tab) => {
    const tabId = tab?.id;

    // компилятор требует
    if (!tabId) {
      return;
    }

    const emoji = tabStore.get(tabId);

    // Контекстное меню должно быть доступно только при наличии emoji,
    // но мало ли чего вдруг
    if (!emoji) {
      notify({
        icon: favicon,
        title: `Task execution error`,
        message: 'No emoji to copy to clipboard',
      });

      return;
    }

    const link = linkForEmoji({
      emoji,
      type,
    });

    const notificationId = [type, emoji].join(NOTIFICATION_TYPE_ID_JOINER);

    try {
      const response = await fetch(link, {
        method: 'HEAD',
      });

      if (!response.ok) {
        notify({
          icon: favicon,
          title: `Image not found`,
          message: `Seems like an image for ${emoji ? `"${emoji}"` : 'the emoji'} doesn't exist in the source`,
        });

        return;
      }

      clipboardWrite({
        value: link,
      });
      notify({
        id: notificationId,
        icon: link,
        title: `Link saved to clipboard`,
        message: `Now you can paste ${emoji ? `"${emoji}"` : 'emoji'} as a link to image!`,
      });

      const requiredStorageKeys: Array<keyof ExtensionStorageInterface> = [
        'history',
      ];
      const newItem: ExtensionStorageHistoryItemInterface = {
        type,
        emoji,
        link,
      };

      chrome.storage.sync.get(
        requiredStorageKeys,
        (result: Partial<ExtensionStorageInterface>) => {
          const currentHistory = result.history || [];

          const updates: Partial<ExtensionStorageInterface> = {
            history: [
              ...currentHistory.filter(
                thisItem => !isPlainObject(thisItem)
                  || thisItem.link !== newItem.link,
              ),
              newItem,
            ].slice(-HISTORY_LENGTH),
          };

          chrome.storage.sync.set(updates);
        },
      );
    } catch (error) {
      notify({
        id: notificationId,
        icon: favicon,
        title: 'Image request failed',
        message: `Request url: ${link}`,
      });
    }
  },
});

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
    prepareSourceContextMenuItem({
      type: thisItem,
      parentId: CONTEXT_MENU_ITEM_NAMES.root,
    }),
  ),
);
