
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
  contextMenuMode: ContextMenuModesEnum;
  copyMode: CopyModesEnum;
}

export enum ActionsEnum {
  getSelectionValue,
}

export enum SourcesEnum {
  twemoji = 'twemoji',
  noto = 'noto',
  openmoji = 'openmoji',
  emojione = 'emojione',
  joypixels = 'joypixels',
}

export enum ContextMenuModesEnum {
  nested = 'nested',
  simple = 'simple',
}

export enum CopyModesEnum {
  link = 'link',
  image = 'image',
}
