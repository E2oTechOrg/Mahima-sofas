
import { defineConfig } from 'vite';
import { resolve, relative } from 'node:path';
import glob from 'fast-glob';
import { mkdirSync, cpSync, existsSync } from 'node:fs';

const projectRoot = __dirname;
const srcDir = resolve(projectRoot, 'src');
const distDir = resolve(projectRoot, 'dist');

const htmlFiles = glob.sync('**/*.html', {
  cwd: srcDir,
  absolute: true,
});

export default defineConfig({
  base: './',
  root: srcDir,

  server: {
    host: true,
    port: 3000,
    open: true,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "sass:math";',
      },
    },
  },

  plugins: [
    {
      name: 'copy-static-assets',

      closeBundle() {
        const assetsSrc = resolve(srcDir, 'assets');
        const assetsDist = resolve(distDir, 'assets');

        mkdirSync(assetsDist, { recursive: true });

        // Copy static SCSS files
        const scssSrc = resolve(assetsSrc, 'scss');
        if (existsSync(scssSrc)) {
          cpSync(scssSrc, resolve(assetsDist, 'scss'), {
            recursive: true,
          });
        }

        // Copy images
        const imagesSrc = resolve(assetsSrc, 'images');
        if (existsSync(imagesSrc)) {
          cpSync(imagesSrc, resolve(assetsDist, 'images'), {
            recursive: true,
          });
        }

        console.log('Static assets copied successfully.');
      },
    },
  ],

  build: {
    outDir: distDir,
    emptyOutDir: true,

    rollupOptions: {
      input: Object.fromEntries(
        htmlFiles.map((file) => [
          relative(srcDir, file)
            .replace(/\\/g, '/')
            .replace(/\.html$/, ''),
          file,
        ])
      ),

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
