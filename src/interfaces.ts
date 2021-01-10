
export interface ExtensionStorageHistoryItemInterface {
  link: string;
  type: SourcesEnum;
  emoji: string;
}

export interface ExtensionStorageInterface {
  history: Array<ExtensionStorageHistoryItemInterface>;
}

export enum ActionsEnum {
  getSelectionValue,
}

export enum SourcesEnum {
  twemoji = 'twemoji',
  noto = 'noto',
}
