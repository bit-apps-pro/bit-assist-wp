import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/',
  plugins: [react(), tsconfigPaths()],
  root: 'src',
  server: {
    cors: true,
    hmr: {
      host: 'localhost'
    },
    port: 3000,
    strictPort: true
  }
})
