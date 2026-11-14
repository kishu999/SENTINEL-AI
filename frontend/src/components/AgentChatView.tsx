import React from 'react';
import { Bot, User, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Lock, ArrowUpRight } from 'lucide-react';
import { ChatMessage, QuarantinedToolCall } from '../types';

interface AgentChatViewProps {
  assistantMessage: ChatMessage | null;
  quarantinedTools: QuarantinedToolCall[];
  onApproveTool: (id: string) => void;
  onRejectTool: (id: string) => void;
  firewallEnabled: boolean;
  isRunning: boolean;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  assistantMessage,
  quarantinedTools,
  onApproveTool,
  onRejectTool,
  firewallEnabled,
  isRunning,
}) => {
  const content = assistantMessage?.content || '';
  const hasMarkdownImage = content.includes('![');
  const isBlockedImage = content.includes('[SENTINEL AI EGRESS BLOCKED');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3 min-h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold font-mono tracking-wide text-slate-200">
              AI Agent Execution & Output
            </h2>
            <div className="text-[10px] text-slate-400 font-mono">
              Model: <span className="text-cyan-300">sentinel-agent-v1</span> (Evaluated by Layer 3)
            </div>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
          firewallEnabled
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}>
          {firewallEnabled ? 'Egress Filter Active' : 'Unshielded Agent'}
        </span>
      </div>

      {/* Assistant Output Bubble */}
      <div className="flex-1 flex flex-col gap-3">
        {isRunning ? (
          <div className="flex items-center justify-center h-40 text-xs font-mono text-slate-400 gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            <span>Evaluating prompt through Sentinel AI security layers...</span>
          </div>
        ) : assistantMessage ? (
          <div className="flex flex-col gap-3">
            {/* Output Text */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>

            {/* Blocked Image Egress Callout (Layer 3) */}
            {isBlockedImage && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-600/50 flex items-center gap-2.5 text-xs font-mono text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>Layer 3 Neutralized Exfiltration Pixel:</strong> An unauthorized outbound image request with sensitive parameters was intercepted and scrubbed before leaving the firewall.
                </span>
              </div>
            )}

            {/* Malicious Rendered Pixel Warning (When Sentinel OFF) */}
            {!firewallEnabled && hasMarkdownImage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-600/60 flex items-center gap-2.5 text-xs font-mono text-rose-200 animate-pulse">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  <strong>CRITICAL BREACH:</strong> The unshielded assistant rendered the attacker's hidden markdown image pixel! Check the Attacker Sink below for the exfiltrated Stripe API key.
                </span>
              </div>
            )}

            {/* Tool Calls (Unshielded) */}
            {!firewallEnabled && assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-600/50 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Hijacked Tool Execution (Sentinel AI OFF)</span>
                  </span>
                  <span className="text-[10px] text-rose-400">Automated Dispatch</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-rose-900/60 font-mono text-xs text-rose-200">
                  {JSON.stringify(assistantMessage.tool_calls, null, 2)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-xs font-mono text-slate-500">
            Awaiting execution... Click "Run Security Audit" to test.
          </div>
        )}

        {/* Quarantined Tool Calls (HITL Gatekeeper) */}
        {quarantinedTools.length > 0 && (
          <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/50 glow-amber">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Zero-Trust Tool Call Quarantined (HITL Required)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 text-[10px]">
                Layer 3 Gatekeeper
              </span>
            </div>

            {quarantinedTools.map((tool) => (
              <div
                key={tool.id}
                className="flex flex-col gap-2 bg-slate-950 p-3 rounded-lg border border-amber-800/60 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200">
                    Tool: <span className="text-white">{tool.tool_name}()</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    tool.status === 'QUARANTINED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : tool.status === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {tool.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed">
                  {tool.reason}
                </div>

                <div className="bg-slate-900 p-2 rounded text-[11px] text-slate-300 border border-slate-800">
                  <pre>{JSON.stringify(tool.arguments, null, 2)}</pre>
                </div>

                {tool.status === 'QUARANTINED' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onApproveTool(tool.id)}
                      className="flex-1 py-1.5 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Tool Dispatch</span>
                    </button>
                    <button
                      onClick={() => onRejectTool(tool.id)}
                      className="flex-1 py-1.5 px-3 rounded bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject & Neutralize</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
