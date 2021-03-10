module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	'plugins': [
		'react',
		'@typescript-eslint',
		'prettier'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
		'arrow-parens':['error', 'as-needed'],
		'jsx-quotes': ["error", "prefer-double"],
		"react/no-unused-state": "error",
		"space-before-function-paren": ["error", "always"],
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
};
