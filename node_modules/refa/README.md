# Regular Expressions and Finite Automata (refa)

[![Actions Status](https://github.com/RunDevelopment/refa/workflows/Node.js%20CI/badge.svg)](https://github.com/RunDevelopment/refa/actions)
[![npm](https://img.shields.io/npm/v/refa)](https://www.npmjs.com/package/refa)

A library for regular expressions (RE) and finite automata (FA) in the context of [Javascript RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).


## About

refa is a general library for [DFA](https://en.wikipedia.org/wiki/Deterministic_finite_automaton), [NFA](https://en.wikipedia.org/wiki/Nondeterministic_finite_automaton), and REs of [formal regular languages](https://en.wikipedia.org/wiki/Induction_of_regular_languages). It also includes methods to easily convert from JS RegExp to the internal RE AST and vice versa.


## Installation

Get refa from NPM:

```
npm i --save refa
```

or

```
yarn add refa
```


## Features

- Conversions

  * RE to NFA (_assertions are not implemented yet_)
  * NFA to DFA and DFA to NFA
  * NFA to RE and DFA to RE

- DFA and NFA operations

  * Construction from other FA, the intersection of two FA, or a finite set of words
  * Print internal representation in a human-readable form
  * Test whether a word is accepted
  * Test whether the language of an FA is the empty set/a finite set
  * Accept all prefixes of a language

- DFA specific operations

  * Minimization
  * Complement
  * Structural equality

- NFA specific operations

  * Union and Concatenation with other FA
  * Quantification
  * Reverse
  * Accept all suffixes of a language

- JavaScript RegExp

  * RegExp to RE and RE to RegExp
    * All flags are fully supported
    * Unicode properties
    * Change flags
    * Limited support for simple backreferences

See the [API documentation](https://rundevelopment.github.io/refa/docs/latest/) for a complete list of all currently implemented operations.

### RE AST format

refa uses its own AST format to represent regular expressions. The RE AST format is language agnostic and relatively simple.

It supports:

- Concatenation (e.g. `ab`)
- Alternation (e.g. `a|b`)
- Quantifiers (greedy and lazy) (e.g. `a{4,6}`, `a{2,}?`, `a?`, `a*`)
- Assertions (e.g. `(?=a)`, `(?<!a)`)
- Characters/character sets (represented by interval sets)

Some features like atomic groups and capturing groups are not supported (but might be added in the future).

#### Converting to and from the RE AST format

JavaScript RegExp can be converted to the RE AST format by using `JS.Parser`. `JS.toLiteral` converts into the other direction. (Note that the conversion from JS RegExp to the RE AST format is lossy (capturing groups) and sometime impossible due to the limitations of the RE AST format.)

Converters for other regex dialects might be added in the future as separate packages.

### Universal characters

refa does not use JavaScript string represent characters or a sequence of characters. Instead it uses integers to represent characters (see the `Char` type) and arrays of numbers to represent words/strings (see the `Word` type).

This means that any text encoding can be used.

The `Words` namespace contains functions to convert JavaScript data into refa-compatible words and characters.

### General limitations

This library will never be able to support some modern features of regex engines such as [backreferences](https://www.rexegg.com/regex-capture.html) and [recursion](https://www.rexegg.com/regex-recursion.html) because these features, generally, cannot be be represented by a DFA or NFA.


## Usage examples

refa is a relatively low-level library. It only provides the basic building blocks. In the following examples, JS RegExps are used a lot so we will define a few useful helper function beforehand.

```ts
import { DFA, FiniteAutomaton, JS, NFA } from "refa";

function toNFA(regex: RegExp): NFA {
	const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();
	return NFA.fromRegex(expression, { maxCharacter });
}
function toDFA(regex: RegExp): DFA {
	return DFA.fromFA(toNFA(regex));
}
function toRegExp(fa: FiniteAutomaton): RegExp {
	const literal = JS.toLiteral(fa.toRegex());
	return new RegExp(literal.source, literal.flags);
}
```

- `toNFA` parses the given RegExp and constructs a new NFA from the parsed AST.
- `toDFA` constructs a new NFA from the RegExp first and then converts that NFA into a new DFA.
- `toRegex` takes an FA (= NFA or DFA) and converts it into a RegExp.

### Testing whether a word is accepted

```ts
import { Words } from "refa";

const regex = /\w+\d+/;
const nfa = toNFA(regex);

console.log(nfa.test(Words.fromStringToUTF16("abc")));
// => false
console.log(nfa.test(Words.fromStringToUTF16("123")));
// => true
console.log(nfa.test(Words.fromStringToUTF16("abc123")));
// => true
console.log(nfa.test(Words.fromStringToUTF16("123abc")));
// => false
```

### Finding the intersection of two JS RegExps

```ts
const regex1 = /a+B+c+/i;
const regex2 = /Ab*C\d?/;

const intersection = NFA.fromIntersection(toNFA(regex1), toNFA(regex2));

console.log(toRegExp(intersection));
// => /Ab+C/
```

### Finding the complement of a JS RegExp

```ts
const regex = /a+b*/i;

const dfa = toDFA(regex);
dfa.complement();

console.log(toRegExp(dfa));
// => /(?:(?:[^A]|A+(?:[^AB]|B+[^B]))[^]*)?/i
```

### Converting a JS RegExp to an NFA

In the above examples, we have been using the `toNFA` helper function to parse and convert RegExps. This function assumes that the given RegExp is a pure regular expression without assertions and backreferences and will throw an error if the assumption is not met.

However, the JS parser and `NFA.fromRegex` provide some options to work around and even solve this problem.

#### Backreferences

Firstly, the parser will automatically resolve simple backreferences. Even `toNFA` will do this since it's on by default:

```ts
console.log(toRegExp(toNFA(/("|').*?\1/)));
// => /".*"|'.*'/i
```

But it will throw an error for non-trivial backreferences that cannot be resolved:

```ts
toNFA(/(#+).*\1|foo/);
// Error: Backreferences are not supported.
```

The only way to parse the RegExp despite unresolvable backreferences is to remove the backreferences. This means that the result will be imperfect but it might still be useful.

```ts
const regex = /(#+).*\1|foo/;
const { expression } =
	JS.Parser.fromLiteral(regex).parse({ backreferences: "disable" });

console.log(JS.toLiteral(expression));
// => { source: 'foo', flags: '' }
```

Note that the `foo` alternative is kept because it is completely unaffected by the unresolvable backreferences.

#### Assertions

While the parser and AST format can handle assertions, the NFA construction cannot.

```ts
const regex = /\b(?!\d)\w+\b|->/;
const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();

console.log(JS.toLiteral(expression));
// => { source: '\\b(?!\\d)\\w+\\b|->', flags: 'i' }

NFA.fromRegex(expression, { maxCharacter });
// Error: Assertions are not supported yet.
```

Similarly to backreferences, we can let the parser remove them:

```ts
const regex = /\b(?!\d)\w+\b|->/;
const { expression, maxCharacter } =
	JS.Parser.fromLiteral(regex).parse({ assertions: "disable" });

console.log(JS.toLiteral(expression));
// => { source: '->', flags: 'i' }

const nfa = NFA.fromRegex(expression, { maxCharacter });
console.log(toRegExp(nfa));
// => /->/i
```

<details>

Or we can let the NFA construction method remove them:

```ts
const regex = /\b(?!\d)\w+\b|->/;
const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();

console.log(JS.toLiteral(expression));
// => { source: '\\b(?!\\d)\\w+\\b|->', flags: 'i' }

const nfa = NFA.fromRegex(expression, { maxCharacter }, { assertions: "disable" });
console.log(toRegExp(nfa));
// => /->/i
```

Prefer using the parser to remove assertions if possible. The parser is quite clever and will optimize based on that assertions can be removed resulting in faster parse times.

</details>

However, simply removing assertions is not ideal since they are a lot more common than backreferences. To work around this, refa has AST transformers. AST transformers can make changes to a given AST. While each transformer is rather simple, they can also work together to accomplish more complex tasks. Applying and removing assertions is one such task.

The details about the transformers used in this example can be found in their documentation.

```ts
import { combineTransformers, JS, NFA, transform, Transformers } from "refa";

const regex = /\b(?!\d)\w+\b|->/;
const { expression, maxCharacter } = JS.Parser.fromLiteral(regex).parse();

console.log(JS.toLiteral(expression));
// => { source: '\\b(?!\\d)\\w+\\b|->', flags: 'i' }

const applyTransformer = combineTransformers([
	Transformers.inline(),
	Transformers.removeDeadBranches(),
	Transformers.removeUnnecessaryAssertions(),
	Transformers.sortAssertions(),
	Transformers.applyAssertions(),
	Transformers.removeUnnecessaryAssertions(),
]);
const modifiedExpression = transform(applyTransformer, expression);

console.log(JS.toLiteral(modifiedExpression));
// => { source: '(?<!\\w)[A-Z_]\\w*(?!\\w)|->', flags: 'i' }

// Most assertions have been removed but the patterns are still equivalent.
// The only assertions left assert characters beyond the edge of the pattern.
// Removing those assertions is easy but slightly changes the pattern.

const finalExpression = transform(
	Transformers.patternEdgeAssertions({ remove: true }),
	modifiedExpression
);

console.log(JS.toLiteral(finalExpression));
// => { source: '[A-Z_]\\w*|->', flags: 'i' }

const nfa = NFA.fromRegex(finalExpression, { maxCharacter });

console.log(JS.toLiteral(nfa.toRegex()));
// => { source: '->|[A-Z_]\\w*', flags: 'i' }
```

AST transformers can handle a lot of assertions but there are limitations. Transformers cannot handle assertions that are too complex or require large-scale changes to the AST.
