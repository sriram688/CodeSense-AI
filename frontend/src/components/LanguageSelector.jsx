import React from 'react';

export const LANGUAGES = [
  { id: 'Python', label: 'Python', icon: '🐍', tag: 'py' },
  { id: 'JavaScript', label: 'JavaScript', icon: '🟨', tag: 'js' },
  { id: 'Java', label: 'Java', icon: '☕', tag: 'java' },
  { id: 'C++', label: 'C++', icon: '⚡', tag: 'cpp' },
  { id: 'C', label: 'C', icon: '🔧', tag: 'c' },
  { id: 'HTML', label: 'HTML', icon: '🌐', tag: 'html' },
  { id: 'CSS', label: 'CSS', icon: '🎨', tag: 'css' },
  { id: 'SQL', label: 'SQL', icon: '🗄️', tag: 'sql' },
];

export default function LanguageSelector({ selectedLanguage, onSelectLanguage }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-600 flex items-center justify-between">
        <span>Programming Language</span>
        <span className="text-[10px] text-indigo-400 font-mono">8 Supported</span>
      </label>
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onSelectLanguage(e.target.value)}
          className="w-full appearance-none rounded-xl bg-slate-900/90 light:bg-white border border-slate-800 light:border-slate-300 px-3.5 py-2.5 text-sm text-slate-100 light:text-slate-900 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-100">
              {lang.icon} {lang.label}
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
