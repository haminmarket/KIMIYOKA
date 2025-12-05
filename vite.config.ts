import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'extension/src/background.ts'),
        content: resolve(__dirname, 'extension/src/content.ts'),
        popup: resolve(__dirname, 'extension/src/popup/popup.ts'),
        options: resolve(__dirname, 'extension/src/options/options.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'extension/public/manifest.json',
          dest: '.',
        },
        {
          src: 'extension/public/icons/*',
          dest: 'icons',
        },
        {
          src: 'extension/src/popup/popup.html',
          dest: '.',
        },
        {
          src: 'extension/src/popup/popup.css',
          dest: '.',
        },
        {
          src: 'extension/src/options/options.html',
          dest: '.',
        },
        {
          src: 'extension/src/options/options.css',
          dest: '.',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './extension/src'),
    },
  },
})
