"""Build the VertiStrat A4 tri-fold brochure: 297 x 210 mm trim, 3 mm bleed, print PDF + trimmed PNG previews."""
import pathlib, subprocess

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE = pathlib.Path(__file__).parent
BLUE, AMBER, INK, MUTED, FG, GREY, SOFT, WARM = "#1E64EF", "#EB8A00", "#0C0F14", "#C4C9D1", "#12161C", "#565B63", "#EAF4FF", "#FDF0DC"
RAISED, LINE = "#1A1F27", "#333A44"


def logo(h):
    return (f'<svg style="height:{h}mm;width:{h}mm;display:block" viewBox="0 0 22 22">'
            f'<rect x="0" y="13" width="5" height="9" rx="1" fill="{BLUE}"/>'
            f'<rect x="8" y="7" width="5" height="15" rx="1" fill="{BLUE}"/>'
            f'<rect x="16" y="0" width="5" height="22" rx="1" fill="{AMBER}"/></svg>')


def brand(h, size, color):
    return f'<div class="brand" style="font-size:{size}pt;color:{color};gap:{h*0.32:.1f}mm">{logo(h)}VertiStrat</div>'


def eyebrow(text, color=BLUE):
    return f'<p class="eyebrow" style="color:{color}">{text}</p>'


def panel(left, width, bg, body, color=FG):
    # left and width are trim coordinates; the first and last panels run 3 mm into the bleed.
    x = left + 3
    pad_l = pad_r = 8
    if left == 0:
        x, width, pad_l = 0, width + 3, 11
    if left + width >= 297:
        width, pad_r = width + 3, 11
    return (f'<div class="panel" style="left:{x}mm;width:{width}mm;background:{bg};color:{color};'
            f'padding:11mm {pad_r}mm 11mm {pad_l}mm">{body}</div>')


def rows(items, head=FG, text="#2A3038", line="#D5D8DD"):
    return "".join(f'<div class="row" style="border-top:0.25mm solid {line}"><p class="rowhead" style="color:{head}">{a}</p>'
                   f'<p class="small" style="color:{text}">{b}</p></div>' for a, b in items)


plant = f'''<svg viewBox="0 0 560 220" fill="none" stroke="{MUTED}" stroke-width="1.25" stroke-linejoin="round" style="width:100%;display:block;opacity:.55">
<path d="M10 200 H550" opacity=".5"/><path d="M30 200 V120 L70 95 V120 L110 95 V120 L150 95 V120 L190 95 V200"/>
<path d="M215 200 V60 H235 V200 M245 200 V80 H262 V200"/><path d="M222 50 q8 -10 0 -20 q-8 -10 0 -20" opacity=".35"/>
<path d="M280 200 V130 H420 V200"/>{"".join(f'<rect x="{292+i*21}" y="145" width="12" height="16" rx="2" opacity=".6"/>' for i in range(6))}
<path d="M300 182 H520" stroke-dasharray="2 6"/><circle cx="300" cy="182" r="9"/><circle cx="520" cy="182" r="9"/>
<circle cx="480" cy="110" r="22"/><circle cx="480" cy="110" r="7"/>
{"".join(f'<path d="M480 82 V90 M480 130 V138" transform="rotate({a} 480 110)"/>' for a in (0,45,90,135))}
<path d="M440 200 V140 H520 V200" opacity=".7"/></svg>'''

# ---------- Outside: flap | back | cover ----------
flap = (eyebrow("Who we work with") + '<h2>Four kinds of client</h2>'
        + rows([("Overseas manufacturers", "Entering India or adding capacity."),
                ("Indian manufacturers", "Expanding, relocating or modernising."),
                ("IT services firms", "Delivery centres, GCCs, manufacturing clients."),
                ("Biofuel and energy developers", "Planning a new plant or a new route.")], line="#BFD3EE")
        + '<div class="gap"></div>' + eyebrow("Principles") + '<h2>How we work</h2>'
        + rows([("Recommend with reasons", "One answer, plus what we rejected."),
                ("Scope in writing", "Deliverables agreed before work starts."),
                ("Independent", "No commissions from vendors or parks."),
                ("Hand over", "Your team owns the outputs.")], line="#BFD3EE")
        + '<div class="gap"></div>' + eyebrow("Where we work")
        + '<ul class="sectors"><li>Automotive and EV components</li><li>Electronics and semiconductors</li><li>Engineering goods</li><li>Pharma and medical devices</li><li>Food processing</li><li>Chemicals and specialty materials</li><li>Renewable energy equipment</li><li>Global capability centres</li><li>SaaS and IT services</li></ul>')

back = (f'<div style="flex:1"></div>{brand(7, 15, FG)}'
        '<h2 style="margin-top:7mm">Tell us what you’re deciding</h2>'
        f'<p class="body" style="color:#2A3038">A short note is enough. We’ll say if we can help.</p>'
        f'<p class="contact" style="margin-top:6mm;color:{BLUE}">contact@vertistratsolution.com</p>'
        f'<p class="contact" style="color:{BLUE}">+91 70222 59460</p>'
        f'<p class="contact" style="color:{BLUE}">vertistratsolution.com</p>'
        '<p class="body" style="margin-top:6mm;color:#2A3038">Plot No. 141, Gurusamy Road<br>Near Queen Street &amp; VGN Monte Carlo<br>Nolambur, Chennai 600095<br>Tamil Nadu, India</p>'
        f'<div style="flex:1"></div><p class="fine" style="color:{GREY}">VertiStrat Solutions LLP. Independent adviser. Not affiliated with any government agency or investment promotion body.</p>')

cover = (f'{brand(9, 19, "#F6F7F9")}<div style="height:24mm"></div>'
         '<h1>From the<br>policy desk<br>to the<br>plant floor.</h1>'
         f'<p class="lead" style="color:{MUTED}">One team for the plan,<br>the incentives and the IT.</p>'
         f'<div style="flex:1"></div>{plant}<div style="height:6mm"></div>'
         f'<p class="small" style="color:{MUTED}">Manufacturing · IT services<br>Biofuels &amp; energy · Investment facilitation</p>')

# ---------- Inside: problem | practices | facilitation + founder ----------
tile = lambda t, d, bg, tc=FG, dc="#2A3038", extra="": (
    f'<div class="tile" style="background:{bg};{extra}"><p class="rowhead" style="color:{tc};font-size:11pt">{t}</p>'
    f'<p class="small" style="color:{dc}">{d}</p></div>')
p1 = (eyebrow("The problem") + '<h2>Projects stall between the layers</h2>'
      '<p class="body" style="color:#2A3038">The plant plan, the incentive file and the IT landscape get written separately. When their numbers disagree, the project waits. One team keeps them consistent.</p>'
      '<div class="tiles">' + tile("Policy", "Incentives and approvals", WARM) + tile("Plant", "Site and capacity", SOFT)
      + tile("Platform", "IT, data and cyber", "#FFFFFF", extra="border:0.25mm solid #E2E4E8;") + tile("People", "Hiring and skills", INK, "#F6F7F9", MUTED) + '</div>'
      '<div style="height:11mm"></div>' + eyebrow("Approach") + '<h2>Four steps, each written down</h2>'
      + rows([("1  Diagnose", "Decision brief, constraints register, data request list."),
              ("2  Design", "Options comparison, shortlist, incentive map, draft report."),
              ("3  Deliver", "Final report, applications filed, implementation plan."),
              ("4  Hand over", "Compliance calendar, documents, owners, claims schedule.")]))

block = lambda t, line, items, bg: (
    f'<div class="block" style="background:{bg}"><h3>{t}</h3><p class="small" style="color:#2A3038">{line}</p>'
    f'<ul>{"".join(f"<li>{i}</li>" for i in items)}</ul></div>')
p2 = (eyebrow("What we do") + '<h2>Three practices, one team</h2>'
      + block("Manufacturing", "A site, scheme and project report on one set of numbers.",
              ["Feasibility and entry", "Site selection", "Project reports", "Approvals and incentives", "Supply chain localisation", "Operations improvement"], SOFT)
      + block("IT services", "A delivery centre or programme that runs on the plant floor.",
              ["Delivery centre and GCC set-up", "Entity structure and hiring plan", "Build-operate-transfer", "Industry 4.0 roadmap", "Vendor selection and governance", "Cloud, data and cyber readiness"], "#F4F5F7")
      + block("Biofuels &amp; energy", "Feedstock, route and offtake settled before you commit capital.",
              ["Ethanol", "Compressed biogas", "Sustainable aviation fuel", "Bio-based chemicals", "Integrated biorefineries", "Energy transition"], WARM))

p3 = (eyebrow("Investment facilitation", AMBER) + '<h2>Briefing to aftercare</h2>'
      + rows([("Briefing", "States, sites and schemes, for your board."),
              ("Incentives", "Central and state schemes mapped and filed."),
              ("Liaison", "Working with the government bodies involved."),
              ("Aftercare", "Conditions and claims tracked after you start.")], "#F6F7F9", MUTED, LINE)
      + '<p class="body" style="margin-top:3mm;font-weight:600">Independent adviser. Not a government agency.</p>'
      '<div class="gap"></div>' + eyebrow("Who leads the work", AMBER) + '<h2>Umashankar Triplicane Dwarakanathan</h2>'
      f'<p class="small" style="color:{MUTED}">Founder. Chemical engineer (IIT Madras) and MBA (ESMT Berlin), with 10+ years across energy, investment promotion and business transformation.</p>'
      '<div style="height:2.5mm"></div>'
      + rows([("Shell", "~USD 7 billion LNG train expansion."),
              ("Invest India", "USD 6 billion+ oil and gas investment pipeline across five states."),
              ("GITA for MPIDC", "State investment strategy across 13 focus sectors."),
              ("Ritzenhöfer &amp; Company", "~USD 400 million India tech hub, 550+ hires."),
              ("Synergy Marine Group", "Fleet digitalisation and decarbonisation.")], "#F6F7F9", MUTED, LINE)
      + f'<p class="fine" style="margin-top:2.5mm;color:{MUTED}">Roles held before founding VertiStrat.</p>')

html = f"""<!doctype html><meta charset="utf-8"><title>VertiStrat brochure</title><style>
@font-face {{ font-family:"Host Grotesk"; src:url(fonts/host.woff2); font-weight:400 800; }}
@font-face {{ font-family:"Instrument Sans"; src:url(fonts/instrument.woff2); font-weight:400 700; }}
@page {{ size:303mm 216mm; margin:0; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.page {{ position:relative; width:303mm; height:216mm; overflow:hidden; break-after:page; font-family:"Instrument Sans"; }}
.page:last-child {{ break-after:auto; }}
.panel {{ position:absolute; top:0; height:216mm; display:flex; flex-direction:column; }}
.brand {{ display:flex; align-items:center; font-family:"Host Grotesk"; font-weight:700; letter-spacing:-.02em; }}
h1 {{ font-family:"Host Grotesk"; font-weight:700; font-size:30pt; line-height:1.06; letter-spacing:-.025em; }}
h2 {{ font-family:"Host Grotesk"; font-weight:700; font-size:16pt; line-height:1.14; letter-spacing:-.015em; margin-bottom:3mm; }}
h3 {{ font-family:"Host Grotesk"; font-weight:700; font-size:12pt; line-height:1.2; margin-bottom:1mm; }}
.eyebrow {{ font-size:8.5pt; font-weight:600; margin-bottom:1.5mm; }}
.lead {{ font-size:12pt; line-height:1.3; margin-top:5mm; }}
.body {{ font-size:10pt; line-height:1.38; }}
.contact {{ font-size:10.5pt; font-weight:600; line-height:1.5; }}
.small {{ font-size:9pt; line-height:1.34; }}
.fine {{ font-size:8pt; line-height:1.35; }}
.row {{ padding:1.9mm 0; }}
.rowhead {{ font-size:9.5pt; font-weight:700; line-height:1.25; }}
.gap {{ height:7mm; }}
.tiles {{ display:flex; flex-direction:column; gap:1.5mm; margin-top:3.5mm; }}
.tile {{ border-radius:1.8mm; padding:3mm 3.5mm; }}
.block {{ border-radius:2.2mm; padding:5mm 4.5mm; margin-top:4.5mm; }}
.sectors {{ margin:1mm 0 0 3.5mm; font-size:9pt; line-height:1.42; }}
.block ul {{ margin:1.6mm 0 0 3.5mm; font-size:9pt; line-height:1.36; }}
</style>
<div class="page">
{panel(0, 97, SOFT, flap)}
{panel(97, 100, "#FFFFFF", back)}
{panel(197, 100, INK, cover, "#F6F7F9")}
</div>
<div class="page">
{panel(0, 100, "#FFFFFF", p1)}
{panel(100, 100, "#FFFFFF", p2)}
{panel(200, 97, INK, p3, "#F6F7F9")}
</div>"""
(HERE / "brochure.html").write_text(html)
pdf = HERE / "VertiStrat_Brochure_A4_TriFold_PRINT_3mm_bleed.pdf"
subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--print-to-pdf={pdf}",
                "--allow-file-access-from-files", f"file://{HERE/'brochure.html'}"], check=True, capture_output=True)
# Previews cropped to the 297 x 210 mm trim: 3 mm = 35 px at 300 dpi.
for page, side in ((1, "outside"), (2, "inside")):
    subprocess.run(["pdftoppm", "-png", "-singlefile", "-r", "300", "-f", str(page), "-l", str(page), "-x", "35", "-y", "35",
                    "-W", "3508", "-H", "2480", str(pdf), str(HERE / f"VertiStrat_Brochure_{side}")], check=True)
