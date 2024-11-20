import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		emptyOutDir: true,
		target: 'chrome51',
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				dir: resolve(__dirname, '../iframe/'),
				entryFileNames: 'assets/[name].js',
				assetFileNames: assetInfo => {
					if (assetInfo.name.indexOf('index.css') > -1) return 'assets/[name].[ext]'
					return 'assets/[name].[hash].[ext]'
				},
				format: 'cjs',
			},
		},
	},
	server: { port: 5000 },
	base: '',
})
