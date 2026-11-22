import { fireEvent, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BLOG_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  DISCLAIMER,
  OFFICE_ADDRESS_LINES,
  OFFICE_MAP_URL,
} from "@/config";
import { renderWithRouter } from "@/test/renderWithRouter";
import { Footer, Header } from "./Shell";

const NAV_HREFS = [
  "/about",
  "/manufacturing",
  "/it-services",
  "/biofuels-energy",
  "/insights",
  "/trade-ideas",
];

afterEach(() => {
  vi.useRealTimers();
});

describe("Header", () => {
  it("has a skip link, a home link and the main navigation to every page", () => {
    renderWithRouter(<Header />);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    expect(screen.getByRole("link", { name: "VertiStrat home" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Main", hidden: true });
    const hrefs = within(nav)
      .getAllByRole("link", { hidden: true })
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([...NAV_HREFS, "/#contact"]);
  });

  it("labels the contact call to action", () => {
    renderWithRouter(<Header />);
    const nav = screen.getByRole("navigation", { name: "Main", hidden: true });
    expect(within(nav).getByRole("link", { name: "Contact", hidden: true })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("keeps the mobile menu closed until the button is pressed", () => {
    renderWithRouter(<Header />);
    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "mnav");
    expect(screen.queryByRole("navigation", { name: "Mobile", hidden: true })).toBeNull();
  });

  it("opens the mobile menu with every page plus contact, and the button becomes Close", () => {
    renderWithRouter(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    const close = screen.getByRole("button", { name: "Close" });
    expect(close).toHaveAttribute("aria-expanded", "true");
    const mobile = screen.getByRole("navigation", { name: "Mobile", hidden: true });
    expect(mobile).toHaveAttribute("id", "mnav");
    const hrefs = within(mobile)
      .getAllByRole("link", { hidden: true })
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([...NAV_HREFS, "/#contact"]);
  });

  it("closes the mobile menu when Close is pressed", () => {
    renderWithRouter(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("navigation", { name: "Mobile", hidden: true })).toBeNull();
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });

  it("closes the mobile menu after a link is followed", () => {
    renderWithRouter(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    const mobile = screen.getByRole("navigation", { name: "Mobile", hidden: true });
    fireEvent.click(within(mobile).getByRole("link", { name: "About", hidden: true }));
    expect(screen.queryByRole("navigation", { name: "Mobile", hidden: true })).toBeNull();
  });
});

describe("Footer", () => {
  it("shows the contact details from config", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByRole("link", { name: CONTACT_EMAIL })).toHaveAttribute(
      "href",
      `mailto:${CONTACT_EMAIL}`,
    );
    expect(screen.getByRole("link", { name: CONTACT_PHONE_DISPLAY })).toHaveAttribute(
      "href",
      `tel:${CONTACT_PHONE_TEL}`,
    );
  });

  it("prints every office address line and an external map link", () => {
    renderWithRouter(<Footer />);
    for (const line of OFFICE_ADDRESS_LINES) expect(screen.getByText(line)).toBeInTheDocument();
    const map = screen.getByRole("link", { name: /Map/ });
    expect(map).toHaveAttribute("href", OFFICE_MAP_URL);
    expect(map).toHaveAttribute("target", "_blank");
    expect(map).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lists the pages and an external blog link", () => {
    renderWithRouter(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([...NAV_HREFS, BLOG_URL]);
    expect(links.at(-1)).toHaveAttribute("target", "_blank");
    expect(links.at(-1)).toHaveTextContent("(opens in new tab)");
  });

  it("shows the disclaimer and the non-affiliation notice", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(DISCLAIMER)).toBeInTheDocument();
    expect(screen.getByText(/Not affiliated with any government agency/)).toBeInTheDocument();
  });

  it("uses the current year in the copyright line", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-06-15T00:00:00Z"));
    renderWithRouter(<Footer />);
    expect(screen.getByText(/^© 2031 VertiStrat Solutions LLP/)).toBeInTheDocument();
  });
});
