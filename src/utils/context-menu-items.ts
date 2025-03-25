import { ISource, ISources, SOURCE_IDS, SOURCES } from "@/constants/sources";
import {
  CONTEXT_MENU_MODES,
  IContextMenuModes,
} from "@/constants/storage-data";

export const CONTEXT_MENU_ROOT_ITEM_ID = "root";
export const CONTEXT_MENU_SOURCE_ITEM_IDS = SOURCE_IDS;
const CONTEXT_MENU_ITEM_CONTEXTS = ["selection"] as Parameters<
  (typeof browser)["contextMenus"]["create"]
>["0"]["contexts"];
export type IContextMenuItems = ISources | typeof CONTEXT_MENU_ROOT_ITEM_ID;

const createContextMenuItems = async (
  list: Readonly<Array<IContextMenuItems>>
) => {
  for (const thisItem of list) {
    await browser.contextMenus.create({
      id: thisItem,
      title: thisItem,
      contexts: CONTEXT_MENU_ITEM_CONTEXTS,

      ...(thisItem === CONTEXT_MENU_ROOT_ITEM_ID
        ? {
            title: "SVGmoji",
            visible: false,
          }
        : {}),

      ...(CONTEXT_MENU_SOURCE_ITEM_IDS.includes(thisItem as ISources)
        ? {
            title: SOURCES[thisItem as ISources].title,
            parentId: CONTEXT_MENU_ROOT_ITEM_ID,
          }
        : {}),
    });
  }
};

export const setAvailabilityOfContextMenuItems = async (
  items: Readonly<Array<(typeof CONTEXT_MENU_SOURCE_ITEM_IDS)[number]>>,
  isAvailable: boolean
) => {
  if (isAvailable) {
    await createContextMenuItems(items);
  } else {
    for (const thisItem of items) {
      await browser.contextMenus.remove(thisItem);
    }
  }
};

export const setVisibilityOfContextMenuItems = async (
  items: Readonly<Array<IContextMenuItems>> = [CONTEXT_MENU_ROOT_ITEM_ID],
  isVisible: boolean
) => {
  for (const thisItem of items) {
    await browser.contextMenus.update(thisItem, {
      visible: isVisible,
    });
  }
};

export const hideContextMenuItems = async (
  items?: Readonly<Array<IContextMenuItems>>
) => {
  setVisibilityOfContextMenuItems(items, false);
};

export const showContextMenuItems = async (
  items?: Readonly<Array<IContextMenuItems>>
) => {
  setVisibilityOfContextMenuItems(items, true);
};

export const setContextMenuItemTitle = async (value: string) => {
  await browser.contextMenus.update(CONTEXT_MENU_ROOT_ITEM_ID, {
    title: value,
  });
};

export const initializeContextMenus = async (mode: IContextMenuModes) => {
  await browser.contextMenus.removeAll();
  await createContextMenuItems([
    CONTEXT_MENU_ROOT_ITEM_ID,
    ...(mode === CONTEXT_MENU_MODES.nested ? SOURCE_IDS : []),
  ]);
};
