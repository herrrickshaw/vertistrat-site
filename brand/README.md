# VertiStrat brand and collateral

Brand assets and the scripts that rebuild them. The website source is in `src/` at the repo root.

## Identity (as built into the site, `src/styles.css`)

| Role | Value |
|---|---|
| Primary (electric blue) | `oklch(0.55 0.22 262)` light, `oklch(0.70 0.17 262)` dark |
| Highlight (amber) | `oklch(0.72 0.17 65)` |
| Ink (dark bands) | `oklch(0.16 0.012 260)` |
| Page background | `oklch(0.985 0.002 260)` light, `oklch(0.145 0.01 260)` dark |
| Display font | Host Grotesk (500 to 800) |
| Body font | Instrument Sans |
| Label font | IBM Plex Mono, uppercase, wide tracking |
| Style | Bento tiles, amber underline highlight on one key phrase |

The site's CSS is the source of truth; change tokens there first.

## Folders

| Folder | What it is | Rebuild |
|---|---|---|
| `business-card/` | Print card, 90 x 54 mm plus 3 mm bleed, front and back | `python3 build_card.py` (name, title, email and phone live there) |
| `brochure/` | A4 tri-fold, inside and outside | `python3 build_brochure.py` |
| `diwali-2026/` | Festival greeting graphic, 3 sizes | `python3 build_diwali.py` |
| `linkedin/` | LinkedIn graphics and posts on the IEM and EC tracker | HTML sources beside each PNG |
| `pitch-deck/` | 3-slide overview deck | `python3 build_3slide.py` (python-pptx) |
| `site-screenshots/` | Home page, light, dark and mobile, 29 Oct 2026 | |

## Not in this repo, on purpose

Outreach lists and lead sheets, outreach email drafts, the Cellumantra MOU draft and client DPRs. They hold third-party contact details or confidential terms.
