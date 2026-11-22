import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fitCharts } from "@/lib/fitCharts";
import { PostBody } from "./PostBody";

vi.mock("@/lib/fitCharts", () => ({ fitCharts: vi.fn() }));

const fit = vi.mocked(fitCharts);

beforeEach(() => {
  vi.useFakeTimers();
  fit.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

const shadowOf = (container: HTMLElement) =>
  container.querySelector<HTMLElement>("[data-post-body]")!.shadowRoot!;

describe("PostBody", () => {
  it("renders the article inside an open shadow root", () => {
    const { container } = render(<PostBody html="<p>Hello <b>world</b></p>" />);
    const shadow = shadowOf(container);
    expect(shadow).not.toBeNull();
    expect(shadow.querySelector("p")!.textContent).toBe("Hello world");
    expect(container.querySelector("[data-post-body]")!.textContent).toBe("");
  });

  it("strips scripts and event handlers from the markup", () => {
    const { container } = render(
      <PostBody html={'<p onclick="x()">Safe</p><script>window.hacked = 1</script>'} />,
    );
    const shadow = shadowOf(container);
    expect(shadow.querySelector("script")).toBeNull();
    expect(shadow.querySelector("p")!.hasAttribute("onclick")).toBe(false);
    expect(shadow.textContent).toContain("Safe");
  });

  it("wraps tables and code blocks in focusable, labelled scroll regions", () => {
    const { container } = render(
      <PostBody html="<table><tr><td>cell</td></tr></table><pre>code</pre>" />,
    );
    const boxes = shadowOf(container).querySelectorAll<HTMLElement>(".post-scroll");
    expect(boxes).toHaveLength(2);
    const [tableBox, preBox] = [boxes[0]!, boxes[1]!];
    expect(tableBox.querySelector("table")).not.toBeNull();
    expect(tableBox.getAttribute("aria-label")).toBe("Article table");
    expect(preBox.querySelector("pre")).not.toBeNull();
    expect(preBox.getAttribute("aria-label")).toBe("Code block");
    for (const box of [tableBox, preBox]) {
      expect(box.tabIndex).toBe(0);
      expect(box.getAttribute("role")).toBe("region");
    }
  });

  it("leaves posts without tables or code unwrapped", () => {
    const { container } = render(<PostBody html="<p>Just text</p>" />);
    expect(shadowOf(container).querySelector(".post-scroll")).toBeNull();
  });

  it("adds scoped styles after the content", () => {
    const { container } = render(<PostBody html="<p>x</p>" />);
    const shadow = shadowOf(container);
    expect(shadow.children).toHaveLength(2);
    expect(shadow.children[1]!.tagName).toBe("STYLE");
    expect(shadow.children[1]!.textContent).toContain(":host");
    expect(shadow.children[1]!.textContent).toContain(".post-scroll");
  });

  it("fits charts once, on the next animation frame", () => {
    render(<PostBody html="<p>x</p>" />);
    expect(fit).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(fit).toHaveBeenCalledTimes(1);
    const root = fit.mock.calls[0]![0] as HTMLElement;
    expect(root.textContent).toBe("x");
  });

  it("refits 250ms after the last window resize, not before", () => {
    render(<PostBody html="<p>x</p>" />);
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    fit.mockClear();

    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(200);
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(249);
    });
    expect(fit).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(fit).toHaveBeenCalledTimes(1);
  });

  it("re-renders the content when the html changes", () => {
    const { container, rerender } = render(<PostBody html="<p>first</p>" />);
    rerender(<PostBody html="<p>second</p>" />);
    const shadow = shadowOf(container);
    expect(shadow.querySelector("p")!.textContent).toBe("second");
    expect(shadow.querySelectorAll("p")).toHaveLength(1);
  });

  it("cleans up on unmount: empties the shadow root, cancels the frame and stops listening", () => {
    const { container, unmount } = render(<PostBody html="<p>x</p>" />);
    const shadow = shadowOf(container);
    unmount();
    expect(shadow.childNodes).toHaveLength(0);
    act(() => {
      vi.advanceTimersToNextFrame();
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(1000);
    });
    expect(fit).not.toHaveBeenCalled();
  });

  it("cancels a pending resize refit on unmount", () => {
    const { unmount } = render(<PostBody html="<p>x</p>" />);
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    fit.mockClear();
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(fit).not.toHaveBeenCalled();
  });
});
