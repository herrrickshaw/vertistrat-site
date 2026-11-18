import { describe, expect, it } from "vitest";
import { NOTIFICATIONS, PLANTS, authorisationEnds, isCurrent } from "./biogasFomAuthorisations";

describe("biogas FOM authorisations", () => {
  it("lists as many plants per order as the gazette table has entries", () => {
    for (const n of NOTIFICATIONS) {
      expect(PLANTS.filter((p) => p.notification === n.id).length, n.so).toBe(n.entries);
    }
    expect(PLANTS.length).toBe(149);
  });

  it("runs each authorisation for three years from publication", () => {
    expect(authorisationEnds("2023-11-14")).toBe("2026-11-14");
    expect(isCurrent("2023-11-14", new Date("2026-11-13T12:00:00Z"))).toBe(true);
    expect(isCurrent("2023-11-14", new Date("2026-11-18T12:00:00Z"))).toBe(false);
    expect(isCurrent("2024-03-15", new Date("2026-11-18T12:00:00Z"))).toBe(true);
  });

  it("counts 27 expired and 122 current entries on 18 November 2026", () => {
    const now = new Date("2026-11-18T12:00:00Z");
    const live = PLANTS.filter((p) =>
      isCurrent(NOTIFICATIONS.find((n) => n.id === p.notification)!.published, now),
    );
    expect(live.length).toBe(122);
  });

  it("tags the eight Reliance plants of the July 2025 order", () => {
    expect(
      PLANTS.filter((p) => p.notification === "n5" && p.parent === "Reliance Industries").length,
    ).toBe(8);
  });
});
