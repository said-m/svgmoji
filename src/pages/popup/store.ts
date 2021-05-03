import { ContextMenuModesEnum, CopyModesEnum, ExtensionStorageInterface } from '../../interfaces';

export const popupStore: Pick<
  ExtensionStorageInterface,
  'sources'
  | 'sourcePrioritization'
  | 'contextMenuMode'
  | 'copyMode'
> = {
  sources: {},
  sourcePrioritization: [],
  contextMenuMode: ContextMenuModesEnum.nested,
  copyMode: CopyModesEnum.link,
};
