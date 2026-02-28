import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  build: {
    cssCodeSplit: true,
    emptyOutDir: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.includes('index.css')) {
            return 'assets/[name].[ext]'
          }
          return 'assets/[name].[hash].[ext]'
        },
        dir: resolve(__dirname, '../iframe/'),
        entryFileNames: 'assets/[name].js',
        format: 'cjs',
      },
    },
    target: 'chrome51',
    terserOptions: {
      mangle: { reserved: ['__', 'sprintf'] },
    },
  },
  resolve: {
    alias: {
      '@wordpress/i18n': resolve(__dirname, 'wp-i18n-shim.js'),
    },
  },
  server: { port: 5000 },
})
