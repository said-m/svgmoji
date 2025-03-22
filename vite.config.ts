import { defineConfig, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import fs from "fs";
import { viteStaticCopy } from "vite-plugin-static-copy";

const manifestPlugin = {
  name: "manifest-plugin",
  writeBundle() {
    if (!fs.existsSync("dist")) {
      fs.mkdirSync("dist", { recursive: true });
    }
    // Копируем manifest.json в dist
    const manifest = JSON.parse(
      fs.readFileSync("./src/manifest.json", "utf-8")
    );
    // manifest.action.default_popup = "popup.html";
    fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));
  },
};

// Target-specific configs
const targetConfigs = {
  popup: {
    build: {
      rollupOptions: {
        input: {
          popup: resolve(__dirname, "src/popup/index.html"),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "chunks/[name].[hash].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
  },
  background: {
    build: {
      rollupOptions: {
        input: resolve(__dirname, "src/background/index.ts"),
        output: {
          entryFileNames: "background.js",
          format: "es",
        },
      },
    },
  },
  content: {
    build: {
      rollupOptions: {
        input: resolve(__dirname, "src/content/index.ts"),
        output: {
          entryFileNames: "content-script.js",
          format: "iife",
        },
      },
    },
  },
} satisfies Record<string, UserConfig>;

export default defineConfig(({ mode }) => {
  const target = process.env.BUILD_TARGET || "popup";
  const config = targetConfigs[target];

  return {
    ...config,
    plugins: [
      vue(),
      manifestPlugin,
      viteStaticCopy({
        targets: [{ src: "src/static/*", dest: "assets/" }],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      ...config.build,
      minify: mode === "production",
      sourcemap: mode === "development",
      // Важно: не очищать папку при каждой сборке
      emptyOutDir: false,
      // Гарантируем создание папки dist
      outDir: "dist",
    },
  };
});
