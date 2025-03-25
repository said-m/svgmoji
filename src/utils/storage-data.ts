import { ISources, SOURCES } from "@/constants/sources";
import {
  CONTEXT_MENU_MODES,
  COPY_MODES,
  IContextMenuModes,
  ICopyModes,
} from "@/constants/storage-data";

export interface IStorageHistoryItem {
  emoji: string;
  source: ISources;
  link: string;
}

export type IStorageSourcePrioritizationItem = Array<ISources>;

export const copyHistory = storage.defineItem("sync:history", {
  fallback: new Array<IStorageHistoryItem>(),
});

export const commitToHistory = async (value: IStorageHistoryItem) => {
  const history = await copyHistory.getValue();

  if (history.at(0)?.link === value.link) {
    return;
  }

  copyHistory.setValue([value, ...history.slice(0, 29)]);
};

export const sourcePrioritization = storage.defineItem(
  "sync:sourcePrioritization",
  {
    fallback: Object.keys(SOURCES) as IStorageSourcePrioritizationItem,
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
