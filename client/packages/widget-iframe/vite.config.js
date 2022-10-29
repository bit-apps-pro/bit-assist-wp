import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig(() => {
	return {
		build: {
			emptyOutDir: true,
			target: 'chrome51',
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					dir: resolve(__dirname, '../../../iframe/'),
				},
			},
		},
		server: { port: 5000 },
		base: '',
	}
})
