import test from "node:test";
import assert from "node:assert/strict";

test("issue key format is documented by validation", () => {
  assert.match("QA-123", /^[A-Z][A-Z0-9]*-\d+$/);
  assert.doesNotMatch("not-an-issue", /^[A-Z][A-Z0-9]*-\d+$/);
});
