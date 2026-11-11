import os,csv
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'build_stats.py')).read()
exec(src.split('\nA=[')[0])
Y=list(range(2014,2026))
AC=[1801,1998,2283,1972,2173,2378,1432,1489,1185,1267,986,702]
AV=[404339,311031,414086,395296,458652,678852,414620,771428,424101,510852,602000,530000]   # Rs crore
BC=[340,441,525,571,1005,1229,848,812,916,968,1165,998]
BV=[78747,77972,100537,71396,255783,1796552,233969,347978,250064,276925,494000,583000]
# save data
with open(os.path.join(O,'IEM_yearly_count_value_2014_2025.csv'),'w',newline='') as f:
    w=csv.writer(f);w.writerow(['year','partA_filed','partA_proposed_Rs_cr','partA_avg_Rs_cr','partB_filed','partB_invested_Rs_cr','partB_avg_Rs_cr','note'])
    for i,y in enumerate(Y):
        n='2024-25 values are rounded to Rs 0.01 lakh crore (annual report 2025-26)' if y>=2024 else ('2019 Part B includes Gujarat Rs 15,18,861 cr from 434 filings (likely outlier)' if y==2019 else '')
        w.writerow([y,AC[i],AV[i],round(AV[i]/AC[i]),BC[i],BV[i],round(BV[i]/BC[i]),n])
def chart(cnt,val,cmax,vmax,ccol,vcol,clip=None):
    W=952;n=12;bw=W/n;ph=120;base=140
    s=f'<svg width="{W}" height="228" viewBox="0 0 {W} 228">'
    for g in (0.5,1):
        s+=f'<line x1="0" x2="{W}" y1="{base-ph*g:.1f}" y2="{base-ph*g:.1f}" stroke="#E4E8EF"/>'
    for i,c in enumerate(cnt):
        h=c/cmax*ph;x=i*bw+10
        s+=f'<rect x="{x:.1f}" y="{base-h:.1f}" width="{bw-20:.1f}" height="{h:.1f}" rx="3" fill="{ccol}" opacity=".85"/>'
    pts=[]
    for i,v in enumerate(val):
        y=base-min(v,vmax)/vmax*ph;pts.append(f'{i*bw+bw/2:.1f},{y:.1f}')
    s+=f'<polyline points="{" ".join(pts)}" fill="none" stroke="{vcol}" stroke-width="4" stroke-linejoin="round"/>'
    for i,v in enumerate(val):
        y=base-min(v,vmax)/vmax*ph
        s+=f'<circle cx="{i*bw+bw/2:.1f}" cy="{y:.1f}" r="5" fill="{vcol}"/>'
    for i,y in enumerate(Y):
        x=i*bw+bw/2
        s+=f'<text x="{x:.1f}" y="160" font-size="15" text-anchor="middle" fill="#5B6676">{y}</text>'
        s+=f'<text x="{x:.1f}" y="186" font-size="16.5" font-weight="700" text-anchor="middle" fill="{ccol}" font-family="Host">{cnt[i]:,}</text>'
        s+=f'<text x="{x:.1f}" y="212" font-size="16.5" font-weight="700" text-anchor="middle" fill="{vcol}" font-family="Host">{val[i]/1e5:.2f}</text>'
    s+='</svg>';return s
sa=chart(AC,AV,2500,8e5,'#1E64EF','#EB8A00')
sb=chart(BC,BV,1400,8e5,'#1E64EF','#EB8A00',clip=True)
# ticket size
TA=[AV[i]/AC[i] for i in range(12)];TB=[BV[i]/BC[i] for i in range(12)];TB[5]=(1796552-1518861)/(1229-434)
W=952;bw=W/12;mx=800
sc=f'<svg width="{W}" height="200" viewBox="0 0 {W} 200">'
for i,v in enumerate(TA):
    h=v/mx*130;x=i*bw+10
    sc+=f'<rect x="{x:.1f}" y="{150-h:.1f}" width="{bw-20:.1f}" height="{h:.1f}" rx="3" fill="#1E64EF"/><text x="{i*bw+bw/2:.1f}" y="{143-h:.1f}" font-size="16" font-weight="700" text-anchor="middle" font-family="Host">{v:,.0f}</text><text x="{i*bw+bw/2:.1f}" y="174" font-size="15" text-anchor="middle" fill="#5B6676">{Y[i]}</text>'
sc+='</svg>'
a1=sum(AC[:6])/6;a2=sum(AC[6:])/6;v1=sum(AV[:6])/6;v2=sum(AV[6:])/6
H=lambda t,s:f'<div class="h" style="font-size:22px;font-weight:700">{t}</div><div style="font-size:15.5px;color:#3b4554;margin:1px 0 2px">{s}</div>'
body=f'''<div class="top" style="padding:28px 64px 18px"><div class="kick">IEM trends, 2014 to 2025</div><h1 style="font-size:44px">Fewer projects, much bigger tickets</h1>
<div class="sub" style="font-size:20px;margin-top:6px">Number of Industrial Entrepreneur Memoranda and their value, from DPIIT annual reports</div></div>
<div style="padding:12px 64px 0">
 <div style="display:flex;gap:12px">
  <div style="flex:1;background:#0A0D12;color:#fff;border-radius:12px;padding:10px 16px"><div class="h" style="font-size:30px;font-weight:700;line-height:1">{(a2/a1-1)*100:.0f}% projects</div><div style="font-size:15px;color:#B9C2D0;margin-top:3px">Part A filings a year, 2020–25 vs 2014–19 ({a1:,.0f} to {a2:,.0f})</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:10px 16px"><div class="h" style="font-size:30px;font-weight:700;line-height:1">+{(v2/v1-1)*100:.0f}% value</div><div style="font-size:15px;color:#3b4554;margin-top:3px">proposed per year, ₹{v1/1e5:.1f} to ₹{v2/1e5:.1f} lakh crore</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:10px 16px"><div class="h" style="font-size:30px;font-weight:700;line-height:1">₹225 → ₹755 cr</div><div style="font-size:15px;color:#3b4554;margin-top:3px">average proposed per filing, 2014 to 2025</div></div>
 </div>
 <div style="margin-top:10px">{H('A · Part A, intent to build','<b style="color:#1E64EF">Bars: filings</b> &nbsp; <b style="color:#B86A00">Line: proposed investment, ₹ lakh crore (1 lakh crore = 1,00,000 crore)</b>')}{sa}</div>
 <div style="margin-top:4px">{H('B · Part B, production started','<b style="color:#1E64EF">Bars: filings</b> &nbsp; <b style="color:#B86A00">Line: actual investment, ₹ lakh crore</b> &nbsp; 2019 is cut off at 8: it reads 17.97')}{sb}</div>
 <div style="margin-top:4px">{H('C · Average proposed investment per Part A filing, ₹ crore','')}{sc}</div>
 <div style="margin-top:2px;background:#F2F5FB;border-radius:12px;padding:10px 18px;font-size:18px;line-height:1.35"><b>What it shows</b> · Filings fell from about 2,100 a year to about 1,180, but proposed value rose, so the average filing is now over three times larger. In 2025 actual investment (₹5.83 lakh crore) passed new proposals (₹5.30 lakh crore).</div>
</div>
<div class="src" style="bottom:100px;font-size:12.5px">Source: DPIIT Annual Reports 2018-19 to 2023-24 (Appendices III and V) and 2025-26; latest report used where a year was revised (e.g. 2018 Part A: 2,754 became 2,173). 2019 Part B includes ₹15.2 lakh crore from Gujarat (434 filings), probably an outlier; the ticket in C is Part A only. 2025 is to December. Proposals and actual figures are different projects, not a conversion. Company-list counts are lower than report totals.</div>'''
page('VertiStrat_LinkedIn_IEM_Trends_Count_Value',body)
print(a1,a2,v1,v2,[round(x) for x in TA],[round(x) for x in TB])
