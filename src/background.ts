import { description } from '../package.json';
import { CONTEXT_MENU_ITEM_NAMES, EMOJI_REGEXP, PROJECT_INFO, SOURCE_PATH } from './constants';
import { clipboardWrite, stringToCode } from './helpers';

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
    CONTEXT_MENU_ITEM_NAMES.twemoji,
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

    const emoji = value.trim().match(EMOJI_REGEXP)?.[0];

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

chrome.contextMenus.create({
  id: CONTEXT_MENU_ITEM_NAMES.twemoji,
  title: `${PROJECT_INFO.name} - ${description}`,
  contexts: ['selection'],
  visible: false,
  onclick: async (item, tab) => {
    const tabId = tab?.id;

    // компилятор требует
    if (!tabId) {
      return;
    }

    const emoji = tabStore.get(tabId);

    if (!emoji) {
      // TODO: выводить сообщение об ошибке
      // которая не должна возникнуть, но вдруг
      console.log('❌', 'нет emoji в выделении');

      return;
    }

    const link = `${SOURCE_PATH}/${stringToCode({
      value: emoji,
    })}.svg`;

    clipboardWrite({
      value: link,
    });
    // TODO: выводить сообщение об успехе
    console.log('✔', link);
  },
});
