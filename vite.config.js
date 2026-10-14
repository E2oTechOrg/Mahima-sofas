
import { defineConfig } from 'vite';
import { resolve } from 'path';
import glob from 'fast-glob';

const htmlFiles = glob.sync('./src/**/*.html');

export default defineConfig({
  base: '/Mahima-sofas/',
  root: resolve(__dirname, 'src'),

  server: {
    host: true,
    port: 3000,
    open: true,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`,
      },
    },
  },

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,

    rollupOptions: {
      input: htmlFiles.length
        ? Object.fromEntries(
            htmlFiles.map((file) => [
              file.replace(/^\.\/src\//, '').replace(/\.html$/, ''),
              resolve(__dirname, file),
            ])
          )
        : resolve(__dirname, 'src/index.html'),

      output: {
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',

        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/i.test(name ?? '')) {
            return 'assets/images/[name][extname]';
          }

          if (/\.css$/i.test(name ?? '')) {
            return 'assets/css/[name][extname]';
          }

          return 'assets/[name][extname]';
        },
      },
    },
  },
});
