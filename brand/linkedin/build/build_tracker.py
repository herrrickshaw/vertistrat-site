import csv,os,datetime
from openpyxl import Workbook
from openpyxl.styles import Font,PatternFill,Alignment
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
csv.field_size_limit(10**9)
O=os.path.expanduser('~/Downloads/vertistrat_linkedin')
import re
clean=lambda v:re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]','',v)
rows=[{k:clean(v or '') for k,v in r.items()} for r in csv.DictReader(open(os.path.expanduser('~/masaladeutsch-archive/data/iem/iem_records.csv'))) if r['part']=='A' and '2021'<=r['period_from'][:4]<='2024']
wb=Workbook();ws=wb.active;ws.title='Tracker'
H=['IEM no.','IEM date','Company','State','District','Item','Capacity','Unit','Part A year','EC proposal no. (PARIVESH)','EC category','EC status','EC date','Part B linked (by data)','Part B production date','Part B confirmed? (Y/N)','Stage','Age (yrs since Part A)','Owner','Next action','Notes']
ws.append(H)
for i,r in enumerate(rows,2):
    yb=r['in_part_b'];pb=r['b_production_date']
    ws.append([r['iem_no'],r['iem_date'],r['company'],r['state'].title(),r['district'].title(),r['item'],r['capacity'],r['unit'],r['period_from'][:4],'','','','', {'memo':'Yes (memo no.)','name':'Possible (name only)'}.get(yb,'No'),pb,'',
      f'=IF(OR(P{i}="Y",AND(P{i}="",N{i}="Yes (memo no.)")),"4 Production started",IF(L{i}="Granted","3 EC granted",IF(J{i}<>"","2 EC in process","1 IEM A filed")))',
      f'=IF(Q{i}="4 Production started","",ROUND((TODAY()-DATEVALUE(IF(MID(B{i},3,1)="/",RIGHT(B{i},4)&"-"&MID(B{i},4,2)&"-"&LEFT(B{i},2),B{i})))/365.25,1))','','',''])
n=len(rows)+1
fill=PatternFill('solid',fgColor='1E64EF')
for c in ws[1]: c.font=Font(bold=True,color='FFFFFF');c.fill=fill;c.alignment=Alignment(wrap_text=True,vertical='center')
for col,w in zip('ABCDEFGHIJKLMNOPQRSTU',[9,11,34,16,16,34,10,7,9,18,10,14,11,18,14,12,20,11,12,26,26]): ws.column_dimensions[col].width=w
ws.freeze_panes='D2';ws.auto_filter.ref=f'A1:U{n}'
for col,lst in (('K','A,B,B2,Not required'),('L','Not applied,Applied,Under appraisal,Granted,Rejected'),('P','Y,N')):
    dv=DataValidation(type='list',formula1=f'"{lst}"',allow_blank=True);ws.add_data_validation(dv);dv.add(f'{col}2:{col}{n}')
ws.conditional_formatting.add(f'R2:R{n}',FormulaRule(formula=[f'AND(ISNUMBER(R2),R2>=3,LEFT(Q2,1)="1")'],fill=PatternFill('solid',bgColor='FDE2B8')))
S=wb.create_sheet('Funnel')
S.append(['Stage','Rows','% of Part A filings'])
for k,lab in enumerate(['1 IEM A filed','2 EC in process','3 EC granted','4 Production started'],2):
    S.append([lab,f'=COUNTIF(Tracker!Q2:Q{n},A{k})',f'=B{k}/ROWS(Tracker!A2:A{n})'])
S.append(['Total',f'=SUM(B2:B5)',''])
S.append([]);S.append(['Stalled: still stage 1 after 3 or more years',f'=COUNTIFS(Tracker!Q2:Q{n},"1 IEM A filed",Tracker!R2:R{n},">=3")'])
for c in S[1]: c.font=Font(bold=True,color='FFFFFF');c.fill=fill
for r in range(2,6): S[f'C{r}'].number_format='0.0%'
S.column_dimensions['A'].width=46;S.column_dimensions['B'].width=10;S.column_dimensions['C'].width=20
R=wb.create_sheet('Read me')
for t in ['VertiStrat project tracker: IEM Part A → Environmental clearance → IEM Part B',
 f'Built {datetime.date.today():%d %b %Y}. {n-1:,} Part A filings from 2021 to 2024 (DPIIT lists, parsed by VertiStrat).',
 'Columns A–I come from the DPIIT Part A lists. Column N shows whether a later Part B record matches: "Yes (memo no.)" cites the same memorandum; "Possible (name only)" is a same-company match and needs checking.',
 'Columns J–M (EC only, not forest or CRZ clearance) are empty on purpose: no environmental clearance data has been linked yet. Fill them from PARIVESH / environmentclearance.nic.in by company name and district. Not every project needs an EC. Older proposals (before July 2014) sit in a separate archive on that portal.',
 'Stage 4 is set automatically when the Part B record cites the same memorandum number. For name-only matches, check and set column P to Y (or N to override). The Stage column updates itself.',
 'Age counts years since the Part A date. Part B lists stop in 2024, so recent filings may be marked "No" only because the lists are not published yet.',
 'Stalled projects (stage 1 for 3+ years) are shaded in the Age column and counted on the Funnel sheet.']: R.append([t])
R.column_dimensions['A'].width=140
wb.save(os.path.join(O,'VertiStrat_IEM_EC_PartB_Tracker.xlsx'));print(n-1)
