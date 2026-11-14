import React, { useState } from 'react';
import { Eye, ShieldAlert, Check, Copy, FileCode2, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SentinelAudit, RemovedFragment } from '../types';

interface XRayDiffViewerProps {
  audit: SentinelAudit | null;
  firewallEnabled: boolean;
}

export const XRayDiffViewer: React.FC<XRayDiffViewerProps> = ({ audit, firewallEnabled }) => {
  const [activeTab, setActiveTab] = useState<'xray' | 'datamark' | 'code'>('xray');
  const [copied, setCopied] = useState(false);

  const diff = audit?.sanitization_diff;
  const removed = diff?.removed_fragments ?? [];
  const rawText = diff?.raw_input ?? 'No input processed yet. Click "Run Security Audit" above.';
  const sanitizedText = diff?.sanitized_datamarked_input ?? 'No sanitized output yet.';
  const rules = audit?.triggered_rules ?? [];
  const threatScore = audit?.threat_score ?? 0;

  const pythonSnippet = `# Drop-in 2-line integration: Point your existing OpenAI client to Sentinel AI!
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",  # Sentinel AI Firewall Endpoint
    api_key="sentinel-free-mode"          # Automatically secures all models
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": untrusted_document}]
)
print(response.choices[0].message.content)
print(response.sentinel_audit.verdict)    # "MITIGATED" | "CLEAN"`;

  const tsSnippet = `// TypeScript / Node.js Drop-In Integration
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:8000/v1', // Sentinel AI Proxy
  apiKey: 'sentinel-free-mode',
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: untrustedWebpageContent }],
});

console.log(completion.choices[0].message.content);
console.log((completion as any).sentinel_audit.verdict);`;

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('xray')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeTab === 'xray'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>X-Ray Threat Diff</span>
            {removed.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] flex items-center justify-center font-bold">
                {removed.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('datamark')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeTab === 'datamark'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sanitized & Datamarked</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drop-In SDK (2-Line Diff)</span>
          </button>
        </div>

        {/* Threat Score Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Score:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
            threatScore >= 0.75
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : threatScore >= 0.40
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {(threatScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Tab 1: X-Ray Threat Diff View */}
      {activeTab === 'xray' && (
        <div className="flex flex-col gap-3">
          {/* Threats Scrubbed Pills Bar */}
          {removed.length > 0 ? (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-rose-950/20 border border-rose-900/50">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-rose-300">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{removed.length} Ingestion Threat Spans Intercepted & Scrubbed</span>
                </span>
                <span className="text-[10px] text-rose-400">Layer 1 Pre-Ingestion</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {removed.map((frag, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs"
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 font-bold">
                        {frag.type}
                      </span>
                      <span className="text-slate-400">{frag.location || 'DOM Element'}</span>
                    </div>
                    <div className="font-mono text-rose-200 text-[11px]">
                      {frag.reason}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[420px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                      "{frag.content}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                {firewallEnabled
                  ? 'No hidden DOM elements or micro-font threats detected in document.'
                  : 'Sentinel AI is OFF: Raw input is being ingested unshielded!'}
              </span>
            </div>
          )}

          {/* Triggered Rules Tag Cloud */}
          {rules.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400">Triggered Rules:</span>
              {rules.map((rule, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 text-[10px] font-mono"
                >
                  {rule}
                </span>
              ))}
            </div>
          )}

          {/* Raw Document Highlight Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 max-h-[300px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {rawText}
          </div>
        </div>
      )}

      {/* Tab 2: Sanitized & Datamarked View */}
      {activeTab === 'datamark' && (
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Cryptographically Spotlighted LLM Context Window:</span>
            <span className="text-emerald-400">Passive Data Guard Active</span>
          </div>
          <div className="rounded-xl border border-emerald-900/40 bg-slate-950 p-3.5 max-h-[380px] overflow-y-auto font-mono text-xs text-emerald-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-800 selection:text-white">
            {sanitizedText}
          </div>
        </div>
      )}

      {/* Tab 3: Drop-In Code View */}
      {activeTab === 'code' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>Zero Code Rewrite — Simply Swap OpenAI baseURL:</span>
            <button
              onClick={() => copyCode(pythonSnippet)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 max-h-[360px] overflow-y-auto font-mono text-xs text-cyan-300 leading-relaxed">
            {pythonSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
