import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue(), svgLoader(), quasar({sassVariables: 'src/sheet/quasar/quasar-variables.sass'}), vueJsx()],
  base:
    mode === "production"
      ? `https://storage.googleapis.com/beacon-community-sheets/irosworn-starforged/`
      : "/",
  build: {
    emptyOutDir: true,
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        sheet: "src/main.ts"
      },
      output: {
        dir: "dist",
        compact: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "sheet.css";
          return "assets/[name][extname]";
        },
        entryFileNames: "sheet.js",
        minifyInternalExports: false
      }
    }
  },
  assetsInclude: ["**/*.hbs"],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  server: {
    cors: false
  }
}));
