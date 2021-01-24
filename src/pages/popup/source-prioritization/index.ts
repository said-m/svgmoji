import { SOURCES } from '../../../constants';
import { ExtensionStorageInterface } from '../../../interfaces';
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
    ...[
      ...lists[CreateSourcePrioritizationListsEnum.enabled],
    ].reverse().map(
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

  return componentEl;
};
