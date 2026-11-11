"""Build the VertiStrat business card: 90 x 54 mm trim, 3 mm bleed, print PDF + trimmed PNG previews."""
import pathlib, subprocess

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE = pathlib.Path(__file__).parent
NAME = ("Umashankar", "Triplicane Dwarakanathan")
TITLE = "Founder"
EMAIL = "contact@vertistratsolution.com"
PHONE = "+91 70222 59460"
WEB = "vertistratsolution.com"
TAGLINE = ("From the policy desk", "to the plant floor.")
BLUE, AMBER, INK, MUTED, FG, GREY, SOFT = "#1E64EF", "#EB8A00", "#0A0D12", "#A6ABB3", "#0E1217", "#565B63", "#EAF4FF"


def logo(h, blue=BLUE):
    return (f'<svg style="height:{h}mm;width:{h}mm;display:block" viewBox="0 0 22 22">'
            f'<rect x="0" y="13" width="5" height="9" rx="1" fill="{blue}"/>'
            f'<rect x="8" y="7" width="5" height="15" rx="1" fill="{blue}"/>'
            f'<rect x="16" y="0" width="5" height="22" rx="1" fill="{AMBER}"/></svg>')


contours = "".join(
    f'<path d="M -20 {240 - i*26} C 90 {200 - i*30}, 160 {290 - i*34}, 260 {210 - i*28} S 380 {150 - i*22}, 430 {170 - i*24}" '
    f'stroke="{AMBER}" stroke-width="0.7" fill="none" opacity="{0.2 + i*0.04:.2f}"/>' for i in range(7))

html = f"""<!doctype html><meta charset="utf-8"><title>VertiStrat business card</title><style>
@font-face {{ font-family:"Host Grotesk"; src:url(fonts/host.woff2); font-weight:400 800; }}
@font-face {{ font-family:"Instrument Sans"; src:url(fonts/instrument.woff2); font-weight:400 700; }}
@page {{ size:96mm 60mm; margin:0; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
.side {{ position:relative; width:96mm; height:60mm; overflow:hidden; break-after:page; font-family:"Instrument Sans"; }}
.side:last-child {{ break-after:auto; }}
.abs {{ position:absolute; }}
.brand {{ display:flex; align-items:center; gap:1.9mm; font-family:"Host Grotesk"; font-weight:700; letter-spacing:-.02em; }}
/* All positions below include the 3 mm bleed; the safe area starts at 8 mm. */
.name {{ right:8.5mm; text-align:right; top:22mm; font-family:"Host Grotesk"; font-weight:700; font-size:14pt; line-height:1.14; letter-spacing:-.02em; color:{FG}; }}
.title {{ right:8.5mm; text-align:right; top:35.2mm; font-size:8.5pt; font-weight:600; color:{BLUE}; }}
.contact {{ right:8.5mm; text-align:right; bottom:8.2mm; font-size:8pt; line-height:1.42; color:{FG}; }}
</style>
<div class="side" style="background:#fff">
  <div class="abs brand" style="right:8.5mm;top:8.5mm;font-size:12pt;color:{FG}">{logo(5)}VertiStrat</div>
  <div class="abs name">{NAME[0]}<br>{NAME[1]}</div>
  <div class="abs title">{TITLE}</div>
  <div class="abs contact">{EMAIL}<br>{PHONE}</div>
</div>
<div class="side" style="background:{INK};color:#fff">
  <svg class="abs" style="inset:0;width:100%;height:100%" viewBox="0 0 400 250" preserveAspectRatio="xMinYMid slice">{contours}</svg>
  <div class="abs" style="inset:0;background:linear-gradient(270deg,{INK} 0%,{INK} 58%,rgba(10,13,18,0) 82%)"></div>
  <div class="abs brand" style="right:8.5mm;top:17.5mm;font-size:21pt;gap:3mm">{logo(9)}VertiStrat</div>
  <div class="abs" style="right:8.5mm;text-align:right;top:31mm;font-size:10pt;line-height:1.3;color:#F6F7F9">{TAGLINE[0]}<br>{TAGLINE[1]}</div>
  <div class="abs" style="right:8.5mm;text-align:right;bottom:8.2mm;font-size:8pt;color:{MUTED}">{WEB}</div>
</div>"""
(HERE / "card.html").write_text(html)
pdf = HERE / "VertiStrat_Business_Card_PRINT_90x54mm_3mm_bleed.pdf"
subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--print-to-pdf={pdf}",
                "--allow-file-access-from-files", f"file://{HERE/'card.html'}"], check=True, capture_output=True)
# Previews cropped to the 90 x 54 mm trim: 3 mm = 71 px at 600 dpi.
for page, side in ((1, "front"), (2, "back")):
    subprocess.run(["pdftoppm", "-png", "-singlefile", "-r", "600", "-f", str(page), "-l", str(page),
                    "-x", "71", "-y", "71", "-W", "2126", "-H", "1276", str(pdf), str(HERE / f"VertiStrat_Business_Card_{side}")], check=True)
