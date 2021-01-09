import { clipboardWrite, linkForEmoji, notify } from '../../../helpers';
import styles from './history-list.module.scss';

export const createHistoryList = ({
  items,
}: {
  items: Array<string>,
}): Node => {
  const componentEl = document.createElement('div');
  componentEl.classList.add(styles.component);

  !items.length
    ? componentEl.append('history is empty')
    : componentEl.append(...[
      ...items,
    ].reverse().map(
      thisItem => {
        const itemEl = document.createElement('button');
        itemEl.classList.add(styles.item);
        itemEl.innerText = thisItem;
        itemEl.tabIndex = 0;

        itemEl.onclick = () => {
          const link = linkForEmoji(thisItem);

          clipboardWrite({
            value: link,
          });

          notify({
            id: thisItem,
            icon: link,
            title: `Link saved to clipboard`,
            message: `Now you can paste ${thisItem
              ? `"${thisItem}"`
              : 'emoji'
            } as a link to image!`,
          });
        };

        return itemEl;
      },
    ));

  return componentEl;
};
