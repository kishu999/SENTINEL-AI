import React from 'react';
import { Terminal, ShieldAlert, Trash2, Radio, CheckCircle, Skull, AlertCircle } from 'lucide-react';
import { AttackerSinkEvent } from '../types';

interface AttackerSinkMonitorProps {
  events: AttackerSinkEvent[];
  onClear: () => void;
  firewallEnabled: boolean;
}

export const AttackerSinkMonitor: React.FC<AttackerSinkMonitorProps> = ({
  events,
  onClear,
  firewallEnabled,
}) => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <Terminal className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-slate-200">
              Live Attacker Webhook Sink
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              localhost:8000/v1/attacker-sink
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Radio className="w-3 h-3 text-rose-400 animate-ping" />
            <span>Listening</span>
          </div>

          <button
            onClick={onClear}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              events.length > 0
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950 border border-rose-400 glow-rose'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Clear all breach logs from attacker sink"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{events.length > 0 ? `Reset Sink (${events.length} Breaches)` : 'Reset Sink'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="h-[220px] overflow-y-auto rounded-xl bg-black/90 p-3 border border-slate-900 text-xs text-slate-300 flex flex-col gap-2 terminal-scanlines selection:bg-rose-900 selection:text-white">
        <div className="text-slate-500 text-[11px]">
          [c2-listener-daemon v4.9.1] Awaiting incoming beacon callbacks & exfiltration pixels...
        </div>

        {events.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center gap-2 text-center text-slate-500">
            <CheckCircle className="w-6 h-6 text-emerald-500/60" />
            <div className="text-xs font-semibold text-emerald-400/80">
              {firewallEnabled
                ? 'SENTINEL SHIELD ACTIVE — 0 bytes leaked'
                : 'No exfiltrated tokens captured yet.'}
            </div>
            <div className="text-[11px] max-w-sm text-slate-600">
              {firewallEnabled
                ? 'Layer 1 DOM scrubbing and Layer 3 Egress Firewall prevent all unauthorized outbound pixel and tool exfiltrations.'
                : 'Click "Run Exploit Test (Sentinel OFF)" to witness the unshielded breach arriving in real time.'}
            </div>
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/60 flex flex-col gap-1 text-[11px] glow-rose animate-fadeIn"
            >
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Skull className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>BREACH EVENT INTERCEPTED ({ev.method})</span>
                </span>
                <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
              </div>

              {ev.extracted_leak && (
                <div className="flex items-center gap-2 bg-black/80 px-2.5 py-1.5 rounded border border-rose-800/80 text-rose-200">
                  <span className="text-rose-400 font-bold">EXFILTRATED DATA:</span>
                  <code className="text-amber-300 font-bold font-mono tracking-wider">
                    {ev.extracted_leak}
                  </code>
                </div>
              )}

              {Object.keys(ev.query_params).length > 0 && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Params:</span>
                  <code className="text-slate-300">{JSON.stringify(ev.query_params)}</code>
                </div>
              )}

              {ev.body && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Payload:</span>
                  <code className="text-slate-300">{ev.body}</code>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
