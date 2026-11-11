import os
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'build_stats.py')).read()
exec(src.split('\nA=[')[0])
# Panel 1a: CAG sample, average delay beyond 105-day limit
cy=['2011','2012','2013','2014','2015*'];cv=[86,184,231,316,238]
s1='<svg width="460" height="250" viewBox="0 0 460 250">'
for i,(y,v) in enumerate(zip(cy,cv)):
    h=v/316*150;x=10+i*88
    s1+=f'<rect x="{x}" y="{190-h:.1f}" width="64" height="{h:.1f}" rx="4" fill="#EB8A00"/><text x="{x+32}" y="{183-h:.1f}" font-size="20" font-weight="700" text-anchor="middle" font-family="Host">{v}</text><text x="{x+32}" y="216" font-size="18" text-anchor="middle" fill="#5B6676">{y}</text>'
s1+='<text x="0" y="242" font-size="14" fill="#5B6676">*to July 2015</text></svg>'
# Panel 1b: MoEFCC average days, central EC+CRZ
by=['2019','2020','2022'];bv=[150,102,70];bl=['150+','102','under 70']
s2='<svg width="460" height="250" viewBox="0 0 460 250">'
ly=190-105/160*150
for i,(y,v,l) in enumerate(zip(by,bv,bl)):
    h=v/160*150;x=30+i*135
    s2+=f'<rect x="{x}" y="{190-h:.1f}" width="80" height="{h:.1f}" rx="4" fill="#1E64EF"/><text x="{x+40}" y="{(205-h) if v==102 else (183-h):.1f}" font-size="20" font-weight="700" text-anchor="middle" font-family="Host" fill="{'#fff' if v==102 else '#0A0D12'}">{l}</text><text x="{x+40}" y="216" font-size="18" text-anchor="middle" fill="#5B6676">{y}</text>'
s2+=f'<line x1="0" x2="460" y1="{ly:.1f}" y2="{ly:.1f}" stroke="#0A0D12" stroke-width="2" stroke-dasharray="6 5"/><text x="452" y="{ly-6:.1f}" font-size="15" text-anchor="end" font-weight="700">105-day limit</text></svg>'
# Panel 2: EC granted by submission year, PARIVESH 2.0
yy=['2022','2023','2024','2025','2026*'];st=[1759,10284,20481,15249,6345];ce=[113,613,720,583,270]
s3='<svg width="952" height="250" viewBox="0 0 952 250">';gw=952/5
for k in range(5):
    x=k*gw+60;hs=st[k]/21201*150;hc=ce[k]/21201*150;tot=st[k]+ce[k]
    s3+=f'<rect x="{x}" y="{185-hs:.1f}" width="120" height="{hs:.1f}" rx="4" fill="#1E64EF"/><rect x="{x}" y="{185-hs-hc-1:.1f}" width="120" height="{max(hc,3):.1f}" fill="#EB8A00"/>'
    s3+=f'<text x="{x+60}" y="{176-hs-hc:.1f}" font-size="21" font-weight="700" text-anchor="middle" font-family="Host">{tot:,}</text><text x="{x+60}" y="210" font-size="19" text-anchor="middle" fill="#5B6676">{yy[k]}</text><text x="{x+60}" y="236" font-size="17" text-anchor="middle" fill="#B86A00" font-weight="700">central {ce[k]}</text>'
s3+='</svg>'
body=f'''<div class="top" style="padding:34px 64px 22px"><div class="kick">Environmental clearance (EC)</div><h1 style="font-size:46px">How long it takes, and how many are granted</h1>
<div class="sub" style="font-size:21px;margin-top:8px">The step between Part A (intent) and Part B (production): the data that exists, and where it stops.</div></div>
<div style="padding:18px 64px 0">
 <div style="display:flex;gap:12px">
  <div style="flex:1;background:#0A0D12;color:#fff;border-radius:12px;padding:12px 16px"><div class="h" style="font-size:34px;font-weight:700;line-height:1">105 days</div><div style="font-size:16px;color:#B9C2D0;margin-top:3px">limit from final EIA report to EC (2006 rules)</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:12px 16px"><div class="h" style="font-size:34px;font-weight:700;line-height:1">+316 days</div><div style="font-size:16px;color:#3b4554;margin-top:3px">average delay past the limit, 2014 sample</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:12px 16px"><div class="h" style="font-size:34px;font-weight:700;line-height:1">under 70</div><div style="font-size:16px;color:#3b4554;margin-top:3px">average days, central EC and CRZ, 2022</div></div>
 </div>
 <div style="margin-top:14px"><div class="h" style="font-size:24px;font-weight:700">A · Time taken, central clearances</div>
 <div style="display:flex;gap:32px;margin-top:2px"><div><div style="font-size:16.5px;color:#3b4554;margin-bottom:2px"><b style="color:#B86A00">Days of delay beyond the limit</b>, 216 sampled projects (CAG audit)</div>{s1}</div>
 <div><div style="font-size:16.5px;color:#3b4554;margin-bottom:2px"><b style="color:#1E64EF">Average days to grant</b>, EC and CRZ (MoEFCC)</div>{s2}</div></div></div>
 <div style="margin-top:2px"><div class="h" style="font-size:24px;font-weight:700">B · ECs granted, by year the proposal was filed (2022 onward)</div><div style="font-size:17px;color:#3b4554;margin:2px 0 2px"><span style="color:#1E64EF;font-weight:700">■ State committees (SEIAA)</span> &nbsp; <span style="color:#B86A00;font-weight:700">■ Central (MoEFCC)</span> &nbsp; PARIVESH 2.0 register, to 7 Oct 2026</div>{s3}</div>
 <div style="margin-top:2px;background:#F2F5FB;border-radius:12px;padding:12px 20px;font-size:19px;line-height:1.38"><b>What it shows</b><br>• Delays past the limit grew from 86 to 316 days in 2011–14. Central averages then fell from over 150 days (2019) to under 70 (2022).<br>• 96% of the 56,417 ECs on the register are state grants. Central grants stay near 600–700 a year.<br>• Half of all proposals are re-appraisals, transfers or expansions, not new projects.</div>
</div>
<div class="src" style="bottom:104px;font-size:13.5px">Sources: CAG Report 39 of 2016, Table 2.1 (216 sampled central ECs; delay measured past the 105-day limit; averages are not total time). MoEFCC, Parliament reply published by PIB (central EC and CRZ). PARIVESH 2.0 EC register, counted by VertiStrat. Grant counts are by filing year, not grant year; 2026 is part-year; later years may still rise. The two time series measure different things. No official EC-only count for every year before 2022 was found.</div>'''
page('VertiStrat_LinkedIn_EC_Time_and_Count',body)
