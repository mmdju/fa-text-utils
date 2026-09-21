# fa-text-utils

Tiny Persian text helpers for search. Zero dependencies, runs on Node 18+.

Iranian keyboards produce two spellings of the same word: Arabic yeh/kaf (ي ك) vs Persian (ی ک), Persian digits (۰۱۲۳) vs ASCII, and compound words written three ways (لپ تاپ / لپ‌تاپ / لپتاپ). Two spellings of one word are two different queries upstream. These helpers fold them into one canonical form.

## Install

Install it as a dependency (`npm install github:mmdju/fa-text-utils`) so the folding lives in one place, or copy `fa-text.js` into your project if you would rather vendor it. No build step and no runtime dependency either way.

```js
import { faFold, faSearchVariants } from "fa-text-utils";
```

## `faFold(text)`

Fold Arabic characters, digits and whitespace into one canonical form.

```js
faFold("لپ تاپ"); // "لپ تاپ"
faFold("لپ‌تاپ"); // "لپ‌تاپ" (ZWNJ kept - use faSearchVariants to expand)
faFold("۱۲۳"); // "123"
```

Folds Arabic yeh/kaf (ي → ی, ك → ک), ta marbuta (ة → ه), alef variants (أ إ آ → ا), strips harakat/tatweel and direction marks, converts Arabic-Indic/Persian/Devanagari digits to ASCII, collapses whitespace. **ZWNJ is kept** - it is meaningful in Persian.

## `faSearchVariants(text)`

All spellings of a compound word, for fallback search.

```js
faSearchVariants("لپ تاپ");
// ["لپ تاپ", "لپ‌تاپ", "لپتاپ"]
faSearchVariants("گوشی");
// ["گوشی"]
```

Fold first, then expand spaces into ZWNJ and joined forms. Use only as a **fallback when the first search comes back empty** - the happy path stays a single request.

## Rules

- Fold **both** the query and the indexed text with the same function, or folding buys nothing.
- Never strip ZWNJ in `faFold` - expand it in `faSearchVariants` instead.
- Digits fold to ASCII: compare and sort on the folded form.

## Used in

Powers the Persian search of [digikala-mcp](https://github.com/mmdju/digikala-mcp) and [divar-mcp](https://github.com/mmdju/divar-mcp) - both import the same folding from here instead of copying it, so the two can no longer drift apart.

## Test

```bash
node --test test.mjs
```

## License

MIT.
