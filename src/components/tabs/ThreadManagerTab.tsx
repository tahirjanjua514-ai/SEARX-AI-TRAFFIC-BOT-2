import React, { useState } from 'react';
import {
  Sliders,
  Play,
  Pause,
  Square,
  Cpu,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react';

interface ThreadManagerTabProps {
  workersCount: number;
  onSetWorkersCount: (count: number) => void;
  cpuPercent: number;
  ramPercent: number;
  ramUsedMb: number;
}

export const ThreadManagerTab: React.FC<ThreadManagerTabProps> = ({
  workersCount,
  onSetWorkersCount,
  cpuPercent,
  ramPercent,
  ramUsedMb,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [completedCount, setCompletedCount] = useState(148);
  const [failedCount, setFailedCount] = useState(2);
  const [queuedTasks, setQueuedTasks] = useState([
    { id: 'T-981', type: 'SSL_CERT_AUDIT', target: 'https://searx.me', priority: 'High', status: 'Running' },
    { id: 'T-982', type: 'TCP_PROXY_PING', target: '198.51.100.24:8080', priority: 'Medium', status: 'Queued' },
    { id: 'T-983', type: 'ROBOTS_TXT_CRAWL', target: 'https://duckduckgo.com', priority: 'Low', status: 'Queued' },
    { id: 'T-984', type: 'AD_COMPLIANCE_SYNC', target: 'Google AdSense Report', priority: 'High', status: 'Queued' },
  ]);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStopAll = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Thread & Concurrency Worker Pool Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Asyncio task queue orchestrator with hardware load safeguards, dynamic worker scaling, and task throttling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <>
              <button
                onClick={handleTogglePause}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPaused ? 'Resume Pool' : 'Pause Pool'}</span>
              </button>
              <button
                onClick={handleStopAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop All Tasks</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Worker Pool</span>
            </button>
          )}
        </div>
      </div>

      {/* Hardware Resource Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>CPU Utilization</span>
            </span>
            <span className="font-mono text-slate-200 tabular-nums">
              {cpuPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                cpuPercent > 80 ? 'bg-rose-500' : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(cpuPercent, 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">
            Hardware safeguard active (capped under 85%)
          </div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>RAM Allocation</span>
            </span>
            <span className="font-mono text-slate-200 tabular-nums">
              {ramUsedMb} MB ({ramPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(ramPercent, 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">
            Memory leak guard & process garbage collection active
          </div>
        </div>

        {/* Status */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Worker Pool State</div>
          <div className="flex items-center gap-2 my-1">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                !isRunning
                  ? 'bg-rose-500'
                  : isPaused
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="font-semibold text-slate-100 text-sm">
              {!isRunning ? 'Stopped' : isPaused ? 'Execution Paused' : 'Active & Processing'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
            {completedCount} completed · {failedCount} failed
          </div>
        </div>
      </div>

      {/* Concurrency Controller Slider */}
      <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Worker Pool Concurrency Limit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust simultaneous worker threads allocated to proxy diagnostics and uptime probing.
            </p>
          </div>
          <div className="px-3 py-1 rounded bg-slate-950 border border-slate-800 font-mono font-bold text-sky-400 text-base tabular-nums">
            {workersCount} Workers
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={16}
            value={workersCount}
            onChange={(e) => onSetWorkersCount(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>1 (Conservative / Single-Core)</span>
            <span>4 (Standard Recommended)</span>
            <span>8 (Performance)</span>
            <span>16 (Max Stress Pool)</span>
          </div>
        </div>
      </div>

      {/* Task Queue Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Active Asynchronous Task Queue ({queuedTasks.length})
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            FIFO Priority Dispatch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 pb-2">
              <tr>
                <th className="pb-2 font-medium">Task ID</th>
                <th className="pb-2 font-medium">Operation</th>
                <th className="pb-2 font-medium">Target</th>
                <th className="pb-2 font-medium">Priority</th>
                <th className="pb-2 font-medium text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {queuedTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-2.5 text-slate-400">{t.id}</td>
                  <td className="py-2.5 text-slate-200">{t.type}</td>
                  <td className="py-2.5 text-slate-300 font-sans">{t.target}</td>
                  <td className="py-2.5 text-slate-400">{t.priority}</td>
                  <td className="py-2.5 text-right font-medium">
                    <span
                      className={
                        t.status === 'Running' ? 'text-emerald-400' : 'text-slate-400'
                      }
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
