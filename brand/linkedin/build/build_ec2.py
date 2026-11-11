import os
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'build_stats.py')).read()
exec(src.split('\nA=[')[0])
def hb(rows,mx,color,w=250,fs=18,lw=190):
    s=''
    for n,v,*t in rows:
        lab=f'{v:,}'+(f' <span style="color:#5B6676;font-weight:400">{t[0]}</span>' if t else '')
        s+=f'<div style="display:flex;align-items:center;margin:5px 0"><div style="width:{lw}px;font-size:{fs}px;line-height:1.1">{n}</div><div style="height:22px;border-radius:4px;background:{color};width:{max(3,int(w*v/mx))}px"></div><div style="margin-left:8px;font:700 {fs}px Host;white-space:nowrap">{lab}</div></div>'
    return s
sector=[('Non-coal mining',40923,'73%'),('Buildings, townships (INFRA-2)',11460,'20%'),('Industrial projects',3374,'6%'),('Coal mining',274),('Infra-1 (ports, airports etc.)',223),('Thermal power',92),('River valley, hydro',70)]
typ=[('Fresh projects',28299,'50%'),('Mining re-appraisal',13616,'24%'),('Expansion',3337),('Transfer of owner',3301),('Amend, extend, other',3560),('Not stated',4304)]
act=[('Synthetic organic chemicals',1210),('Metallurgical (iron, steel, metals)',619),('Distilleries (incl. grain)',543),('Cement plants',149),('Oil and gas exploration',129),('Pesticides',97),('Mineral beneficiation',95),('Sugar',50),('Fertilisers',46)]
st=[('Gujarat',1021,'30%'),('Maharashtra',390),('Odisha',280),('Karnataka',210),('Chhattisgarh',151),('Rajasthan',143),('Uttar Pradesh',142),('West Bengal',139)]
yy=['2022','2023','2024','2025','2026*'];yv=[186,871,960,913,444]
s3='<svg width="952" height="130" viewBox="0 0 952 130">'
for k in range(5):
    x=k*190+10;h=yv[k]/960*62
    s3+=f'<rect x="{x}" y="{98-h:.1f}" width="150" height="{h:.1f}" rx="4" fill="#EB8A00"/><text x="{x+75}" y="{90-h:.1f}" font-size="19" font-weight="700" text-anchor="middle" font-family="Host">{yv[k]:,}</text><text x="{x+75}" y="122" font-size="17" text-anchor="middle" fill="#5B6676">{yy[k]}</text>'
s3+='</svg>'
H=lambda t,sub:f'<div class="h" style="font-size:22px;font-weight:700">{t}</div><div style="font-size:15px;color:#5B6676;margin:1px 0 4px">{sub}</div>'
body=f'''<div class="top" style="padding:30px 64px 20px"><div class="kick">Environmental clearance (EC)</div><h1 style="font-size:44px">What gets cleared, and where</h1>
<div class="sub" style="font-size:20px;margin-top:6px">56,417 ECs granted on PARIVESH 2.0 (proposals filed 2022 to Oct 2026), by type</div></div>
<div style="padding:14px 64px 0">
 <div style="display:flex;gap:12px">
  <div style="flex:1;background:#0A0D12;color:#fff;border-radius:12px;padding:10px 16px"><div class="h" style="font-size:32px;font-weight:700;line-height:1">73%</div><div style="font-size:15px;color:#B9C2D0;margin-top:3px">are non-coal mining; about half are leases under 5 ha</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:10px 16px"><div class="h" style="font-size:32px;font-weight:700;line-height:1">3,374</div><div style="font-size:15px;color:#3b4554;margin-top:3px">industrial projects, 6% of the total</div></div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:10px 16px"><div class="h" style="font-size:32px;font-weight:700;line-height:1">30%</div><div style="font-size:15px;color:#3b4554;margin-top:3px">of industrial ECs are in Gujarat</div></div>
 </div>
 <div style="display:flex;gap:28px;margin-top:12px">
  <div style="flex:1.1">{H('A · By sector','all ECs granted')}{hb(sector,40923,'#1E64EF',w=150,fs=16,lw=190)}</div>
  <div style="flex:1">{H('B · By kind of proposal','all ECs granted')}{hb(typ,28299,'#1E64EF',w=130,fs=16,lw=150)}
  <div style="font-size:15px;color:#5B6676;margin-top:6px">Appraisal tier: B2 44,291 · B1 10,492 · A 1,633</div></div>
 </div>
 <div style="display:flex;gap:28px;margin-top:12px">
  <div style="flex:1.2">{H('C · Industrial ECs by activity','3,374 granted (290 with no activity listed)')}{hb(act,1210,'#EB8A00',w=130,fs=16,lw=225)}</div>
  <div style="flex:.8">{H('D · Industrial ECs by state','top eight')}{hb(st,1021,'#EB8A00',w=100,fs=16,lw=125)}</div>
 </div>
 <div style="margin-top:8px">{H('E · Industrial ECs granted, by filing year','')}{s3}</div>
<div style="margin-top:8px;background:#F2F5FB;border-radius:12px;padding:12px 20px;font-size:19px;line-height:1.38"><b>What it shows</b><br>• Industrial ECs filed in 2023–25 ran at about 870–960 a year, steady while mining volume swung.<br>• Chemicals, metals and distilleries make up about 77% of industrial ECs with a stated activity.<br>• Gujarat alone holds 3 in 10, ahead of Maharashtra and Odisha.</div></div>
<div class="src" style="bottom:104px;font-size:13px">Source: PARIVESH 2.0 EC register (open API, saved 7 Oct 2026), proposals with status EC Granted, counted by VertiStrat. "Industrial" = Industrial Projects 1, 2 and 3 (chemicals, metals, distilleries, cement, oil and gas etc.). Counts are proposals, not projects; a project can appear more than once. By filing year; 2026 is part-year. Covers 2022 onward only.</div>'''
page('VertiStrat_LinkedIn_EC_Categories',body)
