module.exports = {
	root: true,
	env: {
		node: true,
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			node: {},
			typescript: {},
		},
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			modules: true,
		},
	},
	plugins: ['unused-imports', 'eslint-plugin-prettier', '@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:react/recommended', // all rules from https://github.com/yannickcr/eslint-plugin-react
		'plugin:react-hooks/recommended',
	],
	rules: {
		'react/jsx-no-target-blank': [
			'error',
			{
				allowReferrer: true,
			},
		],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'prettier/prettier': 'error',
		'no-param-reassign': ['error'],
		'import/order': [
			'error',
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'unknown'],
				pathGroups: [],
				'newlines-between': 'never', // no gaps between imports
				pathGroupsExcludedImportTypes: [],
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		'unused-imports/no-unused-imports-ts': 'error', // remove unused imports
		'no-undef': 'off', // use typescript checker for this rule
		'no-constant-condition': 'off',
		'no-shadow': 'off', // no variables with same name from different scopes
		'@typescript-eslint/no-shadow': ['error'], // no variables with same name from different scopes
		'prefer-const': ['error'], // prefer const to let
		'no-unused-vars': 'off', // use @typescript-eslint/no-unused-vars
		'no-mixed-spaces-and-tabs': 'off', // prettier handles that for us
		'object-shorthand': ['error', 'always'], // prefer { foo } to { foo: foo }
		'spaced-comment': [
			'error', // space inside comments
			'always',
			{
				markers: ['/'],
				block: {
					balanced: true,
				},
			},
		],
		'@typescript-eslint/no-explicit-any': ['error'], // must use unknown but not any
		'@typescript-eslint/no-unused-vars': ['error'],
		'@typescript-eslint/array-type': ['error', { default: 'array' }], // allowed: T[]
		'prefer-destructuring': [
			'error',
			{
				VariableDeclarator: {
					array: false, // allow: const bar = array[0]
					object: true, // disallow: const bar = array.bar
				},
				AssignmentExpression: {
					array: false, // allow: bar = array[0]
					object: false, // allow: bar = array.bar
				},
			},
			{
				enforceForRenamedProperties: false, // allow bar = foo.baz
			},
		],
		'prefer-template': ['error'], // forbid bar + 'a'. allow `${bar}a`
		quotes: [
			'error', // prefer single quotes
			'single',
			{
				avoidEscape: true,
			},
		],
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': [
			'error', // tsx \ jsx for jsx syntax files
			{ allow: 'as-needed', extensions: ['.jsx', '.tsx'] },
		],
		'react/jsx-indent': [
			'error', // ident for jsx
			'tab',
			{ checkAttributes: true, indentLogicalExpressions: true },
		],
		'react/jsx-indent-props': [2, 'tab'], // props indent
		'react/jsx-max-depth': ['error', { max: 8 }], // max dom depth
		'react/self-closing-comp': [
			'error', // respect <Comp /> syntax
			{
				component: true,
				html: false,
			},
		],
		'react-hooks/exhaustive-deps': 'off',
	},
};
