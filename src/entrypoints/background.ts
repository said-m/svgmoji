import { ISources, SOURCES } from "@/constants/sources";
import { CONTEXT_MENU_MODES, COPY_MODES } from "@/constants/storage-data";
import { IContextMenuItems } from "@/utils/context-menu-items";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    const mode = await contextMenuMode.getValue();

    await initializeContextMenus(mode);
  });

  contextMenuMode.watch(async (mode) => {
    setAvailabilityOfContextMenuItems(
      CONTEXT_MENU_SOURCE_ITEM_IDS,
      mode === CONTEXT_MENU_MODES.nested
    );
  });

  onMessage("textSelected", async ({ data, sender }) => {
    if (!sender.tab) return;

    const emoji = extractEmojiFromText(data);

    if (emoji) {
      showContextMenuItems();

      setContextMenuItemTitle(`Copy ${emoji} image to clipboard`);
    } else {
      hideContextMenuItems();
    }
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    const emoji = extractEmojiFromText(info.selectionText ?? "");

    if (!(tab?.id && emoji)) return;

    const mode = await copyMode.getValue();
    const prioritization = await sourcePrioritization.getValue();

    const itemId = info.menuItemId as IContextMenuItems;
    const source =
      itemId === CONTEXT_MENU_ROOT_ITEM_ID ? prioritization.at(0)! : itemId;

    const { link, base64Url } = await sendMessage(
      "copyEmoji",
      {
        emoji,
        source,
        mode,
      },
      tab.id
    );

    commitToHistory({
      emoji,
      source,
      link,
    });

    notify({
      id: link,
      title: `${
        mode === COPY_MODES.link ? "Link to emoji" : "Image of emoji"
      } "${emoji}" copied to clipboard`,
      message: `Source: ${SOURCES[source].title}`,
      icon:
        base64Url ?? (mode === COPY_MODES.link ? "/link.png" : "/icon/128.png"),
    });
  });
});
