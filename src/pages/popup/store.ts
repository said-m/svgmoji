import { ContextMenuModesEnum, ExtensionStorageInterface } from '../../interfaces';

export const popupStore: Pick<
  ExtensionStorageInterface,
  'sources'
  | 'sourcePrioritization'
  | 'contextMenuMode'
> = {
  sources: {},
  sourcePrioritization: [],
  contextMenuMode: ContextMenuModesEnum.nested,
};
