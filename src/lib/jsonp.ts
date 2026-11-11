let sequence = 0;

// Blogger's public feeds do not provide CORS headers.
export function jsonp(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const callback = `__vsFeed${Date.now()}_${sequence++}`;
    const script = document.createElement("script");
    const callbacks = window as unknown as Record<string, unknown>;
    const cleanup = () => { delete callbacks[callback]; script.remove(); clearTimeout(timer); };
    const timer = setTimeout(() => { cleanup(); reject(new Error("timeout")); }, 10_000);
    callbacks[callback] = (data: unknown) => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error("Feed failed")); };
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${callback}`;
    document.head.appendChild(script);
  });
}