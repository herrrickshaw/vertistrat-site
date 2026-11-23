import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      exclude: [
        ...(configDefaults.coverage?.exclude ?? []),
        // Unused shadcn/Radix scaffolds from `shadcn add`: generated, no project logic, and
        // not imported by any route or site component (only by each other). Listed one by one
        // on purpose: button.tsx and sheet.tsx ARE used (insights.$slug, Sections) and stay measured.
        "src/components/ui/accordion.tsx",
        "src/components/ui/alert.tsx",
        "src/components/ui/alert-dialog.tsx",
        "src/components/ui/aspect-ratio.tsx",
        "src/components/ui/avatar.tsx",
        "src/components/ui/badge.tsx",
        "src/components/ui/breadcrumb.tsx",
        "src/components/ui/calendar.tsx",
        "src/components/ui/card.tsx",
        "src/components/ui/carousel.tsx",
        "src/components/ui/chart.tsx",
        "src/components/ui/checkbox.tsx",
        "src/components/ui/collapsible.tsx",
        "src/components/ui/command.tsx",
        "src/components/ui/context-menu.tsx",
        "src/components/ui/dialog.tsx",
        "src/components/ui/drawer.tsx",
        "src/components/ui/dropdown-menu.tsx",
        "src/components/ui/form.tsx",
        "src/components/ui/hover-card.tsx",
        "src/components/ui/input.tsx",
        "src/components/ui/input-otp.tsx",
        "src/components/ui/label.tsx",
        "src/components/ui/menubar.tsx",
        "src/components/ui/navigation-menu.tsx",
        "src/components/ui/pagination.tsx",
        "src/components/ui/popover.tsx",
        "src/components/ui/progress.tsx",
        "src/components/ui/radio-group.tsx",
        "src/components/ui/resizable.tsx",
        "src/components/ui/scroll-area.tsx",
        "src/components/ui/select.tsx",
        "src/components/ui/separator.tsx",
        "src/components/ui/sidebar.tsx",
        "src/components/ui/skeleton.tsx",
        "src/components/ui/slider.tsx",
        "src/components/ui/sonner.tsx",
        "src/components/ui/switch.tsx",
        "src/components/ui/table.tsx",
        "src/components/ui/tabs.tsx",
        "src/components/ui/textarea.tsx",
        "src/components/ui/toggle.tsx",
        "src/components/ui/toggle-group.tsx",
        "src/components/ui/tooltip.tsx",
        // TanStack Router codegen, rewritten on every build ("do not edit").
        "src/routeTree.gen.ts",
      ],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
