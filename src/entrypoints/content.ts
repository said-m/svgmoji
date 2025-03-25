import { COPY_MODES } from "@/constants/storage-data";
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
      try {
        const link = createLinkToSource({
          emoji: data.emoji,
          name: data.source,
        });

        const copyResult = await copy({
          value: link,
          asImage: data.mode === COPY_MODES.image,
        });

        const base64Url =
          copyResult instanceof Blob
            ? await convertPngToBase64(copyResult)
            : undefined;

        return {
          link,
          base64Url,
        };
      } catch (error) {
        throw new Error(`Failed to copy emoji: ${error}`);
      }
    });
  },
});
