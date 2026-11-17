import React from 'react';
import { GraduationCap, BrainCircuit } from 'lucide-react';

export default function DifficultySelector({ difficulty, setDifficulty }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-600 flex items-center justify-between">
        <span>Difficulty Level</span>
        <span className="text-[10px] text-indigo-400">Adaptive Depth</span>
      </label>
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900/90 light:bg-slate-100 border border-slate-800 light:border-slate-300">
        {/* Beginner */}
        <button
          type="button"
          onClick={() => setDifficulty('beginner')}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            difficulty === 'beginner'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Beginner</span>
        </button>

        {/* Intermediate */}
        <button
          type="button"
          onClick={() => setDifficulty('intermediate')}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            difficulty === 'intermediate'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Intermediate</span>
        </button>
      </div>
      <p className="text-[11px] text-slate-400 light:text-slate-500 italic mt-0.5">
        {difficulty === 'beginner'
          ? '🌱 Simple words, line-by-line breakdown & core concept explanations.'
          : '⚡ In-depth technical rationale, time/space complexity & edge cases.'}
      </p>
    </div>
  );
}
