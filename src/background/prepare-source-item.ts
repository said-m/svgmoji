import { isPlainObject } from '@said-m/common';
import { HISTORY_LENGTH, SOURCES } from '../constants';
import { copy, notify } from '../helpers';
import { ExtensionStorageHistoryItemInterface, ExtensionStorageInterface, SourcesEnum } from '../interfaces';
import favicon from '../static/favicon.ico';
import { findAsset } from './find-asset';
import { store } from './store';

export const prepareSourceItem = ({
  type,
  parentId,
}: {
  type: SourcesEnum;
  parentId: string;
}): chrome.contextMenus.CreateProperties => ({
  id: type,
  parentId,
  title: SOURCES[type].title,
  contexts: ['selection'],
  onclick: (item, tab) => {
    const tabId = tab?.id;

    // компилятор требует
    if (!tabId) {
      return;
    }

    const emoji = store.tabEmoji.get(tabId);

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

    findAsset({
      emoji,
      type,
      typesFallback: Object.values(SourcesEnum).filter(
        thisItem => thisItem !== type,
      ),
      onSuccess: ({
        type,
        link,
        notificationId,
      }) => {
        copy({
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
      },
      onNotFound: ({
        type,
        notificationId,
        sources,
      }) => {
        notify({
          id: notificationId,
          icon: favicon,
          title: `${SOURCES[type].title} - Image not found`,
          message: `Seems like an image for ${emoji ? `"${emoji}"` : 'the emoji'} doesn't exist in the source.`,
          description: [
            sources.next.length
              ? `Trying to get an image from another source: ${SOURCES[sources.next[0]].title}`
              : '',
            sources.previous.length
              ? `Checked sources: ${sources.previous.map(
                thisItem => SOURCES[thisItem].title,
              ).join(', ')}`
              : '',
          ].join(' '),
        });
      },
      onRequestFail: ({
        type,
        link,
        notificationId,
      }) => {
        notify({
          id: notificationId,
          icon: favicon,
          title: 'Image request failed',
          message: `Request url: ${link}. Trying to get an image from another source if possible.`,
        });
      },
    });
  },
});
