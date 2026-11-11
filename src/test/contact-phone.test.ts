import { describe, expect, it } from "vitest";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/config";

describe("business phone", () => {
  it("displays the number exactly as given", () => {
    expect(CONTACT_PHONE_DISPLAY).toBe("+91 70222 59460");
  });
  it("links as a tel: href with no spaces", () => {
    expect(CONTACT_PHONE_TEL).toBe("+917022259460");
    expect(CONTACT_PHONE_DISPLAY.replace(/\s/g, "")).toBe(CONTACT_PHONE_TEL);
  });
});
