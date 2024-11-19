import babel from '@rollup/plugin-babel'
import bundleSize from 'rollup-plugin-bundle-size'
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import image from '@rollup/plugin-image'
import terser from '@rollup/plugin-terser'
import fs from 'fs'
import path from 'path'

export default function generateRollupConfig({ watch }) {
	const isDev = watch

	// Dynamic file discovery
	const srcFolder = 'channels'
	const distFolder = '../../../iframe/assets/channels'

	// Identify all .js files in the srcFolder except features.js
	const fileNames = fs
		.readdirSync(srcFolder)
		.filter(file => file.endsWith('.js') && file !== 'features.js')
		.map(file => path.basename(file, '.js'))

	const external = ['window', 'document', ...fileNames]

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
