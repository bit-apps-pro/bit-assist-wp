import react from '@vitejs/plugin-react'
import path from 'node:path'
import { type Alias } from 'vite'
import { defineConfig } from 'vite'

import * as tsconfig from './tsconfig.json'
// import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  // config
  base: '/',
  root: 'src',

  plugins: [
    react()
    // reactRefresh()
    // TODO: PWA not working
    // for PWA resources genarate icon from this link https://realfavicongenerator.net/ and FULL DOCS https://vite-plugin-pwa.netlify.app/
    // VitePWA({
    //   ...PwaConfig(),
    // }),
    // css: {
    //   preprocessorOptions: {
    //     modules:{

    //     }
    //   }
    // }
  ],
  resolve: { alias: readAliasFromTsConfig() },

  server: {
    cors: true,
    hmr: {
      host: 'localhost'
    },
    port: 3000,
    strictPort: true
  }
})

// function PwaConfig() {
//   return {
//     manifest: {
//       description: __('Description of your app'),
//       display: 'standalone',
//       icons: [
//         {
//           sizes: '192x192',
//           src: 'pwa-192x192.png',
//           type: 'image/png'
//         },
//         {
//           sizes: '512x512',
//           src: 'pwa-512x512.png',
//           type: 'image/png'
//         },
//         {
//           sizes: '512x512',
//           src: 'pwa-512x512.png',
//           type: 'image/png'
//         }
//       ],
//       name: 'App Name',
//       scope: '.',
//       short_name: 'App Name',
//       start_url: '/',
//       theme_color: '#ffffff'
//     }
//   }
// }

function readAliasFromTsConfig(): Alias[] {
  const pathReplaceRegex = new RegExp(/\/\*$/, '')
  return Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [fromPaths, toPaths]) => {
    const find = fromPaths.replace(pathReplaceRegex, '')
    const toPath = toPaths[0].replace(pathReplaceRegex, '')
    const replacement = path.resolve(import.meta.dirname, toPath)
    aliases.push({ find, replacement })
    return aliases
  }, [] as Alias[])
}
