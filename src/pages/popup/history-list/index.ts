import { isPlainObject } from '@said-m/common';
import { copy } from '../../../helpers';
import { CopyModesEnum, ExtensionStorageHistoryItemInterface } from '../../../interfaces';
import { popupStore } from '../store';
import styles from './history-list.module.scss';

export const createHistoryList = ({
  items,
}: {
  items: Array<ExtensionStorageHistoryItemInterface>,
}): Node => {
  const componentEl = document.createElement('div');
  componentEl.classList.add(styles.component);

  !items.length
    ? componentEl.append('history is empty')
    : componentEl.append(...[
      ...items,
    ].reverse().map(
      thisItem => {
        if (!isPlainObject(thisItem)) {
          return '';
        }

        const itemEl = document.createElement('button');
        itemEl.classList.add(styles.item);
        itemEl.style.backgroundImage = `url("${thisItem.link}")`;
        itemEl.tabIndex = 0;

        itemEl.onclick = () => {
          copy({
            value: thisItem.link,
            asImage: popupStore.copyMode === CopyModesEnum.image,
          }).catch(
            (error) => console.error(`Ошибка при копировании в буфер обмена: ${error}`),
          );
        };

        return itemEl;
      },
    ));

  return componentEl;
};
