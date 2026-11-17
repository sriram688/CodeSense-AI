import React from 'react';
import { HelpCircle, AlertTriangle, Wrench, Zap, Wand2 } from 'lucide-react';

export const ANALYSIS_TYPES = [
  { id: 'explain-code', label: 'Explain Code', desc: 'Step-by-step breakdown & walkthrough', icon: HelpCircle },
  { id: 'explain-error', label: 'Explain Error', desc: 'Trace cause of error message & symptoms', icon: AlertTriangle },
  { id: 'fix-code', label: 'Fix Code', desc: 'Repair bugs & syntax issues directly', icon: Wrench },
  { id: 'optimize-code', label: 'Optimize Code', desc: 'Improve performance & idiomatic patterns', icon: Zap },
  { id: 'explain-fix', label: 'Explain + Fix', desc: 'Full diagnostic, fix, and lesson', icon: Wand2 },
];

export default function AnalysisTypeSelector({ analysisType, setAnalysisType }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-600 flex items-center justify-between">
        <span>Analysis Type</span>
        <span className="text-[10px] text-indigo-400">Action Mode</span>
      </label>
      <div className="relative">
        <select
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value)}
          className="w-full appearance-none rounded-xl bg-slate-900/90 light:bg-white border border-slate-800 light:border-slate-300 px-3.5 py-2.5 text-sm text-slate-100 light:text-slate-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
        >
          {ANALYSIS_TYPES.map((type) => (
            <option key={type.id} value={type.id} className="bg-slate-900 text-slate-100">
              {type.label} — {type.desc}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
