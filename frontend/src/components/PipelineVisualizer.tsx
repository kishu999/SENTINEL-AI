import React from 'react';
import { Layers, Search, Lock, ArrowRight, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { SentinelAudit } from '../types';

interface PipelineVisualizerProps {
  audit: SentinelAudit | null;
  firewallEnabled: boolean;
  isRunning: boolean;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  audit,
  firewallEnabled,
  isRunning,
}) => {
  const l1Ms = audit?.latency_ms?.layer1_sanitizer_ms ?? 0;
  const l2Ms = audit?.latency_ms?.layer2_semantic_ms ?? 0;
  const l3Ms = audit?.latency_ms?.layer3_egress_ms ?? 0;
  const threatScore = audit?.threat_score ?? 0;
  const verdict = audit?.verdict ?? 'CLEAN';

  const stages = [
    {
      id: 1,
      name: 'Layer 1: Ingestion Sanitizer',
      desc: 'DOM CSS, PDF Spans, Unicode & Base64',
      latency: `${l1Ms.toFixed(1)} ms`,
      icon: Layers,
      status: !firewallEnabled
        ? 'BYPASS'
        : audit?.sanitization_diff?.removed_fragments?.length
        ? `${audit.sanitization_diff.removed_fragments.length} Threats Scrubbed`
        : 'Clean Ingestion',
      isWarning: firewallEnabled && (audit?.sanitization_diff?.removed_fragments?.length ?? 0) > 0,
      isBypass: !firewallEnabled,
    },
    {
      id: 2,
      name: 'Layer 2: Semantic Guard',
      desc: `Threat Score: ${(threatScore * 100).toFixed(0)}% (${threatScore.toFixed(2)})`,
      latency: `${l2Ms.toFixed(1)} ms`,
      icon: Search,
      status: !firewallEnabled
        ? 'UNCHECKED'
        : threatScore >= 0.75
        ? 'CRITICAL THREAT'
        : threatScore >= 0.40
        ? 'SUSPICIOUS INTENT'
        : 'BENIGN INPUT',
      isWarning: firewallEnabled && threatScore >= 0.40,
      isBypass: !firewallEnabled,
    },
    {
      id: 3,
      name: 'Spotlighting Boundary',
      desc: 'Cryptographic Nonce & Isolation Tag',
      latency: '< 0.5 ms',
      icon: Lock,
      status: !firewallEnabled ? 'RAW INGESTION' : 'ISOLATED (<sentinel_XXXX>)',
      isWarning: false,
      isBypass: !firewallEnabled,
    },
    {
      id: 4,
      name: 'Layer 3: Egress & Tool Gate',
      desc: 'Pixel Blocker, Key Redactor & HITL',
      latency: `${l3Ms.toFixed(1)} ms`,
      icon: ShieldCheck,
      status: !firewallEnabled
        ? 'EXFILTRATION OPEN'
        : audit?.egress_actions?.blocked_urls?.length || audit?.egress_actions?.quarantined_tool_calls?.length
        ? 'EXFILTRATION BLOCKED'
        : 'EGRESS SECURED',
      isWarning: firewallEnabled && ((audit?.egress_actions?.blocked_urls?.length ?? 0) > 0 || (audit?.egress_actions?.quarantined_tool_calls?.length ?? 0) > 0),
      isBypass: !firewallEnabled,
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <h2 className="text-sm font-semibold font-mono tracking-wide text-slate-200 uppercase">
            3-Layer Defense Pipeline Inspection
          </h2>
        </div>

        {/* Verdict Badge */}
        {audit && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Verdict:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                verdict === 'EXPLOITED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 glow-rose'
                  : verdict === 'MITIGATED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-emerald'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {verdict === 'EXPLOITED' && '⚠ EXPLOIT EXECUTED (UNSHIELDED)'}
              {verdict === 'MITIGATED' && '✓ THREAT MITIGATED (PROTECTED)'}
              {verdict === 'CLEAN' && '✓ VERIFIED BENIGN'}
            </span>
          </div>
        )}
      </div>

      {/* Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className={`relative p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                stage.isBypass
                  ? 'bg-rose-950/20 border-rose-900/40 text-slate-300'
                  : stage.isWarning
                  ? 'bg-amber-950/20 border-amber-600/40 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
              } ${isRunning ? 'animate-pulse' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono flex items-center justify-center font-bold text-slate-300">
                      {stage.id}
                    </span>
                    <Icon className={`w-4 h-4 ${
                      stage.isBypass ? 'text-rose-400' : stage.isWarning ? 'text-amber-400' : 'text-emerald-400'
                    }`} />
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
                    {stage.latency}
                  </span>
                </div>

                <div className="font-semibold text-xs text-white mb-0.5">
                  {stage.name}
                </div>
                <div className="text-[11px] text-slate-400 mb-2 leading-tight">
                  {stage.desc}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">State:</span>
                <span className={`font-bold ${
                  stage.isBypass ? 'text-rose-400' : stage.isWarning ? 'text-amber-300' : 'text-emerald-400'
                }`}>
                  {stage.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
