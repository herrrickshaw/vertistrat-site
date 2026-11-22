import { describe, expect, it } from "vitest";
import { renderErrorPage } from "./error-page";

describe("renderErrorPage", () => {
  const html = renderErrorPage();

  it("is a complete HTML5 document", () => {
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<html lang="en">');
    expect(html.trimEnd().endsWith("</html>")).toBe(true);
  });

  it("tells the visitor the page did not load", () => {
    expect(html).toContain("<title>This page didn't load</title>");
    expect(html).toContain("<h1>This page didn't load</h1>");
  });

  it("offers a reload button and a link home", () => {
    expect(html).toContain(
      '<button class="primary" onclick="location.reload()">Try again</button>',
    );
    expect(html).toContain('<a class="secondary" href="/">Go home</a>');
  });

  it("is self-contained: no external scripts, styles or images", () => {
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<link/i);
    expect(html).not.toMatch(/src=/i);
  });

  it("renders to the same markup every time", () => {
    expect(renderErrorPage()).toBe(html);
  });
});
