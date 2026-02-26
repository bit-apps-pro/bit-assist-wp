import { resolve } from 'node:path'
import { defineConfig } from 'vite'

function wpI18nExternal() {
  const VIRTUAL_ID = '\0@wordpress/i18n'
  return {
    name: 'wp-i18n-external',
    enforce: 'pre',
    resolveId(id) {
      if (id === '@wordpress/i18n') {
        return VIRTUAL_ID
      }
    },
    load(id) {
      if (id === VIRTUAL_ID) {
        // Inside the widget iframe there is no WordPress, so wp is always undefined.
        // The __ fallback returns the original string (English).
        // The sprintf fallback substitutes %1$s / %s positional placeholders so that
        // pagination labels like "%1$s / %2$s page" still render correctly in English.
        return [
          'var _wp = typeof wp !== "undefined" && wp.i18n ? wp.i18n : null;',
          'export var __ = _wp ? _wp.__ : function(t){ return t; };',
          'export var sprintf = _wp ? _wp.sprintf : function(fmt) {',
          '  var args = Array.prototype.slice.call(arguments, 1), i = 0;',
          '  return fmt.replace(/%([1-9])\\$s|%s/g, function(m, n) {',
          '    return String(n !== undefined ? args[n - 1] : args[i++]);',
          '  });',
          '};',
        ].join('\n')
      }
    },
  }
}

export default defineConfig({
  build: {
    emptyOutDir: true,
    minify: 'terser',
    target: 'chrome51',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        dir: resolve(__dirname, '../iframe/'),
        entryFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.includes('index.css')) {
            return 'assets/[name].[ext]'
          }
          return 'assets/[name].[hash].[ext]'
        },
        format: 'cjs',
      },
    },
    terserOptions: {
      mangle: { reserved: ['__', 'sprintf'] },
    },
  },
  plugins: [wpI18nExternal()],
  server: { port: 5000 },
  base: '',
})
