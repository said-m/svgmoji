import { sendMessage } from "~/utils/messaging";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    let lastSelection = "";

    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection()?.toString().trim();

      if (!selection || selection === lastSelection) return;

      lastSelection = selection;
      sendMessage("textSelected", selection);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      sendMessage("textSelected", lastSelection);
    });

    onMessage("copyEmoji", async ({ data }) => {
      const link = createLinkToSource({
        emoji: data.emoji,
        name: data.source,
      });
      const isCopied = await copy({ value: link, asImage: true });
    });
  },
});
