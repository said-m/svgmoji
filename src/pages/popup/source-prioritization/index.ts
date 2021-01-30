import Sortable from 'sortablejs';
import { SOURCES } from '../../../constants';
import { isEnumItem } from '../../../helpers';
import { ExtensionStorageInterface, SourcesEnum } from '../../../interfaces';
import { popupStore } from '../store';
import { CreateSourcePrioritizationItemAttrsEnum, CreateSourcePrioritizationListsEnum, CreateSourcePrioritizationListsInterface } from './interfaces';
import styles from './source-prioritization.module.scss';

export const createSourcePrioritization = ({
  items,
  order,
}: {
  items: ExtensionStorageInterface['sources'],
  order: ExtensionStorageInterface['sourcePrioritization'],
}): Node => {
  const componentEl = document.createElement('ol');
  componentEl.classList.add(styles.component);

  const lists: CreateSourcePrioritizationListsInterface = {
    [CreateSourcePrioritizationListsEnum.enabled]: [],
    [CreateSourcePrioritizationListsEnum.disabled]: [],
  };

  order.forEach(
    thisItemName => {
      const item = items[thisItemName];

      if (!item) {
        return;
      }

      const itemList: keyof CreateSourcePrioritizationListsInterface = item.isDisabled
        ? CreateSourcePrioritizationListsEnum.disabled
        : CreateSourcePrioritizationListsEnum.enabled;

      lists[itemList].push(item);
    },
  );

  if (!lists[CreateSourcePrioritizationListsEnum.enabled]) {
    componentEl.append('no sources available');

    return componentEl;
  }

  componentEl.append(
    ...lists[CreateSourcePrioritizationListsEnum.enabled].map(
      thisItem => {
        const itemEl = document.createElement('li');
        itemEl.dataset[CreateSourcePrioritizationItemAttrsEnum.dataId] = thisItem.type;
        itemEl.innerText = SOURCES[thisItem.type].title;

        itemEl.classList.add(styles.item);
        if (thisItem.isDisabled) {
          itemEl.classList.add(styles.itemDisabled);
        }
        if (thisItem.isNew) {
          itemEl.classList.add(styles.itemNew);
        }

        return itemEl;
      },
    ),
  );

  Sortable.create(
    componentEl,
    {
      group: 'enabledSources',
      sort: true,
      invertSwap: true,
      animation: 50,
      onUpdate: event => {
        const updatedOrder: ExtensionStorageInterface['sourcePrioritization'] = [];

        Array.from(event.to.children).forEach(
          thisItem => {
            if (!(thisItem instanceof HTMLElement)) {
              return;
            }

            const itemName = thisItem.dataset[CreateSourcePrioritizationItemAttrsEnum.dataId];

            if (
              !itemName
              || !isEnumItem(itemName, SourcesEnum)
            ) {
              return;
            }

            updatedOrder.push(itemName);

            const sourceItem = popupStore.sources[itemName];

            if (!sourceItem) {
              return;
            }

            popupStore.sources[itemName] = {
              ...sourceItem,
              isNew: false,
            };

            thisItem.classList.remove(styles.itemNew);
          },
        );

        const updates: Partial<ExtensionStorageInterface> = {
          sourcePrioritization: updatedOrder,
          sources: popupStore.sources,
        };

        popupStore.sourcePrioritization = updatedOrder;

        console.log('Обновление приоритетов источников:', updatedOrder);
        chrome.storage.sync.set(updates);
      },
    },
  );

  return componentEl;
};
