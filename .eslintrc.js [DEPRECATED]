/* eslint-disable quotes */

module.exports = {
	"root": true,

	"env": {
		"browser": true,
		"es6": true,
		"greasemonkey": true,
		"jquery": true,
		// "node": true
	},

	"parserOptions": {
		// "ecmaVersion": 12,
		"ecmaVersion": "latest",
		"sourceType": "script",
		"ecmaFeatures": {
			"globalReturn ": true,
			"impliedStrict": true,
			// "jsx": true,
		},
	},

	// "extends": "eslint:all",
	// "extends": "eslint:recommended",
	"extends": [
		"eslint:recommended",
		// "eslint:all",
		"plugin:css/recommended",
		"plugin:jsonc/recommended-with-json",
		// "plugin:no-jquery/recommended",
		"plugin:no-jquery/deprecated",
		// "plugin:no-jquery/slim",
		// "plugin:no-jquery/all",
		// "plugin:clean-regex/recommended"
		"plugin:regexp/recommended",
		// "plugin:regexp/all",
	],

	"plugins": [
		"css",
		"jsonc",
		// "clean-regex",
		"no-jquery",
		"regexp",
	],

	"rules": {
		"complexity": ["warn", 20],
		"eqeqeq": "warn",
		"func-style": "off",
		// "indent": ["warn","tab" ],
		// "indent": ["warn","tab", { "SwitchCase": 1 } ],
		// "indent": ["warn","tab", { "ignoreComments": true, "SwitchCase": 1 } ],
		"indent": ["warn","tab", { "ignoreComments": false, "SwitchCase": 1 } ],
		"linebreak-style": ["warn","unix"],
		"max-len": "off",
		"max-statements-per-line": "off",
		"new-cap": "off",
		"no-alert": "warn",
		"no-console": "warn",
		"no-dupe-keys": "warn",
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
