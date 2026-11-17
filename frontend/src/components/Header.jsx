import React from 'react';
import { Sparkles, Sun, Moon, History, Code2, Terminal } from 'lucide-react';

export default function Header({ currentTab, setCurrentTab, darkMode, setDarkMode, historyCount = 0 }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/80 border-b border-slate-800/80 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('analyzer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                AI Code Explanation Assistant
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI-03
              </span>
            </div>
            <p className="text-xs text-slate-400 light:text-slate-500 font-medium">
              Understand. Fix. Improve. Learn.
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-3">
          <nav className="flex items-center p-1 rounded-xl bg-slate-900/90 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-medium">
            <button
              onClick={() => setCurrentTab('analyzer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'analyzer'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Analyzer</span>
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                currentTab === 'history'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-slate-400 hover:text-amber-400 dark:hover:text-amber-300 light:hover:text-slate-900 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
