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

# ---------- Graphic 1 ----------
a=[('Maharashtra',1119),('Gujarat',873),('Karnataka',390),('Tamil Nadu',374),('Uttar Pradesh',355)]
b=[('Gujarat',893),('Maharashtra',893),('Madhya Pr.',373),('Uttar Pradesh',364),('Andhra Pr.',251),('Tamil Nadu',251)]
m=[('Maharashtra',182),('Uttar Pradesh',168),('Bihar',126)]
yrs=[('2021',7.71,3.48),('2022',4.24,2.50),('2023',5.11,2.77),('2024',6.02,4.94),('2025',5.30,5.83)]
yg=''.join(f'<div style="flex:1;text-align:center"><div style="font:700 20px Host;color:#5B6676">{y}</div><div style="font:700 24px Host;color:#1E64EF;margin-top:2px">{x:.1f}</div><div style="font:700 24px Host;color:#B86A00">{z:.1f}</div></div>' for y,x,z in yrs)
body=f'''<div class="top"><div class="kick">India project pipeline</div><h1>From intent to production to public projects</h1>
<div class="sub">DPIIT Annual Report 2025-26 and MoSPI’s July 2026 project monitoring.</div></div>
<div style="padding:24px 64px 0">
 <div style="display:flex;gap:28px">
  <div style="flex:1;border-left:8px solid #1E64EF;padding-left:22px"><div style="font:700 20px Host;color:#1E64EF;letter-spacing:.08em">IEM PART A · INTENT</div><div class="h" style="font-size:70px;font-weight:700;line-height:1">5,629</div><div style="font-size:20px;color:#3b4554;margin-top:4px">filings 2021–25 · ₹28.4 lakh cr proposed</div></div>
  <div style="flex:1;border-left:8px solid #EB8A00;padding-left:22px"><div style="font:700 20px Host;color:#B86A00;letter-spacing:.08em">IEM PART B · PRODUCTION</div><div class="h" style="font-size:70px;font-weight:700;line-height:1">4,859</div><div style="font-size:20px;color:#3b4554;margin-top:4px">filings 2021–25 · ₹19.5 lakh cr invested</div></div>
 </div>
 <div style="margin-top:16px;background:#F2F5FB;border-radius:12px;padding:14px 20px">
  <div style="font:700 19px Host;letter-spacing:.06em;color:#3b4554;margin-bottom:8px">INVESTMENT BY YEAR, ₹ LAKH CRORE &nbsp;<span style="color:#1E64EF">■ PROPOSED (A)</span> &nbsp;<span style="color:#B86A00">■ INVESTED (B)</span></div>
  <div style="display:flex">{yg}</div>
  <div style="font-size:19px;color:#3b4554;margin-top:8px;line-height:1.3">In 2025, Part B investment passed Part A proposals. They are different projects, so this is not a loss rate.</div>
 </div>
 <div style="display:flex;gap:28px;margin-top:16px">
  <div style="flex:1"><div class="h" style="font-size:22px;font-weight:700;margin-bottom:4px">Part A filings 2021–25</div>{bars(a,1119,'#1E64EF')}</div>
  <div style="flex:1"><div class="h" style="font-size:22px;font-weight:700;margin-bottom:4px">Part B filings 2021–25</div>{bars(b,893,'#EB8A00')}</div>
 </div>
 <div style="margin-top:12px;background:#0A0D12;color:#fff;border-radius:14px;padding:16px 24px">
  <div style="font:700 19px Host;color:#EB8A00;letter-spacing:.08em">MoSPI · CENTRAL PROJECTS ≥ ₹150 CRORE · JULY 2026</div>
  <div style="display:flex;gap:30px;margin-top:6px;align-items:flex-end">
   <div><div class="h" style="font-size:48px;font-weight:700;line-height:1">1,775</div><div style="font-size:18px;color:#B9C2D0">ongoing projects</div></div>
   <div><div class="h" style="font-size:48px;font-weight:700;line-height:1">₹37.1<span style="font-size:26px"> lakh cr</span></div><div style="font-size:18px;color:#B9C2D0">revised cost · 51.9% spent</div></div>
   <div style="font-size:19px;color:#B9C2D0;line-height:1.35">Most projects by state:<br><b style="color:#fff">Maharashtra 182 · Uttar Pradesh 168 · Bihar 126</b></div>
  </div>
 </div>
</div>
<div class="src">Sources: DPIIT Annual Report 2025-26, Appendices III and V (2025 = up to December 2025; state ranks use the state rows, which are slightly below the totals); MoSPI PAIMANA Flash Report, July 2026 (a multi-state project counts in each state).</div>'''
page('VertiStrat_LinkedIn_1_Pipeline_Summary',body)

# ---------- Graphic 2: funnel ----------
def stage(w,color,num,title,big,sm,tag,dash=False):
    bd='border:3px dashed #1E64EF;background:#fff;color:#0A0D12' if dash else f'background:{color};color:#fff'
    return f'''<div style="display:flex;align-items:center;margin:0 0 14px"><div style="width:{w}px;margin:0 auto;{bd};border-radius:12px;padding:18px 24px;min-height:116px">
<div style="font:700 19px Host;letter-spacing:.08em;opacity:.9">STAGE {num} · {tag}</div><div class="h" style="font-size:34px;font-weight:700;margin-top:4px">{title}</div>
<div style="display:flex;align-items:baseline;gap:12px;margin-top:4px"><div class="h" style="font-size:{'34' if dash else '44'}px;font-weight:700;white-space:nowrap">{big}</div><div style="font-size:20px;opacity:.92">{sm}</div></div></div></div>'''
def track(items):
    return ''.join(f'<div style="margin:0 0 14px;min-height:120px;font-size:19px;line-height:1.3;border-left:4px solid #D6DCE8;padding:12px 0 0 14px"><div style="font:700 17px Host;color:#5B6676;letter-spacing:.06em">TRACK</div>{t}</div>' for t in items)
body=f'''<div class="top"><div class="kick">Project tracking workflow</div><h1>Intent → clearance → production</h1>
<div class="sub">One record per project, moving through three public checkpoints. Each stage has a reference number to track.</div></div>
<div style="padding:24px 64px 0;display:flex;gap:26px">
 <div style="width:600px">
  {stage(600,'#1E64EF','1','IEM Part A filed','5,629','filings 2021–25 · ₹28.4 lakh cr','DPIIT')}
  {stage(490,'#fff','2','Environmental clearance','2021–25','EC only · count pending','MOEFCC',dash=True)}
  {stage(430,'#EB8A00','3','IEM Part B','4,859','filings · ₹19.5 lakh cr','DPIIT')}
 </div>
 <div style="flex:1;padding-top:0">{track(['IEM acknowledgement no. + date, company, state, district, item, capacity','EC proposal no., category (A/B), status, EC date. Forest and CRZ clearances are not counted.','Memorandum no. + production start date. About 1 in 3 of 2016–19 filings can be traced to a Part B.'])}</div>
</div>
<div style="padding:8px 64px 0">
 <div class="h" style="font-size:26px;font-weight:700;margin-bottom:10px">How the tracker works</div>
 <div style="display:flex;gap:14px">
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:16px 18px;font-size:20px;line-height:1.35"><b>1 · Load</b><br>Every Part A filing becomes a row, with state, item and date.</div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:16px 18px;font-size:20px;line-height:1.35"><b>2 · Link</b><br>Add the EC reference. Part B is matched by memorandum no. or name.</div>
  <div style="flex:1;background:#F2F5FB;border-radius:12px;padding:16px 18px;font-size:20px;line-height:1.35"><b>3 · Flag</b><br>Stage and age update by formula. Stalled projects show up first.</div>
 </div>
</div>
<div class="src">Counts from DPIIT Annual Report 2025-26, Appendices III and V (2025 = up to December 2025). Part A and Part B are different projects filed in different years, so the counts are not a conversion rate. The EC stage is dashed because its count has not been compiled yet.</div>'''
page('VertiStrat_LinkedIn_2_Tracking_Funnel',body)
