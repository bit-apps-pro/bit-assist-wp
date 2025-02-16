import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/src/' : '',
  build: {
    outDir: '../assets',
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]', // currently does not work for images
        entryFileNames: '[name].js', // currently does not work for the legacy bundle
        inlineDynamicImports: true,
        manualChunks: undefined
      }
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
  server: {
    commonjsOptions: { transformMixedEsModules: true },
    cors: true,
    hmr: { host: 'localhost' },
    origin: 'http://localhost:3000',
    port: 3000,
    strictPort: true
  }
}))
