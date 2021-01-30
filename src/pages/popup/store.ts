import { ExtensionStorageInterface } from '../../interfaces';

export const popupStore: Pick<
  ExtensionStorageInterface,
  'sources'
  | 'sourcePrioritization'
> = {
  sources: {},
  sourcePrioritization: [],
};
