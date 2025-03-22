import { HISTORY_LENGTH, SOURCES } from "@/constants";
import { CopyModes, ContextMenuModes, HistoryItem, Sources } from "@/types";
import { copy } from "@/utils/copy";
import { extractEmoji } from "../helpers";

// Use structured state management
const state = {
  tabs: new Map<number, string>(),
  settings: {
    sourcePrioritization: [] as Sources[],
    contextMenuMode: ContextMenuModes.nested,
    copyMode: CopyModes.link,
  },
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  await initializeContextMenus();
  await loadSettings();
});

// Handle tab updates
chrome.tabs.onActivated.addListener(({ tabId }) => {
  updateContextMenuForTab(tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  state.tabs.delete(tabId);
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "SELECTION_CHANGE" && sender.tab?.id) {
    const emoji = extractEmoji(message.text);
    if (emoji) {
      state.tabs.set(sender.tab.id, emoji);
      updateContextMenuForTab(sender.tab.id);
    }
  }
});

// Context menu handling
async function initializeContextMenus() {
  await chrome.contextMenus.removeAll();

  await chrome.contextMenus.create({
    id: "root",
    title: "SVGMoji",
    contexts: ["selection"],
    visible: false,
  });

  for (const [sourceKey, source] of Object.entries(SOURCES)) {
    await chrome.contextMenus.create({
      id: sourceKey,
      title: source.title,
      parentId: "root",
      contexts: ["selection"],
    });
  }
}

// Settings management
async function loadSettings() {
  const stored = await chrome.storage.sync.get([
    "sourcePrioritization",
    "contextMenuMode",
    "copyMode",
  ]);

  state.settings = {
    sourcePrioritization: stored.sourcePrioritization || [],
    contextMenuMode: stored.contextMenuMode || ContextMenuModes.nested,
    copyMode: stored.copyMode || CopyModes.link,
  };
}

// Context menu click handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || !state.tabs.has(tab.id)) return;

  const emoji = state.tabs.get(tab.id)!;
  const sourceType = info.menuItemId as Sources;

  try {
    await handleEmojiAction(emoji, sourceType);
  } catch (error) {
    console.error("Failed to handle emoji:", error);
  }
});

// Helper functions
function updateContextMenuForTab(tabId: number) {
  const emoji = state.tabs.get(tabId);
  chrome.contextMenus.update("root", {
    visible: Boolean(emoji),
    title: emoji ? `Copy "${emoji}" as emoji` : "SVGMoji",
  });
}

async function handleEmojiAction(emoji: string, sourceType: Sources) {
  const url = createEmojiUrl(emoji, sourceType);

  await copy({
    value: url,
    asImage: state.settings.copyMode === CopyModes.image,
  });

  await updateHistory({
    emoji,
    type: sourceType,
    link: url,
  });
}

// Вспомогательные функции
function createEmojiUrl(emoji: string, sourceType: Sources): string {
  const source = SOURCES[sourceType];
  const code = getEmojiCode(emoji);
  return `${source.path}/${source.prefix}${code}${source.postfix}`;
}

async function handleCopy(url: string, emoji: string, sourceType: Sources) {
  await copy({
    value: url,
    asImage: state.settings.copyMode === CopyModes.image,
  });

  // Обновление истории
  const { history = [] } = await chrome.storage.sync.get("history");
  const newHistory: HistoryItem = { emoji, type: sourceType, link: url };

  await chrome.storage.sync.set({
    history: [...history, newHistory].slice(-HISTORY_LENGTH),
  });
}
