module.exports = {
	extends: ['stylelint-prettier/recommended', 'stylelint-config-rational-order'],
	rules: {
		'comment-empty-line-before': null, // allow comment without empty line before
		'max-nesting-depth': [
			3, // max nesting depth -3, without pseudo-classes and mixins
			{
				ignore: ['pseudo-classes'],
				ignoreAtRules: ['mixin', 'keyframes'],
			},
		],
		'length-zero-no-unit': true, // write zero numbers without unit
		'declaration-block-no-duplicate-properties': true,
		'at-rule-empty-line-before': [
			'never', // remove empty line before css rules
			{
				ignoreAtRules: ['mixin', 'define-mixin', 'keyframes'],
			},
		],
		'declaration-empty-line-before': [
			'always', // add empty line before css block
			{
				ignore: ['after-comment', 'after-declaration', 'first-nested'],
			},
		],
		'order/order': ['custom-properties', 'declarations'], // order - custom-properties first
	},
};
