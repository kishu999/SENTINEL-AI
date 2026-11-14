"""
LAYER 2: Semantic Prompt-Injection Guardrail.
Multi-signal threat scoring engine with heuristic + regex fallback
and optional transformers support.
"""
import re
import time
from typing import Dict, Any, List, Tuple, Optional


class SemanticGuard:
    # Pattern Categories with associated threat weights
    PATTERNS = {
        "INSTRUCTION_OVERRIDE": {
            "weight": 0.40,
            "patterns": [
                re.compile(r"ignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|directives|rules|restrictions|safeguards?)", re.IGNORECASE),
                re.compile(r"disregard\s+(the\s+)?(system|above|previous|prior|all)\s+(prompt|instructions|rules|restrictions)", re.IGNORECASE),
                re.compile(r"(new|updated|important|critical)?\s*system\s+(override|instructions?|directive|note):?", re.IGNORECASE),
                re.compile(r"developer\s+mode\s+(enabled|on|activated)", re.IGNORECASE),
                re.compile(r"you\s+are\s+now\s+(in|acting\s+as|an\s+unfiltered|jailbroken)", re.IGNORECASE),
                re.compile(r"from\s+now\s+on\s+you\s+(will|must|should)\s+act\s+as", re.IGNORECASE),
                re.compile(r"override\s+system\s+(prompt|settings|guardrails?|instructions?)", re.IGNORECASE),
                re.compile(r"bypass\s+(safety|guardrails?|firewall|filters?)", re.IGNORECASE),
                re.compile(r"do\s+anything\s+now\s+mode", re.IGNORECASE),
            ]
        },
        "EXFILTRATION_DIRECTIVE": {
            "weight": 0.35,
            "patterns": [
                re.compile(r"!\[.*?\]\((https?://[^\s\)]+)\)", re.IGNORECASE),
                re.compile(r"(render|append|include|embed)\s+(a\s+|an\s+)?(markdown\s+)?image", re.IGNORECASE),
                re.compile(r"\?(leak|secret|token|key|data|q|exfil)=", re.IGNORECASE),
                re.compile(r"(silently\s+)?(append|send|transmit|forward)\s+(the\s+)?(user['’]s\s+)?(stripe|api|secret|password|access)\s+key", re.IGNORECASE),
                re.compile(r"verification\s+pixel", re.IGNORECASE),
                re.compile(r"exfiltrat(e|ion)\s+(secrets?|keys?|tokens?)", re.IGNORECASE),
                re.compile(r"attacker-sink", re.IGNORECASE),
            ]
        },
        "TOOL_HIJACKING": {
            "weight": 0.30,
            "patterns": [
                re.compile(r"(invoke|call|execute|trigger)\s+(tool|function)\s*[:(]?\s*(send_offer_email|send_email|forward_email|http_post|webhook|transfer_funds)", re.IGNORECASE),
                re.compile(r"send_offer_email\s*\(", re.IGNORECASE),
                re.compile(r"forward_email\s*\(", re.IGNORECASE),
                re.compile(r"send_email\s*\(", re.IGNORECASE),
                re.compile(r"immediately\s+(execute|invoke)\s+(tool|function)", re.IGNORECASE),
                re.compile(r"attacker@darkweb\.io|drop@exfil-server\.net", re.IGNORECASE),
                re.compile(r"score\s+this\s+candidate\s+100/100", re.IGNORECASE),
            ]
        },
        "DELIMITER_ESCAPE": {
            "weight": 0.25,
            "patterns": [
                re.compile(r"###\s*System:?", re.IGNORECASE),
                re.compile(r"<\|im_start\|>\s*system", re.IGNORECASE),
                re.compile(r"<\|im_end\|>", re.IGNORECASE),
                re.compile(r"</?context>", re.IGNORECASE),
                re.compile(r"\[INST\]|\[/INST\]", re.IGNORECASE),
                re.compile(r"<<SYS>>|<</SYS>>", re.IGNORECASE),
                re.compile(r"<\|start_header_id\|>system", re.IGNORECASE),
            ]
        }
    }

    def __init__(self, use_ml_model: bool = False):
        self.use_ml_model = use_ml_model
        self.classifier = None
        if self.use_ml_model:
            try:
                from transformers import pipeline
                self.classifier = pipeline("text-classification", model="protectai/deberta-v3-base-prompt-injection-v2")
            except Exception:
                self.classifier = None

    def evaluate_threat(self, text: str) -> Dict[str, Any]:
        """
        Calculates multi-signal threat score (0.00 to 1.00) based on weighted pattern matching
        and optional ML model scoring. Sub-5ms execution.
        """
        start_time = time.perf_counter()
        triggered_rules: List[str] = []
        matched_details: List[Dict[str, Any]] = []
        raw_score = 0.0

        # Normalize out zero-width and invisible chars for clean semantic inspection
        normalized_text = re.sub(r"[\u200b\u200c\u200d\u2060\ufeff\u202a-\u202e\u2066-\u2069]", "", text)

        for category, info in self.PATTERNS.items():
            category_matched = False
            for pat in info["patterns"]:
                match = pat.search(normalized_text)
                if match:
                    category_matched = True
                    rule_name = f"{category}_DETECTED"
                    if rule_name not in triggered_rules:
                        triggered_rules.append(rule_name)
                    matched_details.append({
                        "category": category,
                        "matched_text": match.group(0),
                        "start": match.start(),
                        "end": match.end(),
                        "weight": info["weight"]
                    })
                    break  # count category once
            if category_matched:
                raw_score += info["weight"]

        # If multiple strong categories trigger, boost score
        if len(triggered_rules) >= 2:
            raw_score = min(1.0, raw_score * 1.25)

        # Scale to max 1.0
        threat_score = round(min(1.0, max(0.0, raw_score)), 3)

        # If ML model is loaded, ensemble
        if self.classifier:
            try:
                res = self.classifier(text[:512])[0]
                if res["label"].lower() == "injection":
                    ml_score = res["score"]
                    threat_score = round(max(threat_score, ml_score), 3)
                    triggered_rules.append("DEBERTA_INJECTION_FLAGGED")
            except Exception:
                pass

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "threat_score": threat_score,
            "is_suspicious": threat_score >= 0.50,
            "is_malicious": threat_score >= 0.75,
            "triggered_rules": triggered_rules,
            "matched_details": matched_details,
            "latency_ms": elapsed_ms
        }

    def heal_semantic_text(self, text: str) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Surgically neutralizes detected malicious semantic spans (for SANITIZE_AND_HEAL mode)
        while preserving the rest of the text.
        """
        healed_text = text
        removed_spans = []

        for category, info in self.PATTERNS.items():
            for pat in info["patterns"]:
                matches = list(pat.finditer(healed_text))
                for m in reversed(matches):
                    span_text = m.group(0)
                    removed_spans.append({
                        "category": category,
                        "content": span_text,
                        "reason": f"Surgically neutralized semantic injection pattern ({category})"
                    })
                    start, end = m.span()
                    healed_text = healed_text[:start] + f" [SENTINEL_NEUTRALIZED_{category}] " + healed_text[end:]

        # Normalize whitespace
        healed_text = re.sub(r"\s+", " ", healed_text).strip()
        return healed_text, removed_spans
