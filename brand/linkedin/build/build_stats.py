import os,subprocess,tempfile,shutil
O=os.path.expanduser('~/Downloads/vertistrat_linkedin')
CSS='''
@font-face{font-family:Host;src:url(fonts/host.woff2);font-weight:100 900}
@font-face{font-family:Inst;src:url(fonts/instrument.woff2);font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;background:#fff;color:#0A0D12;font-family:Inst,sans-serif;position:relative;overflow:hidden}
h1,.h{font-family:Host,sans-serif;letter-spacing:-.02em}
.top{background:#0A0D12;color:#fff;padding:44px 64px 30px}
.kick{color:#EB8A00;font:700 22px Host;letter-spacing:.14em;text-transform:uppercase}
h1{font-size:50px;line-height:1.05;margin-top:14px;font-weight:700}
.sub{color:#B9C2D0;font-size:24px;margin-top:14px;line-height:1.35}
.foot{position:absolute;left:0;right:0;bottom:0;height:92px;background:#1E64EF;color:#fff;display:flex;justify-content:space-between;align-items:center;padding:0 64px}
.foot b{font:700 30px Host}.foot span{font-size:20px;opacity:.92;text-align:right;line-height:1.3}
.src{position:absolute;left:64px;right:64px;bottom:108px;font-size:15.5px;color:#5B6676;line-height:1.35}
'''
def page(name,body):
    h=f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}<div class="foot"><b>VertiStrat Solutions</b><span>Project advisory for energy, fuels &amp; industry<br>vertistratsolution.com</span></div></body></html>'
    p=os.path.join(O,name+'.html');open(p,'w').write(h)
    chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    out=os.path.join(O,name+'_2160.png');tmp=os.path.join(tempfile.mkdtemp(),'s.png')
    prof=tempfile.mkdtemp(prefix='li-chrome-')
    subprocess.run([chrome,'--headless=new',f'--user-data-dir={prof}','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=2','--window-size=1080,1350',f'--screenshot={tmp}','file://'+p],check=True,capture_output=True)
    assert os.path.getsize(tmp)>50000;shutil.copyfile(tmp,out)
    subprocess.run(['sips','-z','1350','1080',out,'--out',os.path.join(O,name+'.png')],check=True,capture_output=True)

def bars(rows,mx,color,fmt=lambda v:f'{v:,}'):
    s=''
    for n,v in rows:
        s+=f'<div style="display:flex;align-items:center;margin:7px 0"><div style="width:150px;font-size:21px">{n}</div><div style="height:26px;border-radius:4px;background:{color};width:{int(210*v/mx)}px"></div><div style="margin-left:10px;font:700 21px Host">{fmt(v)}</div></div>'
    return s


A=[2357, 2574, 2544, 4031, 4237, 4931, 2302, 3455, 2835, 1780, 3178, 2501, 2420, 1543, 1819, 1780, 2071, 2127, 2503, 1001, 976, 1048, 1219, 549];P=[21.0, 19.5, 18.1, 18.0, 19.0, 18.8, 21.5, 21.6, 22.9, 27.0, 23.7, 20.0, 25.5, 25.3, 26.8, 32.5, 37.8, 37.0, 34.4, 25.6, 33.9, 30.0, 21.4, 16.2]
W=952;bw=W/24
svg1='<svg width="952" height="260" viewBox="0 0 952 260">'
for i,(v,p) in enumerate(zip(A,P)):
    h=v/4931*170;x=i*bw+4;cen=i>=19
    svg1+=f'<rect x="{x:.1f}" y="{210-h:.1f}" width="{bw-8:.1f}" height="{h:.1f}" rx="3" fill="{"#9DB8F5" if cen else "#1E64EF"}"/>'
    if i%3==0 or i==23: svg1+=f'<text x="{x+bw/2-4:.1f}" y="232" font-size="15" text-anchor="middle" fill="#5B6676">{2001+i}</text>'
pts=' '.join(f'{i*bw+bw/2:.1f},{210-p/40*170:.1f}' for i,p in enumerate(P))
svg1+=f'<polyline points="{pts}" fill="none" stroke="#EB8A00" stroke-width="4" stroke-linejoin="round"/>'
for i in (0,16,23):
    svg1+=f'<text x="{i*bw+bw/2:.1f}" y="{210-P[i]/40*170-9:.1f}" font-size="17" font-weight="700" text-anchor="middle" fill="#B86A00" font-family="Host">{P[i]:.0f}%</text>'
svg1+=f'<text x="{5*bw+bw/2:.1f}" y="{210-A[5]/4931*170-8:.1f}" font-size="16" font-weight="700" text-anchor="middle" fill="#1E64EF">{A[5]:,}</text></svg>'
yrs=['2021','2022','2023','2024','2025'];fa=[1489,1185,1267,986,702];fb=[812,916,968,1165,998];ia=[7.71,4.24,5.11,6.02,5.30];ib=[3.48,2.50,2.77,4.94,5.83]
svg2='<svg width="952" height="270" viewBox="0 0 952 270">'
gw=952/5
for k in range(5):
    x0=k*gw+30;h1=fa[k]/1489*135;h2=fb[k]/1489*135
    svg2+=f'<rect x="{x0}" y="{160-h1}" width="60" height="{h1}" rx="4" fill="#1E64EF"/><rect x="{x0+66}" y="{160-h2}" width="60" height="{h2}" rx="4" fill="#EB8A00"/>'
    svg2+=f'<text x="{x0+30}" y="{154-h1}" font-size="19" font-weight="700" text-anchor="middle" font-family="Host">{fa[k]:,}</text><text x="{x0+96}" y="{154-h2}" font-size="19" font-weight="700" text-anchor="middle" font-family="Host">{fb[k]:,}</text>'
    svg2+=f'<text x="{x0+63}" y="186" font-size="21" font-weight="700" text-anchor="middle" font-family="Host">{yrs[k]}</text>'
    svg2+=f'<text x="{x0+30}" y="214" font-size="19" text-anchor="middle" fill="#1E64EF" font-weight="700">₹{ia[k]:.1f}</text><text x="{x0+96}" y="214" font-size="19" text-anchor="middle" fill="#B86A00" font-weight="700">₹{ib[k]:.1f}</text>'
svg2+='<text x="0" y="250" font-size="16" fill="#5B6676">Filings (bars) and investment in ₹ lakh crore (below). Blue = Part A proposed, orange = Part B invested.</text></svg>'
body=f'''<div class="top" style="padding:34px 64px 22px"><div class="kick">IEM statistics</div><h1 style="font-size:46px">2001 to 2025, then the last five years</h1>
<div class="sub" style="font-size:21px;margin-top:8px">Industrial Entrepreneur Memoranda filed with DPIIT: intent (Part A) and production started (Part B).</div></div>
<div style="padding:18px 64px 0">
 <div style="display:flex;gap:12px">
  <div style="flex:1.2;background:#0A0D12;color:#fff;border-radius:12px;padding:12px 16px"><div class="h" style="font-size:34px;font-weight:700;line-height:1">1,12,843</div><div style="font-size:16px;color:#B9C2D0;margin-top:3px">IEMs since Aug 1991, ₹160 lakh cr proposed (to Dec 2025)</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:12px 16px"><div class="h" style="font-size:34px;font-weight:700;line-height:1">0.9 yrs</div><div style="font-size:16px;color:#3b4554;margin-top:3px">median filing to production, where matched</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:12px 16px"><div class="h" style="font-size:34px;font-weight:700;line-height:1">15–23%</div><div style="font-size:16px;color:#3b4554;margin-top:3px">of 2001–18 filings later found in Part B</div></div>
 </div>
 <div style="margin-top:16px"><div class="h" style="font-size:24px;font-weight:700">A · 2001–24 at a glance</div><div style="font-size:17px;color:#3b4554;margin:2px 0 4px"><span style="color:#1E64EF;font-weight:700">■ Part A filings per year</span> &nbsp; <span style="color:#B86A00;font-weight:700">― share that reached Part B</span> &nbsp; (lighter bars: recent years, less time to report)</div>{svg1}</div>
 <div style="margin-top:8px"><div class="h" style="font-size:24px;font-weight:700">B · Zoom: the last five years (2021–25)</div><div style="font-size:17px;color:#3b4554;margin:2px 0 2px">Annual-report totals. Part B overtook Part A in 2024 and 2025.</div>{svg2}</div>
 <div style="margin-top:6px;background:#F2F5FB;border-radius:12px;padding:14px 20px;font-size:20px;line-height:1.4"><b>What it shows</b><br>• Follow-through rose from about 1 in 5 (2001–06) to about 1 in 3 (2016–19).<br>• Since 2024 more plants are reported started than new plans filed.<br>• 2025 Part A filings are the lowest of the five years. It was also the year of the April size threshold and the October move to NSWS.</div>
</div>
<div class="src" style="bottom:104px;font-size:14px">Sources: A: DPIIT monthly IEM lists 2001–24, parsed by VertiStrat (55,781 memoranda counted once; a lower bound on filings, e.g. the report counts 1,489 for 2021 against 976 here). B: DPIIT Annual Report 2025-26, Appendices III and V (2025 = up to December). Part A and Part B are different projects, so the totals are not a conversion rate.</div>'''
page('VertiStrat_LinkedIn_Stats_2001_2025',body)
