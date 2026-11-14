export interface RemovedFragment {
  type: string;
  content: string;
  reason: string;
  location?: string;
}

export interface SanitizationDiff {
  raw_input: string;
  sanitized_datamarked_input: string;
  removed_fragments: RemovedFragment[];
}

export interface QuarantinedToolCall {
  id: string;
  tool_name: string;
  arguments: Record<string, any>;
  reason: string;
  status: 'QUARANTINED' | 'APPROVED' | 'REJECTED';
  timestamp?: number;
}

export interface EgressActions {
  blocked_urls: string[];
  quarantined_tool_calls: QuarantinedToolCall[];
  secrets_redacted: string[];
}

export interface SentinelAudit {
  request_id: string;
  firewall_enabled: boolean;
  mode: string;
  taint_state: {
    is_tainted: boolean;
    taint_sources: string[];
  };
  threat_score: number;
  verdict: 'CLEAN' | 'MITIGATED' | 'BLOCKED' | 'EXPLOITED';
  latency_ms: {
    layer1_sanitizer_ms: number;
    layer2_semantic_ms: number;
    layer3_egress_ms: number;
    total_overhead_ms: number;
  };
  triggered_rules: string[];
  sanitization_diff: SanitizationDiff;
  egress_actions: EgressActions;
}

export interface ChatMessage {
  role: string;
  content: string;
  name?: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface ChatCompletionResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  sentinel_audit: SentinelAudit;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE';
  threat_vector: string;
  description: string;
  system_prompt: string;
  user_prompt: string;
  input_type: 'html' | 'pdf' | 'email';
  raw_content: string;
  expected_leak?: string | null;
  expected_tool?: {
    name: string;
    arguments: Record<string, any>;
  } | null;
}

export interface AttackerSinkEvent {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  query_params: Record<string, string>;
  body?: string | null;
  headers: Record<string, string>;
  extracted_leak?: string | null;
  source_scenario?: string | null;
}
