import { CONTEXT_MENU_ITEM_NAMES, PROJECT_INFO } from '../constants';
import { store } from './store';

export const updateRootItem = ({
  tabId,
}: {
  tabId: number;
}) => {
  // Контекстное меню должно быть актуально для активной вкладки
  if (store.activeTabId !== tabId) {
    return;
  }

  const emoji = store.tabEmoji.get(tabId);

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
