import { describe, expect, it } from "vitest";
import { OFFICE_ADDRESS_LINES, OFFICE_MAP_EMBED_URL } from "@/config";

describe("operating office", () => {
  it("uses a Google Maps embed URL", () => {
    expect(OFFICE_MAP_EMBED_URL.startsWith("https://www.google.com/maps")).toBe(true);
    expect(OFFICE_MAP_EMBED_URL).toContain("output=embed");
  });
  it("includes the office postal code 600095", () => {
    expect(OFFICE_ADDRESS_LINES.join(" ")).toContain("600095");
  });
});