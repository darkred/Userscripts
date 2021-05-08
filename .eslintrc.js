module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"greasemonkey": true,
		"jquery": true,
		// "node": true
	},
	// "extends": "eslint:all",
	// "extends": "eslint:recommended",
	"extends": [
		// "eslint:all",
		"eslint:recommended",
		// "plugin:clean-regex/recommended"
		"plugin:regexp/recommended"

	],
	"plugins": [
		// "clean-regex"
		"regexp"
	],
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "script",
		"ecmaFeatures": {
			"globalReturn ": true,
			"impliedStrict": true,
			// "jsx": true,
		},
	},
	"rules": {
		"complexity": ["warn", 20],
		"eqeqeq": "warn",
		"func-style": "off",
		// "indent": ["warn","tab" ],
		// "indent": ["warn","tab", { "SwitchCase": 1 } ],
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
		"require-unicode-regexp": "off",
		"semi": ["warn","always"],
		// "strict": ["error", "global"],
		"space-before-function-paren": "off",
		// "space-in-parens": ["warn", "always"],
		"unicode-bom": ["warn", "never"],

	},
	"reportUnusedDisableDirectives": true

};
