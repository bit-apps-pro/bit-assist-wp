module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['xo'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		semi: ['error', 'never'],
		'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
		'object-curly-spacing': ['error', 'always'],
		'no-mixed-operators': ['error', 'never'],
	},
}
