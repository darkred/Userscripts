module.exports = {
	"env": {
		"browser": true,
		// "es6": true,
		"greasemonkey": true,
		"jquery": true,
		"node": true,
	},
	"extends": "eslint:recommended",
	// "extends": "eslint:all",
	"parserOptions": {
		"ecmaVersion": 9,
		"sourceType": "script",
		"ecmaFeatures": {
			"globalReturn ": true,
			"impliedStrict": true,
			// "jsx": true,
			// "experimentalObjectRestSpread": true
		},
	},
	"rules": {
		"complexity": ["warn", 20],
		"eqeqeq": "warn",
		"func-style": "off",
		"indent": ["warn","tab", { "ignoreComments": true, "SwitchCase": 1 } ],
		"linebreak-style": ["warn","unix"],
		"max-len": "off",
		"max-statements-per-line": "off",
		"new-cap": "off",
		"no-alert": "warn",
		"no-console": "warn",
		"no-extra-semi": "warn",
		"no-inline-comments": "off",
		"no-magic-numbers": "off",
		"no-misleading-character-class": "warn",
		"no-mixed-spaces-and-tabs": "warn",
		// "no-var": "off",
		"no-multiple-empty-lines": "off",
		"no-tabs": "off",
		"no-unused-labels": "warn",
		"no-unused-vars": ["warn", {"vars": "all", "args": "after-used"}],
		"no-useless-escape": "warn",
		"padded-blocks": "off",
		"quotes": ["warn", "single", { "allowTemplateLiterals": true }] ,
		"require-jsdoc": "off",
		"require-unicode-regexp": "warn",
		"semi": ["warn","always"],
		"space-before-function-paren": "off",
		"unicode-bom": ["warn", "never"]

	}
};
