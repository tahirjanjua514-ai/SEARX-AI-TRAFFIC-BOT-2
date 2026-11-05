import React from 'react';
import {
  Globe,
  Network,
  Compass,
  Sliders,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Play,
  RotateCw,
} from 'lucide-react';
import { Website, ProxyItem, BrowserProfile, SecurityEvent } from '../../types';

interface DashboardTabProps {
  websites: Website[];
  proxies: ProxyItem[];
  profiles: BrowserProfile[];
  securityEvents: SecurityEvent[];
  activeWorkers: number;
  cpuPercent: number;
  ramPercent: number;
  onNavigate: (tab: any) => void;
  onRunHealthCheckAll: () => void;
  onTestProxiesAll: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  websites,
  proxies,
  profiles,
  securityEvents,
  activeWorkers,
  cpuPercent,
  ramPercent,
  onNavigate,
  onRunHealthCheckAll,
  onTestProxiesAll,
}) => {
  const activeWebsites = websites.filter((w) => w.status === 'active').length;
  const workingProxies = proxies.filter((p) => p.status === 'active').length;
  const failedProxies = proxies.filter((p) => p.status === 'failed' || p.status === 'timeout').length;
  const activeSessions = profiles.filter((p) => p.status === 'running').length;
  const unresolvedAlerts = securityEvents.filter((s) => !s.resolved).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of websites, proxy fleet, isolated browser sessions, and security compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRunHealthCheckAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Ping All Sites</span>
          </button>
          <button
            onClick={onTestProxiesAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test All Proxies</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Zero-Pill, Anti-Slop, High Legibility) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Websites */}
        <div
          onClick={() => onNavigate('websites')}
          className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered Websites</span>
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {websites.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-mono tabular-nums">{activeWebsites}</span> operational · <span className="font-mono tabular-nums">{websites.length - activeWebsites}</span> degraded
          </div>
        </div>

        {/* Proxies */}
        <div
          onClick={() => onNavigate('proxies')}
          className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Proxy Fleet</span>
            <Network className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {proxies.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-mono tabular-nums">{workingProxies}</span> working · <span className="text-rose-400 font-mono tabular-nums">{failedProxies}</span> failed
          </div>
        </div>

        {/* Browser Profiles */}
        <div
          onClick={() => onNavigate('browser')}
          className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Browser Profiles</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {profiles.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span className="text-sky-400 font-mono tabular-nums">{activeSessions}</span> active sessions · Isolated cookies
          </div>
        </div>

        {/* Thread Workers */}
        <div
          onClick={() => onNavigate('threads')}
          className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Running Threads</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {activeWorkers} <span className="text-sm font-normal text-slate-400">/ 16</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            CPU <span className="font-mono tabular-nums">{cpuPercent.toFixed(0)}%</span> · RAM <span className="font-mono tabular-nums">{ramPercent.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Website Health Table & Live Security / Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Website Health Overview (2 cols) */}
        <div className="lg:col-span-2 p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Website Health & Latency Benchmarks
              </h2>
            </div>
            <button
              onClick={() => onNavigate('websites')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
            >
              <span>Manage all</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 pb-2">
                <tr>
                  <th className="pb-2 font-medium">Domain</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium text-right">Uptime</th>
                  <th className="pb-2 font-medium text-right">Response Time</th>
                  <th className="pb-2 font-medium">SSL Certificate</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {websites.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-medium text-slate-200">
                      {w.domain}
                    </td>
                    <td className="py-2.5 text-slate-400">{w.category}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-300">
                      {w.uptimePercent}%
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-300">
                      {w.lastResponseTimeMs} ms
                    </td>
                    <td className="py-2.5 text-slate-400">
                      {w.sslValid ? (
                        <span className="text-emerald-400">Valid ({w.sslExpires})</span>
                      ) : (
                        <span className="text-rose-400">Invalid / Expired</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right font-medium">
                      {w.status === 'active' ? (
                        <span className="text-emerald-400">Operational</span>
                      ) : (
                        <span className="text-amber-400">Degraded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Audit Events Stream (1 col) */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Security & Audit Alerts
              </h2>
            </div>
            <button
              onClick={() => onNavigate('security')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              View Log
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {securityEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-md bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">
                    {evt.eventType.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {evt.timestamp}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {evt.description}
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Rule: {evt.triggeredRule} · {evt.resolved ? 'Resolved' : 'Active'}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Ad Network Policy Notice */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ad Compliance Policy:</span>
            <span className="text-emerald-400 font-medium">Zero-IVT Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
