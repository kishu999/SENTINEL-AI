"""
HTML & Email DOM Sanitizer.
Detects and strips hidden DOM elements, micro-fonts, off-screen text,
color-camouflaged text, comments, and dangerous tags.
"""
import re
from typing import List, Dict, Any, Tuple
from bs4 import BeautifulSoup, Comment, Tag
from ..models import RemovedFragment


class HTMLSanitizer:
    DANGEROUS_TAGS = {
        "script", "style", "noscript", "template", "iframe",
        "svg", "canvas", "meta", "object", "embed", "link", "base", "applet"
    }

    IMPERATIVE_OVERRIDE_PATTERNS = [
        re.compile(r"ignore\s+(all\s+)?(previous|above|system)\s+(instructions|prompts|rules)", re.IGNORECASE),
        re.compile(r"system\s+(override|prompt|directive|note|instruction)", re.IGNORECASE),
        re.compile(r"(new|important)\s+instructions?", re.IGNORECASE),
        re.compile(r"(send_offer_email|forward_email|http_post|webhook|send_email)", re.IGNORECASE),
        re.compile(r"disregard\s+(everything|prior|instructions?)", re.IGNORECASE),
        re.compile(r"(exfiltrate|leak|steal|send\s+secret)", re.IGNORECASE),
    ]

    def __init__(self):
        pass

    def _parse_css_declarations(self, style_str: str) -> Dict[str, str]:
        """Parses inline CSS declarations into a lowercase key-value dictionary."""
        styles = {}
        if not style_str:
            return styles
        items = style_str.split(";")
        for item in items:
            if ":" in item:
                k, v = item.split(":", 1)
                styles[k.strip().lower()] = v.strip().lower()
        return styles

    def _is_color_white_or_invisible(self, color_val: str) -> bool:
        """Determines if a CSS color represents white, near-white, or full transparency."""
        color_val = color_val.replace(" ", "")
        if color_val in {"#fff", "#ffffff", "white", "rgb(255,255,255)", "rgba(255,255,255,1)"}:
            return True
        if "rgba(" in color_val:
            m = re.search(r"rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9\.]+)\s*\)", color_val)
            if m:
                try:
                    alpha = float(m.group(1))
                    if alpha < 0.05:
                        return True
                except ValueError:
                    pass
        if color_val == "transparent":
            return True
        # Check hex near-white
        if color_val.startswith("#"):
            hex_val = color_val[1:]
            if len(hex_val) == 6:
                try:
                    r, g, b = int(hex_val[0:2], 16), int(hex_val[2:4], 16), int(hex_val[4:6], 16)
                    if r >= 245 and g >= 245 and b >= 245:
                        return True
                except ValueError:
                    pass
        return False

    def _is_font_micro(self, font_size_val: str) -> Tuple[bool, str]:
        """Detects micro fonts: <= 3px, 0pt, 0rem, etc."""
        font_size_val = font_size_val.strip().lower()
        if font_size_val in {"0", "0px", "0pt", "0rem", "0em", "0%"}:
            return True, f"Zero font-size ({font_size_val})"
        m = re.match(r"^([0-9\.]+)(px|pt|rem|em)?$", font_size_val)
        if m:
            try:
                num = float(m.group(1))
                unit = m.group(2) or "px"
                if unit == "px" and num <= 3.0:
                    return True, f"Micro-font size ({font_size_val} <= 3px)"
                elif unit == "pt" and num <= 2.5:
                    return True, f"Micro-font size ({font_size_val} <= 2.5pt)"
                elif unit in {"rem", "em"} and num <= 0.2:
                    return True, f"Micro-font size ({font_size_val} <= 0.2rem)"
            except ValueError:
                pass
        return False, ""

    def _is_off_screen(self, styles: Dict[str, str]) -> Tuple[bool, str]:
        """Detects negative coordinate offsets, indentation, or zero-dimension clippings."""
        for prop in ["left", "top", "text-indent", "margin-left", "margin-top"]:
            if prop in styles:
                val = styles[prop]
                m = re.search(r"-\s*(\d+)", val)
                if m:
                    offset = int(m.group(1))
                    if offset >= 500:
                        return True, f"Off-screen positioning ({prop}: {val})"

        if styles.get("clip-path") in {"inset(100%)", "circle(0)", "polygon(0 0, 0 0, 0 0)"}:
            return True, "Invisible clip-path clipping"

        w = styles.get("width")
        h = styles.get("height")
        if (w in {"0", "0px", "0pt"} and h in {"0", "0px", "0pt"}):
            return True, "Zero dimensions (width:0, height:0)"

        return False, ""

    def sanitize(self, html_content: str) -> Tuple[str, List[RemovedFragment], List[str]]:
        """
        Parses HTML, detects and strips comments, dangerous tags, CSS-hidden text,
        micro-fonts, off-screen elements, and suspicious attributes.
        Returns (clean_text, removed_fragments, triggered_rules).
        """
        removed_fragments: List[RemovedFragment] = []
        triggered_rules: set = set()

        if not html_content or not html_content.strip():
            return "", [], []

        soup = BeautifulSoup(html_content, "html.parser")

        # 1. Cleanly strip standard HTML comments without flagging them as threats
        comments = soup.find_all(string=lambda text: isinstance(text, Comment))
        for comment in comments:
            comment.extract()

        # 2. Strip dangerous tags
        for tag_name in self.DANGEROUS_TAGS:
            for tag in soup.find_all(tag_name):
                content = tag.get_text(strip=True) or str(tag)[:120]
                removed_fragments.append(RemovedFragment(
                    type="DANGEROUS_TAG",
                    content=content,
                    reason=f"Stripped untrusted <{tag_name}> tag",
                    location=f"<{tag_name}>"
                ))
                triggered_rules.add("DANGEROUS_TAG_REMOVED")
                tag.decompose()

        # 3. Inspect all tags for CSS hiding, micro-fonts, and off-screen coordinates
        for tag in list(soup.find_all(True)):
            if not isinstance(tag, Tag):
                continue

            style_attr = tag.get("style", "")
            styles = self._parse_css_declarations(style_attr)

            tag_text = tag.get_text(strip=True)
            tag_name = tag.name

            # Check hidden styles
            is_hidden = False
            hide_reason = ""

            if styles.get("display") == "none":
                is_hidden = True
                hide_reason = "CSS display: none"
                triggered_rules.add("CSS_DISPLAY_NONE")
            elif styles.get("visibility") == "hidden":
                is_hidden = True
                hide_reason = "CSS visibility: hidden"
                triggered_rules.add("CSS_VISIBILITY_HIDDEN")
            elif "opacity" in styles:
                try:
                    op = float(styles["opacity"])
                    if op < 0.05:
                        is_hidden = True
                        hide_reason = f"CSS opacity: {styles['opacity']} (< 0.05)"
                        triggered_rules.add("CSS_OPACITY_ZERO")
                except ValueError:
                    pass

            # Micro-font check
            if not is_hidden and "font-size" in styles:
                is_micro, micro_reason = self._is_font_micro(styles["font-size"])
                if is_micro:
                    is_hidden = True
                    hide_reason = micro_reason
                    triggered_rules.add("MICRO_FONT_REMOVED")

            # Off-screen check
            if not is_hidden:
                is_off, off_reason = self._is_off_screen(styles)
                if is_off:
                    is_hidden = True
                    hide_reason = off_reason
                    triggered_rules.add("OFF_SCREEN_TEXT_REMOVED")

            # Color camouflaging check (e.g. white text on white/default light background)
            if not is_hidden and "color" in styles:
                color_val = styles["color"]
                bg_val = styles.get("background-color") or styles.get("background") or "#ffffff"
                if self._is_color_white_or_invisible(color_val):
                    # Check if background is also white or default light
                    if not bg_val or self._is_color_white_or_invisible(bg_val) or bg_val in {"#fff", "#ffffff", "white"}:
                        is_hidden = True
                        hide_reason = f"Camouflaged white/invisible text (color: {color_val})"
                        triggered_rules.add("CSS_HIDDEN_WHITE_TEXT")

            if is_hidden:
                if tag_text:
                    removed_fragments.append(RemovedFragment(
                        type="CSS_HIDDEN_ELEMENT",
                        content=tag_text,
                        reason=hide_reason,
                        location=f"<{tag_name} style='{style_attr}'>"
                    ))
                tag.decompose()
                continue

            # 4. Check suspicious attributes like aria-label, title, alt with imperative overrides
            for attr in ["aria-label", "title", "alt"]:
                val = tag.get(attr)
                if val:
                    for pat in self.IMPERATIVE_OVERRIDE_PATTERNS:
                        if pat.search(val):
                            removed_fragments.append(RemovedFragment(
                                type="SUSPICIOUS_ATTRIBUTE_OVERRIDE",
                                content=f"{attr}='{val}'",
                                reason=f"Imperative override verb found in {attr} attribute",
                                location=f"<{tag_name} {attr}=...>"
                            ))
                            triggered_rules.add("SUSPICIOUS_ATTRIBUTE_OVERRIDE")
                            del tag[attr]
                            break

        # Extract remaining clean text with paragraph/div separation
        clean_text = soup.get_text(separator="\n", strip=True)
        # Normalize excessive newlines
        clean_text = re.sub(r"\n{3,}", "\n\n", clean_text)

        return clean_text, removed_fragments, sorted(list(triggered_rules))
