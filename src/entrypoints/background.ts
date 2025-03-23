import { ISources, SOURCES } from "@/constants/sources";
import { COPY_MODES } from "@/constants/storage-data";

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
    const mode = await copyMode.getValue();

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
