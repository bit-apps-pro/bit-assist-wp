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

	// Paths and folders
	const srcFolder = 'channels'
	const distFolder = '../../../iframe/assets/channels'

	// Dynamically fetch all .js files except 'features.js'
	const fileNames = fs
		.readdirSync(srcFolder)
		.filter(file => file.endsWith('.js') && file !== 'features.js')
		.map(file => path.basename(file, '.js'))

	// External dependencies
	const external = ['window', 'document', ...fileNames]

	// Common plugins
	const basePlugins = [
		resolve(),
		bundleSize(),
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'bundled',
		}),
	]

	// Get Terser configuration
	const getTerserConfig = fileName => ({
		mangle: {
			reserved: fileNames,
			...(fileName === 'common' && { keep_fnames: true }),
		},
	})

	// Generate output configuration
	const getOutputConfig = (fileName, filePath) => ({
		file: filePath,
		name: fileName.replace(/-/g, '_'),
		globals: { document: 'document', window: 'window' },
	})

	// Generate channel-specific configurations
	const channels = fileNames.map(fileName => ({
		input: `${srcFolder}/${fileName}.js`,
		external,
		plugins: [...basePlugins, terser(getTerserConfig(fileName))],
		output: [getOutputConfig(fileName, `${distFolder}/${fileName}.js`)],
	}))

	// Add main index.js configuration
	channels.push({
		input: `index.js`,
		external,
		plugins: [scss(), image(), ...basePlugins, ...(isDev ? [] : [terser(getTerserConfig('index'))])],
		output: [
			{
				...getOutputConfig('index.js', '../../../iframe/assets/index.js'),
				format: 'iife',
			},
		],
	})

	return channels
}
