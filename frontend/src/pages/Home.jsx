import React, { useState, useEffect } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import DifficultySelector from '../components/DifficultySelector';
import AnalysisTypeSelector from '../components/AnalysisTypeSelector';
import TestPresets from '../components/TestPresets';
import CodeEditor from '../components/CodeEditor';
import ResultCard from '../components/ResultCard';
import CodeBlock from '../components/CodeBlock';
import Loading from '../components/Loading';
import { analyzeCode } from '../services/api';
import {
  Sparkles,
  Info,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Terminal,
  BookOpen,
  ShieldCheck,
  Activity,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export default function Home({ onAnalysisCompleted }) {
  // Input states
  const [language, setLanguage] = useState('Python');
  const [difficulty, setDifficulty] = useState('beginner');
  const [analysisType, setAnalysisType] = useState('explain-fix');
  const [code, setCode] = useState('');

  // Execution states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState(null);

  // Restore session record if clicked from History
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem('loaded_record');
      if (stored) {
        const item = JSON.parse(stored);
        if (item.language) setLanguage(item.language);
        if (item.difficulty) setDifficulty(item.difficulty);
        if (item.analysis_type) setAnalysisType(item.analysis_type);
        if (item.original_code) setCode(item.original_code);
        if (item.result) setResult(item.result);
        window.sessionStorage.removeItem('loaded_record');
      }
    } catch (e) {
      console.warn('Failed to parse loaded_record:', e);
    }
  }, []);

  // Handle Preset selection
  const handleSelectPreset = (preset) => {
    setLanguage(preset.language);
    setDifficulty(preset.difficulty);
    setAnalysisType(preset.analysisType);
    setCode(preset.code);
    setError(null);
  };

  // Submit analysis
  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter source code or an error message to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeCode({
        language,
        difficulty,
        analysisType,
        code
      });

      if (response.success && response.result) {
        setResult(response.result);
        setLastAnalyzedTime(new Date());
        if (onAnalysisCompleted) {
          onAnalysisCompleted();
        }
        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        throw new Error(response.error || 'Invalid response from analysis service');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while analyzing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear inputs
  const handleClear = () => {
    setCode('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
          <span>Educational Code Reasoning & Error Diagnosis Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white light:text-slate-900">
          Understand unfamiliar code <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            and fix bugs with confidence.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 light:text-slate-600">
          Tailored explanations for beginner and intermediate programmers. Powered by AI with structured educational breakdowns.
        </p>
      </div>

      {/* 1-Click Test Presets */}
      <TestPresets onSelectPreset={handleSelectPreset} />

      {/* Main Input Workbench */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800/80 shadow-2xl relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <LanguageSelector selectedLanguage={language} onSelectLanguage={setLanguage} />
          <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
          <AnalysisTypeSelector analysisType={analysisType} setAnalysisType={setAnalysisType} />
        </div>

        {/* Code Editor */}
        <CodeEditor
          code={code}
          setCode={setCode}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onClear={handleClear}
        />

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start space-x-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-rose-200/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
            <span>Target: <strong className="text-slate-200">{language}</strong> • Level: <strong className="text-slate-200 capitalize">{difficulty}</strong></span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {result && (
              <button
                type="button"
                onClick={handleClear}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !code.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2.5 cursor-pointer ring-1 ring-white/20"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{isLoading ? 'Analyzing Input...' : 'Analyze Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Screen */}
      {isLoading && <Loading difficulty={difficulty} language={language} />}

      {/* Results Section */}
      {result && !isLoading && (
        <div id="analysis-results" className="space-y-6 pt-4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>Analysis Results</span>
                <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Structured pedagogical breakdown for {language} • {difficulty} level
              </p>
            </div>
            {lastAnalyzedTime && (
              <span className="text-xs text-slate-500 mt-2 sm:mt-0 font-mono">
                Analyzed at {lastAnalyzedTime.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: CODE / ERROR SUMMARY */}
            <ResultCard
              title="Card 1: Code / Error Summary"
              icon={Info}
              badge="Overview"
              badgeColor="blue"
              copyableContent={result.summary}
              className="md:col-span-2"
            >
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {result.summary}
              </p>
            </ResultCard>

            {/* CARD 2: IDENTIFIED ISSUE */}
            <ResultCard
              title="Card 2: Identified Issue"
              icon={AlertCircle}
              badge="Diagnosis"
              badgeColor="rose"
              copyableContent={result.identified_issue}
            >
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-semibold flex items-start space-x-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{result.identified_issue}</span>
              </div>
            </ResultCard>

            {/* CARD 3: WHY THIS HAPPENS */}
            <ResultCard
              title="Card 3: Why This Happens"
              icon={HelpCircle}
              badge="Root Cause"
              badgeColor="amber"
              copyableContent={result.why_it_happens}
            >
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.why_it_happens || 'No issues triggered.'}
              </p>
            </ResultCard>

            {/* CARD 4: SUGGESTED SOLUTION */}
            <ResultCard
              title="Card 4: Suggested Solution"
              icon={CheckCircle}
              badge="Remedy"
              badgeColor="emerald"
              copyableContent={result.suggested_solution}
              className="md:col-span-2"
            >
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium leading-relaxed">
                {result.suggested_solution}
              </div>
            </ResultCard>

            {/* CARD 5: CORRECTED CODE */}
            <ResultCard
              title="Card 5: Corrected Code"
              icon={Terminal}
              badge="Solution Code"
              badgeColor="indigo"
              className="md:col-span-2"
            >
              <CodeBlock
                code={result.corrected_code || code}
                language={language}
                title="Corrected Source Code"
              />
            </ResultCard>

            {/* CARD 6: EXAMPLE OUTPUT */}
            <ResultCard
              title="Card 6: Example Output"
              icon={Terminal}
              badge="Standard Output"
              badgeColor="purple"
              copyableContent={result.example_output}
            >
              <div className="rounded-xl bg-black/60 border border-slate-800 p-3.5 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {result.example_output ? (
                  result.example_output
                ) : (
                  <span className="text-slate-500 italic">No direct console output produced.</span>
                )}
              </div>
            </ResultCard>

            {/* CARD 9: COMPLEXITY (Only shown when available/applicable) */}
            {result.complexity ? (
              <ResultCard
                title="Card 9: Complexity Analysis"
                icon={Activity}
                badge="Performance"
                badgeColor="blue"
                copyableContent={result.complexity}
              >
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-mono font-medium">
                  {result.complexity}
                </div>
              </ResultCard>
            ) : null}

            {/* CARD 7: EXPLANATION (Difficulty-tuned line-by-line / breakdown) */}
            <ResultCard
              title={`Card 7: Explanation (${difficulty.toUpperCase()})`}
              icon={BookOpen}
              badge={difficulty}
              badgeColor={difficulty === 'beginner' ? 'emerald' : 'purple'}
              className="md:col-span-2"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs text-indigo-300 font-semibold mb-2">
                  <span>Educational Deep-Dive ({difficulty} level):</span>
                </div>
                {result.line_by_line_explanation && result.line_by_line_explanation.length > 0 ? (
                  <ul className="space-y-2.5">
                    {result.line_by_line_explanation.map((line, idx) => (
                      <li
                        key={idx}
                        className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-300">{result.summary}</p>
                )}
              </div>
            </ResultCard>

            {/* CARD 8: BEST PRACTICES */}
            <ResultCard
              title="Card 8: Best Practices & Guidelines"
              icon={ShieldCheck}
              badge="Guidelines"
              badgeColor="emerald"
              className="md:col-span-2"
            >
              {result.best_practices && result.best_practices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.best_practices.map((practice, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5 leading-relaxed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Standard clean coding conventions apply.</p>
              )}
            </ResultCard>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Back to Top / Analyze Another</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
