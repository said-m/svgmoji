export enum Sources {
  twemoji = "twemoji",
  noto = "noto",
  openmoji = "openmoji",
  emojione = "emojione",
  joypixels = "joypixels",
}

export enum CopyModes {
  link = "link",
  image = "image",
}

export enum ContextMenuModes {
  nested = "nested",
  simple = "simple",
}

export interface HistoryItem {
  link: string;
  type: Sources;
  emoji: string;
}

export interface SourceItem {
  type: Sources;
  isDisabled: boolean;
  isNew: boolean;
}

export interface AppState {
  history: HistoryItem[];
  sources: Partial<Record<Sources, SourceItem>>;
  sourcePrioritization: Sources[];
  contextMenuMode: ContextMenuModes;
  copyMode: CopyModes;
}
