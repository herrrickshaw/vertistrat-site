import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("supports conditional object and array syntax", () => {
    expect(cn({ a: true, b: false }, ["c", { d: true }])).toBe("a c d");
  });

  it("lets a later tailwind utility override a conflicting earlier one", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("keeps non-conflicting utilities", () => {
    expect(cn("p-2", "m-2")).toBe("p-2 m-2");
  });

  it("returns an empty string for no input", () => {
    expect(cn()).toBe("");
  });
});
