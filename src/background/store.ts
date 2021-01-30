import { ExtensionStorageInterface } from '../interfaces';

export interface BackgroundStoreInterface {
  tabEmoji: Map<number, string>;
  activeTabId: number;
  sourcePrioritization: ExtensionStorageInterface['sourcePrioritization'];
}

export const store: BackgroundStoreInterface = {
  tabEmoji: new Map(),
  activeTabId: 0,
  sourcePrioritization: [],
};
