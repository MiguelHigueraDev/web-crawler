import { describe, it, expect } from "vitest";
import { normalizeURL } from "./crawl";

describe("normalizeURL", () => {
  it("should normalize a URL", () => {
    const input = "https://www.google.com/";
    const expected = "google.com";
    const result = normalizeURL(input);
    expect(result).toBe(expected);
  });

  it("should normalize a URL with a path", () => {
    const input = "https://www.google.com/path";
    const expected = "google.com/path";
    const result = normalizeURL(input);
    expect(result).toBe(expected);
  });
});
