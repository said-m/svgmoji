import { isEnumValue } from '@said-m/common';
import { ContextMenuModesEnum, ExtensionStorageInterface } from '../../../interfaces';
import styles from './context-menu-mode.module.scss';

export const createContextMenuMode = ({
  mode,
}: {
  mode: ContextMenuModesEnum;
}) => {
  const componentEl = document.createElement('fieldset');
  componentEl.classList.add(styles.component);

  const onChangeRadio: GlobalEventHandlers['onchange'] = event => {
    const radioEl = event.currentTarget;

    if (!(radioEl instanceof HTMLInputElement)) {
      return;
    }

    const value = radioEl.value;

    if (!isEnumValue(value, ContextMenuModesEnum)) {
      return;
    }

    const updates: Partial<ExtensionStorageInterface> = {
      contextMenuMode: value,
    };

    console.log('Обновление настроек контекстного меню:', value);
    chrome.storage.sync.set(updates);
  };

  const createRadio = ({
    name,
    value,
    title,
    isChecked,
    onChange,
  }: {
    name: string;
    value: string;
    title: string;
    isChecked: boolean;
    onChange: GlobalEventHandlers['onchange'];
  }) => {
    const labelEl = document.createElement('label');
    labelEl.classList.add(styles.option);

    const inputEl = document.createElement('input');
    inputEl.type = 'radio';
    inputEl.name = name;
    inputEl.value = value;
    inputEl.checked = isChecked;
    inputEl.onchange = onChange;

    const titleEl = document.createElement('p');
    titleEl.innerText = title;

    labelEl.append(
      inputEl,
      titleEl,
    );

    return labelEl;
  };

  const nestedListRadio = createRadio({
    name: 'contextMenuMode',
    value: ContextMenuModesEnum.nested,
    title: 'Submenu with a list of sources',
    isChecked: mode === ContextMenuModesEnum.nested,
    onChange: onChangeRadio,
  });

  const simpleRadio = createRadio({
    name: 'contextMenuMode',
    value: ContextMenuModesEnum.simple,
    title: 'Action button in root menu (use source priority settings)',
    isChecked: mode === ContextMenuModesEnum.simple,
    onChange: onChangeRadio,
  });

  componentEl.append(
    nestedListRadio,
    simpleRadio,
  );

  return componentEl;
};
