import { useEffect, useRef } from "react";
import { fitCharts } from "@/lib/fitCharts";
import { sanitizePost } from "@/lib/sanitizePost";

export function PostBody({ html }: { html: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const shadow = host.current.shadowRoot ?? host.current.attachShadow({ mode: "open" });
    const content = document.createElement("div");
    content.innerHTML = sanitizePost(html);
    content.querySelectorAll("table, pre").forEach((element) => {
      const scroll = document.createElement("div");
      scroll.className = "post-scroll";
      scroll.tabIndex = 0;
      scroll.setAttribute("role", "region");
      scroll.setAttribute("aria-label", element.tagName === "TABLE" ? "Article table" : "Code block");
      element.replaceWith(scroll);
      scroll.appendChild(element);
    });
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; min-width: 0; color-scheme: light; }
      *, *::before, *::after { box-sizing: border-box; }
      img, svg, video { max-width: 100% !important; height: auto; }
      .post-scroll { max-width: 100% !important; overflow-x: auto !important; margin-block: 1rem; }
      pre { max-width: 100%; overflow-x: auto; }
      .post-scroll:focus-visible, .post-chart-scroll:focus-visible, a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
      .post-chart-scroll { width: 100%; max-width: 100%; min-width: 0; overflow-x: auto; contain: inline-size; margin: 0.2rem 0 1rem; }
      .post-chart-scroll > svg { display: block; }
      .post-swipe { font: 600 0.78rem/1.3 system-ui, sans-serif; color: #43535f; margin: 0.7rem 0 0.3rem; }
      @media (max-width: 640px) {
        .post-scroll-wide table tr > :first-child { position: sticky; left: 0; z-index: 1; background: #fff; box-shadow: 1px 0 0 #d9e1e8; max-width: 9.5rem; white-space: normal; }
        .post-scroll-wide table tbody tr:nth-child(even) > :first-child { background: #f6f7f8; }
      }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
    `;
    shadow.replaceChildren(content, style);
    // Size checks need layout, so run after the browser has laid the post out; again on a width change.
    const fit = () => fitCharts(content);
    const frame = requestAnimationFrame(fit);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(fit, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      shadow.replaceChildren();
    };
  }, [html]);
  return <div className="tile min-w-0 overflow-hidden bg-form-surface p-4 text-paper-foreground sm:p-8"><div ref={host} data-post-body className="min-w-0 max-w-full overflow-x-auto" /></div>;
}