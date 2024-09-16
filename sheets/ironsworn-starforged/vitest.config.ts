import { fileURLToPath } from "node:url";
import path from 'path'
import { configDefaults, defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [vue(), svgLoader()],
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "e2e/*"],
    root: fileURLToPath(new URL("./", import.meta.url))
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
});
