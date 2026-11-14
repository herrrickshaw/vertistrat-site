#!/usr/bin/env python3
"""Sync the site's article data from the blog archive repo (herrrickshaw/blogger_writeups_code).

    python3 ops/sync_blog.py [--blog ../blogger_writeups_code]

Run it after each blog snapshot (tools/snapshot.py) so the site lists exactly what is live on
blog.vertistratsolution.com. It rewrites:

  src/data/allArticles.json   every live article: [postId, path, title, published, themeIndex], newest first
  src/data/retiredSlugs.json  old slug -> slug that replaced it (or null), for posts merged or moved to draft
  src/data/themeOverrides.json  pruned to articles still in the library
  src/data/insights.ts        curated items: current titles; a retired item is swapped for its replacement
  src/data/mostRead.ts        same for the most-read list (ranking unchanged; it is curated by hand)

Sources in the blog repo: meta/manifest.json (live posts), out/retitle/titles.tsv (house-style titles
not yet on the live blog), out/gsc_index/phase1_remove.json and phase3_map.json (merged or retired
posts). Utility pages (the article index, the author page, the shop) are left out, as before.
"""
import argparse
import collections
import html
import json
import pathlib
import re

SITE = pathlib.Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser()
ap.add_argument("--blog", default=str(SITE.parent / "blogger_writeups_code"))
BLOG = pathlib.Path(ap.parse_args().blog)
DATA = SITE / "src/data"
SKIP = {"article-index-start-here", "about-author", "the-masala-deutsch-shop-books-things"}

posts = list(json.load(open(BLOG / "meta/manifest.json"))["posts"].values())
titles = {}
tsv = BLOG / "out/retitle/titles.tsv"
if tsv.exists():
    for line in tsv.read_text(encoding="utf-8").splitlines():
        if "\t" in line:
            s, t = line.split("\t", 1)
            titles[s] = t.strip()
retired = {}
for f in ("out/gsc_index/phase1_remove.json", "out/gsc_index/phase3_map.json"):
    p = BLOG / f
    if p.exists():
        retired.update(json.load(open(p)))
live = {p["slug"]: p for p in posts}
# a retired post's replacement must itself be live; follow chains (a -> b -> c)
def resolve(s):
    seen = set()
    while s in retired and s not in seen:
        seen.add(s)
        s = retired[s]
    return s if s in live and s not in retired else None
retired_map = {s: resolve(s) for s in retired}

lib = json.load(open(DATA / "allArticles.json"))
themes = lib["themes"]
old_theme = {a[0]: a[4] for a in lib["articles"]}
labels = lambda p: p["labels"] if isinstance(p["labels"], list) else json.loads(p["labels"].replace("'", '"'))
# label -> most common theme among articles already placed
votes = collections.defaultdict(collections.Counter)
for p in posts:
    if p["id"] in old_theme:
        for l in labels(p):
            votes[l][old_theme[p["id"]]] += 1
TOOLS = next(i for i, (slug, _) in enumerate(themes) if slug == "tools")


def theme_for(p):
    if p["id"] in old_theme:
        return old_theme[p["id"]]
    if re.search(r"open-source|how-to-use", p["slug"]):
        return TOOLS
    for l in labels(p):
        if votes.get(l):
            return votes[l].most_common(1)[0][0]
    return TOOLS


title_of = lambda p: titles.get(p["slug"]) or html.unescape(p["title"]).strip()
keep = [p for p in posts if p["slug"] not in SKIP and p["slug"] not in retired]
keep.sort(key=lambda p: (p["published"], p["id"]), reverse=True)
articles = [[p["id"], re.sub(r"^https?://[^/]+/|\.html$", "", p["url"]), title_of(p), p["published"][:10], theme_for(p)]
            for p in keep]
(DATA / "allArticles.json").write_text(json.dumps({"themes": themes, "articles": articles}, ensure_ascii=False, separators=(",", ":")))
(DATA / "retiredSlugs.json").write_text(json.dumps(dict(sorted(retired_map.items())), indent=1) + "\n")
ids = {a[0] for a in articles}
ov = json.load(open(DATA / "themeOverrides.json"))
(DATA / "themeOverrides.json").write_text(json.dumps({k: v for k, v in sorted(ov.items()) if k in ids}, separators=(",", ":")))

by_slug = {p["slug"]: p for p in keep}
url_of = lambda p: f"https://blog.vertistratsolution.com/{re.sub(r'^https?://[^/]+/', '', p['url'])}"
js = lambda s: json.dumps(s, ensure_ascii=False)


def fix_items(path, pattern):
    """Update curated entries in a TS data file: current title, and a retired entry swapped for its
    replacement (dropped if it has none, or if the replacement is already in the list)."""
    text = (DATA / path).read_text(encoding="utf-8")
    seen, changes = set(), []

    def one(m):
        line = m.group(0)
        slug = re.search(r'url: "https://[^"]+/([^/"]+)\.html"', line).group(1)
        if slug in retired:
            slug = retired_map.get(slug)
            if not slug or slug in seen:
                changes.append(f"dropped {m.group(0)[:60]}")
                return ""
        seen.add(slug)
        p = by_slug.get(slug)
        if not p:
            changes.append(f"not live, dropped: {slug}")
            return ""
        new = re.sub(r'title: "(?:[^"\\]|\\.)*"', f"title: {js(title_of(p))}", line, count=1)
        new = re.sub(r'url: "[^"]+"', f'url: "{url_of(p)}"', new, count=1)
        new = re.sub(r'postId: "\d+"', f'postId: "{p["id"]}"', new, count=1)
        new = re.sub(r'published: "[^"]+"', f'published: "{p["published"][:10]}"', new, count=1)
        if new != line:
            changes.append(f"updated {slug}")
        return new

    out = re.sub(pattern, one, text)
    out = re.sub(r"\n[ \t]*\n(?=[ \t]*\{ title:)", "\n", out)   # tidy lines left by dropped items
    (DATA / path).write_text(out, encoding="utf-8")
    return changes


ch1 = fix_items("insights.ts", r"[ \t]*\{ title: .*?\},?[ \t]*(?:\n|$)")
ch2 = fix_items("mostRead.ts", r"[ \t]*\{ title: .*?\},?[ \t]*(?:\n|$)")
new_ids = [a for a in articles if a[0] not in old_theme]
print(f"library: {len(articles)} articles ({len(new_ids)} new, {len(old_theme) - len(ids & set(old_theme))} removed); "
      f"{len(retired_map)} retired slugs ({sum(v is not None for v in retired_map.values())} with a replacement)")
print(f"insights.ts: {len(ch1)} changes; mostRead.ts: {len(ch2)} changes")
for c in ch1 + ch2:
    if not c.startswith("updated"):
        print("  ", c)
