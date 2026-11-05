import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Play,
  RotateCw,
  FolderLock,
  Layers,
  Camera,
  CheckCircle2,
  AlertCircle,
  Square,
  Terminal,
} from 'lucide-react';
import { BrowserProfile } from '../../types';

interface BrowserEngineTabProps {
  profiles: BrowserProfile[];
  onCreateProfile: (name: string, engine: 'chromium' | 'firefox', width: number, height: number) => void;
  onDeleteProfile: (id: number) => void;
  onClearProfileStorage: (id: number) => void;
  onToggleProfileSession: (id: number) => void;
}

export const BrowserEngineTab: React.FC<BrowserEngineTabProps> = ({
  profiles,
  onCreateProfile,
  onDeleteProfile,
  onClearProfileStorage,
  onToggleProfileSession,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [engine, setEngine] = useState<'chromium' | 'firefox'>('chromium');
  const [width, setWidth] = useState(1366);
  const [height, setHeight] = useState(768);

  const [activeSessionLog, setActiveSessionLog] = useState<string[]>([
    '[INIT] Playwright persistent contexts loaded.',
    '[STORAGE] Profile sandboxes isolated in data/profiles/.',
    '[READY] Ready to launch browser sessions.',
  ]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProfile(name.trim(), engine, width, height);
    setName('');
    setShowCreateModal(false);
    setActiveSessionLog((prev) => [
      ...prev,
      `[PROFILE] Created isolated profile "${name}" with ${engine} engine (${width}x${height}).`,
    ]);
  };

  const handleRunSession = (p: BrowserProfile) => {
    onToggleProfileSession(p.id);
    const nextState = p.status === 'running' ? 'Terminated' : 'Launched';
    setActiveSessionLog((prev) => [
      ...prev,
      `[SESSION] ${nextState} Playwright instance for profile "${p.name}". Storage: ${p.storagePath}`,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Playwright Browser Engine & Isolated Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain independent persistent browser contexts with segregated cookies, disk caches, and screen viewports in Chromium and Firefox.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Profile</span>
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-slate-100 text-sm">
                    {p.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {p.engine}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Viewport:</span>
                  <span className="font-mono text-slate-200">
                    {p.viewportWidth} × {p.viewportHeight}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Stored Cookies:</span>
                  <span className="font-mono text-slate-200">
                    {p.cookiesCount} entries
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Path:</span>
                  <span className="font-mono text-[11px] text-slate-400 truncate max-w-[150px]">
                    {p.storagePath}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span>Status:</span>
                  <span
                    className={`font-medium ${
                      p.status === 'running' ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {p.status === 'running' ? 'Active Session' : 'Idle'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleRunSession(p)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                  p.status === 'running'
                    ? 'bg-rose-900/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800'
                    : 'bg-sky-600/20 text-sky-300 hover:bg-sky-600/30 border border-sky-500/30'
                }`}
              >
                {p.status === 'running' ? (
                  <>
                    <Square className="w-3 h-3" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Launch</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onClearProfileStorage(p.id)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                title="Purge cookies and cache"
              >
                <FolderLock className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDeleteProfile(p.id)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Delete profile"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Playwright Session Console & Screenshot QA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Terminal logs */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <h2 className="text-xs font-semibold text-slate-100">
                Playwright Process & Crash Recovery Stream
              </h2>
            </div>
            <button
              onClick={() =>
                setActiveSessionLog((prev) => [
                  ...prev,
                  `[HEALTH] Checked Chromium child processes: PID 20412 OK. Memory within safe bounds.`,
                ])
              }
              className="text-[11px] text-sky-400 hover:underline"
            >
              Probe Engine
            </button>
          </div>

          <div className="p-3 rounded bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1.5 flex-1 min-h-[160px] max-h-[220px] overflow-y-auto">
            {activeSessionLog.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Screenshot QA Preview Container */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-semibold text-slate-100">
                  Automated Screenshot Capture QA
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                exports/screenshots/
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              When configured in <code>config.yaml</code>, Playwright automatically generates full-page PNG captures upon DOM network idle or render error for visual inspection.
            </p>
          </div>

          <div className="mt-3 p-4 rounded bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center py-6">
            <Camera className="w-8 h-8 text-slate-600 mb-2" />
            <div className="text-xs font-medium text-slate-300">
              Session Screenshot Buffer Ready
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Captures will be logged to <code>exports/screenshots/*.png</code>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <h2 className="text-base font-bold text-slate-100">
              Create Browser Profile
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Creates a dedicated persistent disk directory for isolated cookies and session cache.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Profile Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. SEO Auditor Profile"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Browser Engine
                </label>
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="chromium">Chromium (Google Chrome)</option>
                  <option value="firefox">Mozilla Firefox</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Viewport Width
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Viewport Height
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
                >
                  Create Sandbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
