import { ISources, SOURCES } from "@/constants/sources";

export const CONTEXT_MENU_MODES = {
  nested: "nested",
  simple: "simple",
} as const;
export type IContextMenuModes =
  (typeof CONTEXT_MENU_MODES)[keyof typeof CONTEXT_MENU_MODES];

export const COPY_MODES = {
  link: "link",
  image: "image",
} as const;
export type ICopyModes = (typeof COPY_MODES)[keyof typeof COPY_MODES];

export interface IStorageHistoryItem {
  emoji: string;
  source: ISources;
  link: string;
}

export interface IStorageSourceItem {
  type: ISources;
  isDisabled: boolean;
  isNew: boolean;
}

export const copyHistory = storage.defineItem("sync:history", {
  fallback: new Array<IStorageHistoryItem>(),
});

export const commitToHistory = async (value: IStorageHistoryItem) => {
  const history = await copyHistory.getValue();

  copyHistory.setValue([value, ...history.slice(0, 29)]);
};

export const sourcePrioritization = storage.defineItem(
  "sync:sourcePrioritization",
  {
    fallback: Object.keys(SOURCES) as Array<ISources>,
  }
);

export const contextMenuMode = storage.defineItem<IContextMenuModes>(
  "sync:contextMenuMode",
  {
    fallback: CONTEXT_MENU_MODES.nested,
  }
);

export const copyMode = storage.defineItem<ICopyModes>("sync:copyMode", {
  fallback: COPY_MODES.link,
});

export default {
  copyHistory,
  sourcePrioritization,
  contextMenuMode,
  copyMode,
};
