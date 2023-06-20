import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import bundleSize from 'rollup-plugin-bundle-size'
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import image from '@rollup/plugin-image'

export default function generateRollupConfig({ watch }) {
	const isDev = watch

	const fileNames = ['common', 'faq', 'custom_form', 'custom_iframe', 'knowledge_base', 'wp_search', 'woocommerce']

	const external = ['window', 'document', ...fileNames]

	const srcFolder = 'channels'
	const distFolder = '../../../iframe/assets/channels'

	const plugins = [
		resolve(),
		bundleSize(),
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'bundled',
		}),
	]

	const getTerserConfig = fileName => {
		const terserOptions = {
			mangle: {
				reserved: fileNames,
			},
		}
		if (fileName === 'common') {
			terserOptions.mangle.keep_fnames = true
		}
		return terserOptions
	}

	const channels = fileNames.map(fileName => ({
		input: `${srcFolder}/${fileName}.js`,
		external,
		plugins: [...plugins, terser(getTerserConfig(fileName))],
		output: [
			{
				file: `${distFolder}/${fileName}.js`,
				name: fileName.replace(/-/g, '_'),
				// format: 'umd',
				globals: {
					document: 'document',
					window: 'window',
				},
			},
		],
	}))

	channels.push({
		input: `index.js`,
		external,
		plugins: [scss(), image(), ...plugins, ...[!isDev && terser(getTerserConfig())]],
		output: [
			{
				file: '../../../iframe/assets/index.js',
				name: 'index.js',
				format: 'iife',
				globals: {
					document: 'document',
					window: 'window',
				},
			},
		],
	})

	return channels
}
