import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/src/' : '',
  build: {
    minify: 'terser',
    outDir: '../assets',
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].js',
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    },
    terserOptions: {
      mangle: { reserved: ['__', '_x', '_n', '_nx', 'sprintf'] }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildCommonjs([
          'react-calendar',
          'react-date-picker',
          'react-clock',
          'react-time-picker',
          'fela'
        ])
      ]
    }
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@wordpress/i18n': path.resolve(__dirname, 'src/wp-i18n-shim.ts')
    }
  },
  root: mode === 'development' ? 'src' : undefined,
  server: {
    commonjsOptions: { transformMixedEsModules: true },
    cors: true,
    hmr: { host: 'localhost' },
    origin: 'http://localhost:3000',
    port: 3000,
    strictPort: true
  }
}))
