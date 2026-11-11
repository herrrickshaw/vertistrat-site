import { describe, expect, it } from "vitest";
import { hasInteractiveCharts, sanitizePost } from "./sanitizePost";

describe("post sanitization", () => {
  it("removes scripts, event handlers and javascript URLs", () => {
    const html = sanitizePost('<p>Hello</p><script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">Bad</a>');
    expect(html).not.toMatch(/<script|onerror|javascript:/i);
    expect(html).toContain("Hello");
  });
  it("keeps style elements and inline styles", () => {
    const html = sanitizePost('<style>.post { color: red; }</style><p style="color: blue">Styled</p>');
    expect(html).toContain('<style>.post { color: red; }</style>');
    expect(html).toContain('style="color: blue"');
  });
  it("removes embedded frames and form controls", () => {
    expect(sanitizePost('<iframe src="https://example.com"></iframe><object></object><embed><form><input><button>Send</button></form>')).not.toMatch(/<(?:iframe|object|embed|form|input|button)\b/i);
  });
  it("removes the translate widget and its wrapper", () => {
    expect(sanitizePost('<div><span>Translate</span><div id="google_translate_element"></div></div><p>Keep article</p>')).not.toContain("Translate");
    expect(sanitizePost('<div id="google_translate_element"></div><p>Keep article</p>')).toContain("Keep article");
  });
  it("opens post links safely in a new tab", () => {
    const html = sanitizePost('<a href="https://example.com">Source</a>');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
  it("keeps the article when the widget is a direct child of its outer container", () => {
    const html = sanitizePost('<div><style>p{color:red}</style><div id="google_translate_element"></div><p>Article text</p><table><tr><td>Data</td></tr></table></div>');
    expect(html).toContain("Article text");
    expect(html).toContain("<table>");
    expect(html).not.toContain("google_translate_element");
  });
  it("flags chart scripts but excludes translate and accordion loaders", () => {
    expect(hasInteractiveCharts('<script>new Chart(canvas, options)</script>')).toBe(true);
    expect(hasInteractiveCharts('<script>googleTranslateElementInit()</script><script>loadAccordion()</script>')).toBe(false);
  });
});