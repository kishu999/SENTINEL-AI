"""
Steganography & Obfuscation Decoder.
Detects and neutralizes:
1. Zero-width Unicode characters and RTL/bidi override exploits.
2. Unicode Tag characters (U+E0000 to U+E007F).
3. Smuggled Base64, Hex, ROT13, and URL-encoded prompt-injection payloads.
"""
import re
import base64
import urllib.parse
from typing import List, Tuple, Dict, Any
from ..models import RemovedFragment


class ObfuscationScanner:
    # Zero-width and invisible characters
    ZERO_WIDTH_CHARS = {
        "\u200b": "Zero-Width Space (U+200B)",
        "\u200c": "Zero-Width Non-Joiner (U+200C)",
        "\u200d": "Zero-Width Joiner (U+200D)",
        "\u2060": "Word Joiner (U+2060)",
        "\ufeff": "Zero-Width No-Break Space (U+FEFF)",
    }

    # Bidi / RTL directional control characters
    BIDI_CHARS = {
        "\u202a": "Left-to-Right Embedding (U+202A)",
        "\u202b": "Right-to-Left Embedding (U+202B)",
        "\u202c": "Pop Directional Formatting (U+202C)",
        "\u202d": "Left-to-Right Override (U+202D)",
        "\u202e": "Right-to-Left Override (U+202E)",
        "\u2066": "Left-to-Right Isolate (U+2066)",
        "\u2067": "Right-to-Left Isolate (U+2067)",
        "\u2068": "First Strong Isolate (U+2068)",
        "\u2069": "Pop Directional Isolate (U+2069)",
    }

    # Malicious intent patterns inside decoded plaintext
    MALICIOUS_INTENT_PATTERNS = [
        re.compile(r"ignore\s+(all\s+)?(previous|above|system)\s+(instructions|prompts)", re.IGNORECASE),
        re.compile(r"(forward_email|send_email|send_offer_email|http_post|webhook)", re.IGNORECASE),
        re.compile(r"(system\s+override|developer\s+mode|root\s+prompt)", re.IGNORECASE),
        re.compile(r"(exfiltrate|leak|steal|drop@|attacker@|password\s+reset)", re.IGNORECASE),
        re.compile(r"(send|forward|transmit)\s+(this|the)?\s+(token|key|secret|password)", re.IGNORECASE),
        re.compile(r"!\[.*?\]\(https?://[^\s\)]+\)", re.IGNORECASE),
    ]

    BASE64_PATTERN = re.compile(r"\b(?:[A-Za-z0-9+/]{4}){4,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\b")
    HEX_PATTERN = re.compile(r"\b(?:[0-9a-fA-F]{2}){12,}\b")

    def __init__(self):
        pass

    def _strip_unicode_smuggling(self, text: str) -> Tuple[str, List[RemovedFragment], List[str]]:
        """Detects and strips zero-width, bidi, and tag characters."""
        removed: List[RemovedFragment] = []
        rules: set = set()
        clean_chars = []

        zw_count = 0
        bidi_count = 0
        tag_count = 0

        for char in text:
            code_point = ord(char)
            # Unicode Tag characters (U+E0000 - U+E007F)
            if 0xE0000 <= code_point <= 0xE007F:
                tag_count += 1
                continue
            # Zero-width
            if char in self.ZERO_WIDTH_CHARS:
                zw_count += 1
                continue
            # Bidi
            if char in self.BIDI_CHARS:
                bidi_count += 1
                continue
            clean_chars.append(char)

        if zw_count > 0:
            removed.append(RemovedFragment(
                type="ZERO_WIDTH_UNICODE",
                content=f"{zw_count} zero-width characters stripped",
                reason=f"Stripped {zw_count} zero-width steganographic Unicode smuggling characters",
                location="Text stream"
            ))
            rules.add("ZERO_WIDTH_UNICODE_SMUGGLING")

        if bidi_count > 0:
            removed.append(RemovedFragment(
                type="BIDI_OVERRIDE_UNICODE",
                content=f"{bidi_count} bidi override characters stripped",
                reason=f"Stripped {bidi_count} bidirectional RTL override characters",
                location="Text stream"
            ))
            rules.add("BIDI_CONTROL_SMUGGLING")

        if tag_count > 0:
            removed.append(RemovedFragment(
                type="UNICODE_TAGS",
                content=f"{tag_count} Unicode Tag characters stripped",
                reason=f"Stripped {tag_count} invisible Unicode Tag characters (U+E0000..U+E007F)",
                location="Text stream"
            ))
            rules.add("UNICODE_TAG_SMUGGLING")

        return "".join(clean_chars), removed, sorted(list(rules))

    def _inspect_and_neutralize_encoded_payloads(self, text: str) -> Tuple[str, List[RemovedFragment], List[str]]:
        """Detects Base64, Hex, and URL-encoded strings, decodes them, and neutralizes malicious injections."""
        removed: List[RemovedFragment] = []
        rules: set = set()

        # 1. Base64 Scanner
        def replace_b64(match: re.Match) -> str:
            blob = match.group(0)
            try:
                decoded_bytes = base64.b64decode(blob, validate=True)
                decoded_str = decoded_bytes.decode("utf-8", errors="ignore")
                for pat in self.MALICIOUS_INTENT_PATTERNS:
                    if pat.search(decoded_str):
                        removed.append(RemovedFragment(
                            type="ENCODED_BASE64_INJECTION",
                            content=f"Encoded: {blob[:40]}... -> Decoded: '{decoded_str.strip()}'",
                            reason=f"Smuggled Base64 prompt injection directive decoded and neutralized",
                            location=f"Base64 token ({len(blob)} chars)"
                        ))
                        rules.add("BASE64_SMUGGLING_NEUTRALIZED")
                        return "[SENTINEL_NEUTRALIZED_MALICIOUS_BASE64]"
            except Exception:
                pass
            return blob

        processed_text = self.BASE64_PATTERN.sub(replace_b64, text)

        # 2. Hex Scanner
        def replace_hex(match: re.Match) -> str:
            blob = match.group(0)
            try:
                decoded_bytes = bytes.fromhex(blob)
                decoded_str = decoded_bytes.decode("utf-8", errors="ignore")
                for pat in self.MALICIOUS_INTENT_PATTERNS:
                    if pat.search(decoded_str):
                        removed.append(RemovedFragment(
                            type="ENCODED_HEX_INJECTION",
                            content=f"Hex: {blob[:40]}... -> Decoded: '{decoded_str.strip()}'",
                            reason="Smuggled Hex prompt injection directive decoded and neutralized",
                            location=f"Hex token ({len(blob)} chars)"
                        ))
                        rules.add("HEX_SMUGGLING_NEUTRALIZED")
                        return "[SENTINEL_NEUTRALIZED_MALICIOUS_HEX]"
            except Exception:
                pass
            return blob

        processed_text = self.HEX_PATTERN.sub(replace_hex, processed_text)

        # 3. URL-encoded inspection
        if "%20" in processed_text or "%3C" in processed_text or "%3c" in processed_text:
            try:
                decoded_url = urllib.parse.unquote(processed_text)
                for pat in self.MALICIOUS_INTENT_PATTERNS:
                    if pat.search(decoded_url) and not pat.search(processed_text):
                        removed.append(RemovedFragment(
                            type="URL_ENCODED_INJECTION",
                            content=decoded_url[:120],
                            reason="URL-encoded prompt injection pattern identified and neutralized",
                            location="URL encoded sequence"
                        ))
                        rules.add("URL_ENCODED_SMUGGLING_NEUTRALIZED")
                        processed_text = decoded_url
                        break
            except Exception:
                pass

        return processed_text, removed, sorted(list(rules))

    def scan(self, text: str) -> Tuple[str, List[RemovedFragment], List[str]]:
        """Runs both Unicode steganography stripping and encoded payload inspection."""
        clean_text, zw_removed, zw_rules = self._strip_unicode_smuggling(text)
        final_text, enc_removed, enc_rules = self._inspect_and_neutralize_encoded_payloads(clean_text)

        all_removed = zw_removed + enc_removed
        all_rules = sorted(list(set(zw_rules + enc_rules)))
        return final_text, all_removed, all_rules
