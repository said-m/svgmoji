
export interface ExtensionStorageHistoryItemInterface {
  link: string;
  type: SourcesEnum;
  emoji: string;
}

export interface ExtensionStorageSourceItemInterface {
  type: SourcesEnum;
  isDisabled: boolean;
  isNew: boolean;
}

export interface ExtensionStorageInterface {
  history: Array<ExtensionStorageHistoryItemInterface>;
  sources: Partial<Record<
    SourcesEnum,
    ExtensionStorageSourceItemInterface
  >>;
  sourcePrioritization: Array<SourcesEnum>;
}

export enum ActionsEnum {
  getSelectionValue,
}

export enum SourcesEnum {
  twemoji = 'twemoji',
  noto = 'noto',
}
