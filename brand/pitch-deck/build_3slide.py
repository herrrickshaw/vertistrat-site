"""VertiStrat 3-slide overview, built with python-pptx. Run: python build_3slide.py (needs: pip install python-pptx)"""
from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.opc.constants import RELATIONSHIP_TYPE as RT
from pptx.util import Inches, Pt

OUT = "VertiStrat_Overview_3_Slides_2026-11-03.pptx"
FONT = "Arial"
INK, TEXT, WHITE, LIGHT = "0C0F14", "12161C", "FFFFFF", "F4F5F7"
BLUE, AMBER, SOFT, WARM, GREY, MUTED = "1E64EF", "EB8A00", "EAF4FF", "FDF0DC", "565B63", "C4C9D1"


def rgb(h):
    return RGBColor.from_string(h)


def set_theme(prs):
    """Write the brand colours and font into the deck's theme, so new content in PowerPoint picks them up."""
    part = prs.slide_master.part.part_related_by(RT.THEME)
    root = etree.fromstring(part.blob)
    a = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
    root.set("name", "VertiStrat")
    scheme = root.find(f".//{a}clrScheme")
    scheme.set("name", "VertiStrat")
    palette = dict(dk1=TEXT, lt1=WHITE, dk2=INK, lt2=LIGHT, accent1=BLUE, accent2=AMBER, accent3=SOFT, accent4=WARM,
                   accent5=GREY, accent6=MUTED, hlink=AMBER, folHlink=AMBER)
    for name, value in palette.items():
        el = scheme.find(f"{a}{name}")
        for child in list(el):
            el.remove(child)
        etree.SubElement(el, f"{a}srgbClr").set("val", value)
    for latin in root.findall(f".//{a}fontScheme/*/{a}latin"):
        latin.set("typeface", FONT)
    part._blob = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


def text(slide, s, x, y, w, h, size, color=TEXT, bold=False, anchor=MSO_ANCHOR.TOP, name=None, align=PP_ALIGN.LEFT):
    """Add a text box. s is a string, or a list of paragraphs; a paragraph is a string or a list of (text, options) runs."""
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    if name:
        box.name = name
    fill_frame(box.text_frame, s, size, color, bold, anchor, align)
    return box


def fill_frame(tf, s, size, color, bold, anchor=MSO_ANCHOR.TOP, align=PP_ALIGN.LEFT):
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    paragraphs = s if isinstance(s, list) else [s]
    for i, para in enumerate(paragraphs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        for run_text, opts in ([(para, {})] if isinstance(para, str) else para):
            r = p.add_run()
            r.text = run_text
            r.font.name = FONT
            r.font.size = Pt(size)
            r.font.bold = opts.get("bold", bold)
            r.font.color.rgb = rgb(opts.get("color", color))
            if opts.get("link"):
                r.hyperlink.address = opts["link"]
                r.font.color.rgb = rgb(opts.get("color", color))


def shape(slide, kind, x, y, w, h, fill, name, radius=None):
    sh = slide.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.name = name
    sh.fill.solid()
    sh.fill.fore_color.rgb = rgb(fill)
    sh.line.fill.background()
    sh._element.remove(sh._element.find(qn("p:style")))  # no theme shadow
    if radius is not None:
        sh.adjustments[0] = radius / min(w, h)
    return sh


def card(slide, x, y, w, h, fill, name):
    return shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h, fill, name, radius=0.1)


def logo(slide, x, y, h):
    u = h / 22  # the site's logo grid is 22 x 22
    for i, (bx, by, bh, color) in enumerate([(0, 13, 9, BLUE), (8, 7, 15, BLUE), (16, 0, 22, AMBER)], 1):
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x + bx * u, y + by * u, 5 * u, bh * u, color, f"Logo bar {i}", radius=u)


def new_slide(prs, title, bg, title_color, x=0.6, y=0.5, w=12.13, h=0.8, size=36):
    slide = prs.slides.add_slide(prs.slide_layouts[5])  # Title Only: keeps a real title for outline view and screen readers
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = rgb(bg)
    t = slide.shapes.title
    t.left, t.top, t.width, t.height = Inches(x), Inches(y), Inches(w), Inches(h)
    fill_frame(t.text_frame, title, size, title_color, True)
    return slide


def footer(slide):
    text(slide, "VertiStrat Solutions", 0.6, 6.95, 4, 0.3, 11, GREY, name="Footer")
    box = text(slide, "", 12.1, 6.95, 0.63, 0.3, 11, GREY, name="Slide number", align=PP_ALIGN.RIGHT)
    p = box.text_frame.paragraphs[0]._p
    for r in p.findall(qn("a:r")):
        p.remove(r)
    fld = etree.SubElement(p, qn("a:fld"), id="{B6F15528-21DE-4FAA-801E-634DDDAF4B2B}", type="slidenum")
    rpr = etree.SubElement(fld, qn("a:rPr"), lang="en-IN", sz="1100")
    fill = etree.SubElement(rpr, qn("a:solidFill"))
    etree.SubElement(fill, qn("a:srgbClr"), val=GREY)
    etree.SubElement(rpr, qn("a:latin"), typeface=FONT)
    etree.SubElement(fld, qn("a:t")).text = str(slide.part.package.presentation_part.presentation.slides.index(slide) + 1)


prs = Presentation()
factor = Inches(13.333) / prs.slide_width
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
for holder in [prs.slide_master, *prs.slide_layouts]:
    for sh in holder.placeholders:
        sh.left, sh.width = int(sh.left * factor), int(sh.width * factor)
set_theme(prs)
prs.core_properties.title = "VertiStrat Solutions: overview"
prs.core_properties.author = "VertiStrat Solutions"

# ---------- Slide 1: the problem and the promise ----------
s = new_slide(prs, ["From the policy desk", "to the plant floor"], INK, WHITE, y=1.7, w=6.9, h=1.75, size=44)
logo(s, 0.6, 0.55, 0.45)
text(s, "VertiStrat", 1.2, 0.55, 4, 0.45, 24, WHITE, True, MSO_ANCHOR.MIDDLE, "Wordmark")
text(s, "Projects stall between the layers. One team keeps the plan, the incentives and the IT on one set of numbers.",
     0.6, 3.6, 6.3, 1.3, 20, MUTED, name="Promise")
text(s, "VertiStrat Solutions LLP · Chennai, India", 0.6, 6.75, 6.3, 0.3, 12, MUTED, name="Firm line")
for i, (t, d, fill, color) in enumerate([("Policy", "Incentives and approvals", WARM, TEXT), ("Plant", "Site and capacity", SOFT, TEXT),
                                         ("Platform", "IT, data and cyber", WHITE, TEXT), ("People", "Hiring and skills", BLUE, WHITE)]):
    y = 0.9 + i * 1.47
    card(s, 7.7, y, 5.03, 1.27, fill, f"{t} tile")
    text(s, t, 8.0, y + 0.17, 4.5, 0.5, 24, color, True, name=f"{t} name")
    text(s, d, 8.0, y + 0.67, 4.5, 0.4, 16, color, name=f"{t} line")
s.notes_slide.notes_text_frame.text = ("We advise companies setting up or expanding in India. Every project crosses these four layers, and they usually "
                                       "have separate advisers. A change in one rarely reaches the others, and that is where projects stall.")

# ---------- Slide 2: what we do and how ----------
s = new_slide(prs, "Three practices, one team, four written steps", WHITE, TEXT)
for i, (t, d, fill) in enumerate([("Manufacturing", "Feasibility, sites, project reports, approvals, incentives and supply chain.", SOFT),
                                  ("IT services", "Delivery centres and GCCs, Industry 4.0 roadmaps, vendor selection and governance.", LIGHT),
                                  ("Biofuels & energy", "Ethanol, compressed biogas, SAF and biochemicals, from feedstock to offtake.", WARM)]):
    x = 0.6 + i * 4.14
    card(s, x, 1.45, 3.85, 2.05, fill, f"{t} card")
    text(s, t, x + 0.28, 1.65, 3.3, 0.45, 22, TEXT, True, name=f"{t} name")
    text(s, d, x + 0.28, 2.15, 3.3, 1.2, 16, TEXT, name=f"{t} line")
card(s, 0.6, 3.72, 12.13, 0.85, INK, "Facilitation band")
text(s, [[("Investment facilitation  ", {"bold": True, "color": WHITE}),
          ("Across all three: briefing, incentives, liaison and aftercare. Independent adviser, not a government agency.", {"color": MUTED})]],
     0.88, 3.72, 11.6, 0.85, 16, anchor=MSO_ANCHOR.MIDDLE, name="Facilitation text")
for i, (t, d) in enumerate([("1  Diagnose", "Decision brief and constraints."), ("2  Design", "Options, costs, risks. One recommendation."),
                            ("3  Deliver", "Run workstreams and applications."), ("4  Hand over", "Documents, owners, calendar. We step back.")]):
    x = 0.6 + i * 3.1
    last = i == 3
    shape(s, MSO_SHAPE.PENTAGON, x, 4.95, 2.83, 0.62, AMBER if last else BLUE, f"Step {i + 1} arrow")
    text(s, t, x + 0.18, 4.95, 2.3, 0.62, 16, TEXT if last else WHITE, True, MSO_ANCHOR.MIDDLE, f"Step {i + 1} name")
    text(s, d, x + 0.05, 5.7, 2.7, 0.95, 15, TEXT, name=f"Step {i + 1} line")
footer(s)
s.notes_slide.notes_text_frame.text = ("Three practices with investment facilitation running through them. Whatever the practice, the engagement follows "
                                       "the same four steps, and each step ends in a document the client keeps.")

# ---------- Slide 3: who leads the work and how to reach us ----------
s = new_slide(prs, "Who leads the work, and how to reach us", WHITE, TEXT)
text(s, "Umashankar Triplicane Dwarakanathan, Founder", 0.6, 1.4, 7.4, 0.4, 20, TEXT, True, name="Founder name")
text(s, "Chemical engineer (IIT Madras) and MBA (ESMT Berlin). 10+ years across energy, investment promotion and business transformation.",
     0.6, 1.85, 7.4, 0.75, 16, TEXT, name="Founder summary")
for i, (n, l) in enumerate([("~USD 7 bn", "LNG train expansion, Shell"), ("USD 6 bn+", "Oil and gas investment pipeline, Invest India"),
                            ("13 sectors", "State investment strategy, GITA for MPIDC"), ("550+ hires", "India tech hub for a European insurer")]):
    x, y = 0.6 + (i % 2) * 3.8, 2.75 + (i // 2) * 1.8
    card(s, x, y, 3.6, 1.6, SOFT if i == 0 else LIGHT, f"Stat {i + 1} card")
    text(s, n, x + 0.22, y + 0.15, 3.2, 0.65, 30, BLUE, True, name=f"Stat {i + 1} value")
    text(s, l, x + 0.22, y + 0.82, 3.2, 0.65, 14, TEXT, name=f"Stat {i + 1} label")
text(s, "Results from roles held before founding VertiStrat.", 0.6, 6.4, 7.4, 0.3, 12, GREY, name="Attribution")
card(s, 8.4, 1.4, 4.33, 5.3, INK, "Contact panel")
text(s, "Tell us what you’re deciding", 8.7, 1.7, 3.75, 1.15, 26, WHITE, True, name="Contact heading")
text(s, "A short note is enough.", 8.7, 2.9, 3.75, 0.4, 16, MUTED, name="Contact line")
contact = text(s, [[("contact@vertistratsolution.com", {"color": AMBER, "link": "mailto:contact@vertistratsolution.com"})],
         [("+91 70222 59460", {"color": AMBER, "link": "tel:+917022259460"})],
         [("vertistratsolution.com", {"color": AMBER, "link": "https://vertistratsolution.com"})]],
     8.7, 3.5, 3.85, 1.2, 15, name="Contact details")
for para in contact.text_frame.paragraphs[1:]:
    para.space_before = Pt(5)
text(s, "Plot No. 141, Gurusamy Road, Nolambur, Chennai 600095, India", 8.7, 4.85, 3.75, 0.75, 14, MUTED, name="Address")
text(s, "Independent adviser. Not affiliated with any government agency.", 8.7, 5.75, 3.75, 0.7, 12, MUTED, name="Disclaimer")
footer(s)
s.notes_slide.notes_text_frame.text = ("The person pitching is the person doing the work. Be explicit that these results come from earlier roles, because "
                                       "VertiStrat is a new firm. Close by asking what decision they need to make next.")

prs.save(OUT)
