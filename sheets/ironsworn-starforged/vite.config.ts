import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import svgLoader from "vite-svg-loader";
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import Components from 'unplugin-vue-components/vite'
import RadixVueResolver from 'radix-vue/resolver'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    svgLoader(),
    Components({
      dts: true,
      resolvers: [
        RadixVueResolver()
      ]
    })
  ],
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
        assetFileNames: (assetInfo: any) => {
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
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  }
}));
