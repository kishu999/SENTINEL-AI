import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Zap, AlertTriangle, RefreshCw, Trash2, Cpu } from 'lucide-react';
import { SentinelAudit } from '../types';

interface TopCommandBarProps {
  firewallEnabled: boolean;
  onToggleFirewall: () => void;
  mode: 'heal' | 'block';
  onChangeMode: (mode: 'heal' | 'block') => void;
  audit: SentinelAudit | null;
  sinkCount: number;
  onClearSink: () => void;
  isRunning: boolean;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  firewallEnabled,
  onToggleFirewall,
  mode,
  onChangeMode,
  audit,
  sinkCount,
  onClearSink,
  isRunning,
}) => {
  const isTainted = audit?.taint_state?.is_tainted ?? false;
  const overheadMs = audit?.latency_ms?.total_overhead_ms ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5">
      <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Proxy Indicator */}
        <div className="flex items-center gap-3.5">
          <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
            firewallEnabled 
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 glow-emerald' 
              : 'bg-rose-500/10 border-rose-500/40 text-rose-400 glow-rose'
          }`}>
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                SENTINEL<span className="text-emerald-400">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                v1.0 Drop-In Firewall
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Proxy Active:</span>
              <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                http://localhost:8000/v1
              </code>
            </div>
          </div>
        </div>

        {/* Master Firewall Switch & Policy Selector */}
        <div className="flex items-center gap-3">
          {/* Master Toggle */}
          <button
            onClick={onToggleFirewall}
            disabled={isRunning}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-mono text-sm font-semibold transition-all duration-300 shadow-lg cursor-pointer ${
              firewallEnabled
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50 border border-emerald-400/40 glow-emerald'
                : 'bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white shadow-rose-950/50 border border-rose-500/50 glow-rose'
            }`}
          >
            {firewallEnabled ? (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
                <span>SENTINEL AI: ON (PROTECTED)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-200 animate-bounce" />
                <span>SENTINEL AI: OFF (VULNERABLE)</span>
              </>
            )}
          </button>

          {/* Policy Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => onChangeMode('heal')}
              className={`px-3 py-1.5 rounded transition-colors ${
                mode === 'heal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sanitize & Heal
            </button>
            <button
              onClick={() => onChangeMode('block')}
              className={`px-3 py-1.5 rounded transition-colors ${
                mode === 'block'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Strict Block (403)
            </button>
          </div>
        </div>

        {/* Live Metrics: Latency, Taint, Sink Count */}
        <div className="flex items-center gap-3">
          {/* Latency Overhead Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Overhead:</span>
            <span className="font-bold text-cyan-300">
              {overheadMs > 0 ? `${overheadMs.toFixed(1)} ms` : '< 5.0 ms'}
            </span>
          </div>

          {/* Session Taint Status */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Taint:</span>
            {isTainted ? (
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                TAINTED
              </span>
            ) : (
              <span className="font-bold text-emerald-400">CLEAN</span>
            )}
          </div>

          {/* Attacker Sink Counter */}
          <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            sinkCount > 0 
              ? 'bg-rose-950/40 border-rose-600/40 text-rose-300 animate-pulse'
              : 'bg-slate-900/90 border-slate-800 text-slate-400'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${sinkCount > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
            <span>Sink:</span>
            <span className={`font-bold ${sinkCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {sinkCount} Breaches
            </span>
            {sinkCount > 0 && (
              <button
                onClick={onClearSink}
                title="Reset Attacker Sink to 0 Breaches"
                className="ml-2 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 transition-all shadow cursor-pointer border border-rose-400"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
