import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

function wpI18nExternal(): Plugin {
  const VIRTUAL_ID = '\0@wordpress/i18n'
  return {
    enforce: 'pre',
    load(id) {
      if (id === VIRTUAL_ID) {
        // Use the global wp.i18n that WordPress loads via wp-i18n (declared as a script
        // dependency). Guard defensively so a broken upstream doesn't crash the whole app.
        return [
          'var _i18n = window.wp && window.wp.i18n ? window.wp.i18n : null;',
          'export var __ = _i18n ? _i18n.__ : function(t){ return t; };',
          'export var sprintf = _i18n ? _i18n.sprintf : function(t){ return t; };',
        ].join('\n')
      }
    },
    name: 'wp-i18n-external',
    resolveId(id) {
      if (id === '@wordpress/i18n') return VIRTUAL_ID
    }
  }
}

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
  plugins: [wpI18nExternal(), react(), tsconfigPaths()],
  server: {
    commonjsOptions: { transformMixedEsModules: true },
    cors: true,
    hmr: { host: 'localhost' },
    origin: 'http://localhost:3000',
    port: 3000,
    strictPort: true
  }
}))
