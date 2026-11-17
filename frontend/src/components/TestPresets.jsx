import React from 'react';
import { PlayCircle, Bookmark } from 'lucide-react';

export const PRESET_TEST_CASES = [
  {
    id: 'test-1',
    title: 'Test 1: Python Syntax Error',
    badge: 'Syntax Error',
    language: 'Python',
    difficulty: 'beginner',
    analysisType: 'explain-fix',
    code: 'print("Hello"',
    description: 'Missing closing parenthesis in print statement'
  },
  {
    id: 'test-2',
    title: 'Test 2: Python NameError',
    badge: 'Runtime Error',
    language: 'Python',
    difficulty: 'beginner',
    analysisType: 'explain-error',
    code: 'print(x)',
    description: 'Using undefined variable x'
  },
  {
    id: 'test-3',
    title: 'Test 3: Correct Python Code',
    badge: 'Valid Code',
    language: 'Python',
    difficulty: 'beginner',
    analysisType: 'explain-code',
    code: 'name = "Sri"\nprint(name)',
    description: 'Valid assignment and print statement'
  },
  {
    id: 'test-4',
    title: 'Test 4: JavaScript Error',
    badge: 'Scope Error',
    language: 'JavaScript',
    difficulty: 'intermediate',
    analysisType: 'explain-fix',
    code: 'console.log(name);',
    description: 'Accessing undeclared/scoped identifier'
  },
  {
    id: 'test-5',
    title: 'Test 5: C++ Syntax Error',
    badge: 'Syntax Error',
    language: 'C++',
    difficulty: 'beginner',
    analysisType: 'fix-code',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello"
    return 0;
}`,
    description: 'Missing semicolon statement terminator'
  },
  {
    id: 'test-6',
    title: 'Test 6: Difficulty Comparison',
    badge: 'Adaptive Depth',
    language: 'Python',
    difficulty: 'intermediate',
    analysisType: 'explain-code',
    code: 'print("Hello"',
    description: 'Intermediate technical AST / token depth'
  },
  {
    id: 'test-7',
    title: 'Test 7: Optimization',
    badge: 'Optimization',
    language: 'Python',
    difficulty: 'intermediate',
    analysisType: 'optimize-code',
    code: `numbers = [10, 20, 30]
for i in range(len(numbers)):
    print(numbers[i])`,
    description: 'Refactor index range loop to direct iteration'
  },
  {
    id: 'test-8',
    title: 'Test 8: Logical Error',
    badge: 'Logic Bug',
    language: 'Python',
    difficulty: 'beginner',
    analysisType: 'explain-fix',
    code: `a = 10
b = 20

if a > b:
    print("a is smaller")`,
    description: 'Condition (a > b) contradicts string message'
  }
];

export default function TestPresets({ onSelectPreset }) {
  return (
    <div className="p-3 rounded-2xl glass-card border border-indigo-500/20 bg-slate-900/60 light:bg-indigo-50/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Quick Test Presets (Tests 1 — 8)</span>
        </div>
        <span className="text-[10px] text-slate-400">Click to load instantly</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESET_TEST_CASES.map((preset, index) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="flex flex-col items-start p-2 rounded-xl bg-slate-950/60 light:bg-white hover:bg-indigo-950/40 light:hover:bg-indigo-100/60 border border-slate-800/80 light:border-indigo-100 hover:border-indigo-500/40 transition-all text-left group"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-mono font-semibold text-slate-400 group-hover:text-indigo-400">
                #{index + 1} {preset.language}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {preset.badge}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-200 light:text-slate-800 mt-1 line-clamp-1 group-hover:text-indigo-200">
              {preset.title.replace(/^Test \d+: /, '')}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
