"""
LAYER 3: Session Taint Tracking & Post-LLM Egress Firewall.
Monitors session taint provenance, intercepts Markdown image exfiltration pixels,
quarantines privileged tool calls under tainted context (HITL Gatekeeper),
and redacts canary tokens and sensitive API keys.
"""
import re
import time
import uuid
from typing import Dict, Any, List, Set, Tuple, Optional
from .models import QuarantinedToolCall, EgressActions


class SentinelTaintContext:
    def __init__(self, session_id: Optional[str] = None):
        self.session_id: str = session_id or f"sess_{uuid.uuid4().hex[:8]}"
        self.is_tainted: bool = False
        self.taint_sources: List[Dict[str, Any]] = []
        self.canary_token: str = "CANARY-SENTINEL-9941"
        self.secrets_inventory: Set[str] = {
            "sk_live_51Nx9921SecretKey",
            "sk-live-998877",
            "8849-AC91-XQ"  # M&A Password Reset Token
        }
        self.quarantined_calls: Dict[str, QuarantinedToolCall] = {}

    def mark_tainted(self, source_type: str, source_id: str, detected_risks: List[str]):
        """Marks this session tainted and records the provenance of untrusted ingestion."""
        self.is_tainted = True
        self.taint_sources.append({
            "source_type": source_type,
            "source_id": source_id,
            "detected_risks": detected_risks,
            "timestamp": time.time()
        })

    def add_secret(self, secret: str):
        if secret and len(secret) >= 6:
            self.secrets_inventory.add(secret)


class EgressFirewall:
    # Safe tools with read-only side effects
    SAFE_TOOLS = {
        "calculator", "get_weather", "read_calendar",
        "search_docs", "lookup_faq", "view_candidate_profile"
    }

    # Privileged tools that can exfiltrate data or cause permanent side effects
    PRIVILEGED_TOOLS = {
        "send_email", "forward_email", "forward_inbox",
        "http_request", "transfer_funds", "delete_record",
        "send_offer_email", "webhook_post", "execute_sql", "export_secrets"
    }

    # Sensitive patterns to redact
    SECRET_PATTERNS = [
        re.compile(r"sk_live_[a-zA-Z0-9]{20,}", re.IGNORECASE),
        re.compile(r"sk-[a-zA-Z0-9_-]{20,}", re.IGNORECASE),
        re.compile(r"AKIA[0-9A-Z]{16}", re.IGNORECASE),
        re.compile(r"Bearer\s+[a-zA-Z0-9_\-\.]{20,}", re.IGNORECASE),
        re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),  # SSN
    ]

    MARKDOWN_IMAGE_PATTERN = re.compile(r"!\[(.*?)\]\((https?://[^\s\)]+)\)", re.IGNORECASE)
    RAW_HTML_IMG_PATTERN = re.compile(r"<img\s+[^>]*src=[\"'](https?://[^\"']+)[\"'][^>]*>", re.IGNORECASE)
    SUSPICIOUS_QUERY_PATTERN = re.compile(r"\?(leak|secret|token|key|data|q|exfil)=", re.IGNORECASE)

    def __init__(self, allowed_domains: Optional[List[str]] = None):
        self.allowed_domains = allowed_domains or ["trusted-cdn.com", "api.github.com"]

    def _is_url_allowed(self, url: str) -> bool:
        """Checks if URL is on explicit domain allowlist and does NOT contain leak queries."""
        if self.SUSPICIOUS_QUERY_PATTERN.search(url):
            return False
        if "attacker-sink" in url:
            return False
        for domain in self.allowed_domains:
            if domain in url:
                return True
        return False

    def inspect_egress_text(
        self,
        text: str,
        taint_context: SentinelTaintContext,
        firewall_enabled: bool = True
    ) -> Tuple[str, List[str], List[str], List[str]]:
        """
        Inspects outgoing LLM completion text.
        Returns (sanitized_text, blocked_urls, redacted_secrets, triggered_rules).
        """
        if not firewall_enabled:
            return text, [], [], []

        blocked_urls: List[str] = []
        redacted_secrets: List[str] = []
        triggered_rules: set = set()
        sanitized_text = text

        # 1. Block Markdown image exfiltration pixels if session is tainted
        if taint_context.is_tainted:
            def replace_md_image(match: re.Match) -> str:
                alt = match.group(1)
                url = match.group(2)
                if not self._is_url_allowed(url):
                    blocked_urls.append(url)
                    triggered_rules.add("MARKDOWN_PIXEL_EXFIL_BLOCKED")
                    return "[SENTINEL AI EGRESS BLOCKED: Unauthorized External Image/Exfiltration URL Neutralized]"
                return match.group(0)

            sanitized_text = self.MARKDOWN_IMAGE_PATTERN.sub(replace_md_image, sanitized_text)

            def replace_html_img(match: re.Match) -> str:
                url = match.group(1)
                if not self._is_url_allowed(url):
                    blocked_urls.append(url)
                    triggered_rules.add("HTML_IMG_EXFIL_BLOCKED")
                    return "[SENTINEL AI EGRESS BLOCKED: Raw HTML Image Tag Neutralized]"
                return match.group(0)

            sanitized_text = self.RAW_HTML_IMG_PATTERN.sub(replace_html_img, sanitized_text)

        # 2. Canary Token Check
        if taint_context.canary_token in sanitized_text:
            sanitized_text = sanitized_text.replace(taint_context.canary_token, "[CANARY_TOKEN_REDACTED]")
            redacted_secrets.append(taint_context.canary_token)
            triggered_rules.add("CANARY_TOKEN_EXFILTRATION_PREVENTED")

        # 3. Known Secrets Inventory Check
        for sec in taint_context.secrets_inventory:
            if sec in sanitized_text:
                sanitized_text = sanitized_text.replace(sec, "[REDACTED_SECRET_BY_SENTINEL_AI]")
                redacted_secrets.append(sec)
                triggered_rules.add("KNOWN_SECRET_REDACTED")

        # 4. Regex Pattern Secret Redaction
        for pat in self.SECRET_PATTERNS:
            for m in pat.finditer(sanitized_text):
                found_sec = m.group(0)
                if "[REDACTED" not in found_sec:
                    sanitized_text = sanitized_text.replace(found_sec, "[REDACTED_KEY_BY_SENTINEL_AI]")
                    redacted_secrets.append(found_sec)
                    triggered_rules.add("SECRET_PATTERN_REDACTED")

        return sanitized_text, blocked_urls, redacted_secrets, sorted(list(triggered_rules))

    def inspect_tool_calls(
        self,
        tool_calls: Optional[List[Dict[str, Any]]],
        taint_context: SentinelTaintContext,
        firewall_enabled: bool = True,
        allow_privileged_override: bool = False
    ) -> Tuple[Optional[List[Dict[str, Any]]], List[QuarantinedToolCall], List[str]]:
        """
        Zero-Trust Tool-Call Gatekeeper.
        If context is tainted and tool is PRIVILEGED_SIDE_EFFECT, intercepts and quarantines.
        """
        if not tool_calls or not firewall_enabled:
            return tool_calls, [], []

        safe_tool_calls: List[Dict[str, Any]] = []
        quarantined: List[QuarantinedToolCall] = []
        triggered_rules: set = set()

        for tc in tool_calls:
            # support both OpenAI function format and direct dict format
            func = tc.get("function", {}) if "function" in tc else tc
            tool_name = func.get("name") or tc.get("tool_name", "")
            raw_args = func.get("arguments", {})
            if isinstance(raw_args, str):
                import json
                try:
                    args = json.loads(raw_args)
                except Exception:
                    args = {"raw": raw_args}
            else:
                args = raw_args or {}

            is_privileged = tool_name in self.PRIVILEGED_TOOLS

            if taint_context.is_tainted and is_privileged and not allow_privileged_override:
                call_id = tc.get("id") or f"call_{uuid.uuid4().hex[:8]}"
                q_item = QuarantinedToolCall(
                    id=call_id,
                    tool_name=tool_name,
                    arguments=args,
                    reason=(
                        f"Privileged side-effect tool '{tool_name}' invoked under TAINTED session context. "
                        f"Source provenance contains untrusted third-party ingestion. "
                        f"Human-in-the-Loop (HITL) approval required."
                    ),
                    status="QUARANTINED"
                )
                quarantined.append(q_item)
                taint_context.quarantined_calls[call_id] = q_item
                triggered_rules.add("TOOL_CALL_QUARANTINED_HITL_REQUIRED")
            else:
                safe_tool_calls.append(tc)

        return (safe_tool_calls if safe_tool_calls else None), quarantined, sorted(list(triggered_rules))
