import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/portfolio': {
        target: 'http://127.0.0.1:5174',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/portfolio/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: process.env.NODE_ENV !== 'production',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
        blogSocialMedia: path.resolve(__dirname, 'blog/social-media-growth-nigeria.html'),
        blogLeemsdtt: path.resolve(__dirname, 'blog/leemsdtt-palm-oil.html'),
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
