import React from 'react';
import { Globe, FileText, Mail, ShieldCheck, Download, Upload, Sparkles, AlertTriangle } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  activeScenarioId: string;
  onSelectScenario: (scenario: Scenario) => void;
  onTestTrojanPdf: () => void;
  onUploadPdf: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingPdf: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onTestTrojanPdf,
  onUploadPdf,
  isLoadingPdf,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'html':
        return Globe;
      case 'pdf':
        return FileText;
      case 'email':
        return Mail;
      default:
        return ShieldCheck;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold font-mono tracking-wide text-slate-200 uppercase">
            Interactive Exploit Scenarios
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          1-Click Demos
        </span>
      </div>

      {/* Scenario Cards */}
      <div className="flex flex-col gap-2.5">
        {scenarios.map((sc) => {
          const Icon = getIcon(sc.input_type);
          const isActive = sc.id === activeScenarioId;

          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 text-left ${
                isActive
                  ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md shadow-emerald-950/30 glow-emerald'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-white">
                    {sc.title.split('—')[0]}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                    sc.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : sc.severity === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {sc.severity}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {sc.description}
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <span className="text-slate-400 font-medium">Vector:</span>
                <span className="text-slate-300 truncate max-w-[240px]">
                  {sc.threat_vector}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Trojan PDF Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>PyMuPDF Trojan Lab</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">1.0pt White Ink</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={onTestTrojanPdf}
            disabled={isLoadingPdf}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-500/40 text-cyan-200 rounded-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isLoadingPdf ? 'Scanning...' : 'Test Trojan PDF'}</span>
          </button>

          <a
            href="http://localhost:8000/v1/download/trojan-pdf"
            download="Alex_Mercer_Trojan_Resume.pdf"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Download PDF</span>
          </a>
        </div>

        {/* Upload Custom PDF */}
        <label className="flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-mono cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Custom PDF to Inspect</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={onUploadPdf}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
