import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  NOTIFICATIONS,
  PLANTS,
  authorisationEnds,
  isCurrent,
  notificationById,
} from "@/data/biogasFomAuthorisations";
import { formatDate } from "@/lib/feeds";
import { BiogasFomRegister } from "./BiogasFomRegister";

// Rendering whole pages is slow on a busy CI runner.
vi.setConfig({ testTimeout: 30_000 });

const NOW = new Date("2026-11-18T12:00:00Z");

const expired = PLANTS.filter((p) => !isCurrent(notificationById(p.notification).published, NOW));
const current = PLANTS.filter((p) => isCurrent(notificationById(p.notification).published, NOW));

const status = () => screen.getByRole("status");
const bodyRows = () => Array.from(document.querySelectorAll<HTMLElement>("tbody tr"));
const cellsOf = (row: HTMLElement) => Array.from(row.querySelectorAll<HTMLElement>("td"));
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;

function renderRegister(now: Date = NOW) {
  return render(<BiogasFomRegister now={now} />);
}

describe("BiogasFomRegister summary", () => {
  it("states the totals for the reference date", () => {
    renderRegister();
    expect(
      screen.getByText(
        `${PLANTS.length} entries · ${current.length} current · ${expired.length} expired · read 18 Nov 2026`,
      ),
    ).toBeInTheDocument();
    expect(current.length).toBe(122);
    expect(expired.length).toBe(27);
  });

  it("counts the gazette orders in the intro", () => {
    renderRegister();
    expect(
      screen.getByText(new RegExp(`from ${NOTIFICATIONS.length}\\s+gazette orders`)),
    ).toBeInTheDocument();
  });

  it("recomputes current and expired counts for a different date", () => {
    renderRegister(new Date("2027-06-01T00:00:00Z"));
    const stillCurrent = PLANTS.filter((p) =>
      isCurrent(notificationById(p.notification).published, new Date("2027-06-01T00:00:00Z")),
    ).length;
    expect(stillCurrent).toBeLessThan(current.length);
    expect(
      screen.getByText(
        new RegExp(`${stillCurrent} current · ${PLANTS.length - stillCurrent} expired`),
      ),
    ).toBeInTheDocument();
  });

  it("defaults the reference date to the real current date", () => {
    render(<BiogasFomRegister />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("BiogasFomRegister filters", () => {
  it("shows only current plants by default", () => {
    renderRegister();
    expect(status()).toHaveTextContent(`${current.length} of ${PLANTS.length} entries shown`);
    expect(bodyRows()).toHaveLength(current.length);
    expect(screen.queryAllByText("Expired", { selector: "span" })).toHaveLength(0);
  });

  it("shows only expired plants, each flagged Expired", () => {
    renderRegister();
    fireEvent.change(select("Status"), { target: { value: "expired" } });
    expect(bodyRows()).toHaveLength(expired.length);
    expect(screen.getAllByText("Expired", { selector: "span" })).toHaveLength(expired.length);
    expect(status()).toHaveTextContent(`${expired.length} of ${PLANTS.length} entries shown`);
  });

  it("shows everything with status All, flagging only the expired rows", () => {
    renderRegister();
    fireEvent.change(select("Status"), { target: { value: "all" } });
    expect(bodyRows()).toHaveLength(PLANTS.length);
    expect(screen.getAllByText("Expired", { selector: "span" })).toHaveLength(expired.length);
  });

  it("filters by state and lists each state once, sorted, after ALL", () => {
    renderRegister();
    const states = [...new Set(PLANTS.map((p) => p.state))].sort();
    const options = Array.from(select("State").options).map((o) => o.value);
    expect(options).toEqual(["ALL", ...states]);

    fireEvent.change(select("Status"), { target: { value: "all" } });
    const target = states[0]!;
    fireEvent.change(select("State"), { target: { value: target } });
    const expectedCount = PLANTS.filter((p) => p.state === target).length;
    expect(bodyRows()).toHaveLength(expectedCount);
    for (const row of bodyRows()) expect(cellsOf(row)[1]).toHaveTextContent(target);
  });

  it("filters by listed parent and lists each parent once, sorted", () => {
    renderRegister();
    const parents = [...new Set(PLANTS.flatMap((p) => (p.parent ? [p.parent] : [])))].sort();
    const options = Array.from(select("Listed parent").options).map((o) => o.value);
    expect(options).toEqual(["ALL", ...parents]);

    fireEvent.change(select("Status"), { target: { value: "all" } });
    fireEvent.change(select("Listed parent"), { target: { value: "GAIL" } });
    const expectedCount = PLANTS.filter((p) => p.parent === "GAIL").length;
    expect(expectedCount).toBeGreaterThan(0);
    expect(bodyRows()).toHaveLength(expectedCount);
    for (const row of bodyRows()) expect(cellsOf(row)[3]).toHaveTextContent("GAIL");
  });

  it("searches plant name, place and state case-insensitively and ignores surrounding space", () => {
    renderRegister();
    fireEvent.change(select("Status"), { target: { value: "all" } });
    const first = PLANTS[0]!;
    const search = screen.getByLabelText("Search");
    const expectedFor = (needle: string) =>
      PLANTS.filter((p) => `${p.name} ${p.place} ${p.state}`.toLowerCase().includes(needle)).length;

    fireEvent.change(search, { target: { value: `  ${first.name.toUpperCase()}  ` } });
    expect(bodyRows()).toHaveLength(expectedFor(first.name.toLowerCase()));

    const placeWord = first.place.split(",")[0]!.trim();
    fireEvent.change(search, { target: { value: placeWord.toLowerCase() } });
    expect(bodyRows()).toHaveLength(expectedFor(placeWord.toLowerCase()));
    expect(bodyRows().length).toBeGreaterThan(0);

    fireEvent.change(search, { target: { value: first.state.toLowerCase() } });
    expect(bodyRows()).toHaveLength(expectedFor(first.state.toLowerCase()));
  });

  it("treats a blank search as no filter", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "    " } });
    expect(bodyRows()).toHaveLength(current.length);
  });

  it("combines filters with AND", () => {
    renderRegister();
    fireEvent.change(select("Status"), { target: { value: "all" } });
    fireEvent.change(select("Listed parent"), { target: { value: "GAIL" } });
    const gail = PLANTS.filter((p) => p.parent === "GAIL");
    const state = gail[0]!.state;
    fireEvent.change(select("State"), { target: { value: state } });
    expect(bodyRows()).toHaveLength(gail.filter((p) => p.state === state).length);
  });

  it("says so when nothing matches", () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "zzzz-no-such-plant" } });
    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByText("No plants match these filters.")).toBeInTheDocument();
    expect(status()).toHaveTextContent(`0 of ${PLANTS.length} entries shown`);
  });
});

describe("BiogasFomRegister table", () => {
  it("has the six column headings", () => {
    renderRegister();
    expect(screen.getAllByRole("columnheader").map((h) => h.textContent)).toEqual([
      "Plant or manufacturer",
      "State",
      "Location",
      "Listed parent",
      "Gazette order",
      "Authorised until",
    ]);
  });

  it("sorts newest gazette order first and keeps source order within an order", () => {
    renderRegister();
    fireEvent.change(select("Status"), { target: { value: "all" } });
    const rows = bodyRows();
    const published = rows.map((row) => {
      const so = cellsOf(row)[4]!.querySelector("a")!.textContent;
      return NOTIFICATIONS.find((n) => n.so === so)!.published;
    });
    expect(published).toEqual([...published].sort().reverse());
    const newest = [...NOTIFICATIONS].sort((a, b) => b.published.localeCompare(a.published))[0]!;
    const firstOfNewest = PLANTS.find((p) => p.notification === newest.id)!;
    expect(cellsOf(rows[0]!)[0]).toHaveTextContent(firstOfNewest.name);
  });

  it("links the gazette order and shows its date and the authorisation end date", () => {
    renderRegister();
    fireEvent.change(select("Status"), { target: { value: "expired" } });
    const n1 = notificationById("n1");
    const row = bodyRows().find((r) => within(r).queryByRole("link", { name: n1.so }))!;
    const cells = cellsOf(row);
    const link = within(cells[4]!).getByRole("link", { name: n1.so });
    expect(link).toHaveAttribute("href", n1.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(cells[4]).toHaveTextContent("14 Nov 2023");
    expect(authorisationEnds(n1.published)).toBe("2026-11-14");
    expect(cells[5]).toHaveTextContent("14 Nov 2026");
    expect(cells[5]).toHaveTextContent("Expired");
  });

  it("shows a dash when a plant has no listed parent", () => {
    renderRegister();
    fireEvent.change(select("Status"), { target: { value: "all" } });
    const orphan = PLANTS.find((p) => !p.parent)!;
    const row = bodyRows().find((r) => cellsOf(r)[0]!.textContent === orphan.name)!;
    expect(cellsOf(row)[3]).toHaveTextContent("—");
  });
});

describe("BiogasFomRegister notes", () => {
  it("lists every order read with its date, entry count, amendment note and a link", () => {
    renderRegister();
    const para = screen.getByText(/Orders read:/).closest("p")!;
    const text = para.textContent!.replace(/\s+/g, " ");
    for (const n of NOTIFICATIONS) {
      const link = Array.from(para.querySelectorAll("a")).find((a) => a.textContent === n.so);
      expect(link, n.so).toBeDefined();
      expect(link).toHaveAttribute("href", n.url);
      expect(text).toContain(`${n.so} (${formatDate(n.published)}, ${n.entries})`);
      if (n.amendedBy) expect(text).toContain(`amended by ${n.amendedBy}`);
    }
    expect(NOTIFICATIONS.some((n) => n.amendedBy)).toBe(true);
    expect((text.match(/amended by/g) ?? []).length).toBe(
      NOTIFICATIONS.filter((n) => n.amendedBy).length,
    );
  });

  it("ends the orders list with a full stop and separates the others with semicolons", () => {
    renderRegister();
    const para = screen.getByText(/Orders read:/).closest("p")!;
    const text = para.textContent!;
    expect(text.trimEnd().endsWith(".")).toBe(true);
    expect((text.match(/; /g) ?? []).length).toBeGreaterThanOrEqual(NOTIFICATIONS.length - 1);
  });
});
