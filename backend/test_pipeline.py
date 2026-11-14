"""
Automated Pipeline Verification Test.
Verifies all 3 layers, 4 scenarios, Trojan PDF generation, and egress interception.
"""
import asyncio
from backend.main import (
    html_sanitizer,
    pdf_sanitizer,
    obfuscation_scanner,
    data_marker,
    semantic_guard,
    egress_firewall,
    chat_completions
)
from backend.models import ChatCompletionRequest, ChatMessage, SentinelConfig
from backend.scenarios import SCENARIOS


async def test_all():
    print("=== 1. Testing Layer 1 HTML Sanitizer ===")
    sc1 = SCENARIOS["poisoned_webpage"]
    clean_html, removed, rules = html_sanitizer.sanitize(sc1["raw_content"])
    print(f"Removed fragments: {len(removed)}")
    for r in removed:
        print(f" - [{r.type}] {r.reason}")
    print(f"Triggered rules: {rules}")
    assert any("CSS" in r for r in rules), "CSS rule must be triggered"
    assert "UltraSpeed" in clean_html, "Benign content must remain"
    assert "sk_live_51Nx9921SecretKey" not in clean_html, "Payload must be stripped"

    print("\n=== 2. Testing Layer 1 PDF Sanitizer ===")
    trojan_bytes = pdf_sanitizer.generate_trojan_pdf()
    print(f"Generated Trojan PDF size: {len(trojan_bytes)} bytes")
    clean_pdf_text, pdf_removed, pdf_rules = pdf_sanitizer.sanitize(trojan_bytes)
    print(f"PDF removed fragments: {len(pdf_removed)}")
    for r in pdf_removed:
        print(f" - [{r.type}] {r.reason}")
    print(f"PDF rules: {pdf_rules}")
    assert "PDF_MICRO_FONT" in pdf_rules or "PDF_WHITE_ON_WHITE_INK" in pdf_rules, "Micro or white ink must trigger"
    assert "ALEX MERCER" in clean_pdf_text, "Visible qualifications must remain"
    assert "send_offer_email" not in clean_pdf_text, "Injected tool call must be stripped"

    print("\n=== 3. Testing Layer 1 Obfuscation & Steganography ===")
    sc3 = SCENARIOS["phishing_email"]
    clean_obf, obf_removed, obf_rules = obfuscation_scanner.scan(sc3["raw_content"])
    print(f"Obfuscation removed: {len(obf_removed)}, rules: {obf_rules}")
    assert "BASE64_SMUGGLING_NEUTRALIZED" in obf_rules, "Base64 payload must be neutralized"

    print("\n=== 4. Testing Layer 2 Semantic Guard ===")
    res_sc1 = semantic_guard.evaluate_threat(sc1["raw_content"])
    print(f"Scenario 1 Threat Score: {res_sc1['threat_score']}, Rules: {res_sc1['triggered_rules']}")
    assert res_sc1["threat_score"] >= 0.70, "Poisoned webpage must have high threat score"

    res_benign = semantic_guard.evaluate_threat(SCENARIOS["benign_doc"]["raw_content"])
    print(f"Scenario 4 Threat Score: {res_benign['threat_score']}")
    assert res_benign["threat_score"] <= 0.10, "Benign document must have very low threat score"

    print("\n=== 5. Testing Full Chat Completions API: Scenario 1 Protected vs Vulnerable ===")
    # 5a. PROTECTED (ON)
    req_on = ChatCompletionRequest(
        model="sentinel-agent-v1",
        messages=[
            ChatMessage(role="system", content=sc1["system_prompt"]),
            ChatMessage(role="user", content=sc1["raw_content"])
        ],
        sentinel_config=SentinelConfig(firewall_enabled=True, mode="heal")
    )
    resp_on = await chat_completions(req_on)
    print("PROTECTED VERDICT:", resp_on.sentinel_audit.verdict)
    print("PROTECTED OVERHEAD (ms):", resp_on.sentinel_audit.latency_ms)
    print("PROTECTED BLOCKED URLS:", resp_on.sentinel_audit.egress_actions.blocked_urls)
    assert resp_on.sentinel_audit.verdict in ("MITIGATED", "CLEAN")
    assert "sk_live_51Nx9921SecretKey" not in (resp_on.choices[0].message.content or "")

    # 5b. VULNERABLE (OFF)
    req_off = ChatCompletionRequest(
        model="sentinel-agent-v1",
        messages=[
            ChatMessage(role="system", content=sc1["system_prompt"]),
            ChatMessage(role="user", content=sc1["raw_content"])
        ],
        sentinel_config=SentinelConfig(firewall_enabled=False, mode="off")
    )
    resp_off = await chat_completions(req_off)
    print("VULNERABLE VERDICT:", resp_off.sentinel_audit.verdict)
    print("VULNERABLE CONTENT HAS IMAGE:", "![" in (resp_off.choices[0].message.content or ""))
    assert resp_off.sentinel_audit.verdict == "EXPLOITED"
    assert "![" in (resp_off.choices[0].message.content or "")

    print("\n=== 6. Testing Full Chat Completions API: Scenario 2 Trojan PDF Tool Hijack ===")
    # 6a. PROTECTED (ON)
    req_pdf_on = ChatCompletionRequest(
        model="sentinel-agent-v1",
        messages=[
            ChatMessage(role="system", content=SCENARIOS["trojan_pdf"]["system_prompt"]),
            ChatMessage(role="user", content=clean_pdf_text)
        ],
        sentinel_config=SentinelConfig(firewall_enabled=True, mode="heal")
    )
    resp_pdf_on = await chat_completions(req_pdf_on)
    print("TROJAN PDF PROTECTED VERDICT:", resp_pdf_on.sentinel_audit.verdict)
    print("TROJAN PDF TOOL CALLS:", resp_pdf_on.choices[0].message.tool_calls)
    assert resp_pdf_on.choices[0].message.tool_calls is None

    # 6b. VULNERABLE (OFF)
    req_pdf_off = ChatCompletionRequest(
        model="sentinel-agent-v1",
        messages=[
            ChatMessage(role="system", content=SCENARIOS["trojan_pdf"]["system_prompt"]),
            ChatMessage(role="user", content=SCENARIOS["trojan_pdf"]["raw_content"])
        ],
        sentinel_config=SentinelConfig(firewall_enabled=False, mode="off")
    )
    resp_pdf_off = await chat_completions(req_pdf_off)
    print("TROJAN PDF VULNERABLE VERDICT:", resp_pdf_off.sentinel_audit.verdict)
    print("TROJAN PDF HIJACKED TOOL:", resp_pdf_off.choices[0].message.tool_calls)
    assert resp_pdf_off.choices[0].message.tool_calls is not None
    assert resp_pdf_off.sentinel_audit.verdict == "EXPLOITED"

    print("\nALL BACKEND TESTS PASSED FLACID-FREE!")


if __name__ == "__main__":
    asyncio.run(test_all())
