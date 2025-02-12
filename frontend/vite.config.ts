import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react'
import path from 'path'
import { Alias, defineConfig } from 'vite'

import * as tsconfig from './tsconfig.json'

// const chunkCount = 0

export default defineConfig(({ mode }) => ({
  // root: 'src',
  base: mode === 'development' ? '/src/' : '',

  build: {
    outDir: '../assets',
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]', // currently does not work for images
        entryFileNames: '[name].js', // currently does not work for the legacy bundle
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(['react-calendar', 'react-date-picker', 'react-clock', 'react-time-picker', 'fela'])],
    },
  },
  plugins: [
    react(),
    // copyStatics(mode),
  ],

  resolve: {
    alias: readAliasFromTsConfig(),
  },

  // build: {
  //   // outDir: '../../assets',
  //   emptyOutDir: true,

  //   // emit manifest so PHP can find the hashed files
  //   manifest: true,

  //   target: 'es2015',
  //   minify: false,

  //   sourcemap: true,
  //   rollupOptions: {
  //     input: path.resolve(__dirname, 'src/index.tsx'),
  //     output: {
  //       entryFileNames: '[name].js',
  //       compact: true,
  //       validate: true,
  //       generatedCode: {
  //         arrowFunctions: true,
  //         // objectShorthand: true
  //       },
  //       chunkFileNames: () => `bf-${hash()}-${chunkCount++}.js`,
  //       assetFileNames: (fInfo) => {
  //         const pathArr = fInfo?.name?.split('/')
  //         const fileName = pathArr?.[pathArr.length - 1]

  //         if (fileName === 'index.css' && fInfo.source.length > 5000) {
  //           return 'index.css'
  //         }
  //         if (fileName === 'logo.svg') {
  //           return 'logo.svg'
  //         }

  //         return `bf-${hash()}-${chunkCount++}.[ext]`
  //       },
  //     },
  //   },
  //   commonjsOptions: { transformMixedEsModules: true },
  // },

  server: {
    commonjsOptions: { transformMixedEsModules: true },
    // required to load scripts from custom host
    cors: true,
    hmr: { host: 'localhost' },
    origin: 'http://localhost:3000',
    port: 3000,
    // we need a strict port to match on PHP side
    strictPort: true,
  },
}))

// function hash() {
//   return Math.round(Math.random() * (999 - 1) + 1)
// }

function readAliasFromTsConfig(): Alias[] {

  const pathReplaceRegex = new RegExp(/\/\*$/, '')
  return Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [fromPaths, toPaths]) => {
    const find = fromPaths.replace(pathReplaceRegex, '')
    const toPath = toPaths[0].replace(pathReplaceRegex, '')
    const replacement = path.resolve(__dirname, toPath)
    aliases.push({ find, replacement })
    return aliases
  }, [] as Alias[])
}
