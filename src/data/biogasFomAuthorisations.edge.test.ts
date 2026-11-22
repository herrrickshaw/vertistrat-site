import { describe, expect, it } from "vitest";
import {
  NOTIFICATIONS,
  PLANTS,
  authorisationEnds,
  isCurrent,
  notificationById,
} from "./biogasFomAuthorisations";

describe("authorisationEnds", () => {
  it("adds exactly three calendar years", () => {
    expect(authorisationEnds("2024-03-15")).toBe("2027-03-15");
    expect(authorisationEnds("2025-12-31")).toBe("2028-12-31");
  });

  it("rolls a leap day to 1 March in a non-leap year", () => {
    expect(authorisationEnds("2024-02-29")).toBe("2027-03-01");
  });
});

describe("isCurrent", () => {
  it("is current through the day before the end date and not on the end date", () => {
    expect(isCurrent("2023-11-14", new Date("2026-11-13T23:59:59Z"))).toBe(true);
    expect(isCurrent("2023-11-14", new Date("2026-11-14T00:00:00Z"))).toBe(false);
    expect(isCurrent("2023-11-14", new Date("2026-11-14T23:59:59Z"))).toBe(false);
  });

  it("is current before the order is even published", () => {
    expect(isCurrent("2030-01-01", new Date("2026-11-18T00:00:00Z"))).toBe(true);
  });
});

describe("notificationById", () => {
  it("finds every notification by its id", () => {
    for (const n of NOTIFICATIONS) expect(notificationById(n.id)).toBe(n);
  });

  it("returns the notification each plant refers to", () => {
    for (const p of PLANTS) expect(notificationById(p.notification).id).toBe(p.notification);
  });
});

describe("PLANTS", () => {
  it("only sets a parent when one was listed, so absent parents have no key", () => {
    const without = PLANTS.filter((p) => !p.parent);
    expect(without.length).toBeGreaterThan(0);
    for (const p of without) expect("parent" in p).toBe(false);
  });

  it("gives every plant a name, state and place", () => {
    for (const p of PLANTS) {
      expect(p.name.length, p.name).toBeGreaterThan(0);
      expect(p.state.length, p.name).toBeGreaterThan(0);
      expect(p.place.length, p.name).toBeGreaterThan(0);
    }
  });
});
