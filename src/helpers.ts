import { ObjectInterface } from '@said-m/common/dist/interfaces';
import { EMOJI_REGEXP, SOURCES } from './constants';
import { SourcesEnum } from './interfaces';

export const getEmojiFromString = (value: string) => value.trim().match(EMOJI_REGEXP)?.[0];

export const stringToCode = ({
  value,
  joiner = '-',
}: {
  value: string,
  joiner?: string,
}) => {
  const result = [];
  let p = 0;

  for (let thisIndex = 0; thisIndex < value.length; thisIndex++) {
    const char = value.charCodeAt(thisIndex);

    if (p) {
      result.push((0x10000 + ((p - 0xD800) << 10) + (char - 0xDC00)).toString(16));
      p = 0;
    } else if (0xD800 <= char && char <= 0xDBFF) {
      p = char;
    } else {
      result.push(char.toString(16));
    }
  }

  return result.join(joiner);
};

export const linkForEmoji = ({
  emoji,
  type,
}: {
  emoji: string;
  type: SourcesEnum;
}) => `${SOURCES[type].path}/${SOURCES[type].prefix}${stringToCode({
  value: emoji,
  joiner: SOURCES[type].joiner,
})}${SOURCES[type].postfix}`;

export const clipboardWrite = ({
  value,
}: {
  value: string;
}) => {
  const copyFrom = document.createElement('textarea');
  copyFrom.textContent = value;

  document.body.appendChild(copyFrom);
  copyFrom.select();

  document.execCommand('copy');

  copyFrom.blur();
  document.body.removeChild(copyFrom);
};

export const notify = ({
  id = '',
  icon,
  title,
  message,
  description,
}: {
  id?: string;
  icon: string;
  title: string;
  message: string;
  description?: string;
}) => {
  // удаляю предыдущее аналогичное оповещение,
  // чтобы chrome (ну или ос) не скрывало его
  chrome.notifications.clear(id);

  chrome.notifications.create(id, {
    type: 'basic',
    silent: true,
    iconUrl: icon,
    title,
    message,
    contextMessage: description,
    isClickable: !!id,
  });
};

export const isEnumItem = <
  Enumerable extends ObjectInterface,
  Item extends (string | number)
>(
  item: Item,
  enumerable: Enumerable,
): item is Extract<Enumerable[keyof Enumerable], Item> => Object.values(enumerable).includes(item);
