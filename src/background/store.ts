import { ContextMenuModesEnum, ExtensionStorageInterface } from '../interfaces';

export interface BackgroundStoreInterface {
  tabEmoji: Map<number, string>;
  activeTabId: number;
  sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'];
  contextMenuMode: ExtensionStorageInterface['contextMenuMode'];
}

export const store: BackgroundStoreInterface = {
  tabEmoji: new Map(),
  activeTabId: 0,
  sourcePrioritization: [],
  contextMenuMode: ContextMenuModesEnum.nested,
};
