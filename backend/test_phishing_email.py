import asyncio
from backend.main import chat_completions, attacker_sink_logs, clear_attacker_sink
from backend.models import ChatCompletionRequest, ChatMessage, SentinelConfig
from backend.scenarios import SCENARIOS

async def test_phishing():
    sc3 = SCENARIOS["phishing_email"]
    raw_content = sc3["raw_content"]
    system_prompt = sc3["system_prompt"]

    print("--- 1. Testing Unsafe Email with Sentinel AI OFF ---")
    await clear_attacker_sink()
    req_off = ChatCompletionRequest(
        model="sentinel-agent-v1",
        messages=[
            ChatMessage(role="system", content=system_prompt),
            ChatMessage(role="user", content=raw_content)
        ],
        tools=[{
            "type": "function",
            "function": {
                "name": "forward_email",
                "parameters": {"type": "object", "properties": {}}
            }
        }],
        sentinel_config=SentinelConfig(firewall_enabled=False, mode="off")
    )
    res_off = await chat_completions(req_off)
    print("Tool calls (OFF):", res_off.choices[0].message.tool_calls)
    print("Sink events count (OFF):", len(attacker_sink_logs))
    if len(attacker_sink_logs) > 0:
        print("Logged Breach Extracted Data:", attacker_sink_logs[0].extracted_leak)
    assert len(attacker_sink_logs) == 1, f"Expected 1 breach with Sentinel OFF, got {len(attacker_sink_logs)}"
    assert res_off.choices[0].message.tool_calls is not None

    print("\n--- 2. Testing Unsafe Email with Sentinel AI ON ---")
    await clear_attacker_sink()
    req_on = ChatCompletionRequest(
        model="sentinel-agent-v1",
        messages=[
            ChatMessage(role="system", content=system_prompt),
            ChatMessage(role="user", content=raw_content)
        ],
        tools=[{
            "type": "function",
            "function": {
                "name": "forward_email",
                "parameters": {"type": "object", "properties": {}}
            }
        }],
        sentinel_config=SentinelConfig(firewall_enabled=True, mode="heal")
    )
    res_on = await chat_completions(req_on)
    print("Verdict (ON):", res_on.sentinel_audit.verdict)
    print("Tool calls (ON):", res_on.choices[0].message.tool_calls)
    print("Sink events count (ON):", len(attacker_sink_logs))
    print("Triggered rules:", res_on.sentinel_audit.triggered_rules)
    assert len(attacker_sink_logs) == 0, f"Expected 0 breaches with Sentinel ON, got {len(attacker_sink_logs)}"
    assert res_on.sentinel_audit.verdict == "MITIGATED"

    print("\nALL PHISHING EMAIL TESTS PASSED!")

if __name__ == "__main__":
    asyncio.run(test_phishing())
