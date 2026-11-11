import { useEffect, useRef } from "react";
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
      .post-scroll:focus-visible, a:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
    `;
    shadow.replaceChildren(content, style);
    return () => { shadow.replaceChildren(); };
  }, [html]);
  return <div className="tile min-w-0 overflow-hidden bg-form-surface p-4 text-paper-foreground sm:p-8"><div ref={host} data-post-body className="min-w-0 max-w-full overflow-x-auto" /></div>;
}