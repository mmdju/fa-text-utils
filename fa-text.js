// fa-text-utils: tiny Persian text helpers for search.
// Zero dependencies, Node 18+.
//
// Iranian keyboards produce two spellings of the same word: Arabic yeh/kaf
// (ي ك) vs Persian (ی ک), Persian digits (۰۱۲۳) vs ASCII, and compound words
// written three ways (لپ تاپ / لپ‌تاپ / لپتاپ). Two spellings of one word
// are two different queries upstream - fold them into one canonical form.

export const ZWNJ = "\u200C";

const FOLD = [
  [/[\u064A\u0649]/g, "\u06CC"], // ي ى -> ی
  [/[\u0643]/g, "\u06A9"], // ك -> ک
  [/[\u0629]/g, "\u0647"], // ة -> ه
  [/[\u0623\u0625\u0622]/g, "\u0627"], // أ إ آ -> ا
  [/[\u064B-\u0652\u0640\u0670]/g, ""], // harakat + tatweel
  [/[\u200B\u200E\u200F\u202A-\u202E]/g, ""], // zero-width + direction marks
];

// ٠-٩ (U+0660), ۰-۹ (U+06F0), ०-९ (U+0966) all mean the same digits.
function foldDigits(s) {
  return s.replace(/[\u0660-\u0669\u06F0-\u06F9\u0966-\u096F]/g, (ch) => {
    const c = ch.codePointAt(0) ?? 0;
    if (c >= 0x0660 && c <= 0x0669) return String(c - 0x0660);
    if (c >= 0x06f0 && c <= 0x06f9) return String(c - 0x06f0);
    return String(c - 0x0966);
  });
}

function str(v, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

// Fold Arabic characters, digits and whitespace into one canonical form.
// ZWNJ is kept - it is meaningful in Persian. Use faSearchVariants to expand.
export function faFold(input) {
  let s = str(input);
  for (const [re, to] of FOLD) s = s.replace(re, to);
  s = foldDigits(s);
  return s.replace(/\s+/g, " ").trim();
}

// All spellings of a compound word, for fallback search.
// Fold first, then expand spaces into ZWNJ and joined forms.
// Use only as a fallback when the first search comes back empty.
export function faSearchVariants(input) {
  const folded = faFold(input);
  const spaced = folded.replace(/[‌‍]/g, " ").replace(/\s+/g, " ").trim();
  const out = [spaced];
  if (spaced.includes(" ")) {
    out.push(spaced.replace(/ /g, ZWNJ));
    out.push(spaced.replace(/ /g, ""));
  }
  return [...new Set(out.filter(Boolean))];
}
