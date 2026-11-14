"""
Data models for Sentinel AI proxy, sanitizers, and audit envelopes.
"""
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
import time


class ChatMessage(BaseModel):
    role: str
    content: Optional[str] = ""
    name: Optional[str] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_call_id: Optional[str] = None


class SentinelConfig(BaseModel):
    firewall_enabled: bool = True
    mode: Literal["heal", "block", "off"] = "heal"
    threat_threshold: float = 0.75
    untrusted_documents: Optional[List[Dict[str, Any]]] = None
    allow_privileged_tools: bool = False
    allowed_domains: List[str] = Field(default_factory=lambda: ["localhost", "127.0.0.1", "trusted-cdn.com"])


class ChatCompletionRequest(BaseModel):
    model: str = "sentinel-agent-v1"
    messages: List[ChatMessage]
    tools: Optional[List[Dict[str, Any]]] = None
    stream: Optional[bool] = False
    temperature: Optional[float] = 0.7
    sentinel_config: Optional[SentinelConfig] = Field(default_factory=SentinelConfig)


class RemovedFragment(BaseModel):
    type: str
    content: str
    reason: str
    location: Optional[str] = None


class SanitizationDiff(BaseModel):
    raw_input: str = ""
    sanitized_datamarked_input: str = ""
    removed_fragments: List[RemovedFragment] = Field(default_factory=list)


class QuarantinedToolCall(BaseModel):
    id: str
    tool_name: str
    arguments: Dict[str, Any]
    reason: str
    status: Literal["QUARANTINED", "APPROVED", "REJECTED"] = "QUARANTINED"
    timestamp: float = Field(default_factory=time.time)


class EgressActions(BaseModel):
    blocked_urls: List[str] = Field(default_factory=list)
    quarantined_tool_calls: List[QuarantinedToolCall] = Field(default_factory=list)
    secrets_redacted: List[str] = Field(default_factory=list)


class SentinelAudit(BaseModel):
    request_id: str
    firewall_enabled: bool
    mode: str
    taint_state: Dict[str, Any]
    threat_score: float
    verdict: Literal["CLEAN", "MITIGATED", "BLOCKED", "EXPLOITED"]
    latency_ms: Dict[str, float]
    triggered_rules: List[str]
    sanitization_diff: SanitizationDiff
    egress_actions: EgressActions


class ChatChoice(BaseModel):
    index: int = 0
    message: ChatMessage
    finish_reason: Optional[str] = "stop"


class Usage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0


class ChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int = Field(default_factory=lambda: int(time.time()))
    model: str
    choices: List[ChatChoice]
    usage: Usage = Field(default_factory=Usage)
    sentinel_audit: SentinelAudit


class AttackerSinkEvent(BaseModel):
    id: str
    timestamp: str
    method: str
    path: str
    query_params: Dict[str, str] = Field(default_factory=dict)
    body: Optional[str] = None
    headers: Dict[str, str] = Field(default_factory=dict)
    extracted_leak: Optional[str] = None
    source_scenario: Optional[str] = None


class ToolApprovalRequest(BaseModel):
    tool_call_id: str
    decision: Literal["approve", "reject"]
