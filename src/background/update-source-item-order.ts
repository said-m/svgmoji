import { CONTEXT_MENU_ITEM_NAMES, CONTEXT_MENU_SOURCE_ITEMS } from '../constants';
import { store } from './store';

export const updateSourceItemOrder = () => {
  store.sourcePrioritization.forEach(
    thisItem => chrome.contextMenus.update(
      thisItem,
      {
        parentId: CONTEXT_MENU_ITEM_NAMES.root,
        visible: true,
      },
    ),
  );

  Object.values(CONTEXT_MENU_SOURCE_ITEMS).forEach(
    thisItem => !store.sourcePrioritization.includes(thisItem)
      ? chrome.contextMenus.update(
        thisItem,
        {
          parentId: CONTEXT_MENU_ITEM_NAMES.root,
          visible: false,
        },
      )
      : undefined,
  );
};
