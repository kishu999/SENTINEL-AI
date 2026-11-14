import fitz
import asyncio
from backend.main import pdf_sanitizer, chat_completions
from backend.models import ChatCompletionRequest, ChatMessage, SentinelConfig

# Create a sample custom PDF (e.g. Machine Learning Research Paper or different candidate)
def make_custom_pdf():
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(fitz.Point(50, 60), "QUANTUM NEURAL NETWORKS FOR MOLECULAR DOCKING", fontsize=14)
    page.insert_text(fitz.Point(50, 90), "Dr. Sarah Jenkins - Department of Computational Chemistry, MIT", fontsize=10)
    page.insert_text(fitz.Point(50, 120), "Abstract: We present a hybrid classical-quantum variational architecture achieving 99.4% precision on binding affinity predictions.", fontsize=10)
    page.insert_text(fitz.Point(50, 140), "Key Results: Inference latency reduced from 4 hours to 3.2 seconds using parameterized ansatz circuits.", fontsize=10)
    pdf_bytes = doc.write()
    doc.close()
    return pdf_bytes

async def test_custom_pdf():
    pdf_bytes = make_custom_pdf()
    clean_text, removed, rules = pdf_sanitizer.sanitize(pdf_bytes)
    print("Clean PDF Text:\n", clean_text)

    req = ChatCompletionRequest(
        model="sentinel-agent-v1",
        messages=[
            ChatMessage(role="system", content="You are an AI Document Assistant. Summarize the PDF document accurately."),
            ChatMessage(role="user", content=clean_text)
        ],
        sentinel_config=SentinelConfig(firewall_enabled=True)
    )
    res = await chat_completions(req)
    output = res.choices[0].message.content or ""
    print("\nAssistant Output:\n", output)
    assert "Alex Mercer" not in output, "Custom PDF must NOT output Alex Mercer!"
    assert "QUANTUM NEURAL NETWORKS" in output or "Sarah Jenkins" in output or "variational" in output or "binding affinity" in output, "Output must contain custom PDF content!"
    print("\nCustom PDF successfully generated dynamic tailored output!")

if __name__ == "__main__":
    asyncio.run(test_custom_pdf())
