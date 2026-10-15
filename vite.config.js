import { defineConfig } from 'vite';
import { resolve } from 'path';
import glob from 'fast-glob';
import { copyFileSync, mkdirSync, cpSync } from 'node:fs';

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


plugins: [
  {
    name: 'copy-ms-enhance-assets',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const cssDir = resolve(distDir, 'assets/css');
      const jsDir = resolve(distDir, 'assets/js');
      const imagesDir = resolve(distDir, 'assets/images');

      mkdirSync(cssDir, { recursive: true });
      mkdirSync(jsDir, { recursive: true });
      mkdirSync(imagesDir, { recursive: true });

      // Copy enhancement CSS
      copyFileSync(
        resolve(__dirname, 'src/assets/css/ms-enhance.css'),
        resolve(cssDir, 'ms-enhance.css')
      );

      // Copy enhancement JavaScript
      copyFileSync(
        resolve(__dirname, 'src/assets/js/ms-enhance.js'),
        resolve(jsDir, 'ms-enhance.js')
      );

      // Copy all images and preserve their subfolders
      cpSync(
        resolve(__dirname, 'src/assets/images'),
        imagesDir,
        { recursive: true }
      );

      console.log('Enhancement assets and images copied successfully.');
    },
  },
],

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
          if (/\.(gif|jpe?g|png|svg|webp)$/i.test(name ?? '')) {
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