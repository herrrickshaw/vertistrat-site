import { fireEvent, render, screen, within } from "@testing-library/react";
import { Fuel, Leaf, Ship } from "lucide-react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "@/test/renderWithRouter";
import {
  CTA,
  Card,
  Chips,
  Contours,
  DotGrid,
  Eyebrow,
  IconChip,
  IconCluster,
  Logo,
  PageHero,
  Placeholder,
  PlantLine,
  SECTORS,
  Section,
  StatTile,
  Tile,
  bento,
  btn,
  muted,
  pageHead,
} from "./ui";

describe("pageHead", () => {
  const head = pageHead("About", "Who we are", "/about");

  it("suffixes the title with the firm name and uses it for the title and og:title", () => {
    expect(head.meta[0]).toEqual({ title: "About | VertiStrat Solutions LLP" });
    expect(head.meta).toContainEqual({
      property: "og:title",
      content: "About | VertiStrat Solutions LLP",
    });
  });

  it("carries the description, url and card metadata", () => {
    expect(head.meta).toContainEqual({ name: "description", content: "Who we are" });
    expect(head.meta).toContainEqual({ property: "og:description", content: "Who we are" });
    expect(head.meta).toContainEqual({ property: "og:url", content: "/about" });
    expect(head.meta).toContainEqual({ property: "og:type", content: "website" });
    expect(head.meta).toContainEqual({ name: "twitter:card", content: "summary_large_image" });
  });

  it("sets the canonical link to the path", () => {
    expect(head.links).toEqual([{ rel: "canonical", href: "/about" }]);
  });
});

describe("shared constants and class helpers", () => {
  it("lists nine sectors", () => {
    expect(SECTORS).toHaveLength(9);
    expect(new Set(SECTORS).size).toBe(9);
  });

  it("uses muted ink text only on the dark tones", () => {
    expect(muted("ink")).toBe("text-ink-muted");
    expect(muted("raised")).toBe("text-ink-muted");
    expect(muted("card")).toBe("text-muted-foreground");
    expect(muted("primary")).toBe("text-muted-foreground");
    expect(muted("amber")).toBe("text-muted-foreground");
  });

  it("exposes two distinct button styles and a bento grid class", () => {
    expect(btn.primary).toContain("bg-primary");
    expect(btn.outline).toContain("border");
    expect(btn.primary).not.toBe(btn.outline);
    expect(bento).toContain("lg:grid-cols-4");
  });
});

describe("simple components", () => {
  it("Logo renders the brand name and a decorative mark", () => {
    const { container } = render(<Logo />);
    expect(screen.getByText("VertiStrat")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("svg rect")).toHaveLength(3);
  });

  it("Eyebrow renders its text with an optional class", () => {
    render(<Eyebrow className="extra">Hello</Eyebrow>);
    expect(screen.getByText("Hello").closest("p")).toHaveClass("extra");
  });

  it("Eyebrow has no extra class by default", () => {
    render(<Eyebrow>Plain</Eyebrow>);
    expect(screen.getByText("Plain").closest("p")!.className).not.toContain("undefined");
  });

  it("Card wraps children and merges a class", () => {
    render(<Card className="mine">inside</Card>);
    const el = screen.getByText("inside");
    expect(el).toHaveClass("tile", "mine");
  });

  it("Chips renders one list item per label", () => {
    render(<Chips items={["A", "B", "C"]} />);
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
  });

  it("Chips with no items renders an empty list", () => {
    render(<Chips items={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("Placeholder renders its children", () => {
    render(<Placeholder>TBD</Placeholder>);
    expect(screen.getByText("TBD")).toBeInTheDocument();
  });

  it("DotGrid, Contours and PlantLine are decorative", () => {
    const { container } = render(
      <>
        <DotGrid className="dg" />
        <Contours className="ct" />
        <PlantLine className="pl" />
      </>,
    );
    expect(container.querySelector(".dg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".ct")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".pl")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("svg.ct path")).toHaveLength(7);
  });
});

describe("Section", () => {
  it("labels the section by its heading when an id is given", () => {
    render(
      <Section id="s1" eyebrow="Eb" title="Title" intro="Intro text">
        body
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Title" });
    expect(region).toHaveAttribute("id", "s1");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "s1-h");
    expect(screen.getByText("Eb")).toBeInTheDocument();
    expect(screen.getByText("Intro text")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("has no aria-labelledby and no heading id without an id", () => {
    const { container } = render(<Section title="T">x</Section>);
    expect(container.querySelector("section")).not.toHaveAttribute("aria-labelledby");
    expect(screen.getByRole("heading")).not.toHaveAttribute("id");
  });

  it("omits the header entirely without eyebrow and title, even with an intro", () => {
    const { container } = render(<Section intro="orphan intro">child</Section>);
    expect(container.querySelector("header")).toBeNull();
    expect(screen.queryByText("orphan intro")).toBeNull();
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("renders only an eyebrow, or only a title", () => {
    const { container, rerender } = render(<Section eyebrow="Just eyebrow">x</Section>);
    expect(container.querySelector("h2")).toBeNull();
    expect(screen.getByText("Just eyebrow")).toBeInTheDocument();
    rerender(<Section title="Just title">x</Section>);
    expect(container.querySelector("h2")).toHaveTextContent("Just title");
    expect(screen.queryByText("Just eyebrow")).toBeNull();
  });
});

describe("IconChip and IconCluster", () => {
  it("sizes the chip by the size prop", () => {
    const { container, rerender } = render(<IconChip icon={Leaf} />);
    const chip = () => container.firstElementChild!;
    expect(chip()).toHaveClass("h-11", "w-11");
    expect(chip().querySelector("svg")).toHaveClass("h-5", "w-5");
    rerender(<IconChip icon={Leaf} size="lg" />);
    expect(chip()).toHaveClass("h-14", "w-14");
    expect(chip().querySelector("svg")).toHaveClass("h-7", "w-7");
  });

  it("colours the chip by tone", () => {
    const { container } = render(<IconChip icon={Leaf} tone="amber" />);
    expect(container.firstElementChild).toHaveClass("bg-amber");
  });

  it("shows at most five icons in the cluster", () => {
    const { container } = render(
      <IconCluster icons={[Leaf, Fuel, Ship, Leaf, Fuel, Ship, Leaf]} />,
    );
    expect(container.querySelectorAll("svg")).toHaveLength(5);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("StatTile", () => {
  it("shows the value and label", () => {
    render(<StatTile value="42" label="Plants" />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Plants")).toBeInTheDocument();
  });

  it("uses light muted text on the ink tone and standard muted text otherwise", () => {
    const { rerender } = render(<StatTile value="1" label="L" tone="ink" />);
    expect(screen.getByText("L")).toHaveClass("text-ink-muted");
    rerender(<StatTile value="1" label="L" />);
    expect(screen.getByText("L")).toHaveClass("text-muted-foreground");
  });
});

describe("PageHero", () => {
  it("renders eyebrow, title, line and children", () => {
    render(
      <PageHero eyebrow="Eyebrow" title="Big title" line="A line">
        <button>child</button>
      </PageHero>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Big title" })).toBeInTheDocument();
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(screen.getByText("A line")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "child" })).toBeInTheDocument();
  });

  it("omits the line when none is given", () => {
    const { container } = render(<PageHero eyebrow="E" title="T" />);
    expect(container.querySelector("p.text-lg")).toBeNull();
  });

  it("switches to a two-column layout only when an aside is given", () => {
    const { container, rerender } = render(<PageHero eyebrow="E" title="T" />);
    const grid = () => container.querySelector(".container-site")!;
    expect(grid().className).not.toContain("lg:grid-cols");
    rerender(<PageHero eyebrow="E" title="T" aside={<div>side</div>} />);
    expect(grid().className).toContain("lg:grid-cols");
    expect(screen.getByText("side")).toBeInTheDocument();
  });
});

describe("CTA", () => {
  it("renders the title, text and a link to the home page contact section", () => {
    renderWithRouter(<CTA title="Talk to us" text="We reply fast." />);
    expect(screen.getByRole("heading", { name: "Talk to us" })).toBeInTheDocument();
    expect(screen.getByText("We reply fast.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start a conversation" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });
});

describe("Tile", () => {
  it("renders a plain div with title and line when nothing links or expands", () => {
    const { container } = render(<Tile title="Plain" line="A line" />);
    expect(container.querySelector("a")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("heading", { level: 3, name: "Plain" })).toBeInTheDocument();
    expect(screen.getByText("A line")).toBeInTheDocument();
    expect(container.firstElementChild!.className).not.toContain("tile-hover");
  });

  it("renders an internal link with an optional hash", () => {
    renderWithRouter(
      <>
        <Tile title="A" to="/about" />
        <Tile title="B" to="/" hash="contact" />
      </>,
    );
    const [a, b] = screen.getAllByRole("link");
    expect(a).toHaveAttribute("href", "/about");
    expect(b).toHaveAttribute("href", "/#contact");
    expect(a).toHaveClass("tile-hover");
  });

  it("opens external hrefs in a new tab but not relative ones", () => {
    render(
      <>
        <Tile title="Ext" href="https://example.com/x" />
        <Tile title="Rel" href="/local" />
      </>,
    );
    const [ext, rel] = screen.getAllByRole("link");
    expect(ext).toHaveAttribute("target", "_blank");
    expect(ext).toHaveAttribute("rel", "noopener noreferrer");
    expect(rel).not.toHaveAttribute("target");
    expect(rel).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the corner arrow on linked tiles unless a kicker replaces it", () => {
    const { container, rerender } = render(<Tile title="L" href="/x" />);
    expect(container.querySelectorAll("a svg")).toHaveLength(1);
    rerender(<Tile title="L" href="/x" kicker="NEW" />);
    expect(container.querySelectorAll("a svg")).toHaveLength(0);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("does not show an arrow on unlinked tiles", () => {
    const { container } = render(<Tile title="U" />);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
  });

  it("colours the kicker amber on dark tones and primary otherwise", () => {
    const { rerender } = render(<Tile title="T" kicker="K" tone="ink" />);
    expect(screen.getByText("K")).toHaveClass("text-amber");
    rerender(<Tile title="T" kicker="K" tone="raised" />);
    expect(screen.getByText("K")).toHaveClass("text-amber");
    rerender(<Tile title="T" kicker="K" />);
    expect(screen.getByText("K")).toHaveClass("text-primary");
  });

  it("renders the icon chip, a larger heading when big, and the decor and children", () => {
    const { container } = render(
      <Tile title="Big" icon={Leaf} big decor={<i data-testid="decor" />}>
        <span>kid</span>
      </Tile>,
    );
    expect(container.querySelector("span[aria-hidden='true']")).toHaveClass("h-14");
    expect(screen.getByRole("heading")).toHaveClass("text-2xl");
    expect(screen.getByTestId("decor")).toBeInTheDocument();
    expect(screen.getByText("kid")).toBeInTheDocument();
  });

  it("uses the small heading by default", () => {
    render(<Tile title="Small" />);
    expect(screen.getByRole("heading")).toHaveClass("text-lg");
  });

  it("draws an icon cluster in a corner, tinted by tone", () => {
    const { container, rerender } = render(<Tile title="C" cluster={[Leaf, Fuel]} />);
    expect(container.querySelector(".opacity-25")).toHaveClass("text-primary");
    rerender(<Tile title="C" cluster={[Leaf, Fuel]} tone="ink" />);
    expect(container.querySelector(".opacity-25")).toHaveClass("text-ink-foreground");
  });

  describe("expandable", () => {
    it("is a closed button that toggles on click", () => {
      render(<Tile title="More" more="Extra detail" />);
      const tile = screen.getByRole("button");
      expect(tile).toHaveAttribute("aria-expanded", "false");
      expect(tile).toHaveAttribute("data-open", "false");
      expect(tile).toHaveAttribute("tabindex", "0");
      fireEvent.click(tile);
      expect(tile).toHaveAttribute("aria-expanded", "true");
      expect(tile).toHaveAttribute("data-open", "true");
      fireEvent.click(tile);
      expect(tile).toHaveAttribute("aria-expanded", "false");
    });

    it("toggles with Enter and Space and prevents the default action", () => {
      render(<Tile title="More" more="Extra" />);
      const tile = screen.getByRole("button");
      expect(fireEvent.keyDown(tile, { key: "Enter" })).toBe(false);
      expect(tile).toHaveAttribute("aria-expanded", "true");
      expect(fireEvent.keyDown(tile, { key: " " })).toBe(false);
      expect(tile).toHaveAttribute("aria-expanded", "false");
    });

    it("ignores other keys", () => {
      render(<Tile title="More" more="Extra" />);
      const tile = screen.getByRole("button");
      expect(fireEvent.keyDown(tile, { key: "a" })).toBe(true);
      fireEvent.keyDown(tile, { key: "Escape" });
      expect(tile).toHaveAttribute("aria-expanded", "false");
    });

    it("renders the extra text and has a pointer cursor", () => {
      render(<Tile title="More" more="Extra detail" />);
      expect(screen.getByText("Extra detail")).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveClass("cursor-pointer");
    });

    it("prefers a link over expansion when both are given", () => {
      renderWithRouter(<Tile title="Both" more="Extra" to="/about" />);
      expect(screen.queryByRole("button")).toBeNull();
      expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
    });
  });
});
