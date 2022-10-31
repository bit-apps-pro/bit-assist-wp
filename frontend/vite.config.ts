/* eslint-disable import/no-extraneous-dependencies */
import path from 'path'
import { Alias, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import * as tsconfig from './tsconfig.json'

export default defineConfig({
  plugins: [
    react(),
    // TODO: PWA not working
    // for PWA resources genarate icon from this link https://realfavicongenerator.net/ and FULL DOCS https://vite-plugin-pwa.netlify.app/
    VitePWA({
      ...PwaConfig(),
    }),
    // css: {
    //   preprocessorOptions: {
    //     modules:{

    //     }
    //   }
    // }
  ],
  build: {
    emptyOutDir: true,
    target: 'chrome51',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        dir: path.resolve(__dirname, '../assets/'),
      },
    },
  },
  resolve: { alias: readAliasFromTsConfig() },
})

function readAliasFromTsConfig(): Alias[] {
  // eslint-disable-next-line prefer-regex-literals
  const pathReplaceRegex = new RegExp(/\/\*$/, '')
  return Object.entries(tsconfig.compilerOptions.paths).reduce(
    (aliases, [fromPaths, toPaths]) => {
      const find = fromPaths.replace(pathReplaceRegex, '')
      const toPath = toPaths[0].replace(pathReplaceRegex, '')
      const replacement = path.resolve(__dirname, toPath)
      aliases.push({ find, replacement })
      return aliases
    },
    [] as Alias[],
  )
}

function PwaConfig() {
  return ({
    manifest: {
      name: 'App Name',
      short_name: 'App Name',
      description: 'Description of your app',
      theme_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope: '.',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  })
}
