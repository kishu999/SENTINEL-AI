from backend.semantic_guard import SemanticGuard
from backend.sanitizers.datamarker import DataMarker

sg = SemanticGuard()
dm = DataMarker()

clean_html = """<div class="email-body"><p>Dear Executive Committee,</p></div>"""
print("Clean HTML threat eval:", sg.evaluate_threat(clean_html))

spotlighted, _ = dm.spotlight(clean_html)
print("\nSpotlighted text eval:", sg.evaluate_threat(spotlighted))
