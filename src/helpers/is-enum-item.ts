import { ObjectInterface } from '@said-m/common/dist/interfaces';

export const isEnumItem = <
  Enumerable extends ObjectInterface,
  Item extends (string | number)
>(
  item: Item,
  enumerable: Enumerable,
): item is Extract<Enumerable[keyof Enumerable], Item> => Object.values(enumerable).includes(item);
