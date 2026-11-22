import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonVariants } from "./button";

describe("buttonVariants", () => {
  it("defaults to the primary variant at the default size", () => {
    const cls = buttonVariants();
    expect(cls).toContain("bg-primary");
    expect(cls).toContain("h-9 px-4 py-2");
  });

  it.each([
    ["destructive", "bg-destructive"],
    ["outline", "border-input"],
    ["secondary", "bg-secondary"],
    ["ghost", "hover:bg-accent"],
    ["link", "underline-offset-4"],
  ] as const)("applies the %s variant", (variant, expected) => {
    const cls = buttonVariants({ variant });
    expect(cls).toContain(expected);
    expect(cls).not.toContain("bg-primary text-primary-foreground shadow");
  });

  it.each([
    ["sm", "h-8"],
    ["lg", "h-10"],
    ["icon", "w-9"],
  ] as const)("applies the %s size", (size, expected) => {
    const cls = buttonVariants({ size });
    expect(cls).toContain(expected);
    expect(cls).not.toContain("py-2");
  });

  it("lets a caller class override a conflicting utility", () => {
    expect(buttonVariants({ className: "h-20" })).toContain("h-20");
    expect(buttonVariants({ className: "h-20" })).not.toContain("h-9");
  });
});

describe("Button", () => {
  it("renders a real button that handles clicks", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire clicks when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it("with asChild, styles its child instead of rendering a button", () => {
    render(
      <Button asChild variant="outline">
        <a href="/x">Link</a>
      </Button>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("href", "/x");
    expect(link.className).toContain("border-input");
  });

  it("merges the className prop with the variant classes", () => {
    render(<Button className="mine">Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("mine", "bg-primary");
  });
});
