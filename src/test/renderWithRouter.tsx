import { createMemoryHistory, createRouter, RouterContextProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { routeTree } from "@/routeTree.gen";

/** Render UI that contains router <Link>s, without matching or loading any route. */
export function renderWithRouter(ui: ReactElement, path = "/") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterContextProvider router={router}>{ui}</RouterContextProvider>
      </QueryClientProvider>,
    ),
  };
}
