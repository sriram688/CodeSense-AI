import React, { useRef } from 'react';
import { Trash2, Clipboard, Terminal, Sparkles } from 'lucide-react';

export default function CodeEditor({ code, setCode, onAnalyze, isLoading, onClear }) {
  const textareaRef = useRef(null);

  // Compute line numbers
  const lines = code ? code.split('\n') : [''];
  const lineCount = lines.length;

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && code.trim()) {
        onAnalyze();
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-600 flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Code or Error Input</span>
        </label>

        <div className="flex items-center space-x-2">
          {/* Paste button */}
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900 rounded-lg hover:bg-slate-800 light:hover:bg-slate-200 transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3 h-3" />
            <span>Paste</span>
          </button>

          {/* Clear button */}
          <button
            type="button"
            onClick={onClear}
            disabled={!code}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 disabled:opacity-30 disabled:hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
            title="Clear input"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="relative rounded-2xl border border-slate-800 light:border-slate-300 bg-slate-950/90 light:bg-slate-900 shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-400 font-sans text-[11px]">editor.source</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
            <span>•</span>
            <span>{code.length} chars</span>
          </div>
        </div>

        {/* Textarea + Line Numbers */}
        <div className="flex min-h-[260px] max-h-[460px] overflow-auto">
          {/* Line Numbers Column */}
          <div className="select-none py-3 px-3 text-right font-mono text-xs text-slate-600 bg-slate-950/40 border-r border-slate-800/60 min-w-[42px]">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your code or error message here...&#10;&#10;Examples:&#10;• print(&quot;Hello&quot;&#10;• NameError: name 'x' is not defined&#10;• cout << &quot;Hello&quot;"
            className="w-full h-full min-h-[260px] p-3 bg-transparent text-slate-100 placeholder-slate-600 font-mono text-xs sm:text-sm leading-6 resize-y focus:outline-none selection:bg-indigo-500/40"
            spellCheck="false"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>

        {/* Bottom Hint */}
        <div className="px-4 py-1.5 border-t border-slate-800/60 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Ctrl+Enter</kbd> to analyze</span>
          {code.trim().length > 0 && (
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              <span>Ready for analysis</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
