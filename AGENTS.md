<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Site content/config constants (URLs, flags, disclaimer) live in src/config.ts so non-developers edit one file.
- Blogger feed is loaded via JSONP (alt=json-in-script) because Blogger sends no CORS headers.
- Shared header/footer render in src/routes/__root.tsx; page sections use helpers in src/components/site/ui.tsx.
- Contact enquiries are collected by our Google Form (GOOGLE_FORM_URL / GOOGLE_FORM_EMBED_URL in src/config.ts), owned by contact@vertistratsolution.com; the site renders it in an iframe and offers a new-tab link, so there is no form code, table or third-party form service in this app.
- Guide topics and sector panels link only to articles in src/data/insights.ts, matched by title keywords in src/lib/guides.ts, so no new URLs are invented.
- Practice pages use the shared hero, bento tiles, phases and CTA helpers; the energy practice reading list uses the exported title matcher in guides.ts to keep article URLs curated.

- Articles are rendered on /insights/<slug> from Blogger's JSON feed by postId, sanitized, inside a Shadow DOM, with canonical pointing to the blog.
