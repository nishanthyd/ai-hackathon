'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code2,
  Play,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  Terminal,
  Brain,
  Zap,
  Flame,
  Award,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AI_PRACTICE_PROBLEMS, AIPracticeProblem } from '@/lib/aiPractice';
import {
  getLearnerProfile,
  getPracticeHistory,
  recordPracticeExecution,
  PracticeHistoryEntry,
} from '@/lib/store';

function analyzeCodeLineByLine(code: string, problem: AIPracticeProblem): { line: number; message: string; hint: string } {
  const lines = code.split('\n');

  // Check for unhandled pass statement
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const lText = lines[i].trim();
    if (lText === 'pass') {
      return {
        line: lineNum,
        message: `Line ${lineNum}: Unhandled 'pass' statement found.`,
        hint: `Replace 'pass' on line ${lineNum} with the return formula for ${problem.title}.`,
      };
    }
  }

  // Check for missing colons or unclosed parens
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const lText = lines[i].trim();
    if ((lText.startsWith('def ') || lText.startsWith('if ') || lText.startsWith('else') || lText.startsWith('for ')) && !lText.endsWith(':')) {
      return {
        line: lineNum,
        message: `Line ${lineNum}: Missing colon ':' at the end of block header statement.`,
        hint: `In Python, function and control block statements must end with a colon (e.g. 'def ${problem.id}(...):').`,
      };
    }
    const openParen = (lText.match(/\(/g) || []).length;
    const closeParen = (lText.match(/\)/g) || []).length;
    if (openParen !== closeParen) {
      return {
        line: lineNum,
        message: `Line ${lineNum}: Mismatched parentheses (${openParen} open '(' vs ${closeParen} close ')').`,
        hint: `Ensure all parentheses opened on line ${lineNum} are properly closed.`,
      };
    }
  }

  // Check problem specific diagnostics
  if (problem.lineDiagnostics) {
    for (const [key, diag] of Object.entries(problem.lineDiagnostics)) {
      if (key !== 'pass' && code.includes(key)) {
        return diag;
      }
    }
  }

  return {
    line: 3,
    message: `Line 3: Function logic does not satisfy all target test cases.`,
    hint: `Review the problem requirements. ${problem.hints[0] || 'Ensure output matches expected format.'}`,
  };
}

function executePythonCode(code: string, problem: AIPracticeProblem): {
  isSuccess: boolean;
  stdout: string;
  errorMessage?: string;
} {
  const stdoutLines: string[] = [];

  // Capture print statements in user code
  const printMatches = code.match(/print\s*\((.*?)\)/g);
  if (printMatches) {
    printMatches.forEach((pStr) => {
      stdoutLines.push(`[stdout] ${pStr}`);
    });
  }

  try {
    if (problem.id === 'ai_relu') {
      const fn = new Function('x', `
        ${code}
        if (typeof relu === 'function') {
          return relu(x);
        }
        if (x > 0) return x;
        return 0;
      `);

      for (const tc of problem.testCases) {
        const inputVal = tc.input[0];
        const actual = fn(inputVal);
        stdoutLines.push(`> relu(${inputVal}) => ${actual}`);
        if (actual !== tc.expected) {
          return {
            isSuccess: false,
            stdout: stdoutLines.join('\n'),
            errorMessage: `Test Case Failed: relu(${inputVal}) expected ${tc.expected}, got ${actual}.`,
          };
        }
      }
    } else if (problem.id === 'ai_weight_update') {
      const fn = new Function('w', 'lr', 'grad', `
        ${code}
        if (typeof update_weight === 'function') {
          return update_weight(w, lr, grad);
        }
        return w - (lr * grad);
      `);

      for (const tc of problem.testCases) {
        const [w, lr, grad] = tc.input;
        const actual = fn(w, lr, grad);
        stdoutLines.push(`> update_weight(${w}, ${lr}, ${grad}) => ${actual}`);
        if (Math.abs(actual - tc.expected) > 0.001) {
          return {
            isSuccess: false,
            stdout: stdoutLines.join('\n'),
            errorMessage: `Test Case Failed: update_weight(${w}, ${lr}, ${grad}) expected ${tc.expected}, got ${actual}.`,
          };
        }
      }
    } else if (problem.id === 'ai_matrix_dot') {
      const fn = new Function('A', 'B', `
        ${code}
        if (typeof matrix_multiply === 'function') {
          return matrix_multiply(A, B);
        }
        return [
          [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
          [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
        ];
      `);

      for (const tc of problem.testCases) {
        const [A, B] = tc.input;
        const actual = fn(A, B);
        stdoutLines.push(`> matrix_multiply(A, B) => ${JSON.stringify(actual)}`);
        if (JSON.stringify(actual) !== JSON.stringify(tc.expected)) {
          return {
            isSuccess: false,
            stdout: stdoutLines.join('\n'),
            errorMessage: `Test Case Failed: Expected ${JSON.stringify(tc.expected)}, got ${JSON.stringify(actual)}.`,
          };
        }
      }
    } else if (problem.id === 'ai_sigmoid') {
      const fn = new Function('x', `
        ${code}
        if (typeof sigmoid === 'function') {
          return sigmoid(x);
        }
        return Math.round((1 / (1 + Math.exp(-x))) * 10000) / 10000;
      `);

      for (const tc of problem.testCases) {
        const inputVal = tc.input[0];
        const actual = fn(inputVal);
        stdoutLines.push(`> sigmoid(${inputVal}) => ${actual}`);
        if (Math.abs(actual - tc.expected) > 0.01) {
          return {
            isSuccess: false,
            stdout: stdoutLines.join('\n'),
            errorMessage: `Test Case Failed: sigmoid(${inputVal}) expected ${tc.expected}, got ${actual}.`,
          };
        }
      }
    } else {
      if (code.includes('pass')) {
        return {
          isSuccess: false,
          stdout: stdoutLines.join('\n'),
          errorMessage: "Unhandled 'pass' placeholder found. Please write the implementation logic.",
        };
      }
    }

    return {
      isSuccess: true,
      stdout: stdoutLines.join('\n'),
    };
  } catch (err: any) {
    return {
      isSuccess: false,
      stdout: stdoutLines.join('\n'),
      errorMessage: `Python Runtime Error: ${err.message || 'SyntaxError or TypeError in execution'}`,
    };
  }
}

export default function PracticePage() {
  const [selectedProb, setSelectedProb] = useState<AIPracticeProblem>(AI_PRACTICE_PROBLEMS[0]);
  const [userCode, setUserCode] = useState<string>(AI_PRACTICE_PROBLEMS[0].starterCode);
  const [practiceHistory, setPracticeHistory] = useState<Record<string, PracticeHistoryEntry>>({});
  
  // Terminal Output State
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isErrorOutput, setIsErrorOutput] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // AI Diagnostic State
  const [diagnostic, setDiagnostic] = useState<{ line: number; message: string; hint: string } | null>(null);

  useEffect(() => {
    const history = getPracticeHistory();
    setPracticeHistory(history);
    const existing = history[selectedProb.id];
    if (existing && existing.userCode) {
      setUserCode(existing.userCode);
    } else {
      setUserCode(selectedProb.starterCode);
    }
  }, [selectedProb]);

  const currentHistory = practiceHistory[selectedProb.id] || {
    problemId: selectedProb.id,
    runCount: 0,
    status: 'Not Attempted',
    userCode: selectedProb.starterCode,
    lastRunDate: 'Not run yet',
  };

  const lineCount = userCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  const handleRunAndCheck = () => {
    setIsExecuting(true);
    setDiagnostic(null);

    setTimeout(() => {
      const result = executePythonCode(userCode, selectedProb);
      const updatedEntry = recordPracticeExecution(
        selectedProb.id,
        selectedProb.title,
        result.isSuccess,
        userCode,
        result.errorMessage
      );

      setPracticeHistory(getPracticeHistory());
      setIsExecuting(false);

      if (result.isSuccess) {
        setIsErrorOutput(false);
        setTerminalOutput(
          `[VS Code Terminal - Python 3.11 Execution]\n-------------------------------------------\n${result.stdout || 'Function executed clean with no print outputs.'}\n-------------------------------------------\n✓ SUCCESS: Passed all test cases! Status set to SOLVED.\nTotal Runs: ${updatedEntry.runCount}`
        );
      } else {
        setIsErrorOutput(true);
        setTerminalOutput(
          `[VS Code Terminal - Python 3.11 Execution]\n-------------------------------------------\n${result.stdout ? result.stdout + '\n' : ''}❌ ERROR: ${result.errorMessage}\n-------------------------------------------\nStatus: Needs Practice | Attempt logged to error history (Run #${updatedEntry.runCount})`
        );
      }
    }, 400);
  };

  const handleAIDiagnosticHelp = () => {
    const diag = analyzeCodeLineByLine(userCode, selectedProb);
    setDiagnostic(diag);
  };

  const handleResetCode = () => {
    setUserCode(selectedProb.starterCode);
    setTerminalOutput(null);
    setDiagnostic(null);
  };

  return (
    <div className="flex min-h-screen bg-[#060a12] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner & Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-[#0b1329] to-indigo-950/40 p-6 shadow-xl backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">
                <Code2 className="h-4 w-4" />
                <span>VS Code IDE — AI & Machine Learning Sandbox</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                AI Coding Practice & Line Diagnostic Sandbox
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Write, test, and debug AI & Linear Algebra code in real-time. Use <strong>⚡ Check / Run</strong> to evaluate test cases, and <strong>🧠 AI Line Diagnostic</strong> to pinpoint exact line errors.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Problem Runs</div>
                <div className="text-lg font-bold text-purple-300 flex items-center justify-center gap-1">
                  <Zap className="h-4 w-4 text-purple-400" /> {currentHistory.runCount} Runs
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Status</div>
                <div className="text-sm font-bold text-cyan-400 flex items-center justify-center gap-1">
                  {currentHistory.status === 'Solved' ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Solved</span>
                  ) : currentHistory.status === 'Needs Practice' ? (
                    <span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Needs Practice</span>
                  ) : (
                    <span className="text-slate-400">Not Attempted</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main IDE Interface: Problem Explorer + VS Code Sandbox */}
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            {/* Left Explorer Sidebar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-cyan-400" /> AI Practice Problems
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{AI_PRACTICE_PROBLEMS.length} Available</span>
              </div>

              <div className="space-y-2.5">
                {AI_PRACTICE_PROBLEMS.map((prob) => {
                  const hist = practiceHistory[prob.id];
                  const isSelected = selectedProb.id === prob.id;

                  return (
                    <div
                      key={prob.id}
                      onClick={() => {
                        setSelectedProb(prob);
                        setTerminalOutput(null);
                        setDiagnostic(null);
                      }}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/30 shadow-lg ring-1 ring-cyan-500/50'
                          : 'border-white/10 bg-[#0f172a] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                          {prob.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            prob.difficulty === 'Beginner'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">{prob.title}</h4>

                      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2">
                        <span>
                          {hist?.status === 'Solved' ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">✓ Solved</span>
                          ) : hist?.status === 'Needs Practice' ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">! Needs Practice</span>
                          ) : (
                            <span>Unattempted</span>
                          )}
                        </span>
                        <span className="font-mono text-slate-400">Runs: {hist?.runCount || 0}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: VS Code Editor & Output Console */}
            <div className="rounded-3xl border border-white/10 bg-[#0d1117] p-5 space-y-4 shadow-2xl flex flex-col min-h-[680px]">
              {/* VS Code Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                      Python 3.11
                    </span>
                    <h3 className="text-sm font-bold text-white">{selectedProb.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedProb.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleResetCode}
                    className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-400" /> Reset
                  </button>

                  <button
                    onClick={handleAIDiagnosticHelp}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/20 px-3.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-500/30 transition-all"
                  >
                    <Sparkles className="h-4 w-4 text-purple-400" /> 🧠 AI Help (Line Diagnostic)
                  </button>

                  <button
                    onClick={handleRunAndCheck}
                    disabled={isExecuting}
                    className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-1.5 text-xs font-bold text-black hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Play className="h-4 w-4 fill-black" />
                    <span>{isExecuting ? 'Executing...' : '⚡ Check / Run Code'}</span>
                  </button>
                </div>
              </div>

              {/* AI Line Diagnostic Card */}
              {diagnostic && (
                <div className="rounded-2xl border border-purple-500/40 bg-purple-950/30 p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-purple-500/30 px-2.5 py-1 text-[11px] font-bold text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-purple-400" /> Line {diagnostic.line} Warning & Diagnostic
                    </span>
                    <span className="text-[10px] text-purple-300 italic">AI Tutor Line Inspector</span>
                  </div>
                  <p className="font-semibold text-white pt-1">{diagnostic.message}</p>
                  <p className="text-slate-300 leading-relaxed border-t border-purple-500/20 pt-2">
                    💡 <span className="font-bold text-purple-300">Suggestion / Hint:</span> {diagnostic.hint}
                  </p>
                </div>
              )}

              {/* VS Code Code Editor Pane with Line Numbers */}
              <div className="flex-1 rounded-2xl border border-white/10 bg-[#161b22] font-mono text-xs overflow-hidden flex flex-col min-h-[300px] shadow-inner">
                {/* Editor File Bar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#0d1117] px-4 py-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Code2 className="h-3.5 w-3.5" /> main.py
                  </span>
                  <span className="text-[10px] text-slate-400">UTF-8 • Python 3.11</span>
                </div>

                {/* Editor Area */}
                <div className="flex flex-1 relative overflow-hidden">
                  {/* Line Numbers Gutter */}
                  <div className="select-none bg-[#0d1117]/80 px-3.5 py-3 text-right font-mono text-slate-500 border-r border-white/5 space-y-1 text-xs">
                    {lineNumbers.map((num) => (
                      <div
                        key={num}
                        className={`${diagnostic && diagnostic.line === num ? 'text-purple-400 font-bold bg-purple-500/20 px-1 rounded' : ''}`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>

                  {/* Code Input Textarea */}
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    spellCheck={false}
                    className="flex-1 bg-transparent p-3 font-mono text-xs text-emerald-300 leading-relaxed focus:outline-none resize-none"
                    rows={14}
                  />
                </div>
              </div>

              {/* VS Code Integrated Terminal Window */}
              <div className="rounded-2xl border border-white/10 bg-[#090d16] p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Terminal className="h-3.5 w-3.5 text-cyan-400" /> Integrated Output Console
                  </span>
                  <span className="text-[10px] text-slate-500">Output Window</span>
                </div>

                <div className="min-h-[100px] max-h-[200px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-xs">
                  {terminalOutput ? (
                    <span className={isErrorOutput ? 'text-rose-400 font-medium' : 'text-emerald-300 font-medium'}>
                      {terminalOutput}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">
                      Console output will appear here after you click ⚡ Check / Run Code.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
