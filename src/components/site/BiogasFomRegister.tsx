import { useMemo, useState } from "react";
import { Sprout } from "lucide-react";
import { Eyebrow, IconChip } from "@/components/site/ui";
import { formatDate } from "@/lib/feeds";
import {
  NOTIFICATIONS,
  PLANTS,
  authorisationEnds,
  isCurrent,
  notificationById,
  type Parent,
} from "@/data/biogasFomAuthorisations";

const sel = "rounded-xl border bg-card px-3 py-2 text-sm";
type Status = "current" | "expired" | "all";

export function BiogasFomRegister({ now = new Date() }: { now?: Date }) {
  const [status, setStatus] = useState<Status>("current");
  const [state, setState] = useState("ALL");
  const [parent, setParent] = useState<"ALL" | Parent>("ALL");
  const [q, setQ] = useState("");

  const states = useMemo(() => [...new Set(PLANTS.map((p) => p.state))].sort(), []);
  const parents = useMemo(
    () => [...new Set(PLANTS.flatMap((p) => (p.parent ? [p.parent] : [])))].sort(),
    [],
  );
  const current = PLANTS.filter((p) =>
    isCurrent(notificationById(p.notification).published, now),
  ).length;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PLANTS.map((p, i) => ({ p, i, n: notificationById(p.notification) }))
      .filter(({ p, n }) => {
        const live = isCurrent(n.published, now);
        return (
          (status === "all" || (status === "current" ? live : !live)) &&
          (state === "ALL" || p.state === state) &&
          (parent === "ALL" || p.parent === parent) &&
          (needle === "" || `${p.name} ${p.place} ${p.state}`.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) => b.n.published.localeCompare(a.n.published) || a.i - b.i);
  }, [status, state, parent, q, now]);

  return (
    <section id="biogas-fom" className="mt-16 border-t pt-12" aria-labelledby="biogas-fom-h">
      <IconChip icon={Sprout} size="lg" />
      <Eyebrow className="mt-6">Register, not trade ideas</Eyebrow>
      <h2 id="biogas-fom-h" className="mt-3 text-3xl font-bold md:text-4xl">
        Biogas plants cleared to sell biofertiliser
      </h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Plants that the Ministry of Agriculture and Farmers Welfare has authorised, under clause
        22(c) of the Fertiliser Control Order, 1985, to sell fermented organic manure and liquid
        fermented organic manure in bulk directly to farmers. Each authorisation runs for three
        years from the gazette date. This is a list of notified plants from {NOTIFICATIONS.length}{" "}
        gazette orders, not a recommendation to buy or sell any security.
      </p>
      <p className="label-mono mt-4 text-muted-foreground">
        {PLANTS.length} entries · {current} current · {PLANTS.length - current} expired · read 18
        Nov 2026
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="text-sm">
          Status
          <br />
          <select
            className={sel}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="current">Current</option>
            <option value="expired">Expired</option>
            <option value="all">All</option>
          </select>
        </label>
        <label className="text-sm">
          State
          <br />
          <select className={sel} value={state} onChange={(e) => setState(e.target.value)}>
            {["ALL", ...states].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Listed parent
          <br />
          <select
            className={sel}
            value={parent}
            onChange={(e) => setParent(e.target.value as "ALL" | Parent)}
          >
            {["ALL", ...parents].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Search
          <br />
          <input
            className={sel}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Plant, place or state"
          />
        </label>
      </div>

      <p role="status" className="label-mono mt-4 text-muted-foreground">
        {rows.length} of {PLANTS.length} entries shown
      </p>

      <div className="mt-3 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <caption className="sr-only">
            Biogas and CBG plants authorised by the Ministry of Agriculture and Farmers Welfare to
            sell fermented organic manure in bulk
          </caption>
          <thead className="border-b">
            <tr>
              {[
                "Plant or manufacturer",
                "State",
                "Location",
                "Listed parent",
                "Gazette order",
                "Authorised until",
              ].map((h) => (
                <th key={h} scope="col" className="label-mono p-3 text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-muted-foreground">
                  No plants match these filters.
                </td>
              </tr>
            ) : (
              rows.map(({ p, i, n }) => {
                const ends = authorisationEnds(n.published);
                const live = isCurrent(n.published, now);
                return (
                  <tr key={`${p.notification}-${i}`} className="border-b align-top last:border-0">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.state}</td>
                    <td className="p-3 text-muted-foreground">{p.place}</td>
                    <td className="p-3">{p.parent ?? "—"}</td>
                    <td className="p-3 whitespace-nowrap">
                      <a
                        className="underline underline-offset-2"
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {n.so}
                      </a>
                      <span className="label-mono block text-muted-foreground">
                        {formatDate(n.published)}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono">
                      {formatDate(ends)}
                      {!live && (
                        <span className="label-mono ml-2 rounded-sm bg-destructive px-2 py-0.5 text-destructive-foreground">
                          Expired
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 max-w-3xl space-y-3 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">How to read it.</span> A plant appears once
          for each gazette order that names it, so several plants show twice, for example a renewal
          or a changed plant name. Reliance rows are the plants named Reliance in the gazette (the
          group&rsquo;s subsidiaries included); &ldquo;listed parent&rdquo; is this site&rsquo;s
          reading of the name and is not checked against company records.
        </p>
        <p>
          <span className="font-medium text-foreground">Not covered.</span> Authorisations before
          the 14 November 2023 order (it renewed earlier ones), plants registered for the Department
          of Fertilizers subsidy of Rs 1,500 a tonne (120 plants on 4 March 2026, a separate list),
          and any order after 17 November 2026. The Seventh Amendment Order of 29 June 2026 also
          dropped the separate authorisation-letter requirement for these manufacturers for ten
          years; whether it makes these lists redundant is not established.
        </p>
        <p>
          Orders read:{" "}
          {NOTIFICATIONS.map((n, i) => (
            <span key={n.id}>
              <a
                className="underline underline-offset-2"
                href={n.url}
                target="_blank"
                rel="noreferrer"
              >
                {n.so}
              </a>{" "}
              ({formatDate(n.published)}, {n.entries})
              {n.amendedBy ? ` amended by ${n.amendedBy}` : ""}
              {i < NOTIFICATIONS.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
