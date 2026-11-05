import React from 'react';
import {
  Minus,
  Square,
  X,
  Sun,
  Moon,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface WindowsTitleBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  activeWorkers: number;
  cpuPercent: number;
  ramUsedMb: number;
  onOpenPythonTerminal: () => void;
}

export const WindowsTitleBar: React.FC<WindowsTitleBarProps> = ({
  isDark,
  onToggleTheme,
  activeWorkers,
  cpuPercent,
  ramUsedMb,
  onOpenPythonTerminal,
}) => {
  return (
    <header className="h-10 bg-slate-900 border-b border-slate-800 text-slate-300 flex items-center justify-between px-3 select-none text-xs shrink-0 z-50">
      {/* Brand & Window Title */}
      <div className="flex items-center gap-2.5">
        {/* Windows App Icon */}
        <div className="w-4 h-4 bg-sky-500 rounded-sm flex items-center justify-center text-slate-950 font-black text-[9px] shadow-sm">
          S
        </div>
        <span className="font-semibold text-slate-100 tracking-tight">
          SEARX AI TRAFFIC BOT
        </span>
        <span className="text-slate-500" aria-hidden="true">·</span>
        <span className="text-slate-400 font-mono text-[11px]">
          Windows 10/11 x64 Workstation v1.0
        </span>
      </div>

      {/* Telemetry & Quick Utilities */}
      <div className="hidden lg:flex items-center gap-4 text-slate-400">
        <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span>CPU {cpuPercent.toFixed(1)}%</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>RAM {ramUsedMb} MB</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Workers: {activeWorkers} active</span>
        </div>

        <button
          onClick={onOpenPythonTerminal}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors"
          title="Run Python CLI diagnostics"
        >
          <Terminal className="w-3 h-3 text-sky-400" />
          <span>Python Diagnostics</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
        </button>
      </div>

      {/* Windows Standard Title Bar Buttons */}
      <div className="flex items-center">
        <button
          onClick={() => {}}
          className="h-10 px-3 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="Minimize"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {}}
          className="h-10 px-3 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="Maximize"
          aria-label="Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={() => {}}
          className="h-10 px-3 hover:bg-rose-600 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
          title="Close"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
