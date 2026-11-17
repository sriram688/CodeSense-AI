import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import Prism from 'prismjs';

// Load Prism components
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

export default function CodeBlock({ code, language = 'python', title = 'Corrected Code' }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Map language string to Prism class
  const getPrismLang = (lang) => {
    const l = lang?.toLowerCase() || 'python';
    if (l === 'c++') return 'cpp';
    if (l === 'c') return 'c';
    if (l === 'javascript' || l === 'js') return 'javascript';
    if (l === 'html') return 'markup';
    if (l === 'css') return 'css';
    if (l === 'sql') return 'sql';
    if (l === 'java') return 'java';
    return 'python';
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl my-2">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-[11px] text-slate-300 font-semibold">{title}</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {language}
          </span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer border border-slate-700"
          title="Copy Code to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-300" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <div className="overflow-x-auto p-3 text-xs sm:text-sm font-mono leading-relaxed">
        <pre className={`language-${getPrismLang(language)} !bg-transparent !p-0 !m-0`}>
          <code className={`language-${getPrismLang(language)}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
