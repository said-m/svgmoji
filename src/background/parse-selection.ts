import { extractEmoji } from '../helpers';
import { store } from './store';
import { updateRootItem } from './update-root-item';

export const parseSelection = ({
  tabId,
  value,
}: {
  tabId: number;
  value: string;
}) => {
  if (!store.activeTabId) {
    store.activeTabId = tabId;
  }

  const emoji = extractEmoji(value) || '';

  store.tabEmoji.set(tabId, emoji);
  updateRootItem({
    tabId,
  });
};
