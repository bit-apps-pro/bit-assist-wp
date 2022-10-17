import babel from '@rollup/plugin-babel'
import { resolve } from 'path'
import { terser } from 'rollup-plugin-terser'
import bundleSize from 'rollup-plugin-bundle-size'

export default {
	input: resolve(__dirname, 'bit-assist.js'),
	external: [
		'window',
		'document',
	],
	output: {
		file: '../../build/bit-assist.js',
		format: 'iife',
		globals: {
			document: 'document',
			window: 'window',
		},
	},
	plugins: [
		bundleSize(),
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'bundled',
		}),
		terser(),
	],
}
