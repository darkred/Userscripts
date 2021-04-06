# Changelog

## 0.7.1 (2021-03-09)

### Fixed

- Backreferences in ignore-case JS RegExps are now correctly resolved ([#25](https://github.com/RunDevelopment/refa/issues/25)).


## 0.7.0 (2021-02-25)

### Breaking changes

- `FiniteAutomaton.test` now requires a `ReadonlyArray` instead of an `Iterable`.
- `Words.wordSetToWords` now returns an `Iterable` instead of an `IterableIterator`.
- Removed `toPatternString` function.
- Removed `NFA.FromRegexOptions.disableLookarounds`. Use `NFA.FromRegexOptions.assertions` instead.
- AST format: Quantifier nodes now have a lazy property to enable non-greedy quantifiers.
- `JS.Parser` no longer implements `JS.Literal`. Use the `JS.Parser.literal` property instead.
- `JS.Parser` now resolves backreferences differently. It now supports resolving capturing groups with finite small languages. How small the language is required to be can be controlled via the new `JS.ParseOptions.maxBackreferenceWords` option (defaults to 100 words). `JS.ParseOptions.backreferences` also works differently now. See the `JS.ParseOptions` documentation for more details.
- Some renaming:
	- `JS.ParseOptions.lookarounds` -> `JS.ParseOptions.assertions`
	- `ToRegexOptions.maximumNodes` -> `ToRegexOptions.maxNodes`
	- `ToRegexOptions.maximumOptimizationPasses` -> `ToRegexOptions.maxOptimizationPasses`

### Fixed

- `Words.fromStringToUTF16` now works properly.
- `JS.toLiteral` will now properly detect predefined character sets in character classes. This didn't work properly before.

### Added

- Documentation. A lot of code documentation and a TypeDoc-generated website have been added.
- New `Char`, `Word`, and `ReadonlyWord` types replace the old plain number and iterable types.
- AST transformers. They can efficiently modify a given AST and are used to e.g. apply assertions.
- `JS.ParseOptions` now has a `maxNodes` option to limit the size of the parsed AST.
- `JS.Parser` now has a `maxCharacter` property.

### Changed

- `NFA.test` now implements [Thompson's algorithm](https://swtch.com/~rsc/regexp/regexp1.html) which guarantees efficient execution.
- The `toRegex` methods of the DFA and NFA classes now use AST transformers under the hood to produce smaller ASTs.
- The default value of `ToRegexOptions.maxOptimizationPasses` is now implementation-defined.


## 0.6.0 (2020-12-22)

### Breaking changes

- `DFA#clone` has been renamed to `DFA#copy` to be compatible with `NFA#copy`.
- The `source` property of RE AST nodes is now optional. This results in the removal/change of several types and functions. The `Simple` type has been removed; use `NoParent` instead.

### Added

- `JS.toLiteral` now has a `flags` options to force/disallow certain flags and a `fastCharacters` options for up to 10x better performance.
- `JS.toLiteral` now detects builtin assertions.

### Changed

- All DFA and NFA creation methods now have safe defaults and will throw if the FA that is being created is too large. The limit can be controlled using the `maxNodes` option.


## 0.5.0 (2020-10-26)

### Breaking changes

- Remove `NFA.fromDFA` and `DFA.fromNFA`. Use `{DFA,NFA}.fromFA` instead.
- Renamed `NFA#removeEmptyWord` to `NFA#withoutEmptyWord`.
- All `NFA`/`DFA`-specific interfaces/classes now live in the `NFA`/`DFA` namespace.

### Added

- New `FAIterator` interface.
- New options for `#toRegex` functions.
- `NFA#reverse` will reverse the accepted language.
- `CharSet#commonCharacter` can used to return any character two sets have in common.
- New `Words` methods to pick as-readable-as-possible words or characters from a set of words or characters.

### Changed

- Unified `DFA`/`NFA` API. This gives `DFA` a lot of functionality that used to be `NFA`-exclusive.
- `JS.toLiteral` will now print smaller character classes.
- New build system.

### Fixed

- A few minor bug fixes.


## 0.4.1 (2020-08-29)

### Changed

- NFA intersection performance optimizations by using lazy data structures. `NFA#disjointWith` is now a lot faster.

### Fixed

- Fixed NFA intersection always discarding the empty word. The intersection can now contain the empty word.


## 0.4.0 (2020-08-23)

### Breaking changes

- Removed `JS.toSource`. Use `JS.toLiteral` instead.

### Added

- `NFA#suffixes()` will change the NFA to accepts all suffixes of its language.
- New options for intersection operations.
- Added a method to count the number of nodes in DFA and NFA.
- `DFA#complement()` will make the DFA match the opposite language.
- New options for the DFA creation operation.
- New `ReadonlyDFA` interface.
- New `ReadonlyCharMap<T>` interface.
- `CharSet#compare(CharSet)` will compare two character sets. This can be used to sort character sets.
- Added regex stress test. This will check common operations on all 2.5K regexes of the PrismJS syntax highlighter.

### Changed

- The RE produced by the `toRegex` functions is now optimized to be as minimal as possible.
- `JS.toLiteral` will now make efficient use of flags to produce smaller literals.

### Fixed

- Fixed and improved `DFA.minimize()`.
- Fixed `CharMap`'s AVL tree implementation.
- Underlying implementation of the `toRegex` functions will now the correct AST and that much faster.
- Fixed `filterMut` in util.
- `toPatternString` now correctly handles quantified empty concatenations.


## 0.3.1 (2020-08-09)

### Fixed

- The prefix and suffix optimization removed final states from the graph but not from the set of final states.
- The intersection algorithm can now handle final states not reachable from the initial states of either NFAs.


## 0.3.0 (2020-07-11)

### Breaking changes

- New `JS.Parser` API.
- Removed `MutSimple` interface.

### Added

- `CharSet#size` returns the number of characters in the set.
- `NFA#prefixes()` will change the NFA such that it accepts all prefixes of itself.
- New `ReadonlyNFA` interface.
- New `FAIterator` interface as an abstraction over different FA representations. This is now the basis for virtually all FA operations that don't change the underlying data structure.
- New `NoParent` and `NoSource` interface for AST nodes.

### Changed

- Better `Flags` interface for JS functions.
- Some minor improvements.

### Fixed

- The prefix and suffix optimizations of the NFA construction didn't check the equivalence of states correctly.


## 0.2.2 (2020-05-04)

### Fixed

- Added a `prepublish` script to actually publish changes.


## 0.2.1 (2020-05-04)

### Fixed

- Calling `CharSet#isSubsetOf` caused a stack overflow because of infinite recursion.


## 0.2.0 (2020-05-03)

### Breaking changes

- New `CharSet` API. This renames some of `has*` methods, to instead use names based on set relations.
- `NFA#concat` is now called `append`.
- `NodeList#final` is now called `finals` for both DFA and NFA nodes lists.
- `NFANode#in` and `NFANode#out` are now of type `ReadonlyMap` instead of `Map`.

### Added

- New options for `NFA.fromRegex` to disable assertions instead of throwing an error and to simplify quantifiers with a huge maximum.
- New `NFA#prepend` method.
- Added changelog.

### Changed

- `CharSet#toString` now uses a simple hexadecimal format.

### Fixed

- `NFA#append` modified the given NFA.


## 0.1.1 (2020-04-05)

### Fixed

- Fixed repository link in `package.json`.


## 0.1.0 (2020-04-05)

Initial release
