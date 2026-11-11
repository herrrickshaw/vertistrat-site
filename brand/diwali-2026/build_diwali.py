import math, os, subprocess, random
O = os.path.dirname(os.path.abspath(__file__))
BLUE, AMBER, INK = "#1E64EF", "#EB8A00", "#0A0D12"
random.seed(7)

def diya(cx, cy, s):
    # clay lamp: bowl + rim + flame with glow
    return f'''<g transform="translate({cx},{cy}) scale({s})">
  <circle cx="0" cy="-58" r="70" fill="url(#glow)"/>
  <path d="M-62,0 Q-58,38 0,40 Q58,38 62,0 Q30,10 0,10 Q-30,10 -62,0 Z" fill="url(#clay)"/>
  <path d="M-62,0 Q-30,10 0,10 Q30,10 62,0 Q30,-6 0,-6 Q-30,-6 -62,0 Z" fill="#7A2E0E"/>
  <path d="M-40,20 Q0,30 40,20" stroke="#FFC46B" stroke-width="2.4" fill="none" opacity=".75"/>
  <circle cx="-22" cy="24" r="2.6" fill="#FFC46B" opacity=".8"/><circle cx="0" cy="27" r="2.6" fill="#FFC46B" opacity=".8"/><circle cx="22" cy="24" r="2.6" fill="#FFC46B" opacity=".8"/>
  <path d="M0,-74 C14,-52 16,-30 0,-8 C-16,-30 -14,-52 0,-74 Z" fill="url(#flame)"/>
  <path d="M0,-48 C6,-38 7,-26 0,-14 C-7,-26 -6,-38 0,-48 Z" fill="#FFF6D6"/>
</g>'''

def rangoli(cx, cy, r):
    parts = []
    for ring, (n, rr, pr) in enumerate([(8, r*0.34, r*0.16), (16, r*0.64, r*0.12), (24, r*0.92, r*0.07)]):
        for i in range(n):
            a = 2*math.pi*i/n + (math.pi/n if ring == 1 else 0)
            x, y = cx + rr*math.cos(a), cy + rr*math.sin(a)
            deg = math.degrees(a) + 90
            parts.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{pr*0.45:.1f}" ry="{pr:.1f}" transform="rotate({deg:.1f} {x:.1f} {y:.1f})"/>')
    for k in (0.2, 0.5, 0.78, 1.0):
        parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r*k:.1f}" fill="none"/>')
    return f'<g fill="none" stroke="{AMBER}" stroke-width="1.6" opacity=".16">{"".join(parts)}</g>'

def _ok(x, y):
    # keep sparkles out of the logo, headline, message and signature blocks
    return not (330 < x < 750 and 40 < y < 120) and not (150 < x < 930 and 170 < y < 680)
_pts = []
while len(_pts) < 60:
    x, y = random.uniform(30, 1050), random.uniform(25, 700)
    if _ok(x, y): _pts.append((x, y))
sparks = ''.join(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.choice([1.2,1.6,2.2,3]):.1f}" fill="#FFD48A" opacity="{random.uniform(.3,.85):.2f}"/>' for x, y in _pts)
lamps = ''.join(diya(540 + 190*k, 875 + 14*abs(k), 1.0 if k == 0 else 0.86 - 0.06*abs(k)) for k in (-2, -1, 0, 1, 2))
logo = (f'<svg width="44" height="44" viewBox="0 0 22 22"><rect x="0" y="13" width="5" height="9" rx="1" fill="{BLUE}"/>'
        f'<rect x="8" y="7" width="5" height="15" rx="1" fill="{BLUE}"/><rect x="16" y="0" width="5" height="22" rx="1" fill="{AMBER}"/></svg>')

html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family:"Host Grotesk"; src:url(fonts/host.woff2); font-weight:400 800; }}
@font-face {{ font-family:"Instrument Sans"; src:url(fonts/instrument.woff2); font-weight:400 700; }}
html,body {{ margin:0; background:{INK}; }}
.c {{ position:relative; width:1080px; height:1080px; overflow:hidden; font-family:"Instrument Sans";
  background: radial-gradient(900px 620px at 50% 96%, #5A2A06 0%, #2A1406 38%, #111018 70%, {INK} 100%); }}
.abs {{ position:absolute; }}
.brand {{ top:58px; left:0; right:0; display:flex; justify-content:center; align-items:center; gap:16px;
  font-family:"Host Grotesk"; font-weight:700; font-size:40px; letter-spacing:-.02em; color:#F6F7F9; }}
.h {{ top:190px; left:0; right:0; text-align:center; font-family:"Host Grotesk"; font-weight:800; font-size:128px;
  line-height:1; letter-spacing:-.035em; color:#FFE2A8; text-shadow:0 0 38px rgba(235,138,0,.55); }}
.h span {{ color:{AMBER}; }}
.rule {{ top:350px; left:470px; width:140px; height:3px; background:linear-gradient(90deg,transparent,{AMBER},transparent); }}
.msg {{ top:382px; left:150px; right:150px; text-align:center; font-size:35px; line-height:1.38; color:#F3E9DA; }}
.sig {{ top:548px; left:0; right:0; text-align:center; font-size:25px; line-height:1.45; color:#C9C2B6; }}
.sig b {{ color:#F6F7F9; font-weight:600; }}
.url {{ bottom:30px; left:0; right:0; text-align:center; font-size:22px; letter-spacing:.06em; color:#A6ABB3; }}
</style></head><body><div class="c">
<svg class="abs" style="inset:0" width="1080" height="1080" viewBox="0 0 1080 1080">
<defs>
 <radialGradient id="glow"><stop offset="0" stop-color="#FFB547" stop-opacity=".75"/><stop offset=".45" stop-color="#EB8A00" stop-opacity=".25"/><stop offset="1" stop-color="#EB8A00" stop-opacity="0"/></radialGradient>
 <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E25A00"/><stop offset=".5" stop-color="#FFA21A"/><stop offset="1" stop-color="#FFE48A"/></linearGradient>
 <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2691E"/><stop offset="1" stop-color="#8B3A10"/></linearGradient>
</defs>
{rangoli(540, 1080, 520)}
{sparks}
{lamps}
</svg>
<div class="abs brand">{logo}VertiStrat</div>
<div class="abs h">Happy <span>Diwali</span></div>
<div class="abs rule"></div>
<div class="abs msg">May the festival of lights bring you and your family joy, good health and prosperity.</div>
<div class="abs sig">Warm wishes,<br><b>Umashankar Triplicane Dwarakanathan</b><br>Founder, VertiStrat Solutions</div>
<div class="abs url">vertistratsolution.com</div>
</div></body></html>'''
p = os.path.join(O, 'diwali.html'); open(p, 'w').write(html)
chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
out = os.path.join(O, 'VertiStrat_Diwali_2026_2160.png')
import tempfile
prof = tempfile.mkdtemp(prefix='diwali-chrome-'); tmpout = os.environ.get('DIWALI_SHOT', out)
for f in (tmpout, out):
    if os.path.exists(f): os.remove(f)
subprocess.run([chrome, '--headless=new', f'--user-data-dir={prof}', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
  '--window-size=1080,1080', f'--screenshot={tmpout}', 'file://' + p], check=True, capture_output=True)
import shutil
if tmpout != out: shutil.copyfile(tmpout, out)
assert os.path.getsize(out) > 100000, 'screenshot missing'
subprocess.run(['sips', '-z', '1080', '1080', out, '--out', os.path.join(O, 'VertiStrat_Diwali_2026.png')], check=True, capture_output=True)
subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '92', os.path.join(O, 'VertiStrat_Diwali_2026.png'), '--out', os.path.join(O, 'VertiStrat_Diwali_2026_WhatsApp.jpg')], check=True, capture_output=True)
print('ok')
