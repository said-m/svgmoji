import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-vue"],
  srcDir: "src",
  manifest: {
    permissions: [
      "contextMenus",
      "storage",
      "activeTab",
      "clipboardWrite",
      "notifications",
    ],
  },
  vite: () => {
    return {
      server: {
        headers: {
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
        },
      },
    };
  },
});
