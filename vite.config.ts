import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
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
        rewrite: (path) => path.replace(/^\/portfolio/, ''),
      },
    },
  },
  build: {
  outDir: 'dist',
  minify: 'terser',
  sourcemap: process.env.NODE_ENV !== 'production',
  cssCodeSplit: true,
  rollupOptions: {
    onwarn(warning, warn) {
      if (warning.code === 'PLUGIN_TIMINGS') return;
      warn(warning);
    },
    input: {
      main: './index.html',
      admin: './admin.html',
      blogSocialMedia: './blog/social-media-growth-nigeria.html',
      blogLeemsdtt: './blog/leemsdtt-palm-oil.html',
    },
    output: {
      entryFileNames: 'assets/[name].[hash].js',
      chunkFileNames: 'assets/[name].[hash].js',
      assetFileNames: 'assets/[name].[hash].[ext]',
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      },
    },
  },
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'VALORTRUST INTEGRATED SERVICES LTD | RC: 9268182 | Kano, Nigeria',
          // Structured data will be handled directly in the HTML or via JS injection
        }
      }
    })
  ]
});
