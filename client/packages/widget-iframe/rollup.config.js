import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import bundleSize from 'rollup-plugin-bundle-size'
import resolve from '@rollup/plugin-node-resolve'

export default function generateRollupConfig() {
	const fileNames = ['common', 'faq', 'custom_form', 'custom_iframe', 'knowledge_base', 'wp_search']

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
		external,
		plugins: [...plugins, terser(getTerserConfig(fileName))],
		input: `${srcFolder}/${fileName}.js`,
		output: [
			{
				file: `${distFolder}/${fileName}.js`,
				name: fileName.replace(/-/g, '_'),
				// format: 'iife',
				globals: {
					document: 'document',
					window: 'window',
				},
			},
		],
	}))

	return channels
}
