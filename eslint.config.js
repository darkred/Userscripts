/* eslint-disable @stylistic/js/quotes */
/* eslint-disable @stylistic/js/indent */

// import * as cssPlugin from "eslint-plugin-css";
import css from "@eslint/css";
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import json from "@eslint/json";
import noJquery from "eslint-plugin-no-jquery";
import * as regexpPlugin from "eslint-plugin-regexp";
import markdown from "@eslint/markdown";
import globals from "globals";
import js from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";


export default [
	{
		files: ['**/*.js', '**/*.mjs'],
		...js.configs.recommended
	},
	// cssPlugin.configs["flat/recommended"],
	...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
	{
		files: ['**/*.js', '**/*.mjs'],
		...regexpPlugin.configs["flat/recommended"],
	},
	...markdown.configs.recommended,
	{
		files: ["**/*.js"],
		ignores: ["**/*.min.js"],

		plugins: {
			"@stylistic/js": stylisticJs
		},

		linterOptions: {
			reportUnusedDisableDirectives: true,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.greasemonkey,
				...globals.jquery,
			},

			ecmaVersion: "latest",
			// sourceType: "module",
			sourceType: "script",


			parserOptions: {
				ecmaFeatures: {
					"globalReturn ": true,
					impliedStrict: true,
				},
			},
		},

		rules: {
			complexity: ["warn", 20],
			eqeqeq: "warn",
			"func-style": "off",

			"@stylistic/js/indent": ["warn", "tab", {
				ignoreComments: false,
				SwitchCase: 1,
			}],

			"@stylistic/js/linebreak-style": ["warn", "unix"],
			"@stylistic/js/max-len": "off",
			"@stylistic/js/max-statements-per-line": "off",
			"new-cap": "off",
			"no-alert": "warn",
			"no-console": "warn",
			"no-dupe-keys": "warn",
			"@stylistic/js/no-extra-semi": "warn",
			"no-inline-comments": "off",
			"no-magic-numbers": "off",
			"no-misleading-character-class": "warn",
			"@stylistic/js/no-mixed-spaces-and-tabs": "warn",
			"@stylistic/js/no-multiple-empty-lines": "off",
			"@stylistic/js/no-tabs": "off",
			"no-unused-labels": "warn",

			"no-unused-vars": ["warn", {
				vars: "all",
				args: "after-used",
			}],

			"no-useless-escape": "warn",
			"@stylistic/js/padded-blocks": "off",

			"@stylistic/js/quotes": ["warn", "single", {
				allowTemplateLiterals: true,
			}],

			"require-jsdoc": "off",
			"require-unicode-regexp": "off",
			"@stylistic/js/semi": ["warn", "always"],
			"@stylistic/js/space-before-function-paren": "off",
			"unicode-bom": ["warn", "never"],
		},

	},


	// https://github.com/eslint/json#usage
	{
		plugins: {
			json,
		},
	},
	// lint JSON files         // (from: https://github.com/eslint/json#recommended-configuration)
	{
		files: ["**/*.json"],
		language: "json/json",
		...json.configs.recommended,
	},

	// lint JSON-C files
	{
		// files: ["**/*.jsonc"],
		files: ["**/*.jsonc", ".vscode/*.json"],  // https://github.com/eslint/json/pull/11
		language: "json/jsonc",
		...json.configs.recommended,
	},



	// https://github.com/eslint/markdown#configuring
	{
		// 1. Add the plugin
		plugins: {
			markdown
		}
	},

	// https://www.npmjs.com/package/eslint-plugin-markdown
	// https://eslint.org/docs/latest/use/configure/plugins
	// https://github.com/eslint/json
	{
		// 2. Enable the Markdown processor for all .md files.
		files: ["**/*.md"],
		// files: ["**/*.md/*.js"],
		// plugins: {
		//     markdown
		// },
		processor: "markdown/markdown"
	},
	{
	//     // 3. Optionally, customize the configuration ESLint uses for ```js
	//     // fenced code blocks inside .md files.
		files: ["**/*.md/*.js"],
		rules: {
			// ...

			// 2. Disable other rules.
			// "no-console": "off",
			// "import/no-unresolved": "off"
		}
	},








	// https://eslint.org/blog/2025/02/eslint-css-support/  [NEW ADDITION 20/2/2025]
	//
	// lint css files
	{
		files: ["**/*.css"],
		plugins: {
			css,
		},
		language: "css/css",
		rules: {
			"css/no-duplicate-imports": "error",
		},
	},




	// https://eslint.org/docs/latest/use/configure/ignore
	// https://eslint.org/docs/latest/use/configure/migration-guide#ignoring-files
	{
		// Note: there should be no other properties in this object
		ignores: [

			"node_modules/*",
			"**/*.min.js",
			"package-lock.json"

		]

	}








];