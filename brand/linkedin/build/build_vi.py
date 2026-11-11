import os
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'build_stats.py')).read()
exec(src.split('\nA=[')[0])
def row(n,t,does,speeds,col):
    return f'''<div style="display:flex;gap:14px;margin-top:16px;align-items:stretch">
<div style="width:54px;min-height:128px;background:{col};color:#fff;border-radius:10px;font:700 28px Host;display:flex;align-items:center;justify-content:center">{n}</div>
<div style="flex:1;background:#F2F5FB;border-radius:10px;padding:14px 18px"><div class="h" style="font-size:25px;font-weight:700">{t}</div><div style="font-size:19px;line-height:1.32;color:#26303f;margin-top:5px"><b>The system:</b> {does}</div><div style="font-size:19px;line-height:1.32;color:#B86A00;margin-top:4px"><b>Speeds up:</b> {speeds}</div></div></div>'''
tile=lambda big,small,dark=False:f'<div style="flex:1;background:{"#0A0D12" if dark else "#F2F5FB"};color:{"#fff" if dark else "#0A0D12"};border-radius:12px;padding:10px 16px"><div class="h" style="font-size:30px;font-weight:700;line-height:1">{big}</div><div style="font-size:15px;color:{"#B9C2D0" if dark else "#3b4554"};margin-top:3px;line-height:1.25">{small}</div></div>'
body=f'''<div class="top" style="padding:30px 64px 20px"><div class="kick">How VertiStrat works</div><h1 style="font-size:44px">One system, from public filing to project advice</h1>
<div class="sub" style="font-size:20px;margin-top:6px">Vertical integration of our own chain: the same record carries a project from first signal to advisory work.</div></div>
<div style="padding:14px 64px 0">
 <div style="display:flex;gap:12px">{tile('~1,200','plans filed a year with DPIIT (Part A, 2020–25)',True)}{tile('3,374','industrial ECs granted since 2022, with state and activity')}{tile('76%','of Part A filings (2001–24) with no Part B found yet')}</div>
 {row('1','Detect','reads DPIIT IEM filings, PARIVESH clearances and tenders, then logs each project once.','finding who is building what, and where.','#1E64EF')}
 {row('2','Qualify','links Part A to clearance to Part B, sizes the ticket in ₹ crore, flags stalled projects.','choosing which projects to approach first.','#1E64EF')}
 {row('3','Reach','keeps contact, past conversations and drafted outreach against the same project record.','first contact, with the project facts already in hand.','#1E64EF')}
 {row('4','Advise','sites and feedstock, partners, approvals, project report and lender-ready finance case.','turning a conversation into scoped work.','#EB8A00')}
 {row('5','Track and publish','updates the tracker and turns the findings into graphics and posts.','the next lead, from what we have already learned.','#EB8A00')}
 <div style="margin-top:18px;background:#F2F5FB;border-radius:12px;padding:14px 22px;font-size:20px;line-height:1.4"><b>Why integrate</b> · One record, no re-keying between steps, and each job feeds the next. <b>Limits:</b> matching filings is imperfect, and every message is reviewed by a person before it is sent.</div>
</div>
<div class="src" style="bottom:100px;font-size:13px">Sources: DPIIT Annual Reports (Part A filings, ₹ crore); PARIVESH 2.0 EC register, counted by VertiStrat (proposals filed 2022 to Oct 2026); DPIIT IEM company lists 2001–24, Part A to Part B linkage by memo number or company name (a lower bound; no Part B found is not the same as abandoned).</div>'''
page('VertiStrat_LinkedIn_Vertical_Integration',body)
