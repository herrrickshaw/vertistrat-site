import os
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'build_stats.py')).read()
exec(src.split('\nA=[')[0])
svc=lambda n,t,d:f'<div style="background:#F2F5FB;border-radius:14px;padding:16px 18px"><div style="font:700 15px Host;color:#B86A00">{n}</div><div class="h" style="font-size:25px;font-weight:700;line-height:1.1;margin:3px 0 6px">{t}</div><div style="font-size:17.5px;line-height:1.35;color:#26303f">{d}</div></div>'
who=lambda t,d:f'<div style="flex:1;border-top:5px solid #1E64EF;padding-top:8px"><div class="h" style="font-size:20px;font-weight:700;line-height:1.1">{t}</div><div style="font-size:16px;line-height:1.3;color:#3b4554;margin-top:3px">{d}</div></div>'
body=f'''<div class="top" style="padding:34px 64px 24px"><div class="kick">VertiStrat Solutions · Chennai</div><h1 style="font-size:46px">From project idea to a plant that gets built</h1>
<div class="sub" style="font-size:21px;margin-top:8px">Independent advice for energy, fuels and industrial projects in India.</div></div>
<div style="padding:18px 64px 0">
 <div class="h" style="font-size:24px;font-weight:700;margin-bottom:10px">What we do</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
  {svc('1','Sites and feedstock','Compare states and sites. Check supply, competing uses, logistics and land.')}
  {svc('2','Partners','Screen technology providers, buyers and co-investors. Structure the local partnership.')}
  {svc('3','Approvals and state engagement','Map the clearances, state policies and incentives that apply, in the right order.')}
  {svc('4','Project report and lender readiness','Detailed project report, cost and finance model, and the case a lender will ask for.')}
 </div>
 <div class="h" style="font-size:24px;font-weight:700;margin:18px 0 8px">Who we work with</div>
 <div style="display:flex;gap:14px">{who('Foreign developers','entering India and needing a local view')}{who('Indian promoters','building a first or next plant')}{who('Technology providers','looking for sites and partners')}{who('Investors and lenders','testing a project before they commit')}</div>
<div class="h" style="font-size:24px;font-weight:700;margin:18px 0 8px">Sectors we work in</div>
 <div style="display:flex;flex-wrap:wrap;gap:10px">{''.join(f'<div style="background:#fff;border:2px solid #1E64EF;color:#1E64EF;border-radius:999px;padding:7px 16px;font:700 17px Host">{t}</div>' for t in ['Sustainable aviation fuel','Biochar and carbon removal','Compressed biogas','Ethanol and biofuels','Gas and LNG terminals','Plantation feedstock','Process industry'])}</div>
 <div class="h" style="font-size:24px;font-weight:700;margin:18px 0 8px">How it works</div>
 <div style="display:flex;gap:12px">{''.join(f'<div style="flex:1;background:#F2F5FB;border-radius:12px;padding:12px 16px"><div style="font:700 15px Host;color:#B86A00">{n}</div><div class="h" style="font-size:20px;font-weight:700;margin:2px 0 3px">{t}</div><div style="font-size:16px;line-height:1.3;color:#3b4554">{d}</div></div>' for n,t,d in [('Step 1','20-minute call','You describe the project and the blocker.'),('Step 2','Scoping note','We confirm the question, inputs and what you get.'),('Step 3','Scoped study','Delivered as a report and model you can use.')])}</div>
 <div style="margin-top:18px;background:#0A0D12;color:#fff;border-radius:14px;padding:16px 22px"><div class="h" style="font-size:22px;font-weight:700">Why us</div><div style="font-size:18px;line-height:1.38;color:#D6DCE6;margin-top:5px">Founder Umashankar Triplicane Dwarakanathan is a chemical engineer from IIT Madras. He did front-end design and cost engineering at Shell, then managed a USD 6 billion+ oil and gas investment pipeline at Invest India. VertiStrat is independent of any government agency.</div></div>
 <div style="margin-top:14px;background:#F2F5FB;border-radius:14px;padding:14px 22px;font-size:20px;line-height:1.4"><b>Start with a 20-minute call.</b> Tell us the project and the question that is holding it up.<br><span style="color:#1E64EF;font-weight:700">contact@vertistratsolution.com</span> &nbsp;·&nbsp; +91 70222 59460</div>
</div>'''
page('VertiStrat_LinkedIn_Service_Pitch',body)
