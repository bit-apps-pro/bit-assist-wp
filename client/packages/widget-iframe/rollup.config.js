import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import bundleSize from 'rollup-plugin-bundle-size'
import resolve from '@rollup/plugin-node-resolve'

export default function generateRollupConfig() {
	const fileNames = [
		'call-to-action',
		'common',
		'render-faq',
		'render-custom-form',
		'render-custom-iframe',
		'render-knowledge-base',
		'render-wp-search',
	]

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
		terser(),
	]

	const channels = fileNames.map(fileName => ({
		external,
		plugins,
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
