// node --test test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { faFold, faSearchVariants } from "./fa-text.js";

test("arabic yeh/kaf fold to persian", () => {
  assert.equal(faFold("علي"), "علی");
  assert.equal(faFold("كتاب"), "کتاب");
});

test("persian digits become ascii", () => {
  assert.equal(faFold("۱۲۳"), "123");
  assert.equal(faFold("٠١٢"), "012");
});

test("compound word yields space, ZWNJ and joined", () => {
  assert.deepEqual(faSearchVariants("لپ تاپ"), ["لپ تاپ", "لپ‌تاپ", "لپتاپ"]);
});

test("single word yields one variant", () => {
  assert.deepEqual(faSearchVariants("گوشی"), ["گوشی"]);
});

test("zwnj input re-expands the same way", () => {
  assert.deepEqual(faSearchVariants("لپ‌تاپ"), ["لپ تاپ", "لپ‌تاپ", "لپتاپ"]);
});

test("empty input yields nothing", () => {
  assert.deepEqual(faSearchVariants("   "), []);
});
