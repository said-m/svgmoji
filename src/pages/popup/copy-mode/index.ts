import { isEnumValue } from '@said-m/common';
import { CopyModesEnum, ExtensionStorageInterface } from '../../../interfaces';
import styles from './copy-mode.module.scss';

export const createCopyMode = ({
  mode,
}: {
  mode: CopyModesEnum;
}) => {
  const componentEl = document.createElement('fieldset');
  componentEl.classList.add(styles.component);

  const onChangeRadio: GlobalEventHandlers['onchange'] = event => {
    const radioEl = event.currentTarget;

    if (!(radioEl instanceof HTMLInputElement)) {
      return;
    }

    const value = radioEl.value;

    if (!isEnumValue(value, CopyModesEnum)) {
      return;
    }

    const updates: Partial<ExtensionStorageInterface> = {
      copyMode: value,
    };

    console.log('Обновление настроек режима копирования:', value);
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

  const linkRadio = createRadio({
    name: 'CopyMode',
    value: CopyModesEnum.link,
    title: 'A link to an image',
    isChecked: mode === CopyModesEnum.link,
    onChange: onChangeRadio,
  });

  const imageRadio = createRadio({
    name: 'CopyMode',
    value: CopyModesEnum.image,
    title: 'An image',
    isChecked: mode === CopyModesEnum.image,
    onChange: onChangeRadio,
  });

  componentEl.append(
    linkRadio,
    imageRadio,
  );

  return componentEl;
};
