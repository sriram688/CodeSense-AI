import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import History from './pages/History';
import { fetchHistory } from './services/api';
import { Sparkles, Terminal, Code2, Shield, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('analyzer');
  const [darkMode, setDarkMode] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Refresh history count
  const refreshHistoryCount = async () => {
    try {
      const records = await fetchHistory({ limit: 100 });
      setHistoryCount(records.length);
    } catch {
      // Ignore background count failure
    }
  };

  useEffect(() => {
    refreshHistoryCount();
  }, []);

  const handleLoadIntoEditor = (record) => {
    setCurrentTab('analyzer');
    // Pre-populate via a custom event or session state
    window.sessionStorage.setItem('loaded_record', JSON.stringify(record));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white transition-colors">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        historyCount={historyCount}
      />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {currentTab === 'analyzer' ? (
          <Home onAnalysisCompleted={refreshHistoryCount} />
        ) : (
          <History onLoadIntoEditor={handleLoadIntoEditor} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">AI-03</span>
            <span>•</span>
            <span>AI Code Explanation Assistant</span>
            <span>•</span>
            <span>Structured Educational Diagnostics</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Supported: Python • JavaScript • C • C++ • Java • SQL • HTML • CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
