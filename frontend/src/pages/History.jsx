import React, { useState, useEffect } from 'react';
import { fetchHistory, deleteAnalysis } from '../services/api';
import ResultCard from '../components/ResultCard';
import CodeBlock from '../components/CodeBlock';
import {
  History as HistoryIcon,
  Trash2,
  ExternalLink,
  Code2,
  Calendar,
  AlertCircle,
  Filter,
  RefreshCw,
  Search,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle,
  BookOpen,
  Terminal,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function History({ onLoadIntoEditor }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filters
  const [languageFilter, setLanguageFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await fetchHistory();
      setHistory(records);
      if (records.length > 0 && !selectedRecord) {
        setSelectedRecord(records[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve analysis history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteAnalysis(id);
      const updated = history.filter((item) => (item._id || item.id) !== id);
      setHistory(updated);
      if (selectedRecord && (selectedRecord._id || selectedRecord.id) === id) {
        setSelectedRecord(updated[0] || null);
      }
    } catch (err) {
      alert('Failed to delete history record: ' + err.message);
    }
  };

  // Filtered records
  const filteredHistory = history.filter((item) => {
    const matchesLang =
      languageFilter === 'all' || item.language?.toLowerCase() === languageFilter.toLowerCase();
    const matchesDiff =
      difficultyFilter === 'all' || item.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.original_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.identified_issue?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesDiff && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Analysis History</h2>
            <p className="text-xs text-slate-400">
              Browse, review, and reload previous code analyses and diagnostics.
            </p>
          </div>
        </div>

        <button
          onClick={loadHistory}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl glass-panel p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search code or issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Languages</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="c++">C++</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
          </select>
        </div>
      </div>

      {/* Main Grid: List on Left, Detail on Right */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
          Loading previous analyses...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="rounded-2xl glass-panel p-12 text-center border border-slate-800 space-y-3">
          <Code2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No analyses found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {history.length === 0
              ? 'You have not analyzed any code snippets yet. Head to the Analyzer tab to begin!'
              : 'No records matched the selected filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* History Records List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredHistory.map((item) => {
              const id = item._id || item.id;
              const isSelected = selectedRecord && (selectedRecord._id || selectedRecord.id) === id;
              const date = item.created_at ? new Date(item.created_at) : null;

              return (
                <div
                  key={id}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                      : 'glass-card border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-200">{item.language}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {item.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">
                        {item.analysis_type}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(id, e)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-300 line-clamp-1 mb-1">
                    {item.identified_issue || item.result?.identified_issue || 'Analysis Record'}
                  </p>

                  <div className="rounded bg-black/40 p-2 font-mono text-[11px] text-slate-400 line-clamp-2 mb-2">
                    {item.original_code}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                    </span>
                    <span className="text-indigo-400 flex items-center space-x-0.5">
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Preview on Right */}
          <div className="lg:col-span-7">
            {selectedRecord ? (
              <div className="space-y-4">
                {/* Header Action Card */}
                <div className="rounded-2xl glass-panel p-4 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">
                      Analysis Record Detail
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {selectedRecord.language} • {selectedRecord.difficulty} • {selectedRecord.analysis_type}
                    </p>
                  </div>

                  <button
                    onClick={() => onLoadIntoEditor(selectedRecord)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Load in Analyzer</span>
                  </button>
                </div>

                {/* Original Code */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase font-mono">
                    Original Submitted Code
                  </div>
                  <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-40">
                    {selectedRecord.original_code}
                  </pre>
                </div>

                {/* Display Full Cards if Result object exists */}
                {selectedRecord.result && (
                  <div className="space-y-3">
                    <ResultCard
                      title="Summary"
                      icon={Info}
                      badge="Summary"
                      badgeColor="blue"
                      copyableContent={selectedRecord.result.summary}
                    >
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {selectedRecord.result.summary}
                      </p>
                    </ResultCard>

                    <ResultCard
                      title="Identified Issue"
                      icon={AlertCircle}
                      badge="Issue"
                      badgeColor="rose"
                      copyableContent={selectedRecord.result.identified_issue}
                    >
                      <p className="text-xs sm:text-sm text-rose-300 font-medium">
                        {selectedRecord.result.identified_issue}
                      </p>
                    </ResultCard>

                    {selectedRecord.result.corrected_code && (
                      <ResultCard
                        title="Corrected Code"
                        icon={Terminal}
                        badge="Solution"
                        badgeColor="indigo"
                      >
                        <CodeBlock
                          code={selectedRecord.result.corrected_code}
                          language={selectedRecord.language}
                        />
                      </ResultCard>
                    )}

                    {selectedRecord.result.example_output && (
                      <ResultCard
                        title="Example Output"
                        icon={Terminal}
                        badge="Output"
                        badgeColor="purple"
                      >
                        <pre className="rounded bg-black/60 p-2 text-xs font-mono text-emerald-400">
                          {selectedRecord.result.example_output}
                        </pre>
                      </ResultCard>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl glass-panel p-12 text-center text-slate-500 text-xs">
                Select an analysis from the list to preview details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
