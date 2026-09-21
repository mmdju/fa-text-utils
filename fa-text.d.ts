export declare const ZWNJ: "\u200C";

/** Fold Arabic characters, digits and whitespace into one canonical form. ZWNJ is kept. */
export declare function faFold(input: unknown): string;

/** All spellings of a compound word (space, ZWNJ, joined), for fallback search. */
export declare function faSearchVariants(input: unknown): string[];
