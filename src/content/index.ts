import { extractEmoji } from "../helpers";

let lastSelection = "";

document.addEventListener("selectionchange", () => {
  const selection = window.getSelection()?.toString().trim();
  if (!selection || selection === lastSelection) return;

  lastSelection = selection;
  const emoji = extractEmoji(selection);

  // Always send message to update menu state
  chrome.runtime.sendMessage({
    type: "SELECTION_CHANGE",
    text: emoji || "", // Send empty string if no emoji found
  });
});

// Modern clipboard handling
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "COPY_IMAGE") {
    handleImageCopy(message.url)
      .then(sendResponse)
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }
});

async function handleImageCopy(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Use modern Clipboard API
    const clipboardItem = new ClipboardItem({
      [blob.type]: blob,
    });
    await navigator.clipboard.write([clipboardItem]);

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to copy image: ${error}`);
  }
}
