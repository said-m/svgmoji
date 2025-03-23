import { ISources } from "@/constants/sources";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    await initializeContextMenus();
  });

  onMessage("textSelected", async ({ data, sender }) => {
    if (!sender.tab) return;

    const emoji = extractEmojiFromText(data);

    if (emoji) {
      enableContextMenuItems();

      setContextMenuItemTitle(`Copy ${emoji} image to clipboard`);
    } else {
      disableContextMenuItems();
    }
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    const emoji = extractEmojiFromText(info.selectionText ?? "");

    if (!(tab?.id && emoji)) return;

    const source = info.menuItemId as ISources;

    const response = await sendMessage(
      "copyEmoji",
      {
        emoji,
        source,
      },
      tab.id
    );

    commitToHistory({
      emoji,
      source,
      link: response,
    });
  });
});
