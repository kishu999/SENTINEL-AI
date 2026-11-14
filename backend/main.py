"""
Sentinel AI - Indirect Prompt-Injection & Data-Exfiltration Firewall.
Drop-in OpenAI-compatible proxy, multi-modal ingestion sanitizer,
session taint tracker, and interactive security sandbox.
"""
import time
import uuid
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from .models import (
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatChoice,
    ChatMessage,
    Usage,
    SentinelAudit,
    SanitizationDiff,
    RemovedFragment,
    EgressActions,
    QuarantinedToolCall,
    AttackerSinkEvent,
    ToolApprovalRequest,
)
from .sanitizers import HTMLSanitizer, PDFSanitizer, ObfuscationScanner, DataMarker
from .semantic_guard import SemanticGuard
from .egress_firewall import EgressFirewall, SentinelTaintContext
from .agent_simulator import AgentSimulator
from .scenarios import get_all_scenarios, get_scenario_by_id

app = FastAPI(
    title="Sentinel AI Firewall",
    description="Drop-in OpenAI-compatible AI Firewall & Multi-Modal Ingestion Sanitizer",
    version="1.0.0"
)

# Enable CORS for local dev and frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Security Engines
html_sanitizer = HTMLSanitizer()
pdf_sanitizer = PDFSanitizer()
obfuscation_scanner = ObfuscationScanner()
data_marker = DataMarker()
semantic_guard = SemanticGuard()
egress_firewall = EgressFirewall()
agent_simulator = AgentSimulator()

# In-memory storage for Attacker Sink and Taint Contexts
attacker_sink_logs: List[AttackerSinkEvent] = []
active_taint_contexts: Dict[str, SentinelTaintContext] = {}
quarantined_tools_store: Dict[str, QuarantinedToolCall] = {}


@app.get("/health")
@app.get("/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Sentinel AI Firewall",
        "version": "1.0.0",
        "active_defenses": ["Layer 1 Pre-Ingestion", "Layer 2 Semantic Guard", "Layer 3 Egress Firewall"],
        "sink_events_count": len(attacker_sink_logs)
    }


# ==========================================
# 1. DROP-IN OPENAI CHAT COMPLETION PROXY
# ==========================================
@app.post("/v1/chat/completions", response_model=ChatCompletionResponse)
async def chat_completions(request: ChatCompletionRequest):
    req_id = f"sentinel_req_{uuid.uuid4().hex[:8]}"
    start_total = time.perf_counter()

    config = request.sentinel_config or request.sentinel_config.__class__()
    firewall_enabled = config.firewall_enabled and config.mode != "off"
    mode = config.mode

    # Initialize / retrieve taint context
    taint_ctx = SentinelTaintContext(session_id=req_id)
    active_taint_contexts[req_id] = taint_ctx

    layer1_time = 0.0
    layer2_time = 0.0
    layer3_time = 0.0

    all_triggered_rules: List[str] = []
    removed_fragments: List[RemovedFragment] = []
    raw_document_text = ""
    sanitized_datamarked_text = ""

    # Inspect messages to identify untrusted document injections
    processed_messages: List[ChatMessage] = []
    has_untrusted_input = False
    raw_untrusted_text = ""

    for msg in request.messages:
        content = msg.content or ""
        msg_triggered = []

        if msg.role in ("user", "tool"):
            raw_untrusted_text += content + "\n"
            raw_document_text += content + "\n"

            if firewall_enabled:
                # ----------------------------------------------------
                # LAYER 1: MULTI-MODAL PRE-LLM INGESTION SANITIZER
                # ----------------------------------------------------
                l1_start = time.perf_counter()

                # 1. HTML Sanitization
                if "<" in content and ">" in content:
                    has_untrusted_input = True
                    cleaned_html, html_removed, html_rules = html_sanitizer.sanitize(content)
                    removed_fragments.extend(html_removed)
                    all_triggered_rules.extend(html_rules)
                    content = cleaned_html

                # 2. Obfuscation & Steganography Scanning (Zero-Width + Base64)
                cleaned_obf, obf_removed, obf_rules = obfuscation_scanner.scan(content)
                if obf_removed:
                    has_untrusted_input = True
                    removed_fragments.extend(obf_removed)
                    all_triggered_rules.extend(obf_rules)
                content = cleaned_obf

                # 3. Cryptographic Datamarking & Spotlighting
                if has_untrusted_input:
                    datamarked, nonce = data_marker.spotlight(content, source_type="user_document")
                    sanitized_datamarked_text += datamarked + "\n"
                    content = datamarked
                    taint_ctx.mark_tainted(
                        source_type="untrusted_input",
                        source_id=f"nonce_{nonce}",
                        detected_risks=[r.reason for r in removed_fragments]
                    )
                else:
                    sanitized_datamarked_text += content + "\n"

                layer1_time += (time.perf_counter() - l1_start) * 1000
            else:
                # Bypass / raw input when Sentinel AI is OFF
                sanitized_datamarked_text += content + "\n"
        else:
            # Trusted system prompt or assistant messages
            raw_document_text += content + "\n"

        processed_messages.append(ChatMessage(
            role=msg.role,
            content=content,
            name=msg.name,
            tool_calls=msg.tool_calls,
            tool_call_id=msg.tool_call_id
        ))

    # ----------------------------------------------------
    # LAYER 2: SEMANTIC PROMPT-INJECTION GUARDRAIL
    # ----------------------------------------------------
    # Evaluate ONLY untrusted external inputs for injection directives (not trusted system prompts or spotlighting wrappers)
    l2_start = time.perf_counter()
    eval_text = raw_untrusted_text.strip()
    eval_result = semantic_guard.evaluate_threat(eval_text)
    threat_score = eval_result["threat_score"]

    if firewall_enabled:
        for r in eval_result["triggered_rules"]:
            if r not in all_triggered_rules:
                all_triggered_rules.append(r)

        # STRICT BLOCK POLICY: Block request entirely if score exceeds threshold
        if mode == "block" and threat_score >= config.threat_threshold:
            layer2_time = (time.perf_counter() - l2_start) * 1000
            total_time = (time.perf_counter() - start_total) * 1000
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "403 Sentinel AI Security Policy Violation",
                    "reason": f"Semantic threat score ({threat_score:.2f}) exceeded policy threshold ({config.threat_threshold:.2f})",
                    "triggered_rules": all_triggered_rules,
                    "threat_score": threat_score,
                    "request_id": req_id
                }
            )

        # SANITIZE AND HEAL: Surgically neutralize remaining malicious semantic spans ONLY when threat is detected
        if mode == "heal" and threat_score >= 0.50:
            for idx, p_msg in enumerate(processed_messages):
                if p_msg.role == "user" and p_msg.content:
                    healed, removed_spans = semantic_guard.heal_semantic_text(p_msg.content)
                    if removed_spans:
                        processed_messages[idx].content = healed
                        for span in removed_spans:
                            removed_fragments.append(RemovedFragment(
                                type="SEMANTIC_SPAN_HEALED",
                                content=span["content"],
                                reason=span["reason"],
                                location="Prompt text"
                            ))
                        all_triggered_rules.append("SEMANTIC_HEAL_APPLIED")

    layer2_time = (time.perf_counter() - l2_start) * 1000

    # ----------------------------------------------------
    # LLM COMPLETION GENERATION
    # ----------------------------------------------------
    assistant_msg, usage = await agent_simulator.generate_response(
        messages=processed_messages,
        tools=request.tools,
        firewall_enabled=firewall_enabled
    )

    # ----------------------------------------------------
    # LAYER 3: EGRESS FIREWALL & TAINT-AWARE TOOL GATEKEEPER
    # ----------------------------------------------------
    l3_start = time.perf_counter()

    final_content, blocked_urls, redacted_secrets, egress_rules = egress_firewall.inspect_egress_text(
        text=assistant_msg.content or "",
        taint_context=taint_ctx,
        firewall_enabled=firewall_enabled
    )
    all_triggered_rules.extend(egress_rules)

    final_tool_calls, quarantined_tools, tool_rules = egress_firewall.inspect_tool_calls(
        tool_calls=assistant_msg.tool_calls,
        taint_context=taint_ctx,
        firewall_enabled=firewall_enabled,
        allow_privileged_override=config.allow_privileged_tools
    )
    all_triggered_rules.extend(tool_rules)

    for q in quarantined_tools:
        quarantined_tools_store[q.id] = q

    # If Sentinel AI is OFF and a leak or hijacked tool occurred, record it in the Attacker Sink
    if not firewall_enabled:
        # Check if markdown image leak occurred
        if "![" in (assistant_msg.content or "") and "attacker-sink" in (assistant_msg.content or ""):
            import re
            m = re.search(r"attacker-sink\?leak=([^\)\s]+)", assistant_msg.content or "")
            leak_val = m.group(1) if m else "UNKNOWN_LEAK"
            sink_event = AttackerSinkEvent(
                id=f"breach_{uuid.uuid4().hex[:8]}",
                timestamp=time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
                method="GET (Image Fetch)",
                path="/v1/attacker-sink",
                query_params={"leak": leak_val},
                body=None,
                headers={"User-Agent": "Browser-Assistant/1.0", "Sec-Fetch-Dest": "image"},
                extracted_leak=leak_val,
                source_scenario="poisoned_webpage"
            )
            attacker_sink_logs.insert(0, sink_event)

        # Check if unauthorized tool call occurred
        if assistant_msg.tool_calls:
            for tc in assistant_msg.tool_calls:
                func = tc.get("function", {}) if "function" in tc else tc
                tool_name = func.get("name") or tc.get("tool_name", "")
                args = func.get("arguments", {})
                sink_event = AttackerSinkEvent(
                    id=f"breach_{uuid.uuid4().hex[:8]}",
                    timestamp=time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
                    method=f"TOOL_CALL ({tool_name})",
                    path="/v1/attacker-sink",
                    query_params={},
                    body=str(args),
                    headers={"Origin": "Agent-Runtime"},
                    extracted_leak=f"Hijacked Tool: {tool_name} with {str(args)}",
                    source_scenario="tool_hijack"
                )
                attacker_sink_logs.insert(0, sink_event)

    layer3_time = (time.perf_counter() - l3_start) * 1000
    total_overhead = layer1_time + layer2_time + layer3_time

    # Determine Verdict
    verdict = "CLEAN"
    if not firewall_enabled:
        if threat_score >= 0.3 or "![" in (assistant_msg.content or "") or assistant_msg.tool_calls:
            verdict = "EXPLOITED"
    else:
        if len(removed_fragments) > 0 or len(blocked_urls) > 0 or len(quarantined_tools) > 0:
            verdict = "MITIGATED"

    audit = SentinelAudit(
        request_id=req_id,
        firewall_enabled=firewall_enabled,
        mode="SANITIZE_AND_HEAL" if firewall_enabled else "BYPASS_VULNERABLE",
        taint_state={
            "is_tainted": taint_ctx.is_tainted,
            "taint_sources": [s["source_type"] for s in taint_ctx.taint_sources]
        },
        threat_score=threat_score,
        verdict=verdict,
        latency_ms={
            "layer1_sanitizer_ms": round(layer1_time, 2),
            "layer2_semantic_ms": round(layer2_time, 2),
            "layer3_egress_ms": round(layer3_time, 2),
            "total_overhead_ms": round(total_overhead, 2)
        },
        triggered_rules=sorted(list(set(all_triggered_rules))),
        sanitization_diff=SanitizationDiff(
            raw_input=raw_document_text.strip(),
            sanitized_datamarked_input=sanitized_datamarked_text.strip(),
            removed_fragments=removed_fragments
        ),
        egress_actions=EgressActions(
            blocked_urls=blocked_urls,
            quarantined_tool_calls=quarantined_tools,
            secrets_redacted=redacted_secrets
        )
    )

    final_msg = ChatMessage(
        role="assistant",
        content=final_content,
        tool_calls=final_tool_calls
    )

    return ChatCompletionResponse(
        id=req_id,
        model=request.model,
        choices=[ChatChoice(index=0, message=final_msg, finish_reason="stop")],
        usage=usage,
        sentinel_audit=audit
    )


# ==========================================
# 2. STANDALONE SANITIZATION ENDPOINTS
# ==========================================
@app.post("/v1/sanitize/html")
async def sanitize_html_endpoint(request: Request):
    data = await request.json()
    html_content = data.get("html", "")
    start = time.perf_counter()

    clean_text, removed_fragments, triggered_rules = html_sanitizer.sanitize(html_content)
    clean_obf, obf_removed, obf_rules = obfuscation_scanner.scan(clean_text)
    removed_fragments.extend(obf_removed)
    triggered_rules.extend(obf_rules)

    datamarked, nonce = data_marker.spotlight(clean_obf, source_type="html_sanitizer")
    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

    return {
        "status": "success",
        "clean_text": clean_obf,
        "datamarked_text": datamarked,
        "nonce": nonce,
        "removed_fragments": [r.model_dump() for r in removed_fragments],
        "triggered_rules": sorted(list(set(triggered_rules))),
        "latency_ms": elapsed_ms
    }


@app.post("/v1/sanitize/pdf")
async def sanitize_pdf_endpoint(file: Optional[UploadFile] = File(None)):
    start = time.perf_counter()

    if file:
        pdf_bytes = await file.read()
    else:
        # Default to the built-in Trojan PDF generator for instant testing
        pdf_bytes = pdf_sanitizer.generate_trojan_pdf()

    clean_text, removed_fragments, triggered_rules = pdf_sanitizer.sanitize(pdf_bytes)
    datamarked, nonce = data_marker.spotlight(clean_text, source_type="pdf_sanitizer")
    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

    return {
        "status": "success",
        "clean_text": clean_text,
        "datamarked_text": datamarked,
        "nonce": nonce,
        "removed_fragments": [r.model_dump() for r in removed_fragments],
        "triggered_rules": triggered_rules,
        "latency_ms": elapsed_ms
    }


# ==========================================
# 3. PRE-LOADED SCENARIOS
# ==========================================
@app.get("/v1/scenarios")
async def list_scenarios():
    return get_all_scenarios()


@app.get("/v1/scenarios/{scenario_id}")
async def get_scenario(scenario_id: str):
    return get_scenario_by_id(scenario_id)


# ==========================================
# 4. LIVE ATTACKER WEBHOOK SINK
# ==========================================
@app.get("/v1/attacker-sink")
@app.post("/v1/attacker-sink")
async def attacker_sink(
    request: Request,
    leak: Optional[str] = Query(None),
    secret: Optional[str] = Query(None),
    token: Optional[str] = Query(None),
    key: Optional[str] = Query(None)
):
    leak_val = leak or secret or token or key
    body_text = None
    try:
        body_bytes = await request.body()
        if body_bytes:
            body_text = body_bytes.decode("utf-8", errors="ignore")
    except Exception:
        pass

    event = AttackerSinkEvent(
        id=f"hit_{uuid.uuid4().hex[:8]}",
        timestamp=time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        method=request.method,
        path="/v1/attacker-sink",
        query_params=dict(request.query_params),
        body=body_text,
        headers=dict(request.headers),
        extracted_leak=leak_val or (body_text[:100] if body_text else "Beacon Hit")
    )
    attacker_sink_logs.insert(0, event)

    # Return a 1x1 transparent GIF for image verification requests
    transparent_gif = (
        b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00"
        b"\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00"
        b"\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b"
    )
    return Response(content=transparent_gif, media_type="image/gif")


@app.get("/v1/attacker-sink/events")
async def get_attacker_sink_events():
    return {
        "count": len(attacker_sink_logs),
        "events": attacker_sink_logs
    }


@app.delete("/v1/attacker-sink")
@app.post("/v1/attacker-sink/clear")
@app.get("/v1/attacker-sink/clear")
async def clear_attacker_sink():
    attacker_sink_logs.clear()
    return {"status": "cleared", "count": 0}


# ==========================================
# 5. HUMAN-IN-THE-LOOP (HITL) TOOL APPROVAL
# ==========================================
@app.post("/v1/tools/approve")
async def approve_tool(approval: ToolApprovalRequest):
    tool_id = approval.tool_call_id
    if tool_id in quarantined_tools_store:
        item = quarantined_tools_store[tool_id]
        item.status = "APPROVED" if approval.decision == "approve" else "REJECTED"
        return {"status": "success", "tool_call": item}
    raise HTTPException(status_code=404, detail="Quarantined tool call not found")


# ==========================================
# 6. DOWNLOADABLE PDF ASSETS
# ==========================================
@app.get("/v1/download/trojan-pdf")
async def download_trojan_pdf():
    pdf_bytes = pdf_sanitizer.generate_trojan_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Alex_Mercer_Trojan_Resume.pdf"}
    )


@app.get("/v1/download/benign-pdf")
async def download_benign_pdf():
    pdf_bytes = pdf_sanitizer.generate_benign_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Enterprise_Architecture_Spec.pdf"}
    )


# ==========================================
# 7. FRONTEND STATIC ASSET SERVING
# ==========================================
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
assets_path = os.path.join(dist_path, "assets")
if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/")
async def serve_frontend():
    index_file = os.path.join(dist_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Sentinel AI Backend Active. Frontend build not found at frontend/dist."}

