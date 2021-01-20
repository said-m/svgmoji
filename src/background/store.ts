
export interface BackgroundStoreInterface {
  tabEmoji: Map<number, string>;
  activeTabId: number;
}

export const store: BackgroundStoreInterface = {
  tabEmoji: new Map(),
  activeTabId: 0,
};
