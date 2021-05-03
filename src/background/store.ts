import { ContextMenuModesEnum, CopyModesEnum, ExtensionStorageInterface } from '../interfaces';

export interface BackgroundStoreInterface {
  tabEmoji: Map<number, string>;
  activeTabId: number;
  sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'];
  contextMenuMode: ExtensionStorageInterface['contextMenuMode'];
  copyMode: ExtensionStorageInterface['copyMode'];
}

export const store: BackgroundStoreInterface = {
  tabEmoji: new Map(),
  activeTabId: 0,
  sourcePrioritization: [],
  contextMenuMode: ContextMenuModesEnum.nested,
  copyMode: CopyModesEnum.link,
};
