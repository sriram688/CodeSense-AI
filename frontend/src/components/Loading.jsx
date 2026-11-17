import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, CheckCircle2 } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Parsing tokens & language grammar...',
  'Checking abstract syntax tree (AST)...',
  'Diagnosing runtime & logical edge cases...',
  'Adapting explanation for selected difficulty...',
  'Synthesizing corrected code and best practices...'
];

export default function Loading({ difficulty = 'beginner', language = 'Python' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl glass-panel p-8 text-center border border-indigo-500/30 my-6 shadow-2xl relative overflow-hidden animate-glow">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/15 to-purple-600/10 pointer-events-none blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        {/* Pulsing Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] animate-spin-slow">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-500/50">
            <Sparkles className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
          Analyzing {language} Code
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Formulating <span className="capitalize font-semibold text-indigo-400">{difficulty}</span> level insights...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 my-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Steps List */}
        <div className="w-full space-y-2 text-left">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-2 text-xs transition-opacity duration-300 ${
                  isCurrent
                    ? 'text-indigo-300 font-semibold opacity-100'
                    : isDone
                    ? 'text-slate-500 opacity-80'
                    : 'text-slate-600 opacity-40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"></div>
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
