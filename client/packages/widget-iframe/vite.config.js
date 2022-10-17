import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		Target: 'chrome51',
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				dir: resolve(__dirname, '../../build'),
			},
		},
	},
	server: { port: 5000 }
})
