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
		"ecmaVersion": 8,
		"sourceType": "script",
		"ecmaFeatures": {
			"globalReturn ": true,
			"impliedStrict": true,
			// "jsx": true,
			// "experimentalObjectRestSpread": true
		}
	},
	"rules": {
		"complexity": ["warn", 3],
		"eqeqeq": "warn",
		"func-style": "off",
		"indent": ["warn","tab"],
		"linebreak-style": ["warn","unix"],
		"max-len": "off",
		"max-statements-per-line": "off",
		"new-cap": "off",
		"no-extra-semi": "warn",
		"no-inline-comments": "off",
		"no-magic-numbers": "off",
		"no-mixed-spaces-and-tabs": "warn",
		// "no-var": "off",
		"no-multiple-empty-lines": "off",
		"no-console": "warn",
		"no-alert": "warn",
		"no-unused-labels": "warn",
		"no-unused-vars": ["warn", {"vars": "all", "args": "after-used"}],
		"no-useless-escape": "warn",
		"no-tabs": "off",
		"padded-blocks": "off",
		"quotes": ["warn", "single", { "allowTemplateLiterals": true }] ,
		"require-jsdoc": "off",
		"semi": ["warn","always"],
		"space-before-function-paren": "off",
		"unicode-bom": ["warn", "never"]

	}
};
