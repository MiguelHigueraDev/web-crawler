import { describe, it, expect } from "vitest";
import { getURLsFromHTML, normalizeURL } from "./crawl";

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

describe("getURLsFromHTML", () => {
  it("should extract absolute URLs", () => {
    const inputHTML = `
    <html>
        <body>
            <a href="https://www.google.com">Google</a>
        </body>
    </html>
    `;
    const baseURL = "https://www.google.com";
    const expected = ["https://www.google.com/"];
    const result = getURLsFromHTML(inputHTML, baseURL);
    expect(result).toEqual(expected);
  });
});
