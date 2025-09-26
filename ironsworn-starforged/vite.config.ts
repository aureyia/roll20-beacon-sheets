import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer'
import svgLoader from 'vite-svg-loader';

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    svgLoader(),
    Components({
      dts: true,
    }),
    tailwindcss(),
    analyzer(),
  ],
  base:
    mode === 'production'
      ? `https://storage.googleapis.com/beacon-community-sheets/irosworn-starforged/`
      : '/',
  build: {
    emptyOutDir: true,
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        sheet: 'src/main.ts',
      },
      output: {
        dir: 'dist',
        compact: false,
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name === 'style.css') return 'sheet.css';
          return 'assets/[name][extname]';
        },
        entryFileNames: 'sheet.js',
        minifyInternalExports: false,
      },
    },
  },
  assetsInclude: ['**/*.hbs'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    cors: false,
    watch: {
      ignored: ['**/local.db*'],
    },
  },
}));
