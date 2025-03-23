import { ISource, ISources, SOURCES } from "@/constants/sources";

const CONTEXT_MENU_ROOT_ITEM_ID = "root";
const CONTEXT_MENU_ITEM_CONTEXTS = ["selection"] as Parameters<
  (typeof browser)["contextMenus"]["create"]
>["0"]["contexts"];

const createContextMenuItems = async () => {
  await browser.contextMenus.create({
    id: CONTEXT_MENU_ROOT_ITEM_ID,
    title: "SVGMoji",
    contexts: CONTEXT_MENU_ITEM_CONTEXTS,
    visible: false,
  });

  for (const [sourceKey, source] of Object.entries(SOURCES) as Array<
    [ISources, ISource]
  >) {
    await browser.contextMenus.create({
      id: sourceKey,
      title: source.title,
      parentId: CONTEXT_MENU_ROOT_ITEM_ID,
      contexts: CONTEXT_MENU_ITEM_CONTEXTS,
    });
  }
};

export const disableContextMenuItems = async () => {
  await browser.contextMenus.update(CONTEXT_MENU_ROOT_ITEM_ID, {
    visible: false,
  });
};

export const enableContextMenuItems = async () => {
  await browser.contextMenus.update(CONTEXT_MENU_ROOT_ITEM_ID, {
    visible: true,
  });
};

export const setContextMenuItemTitle = async (value: string) => {
  await browser.contextMenus.update(CONTEXT_MENU_ROOT_ITEM_ID, {
    title: value,
  });
};

export const initializeContextMenus = async () => {
  await browser.contextMenus.removeAll();
  await createContextMenuItems();
};
