
document.addEventListener(
  'selectionchange',
  () => {
    chrome.runtime.sendMessage({
      value: window.getSelection()?.toString(),
    });
  },
);
