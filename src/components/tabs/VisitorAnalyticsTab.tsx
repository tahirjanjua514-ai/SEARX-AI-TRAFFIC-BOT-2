import React from 'react';
import {
  Users,
  Compass,
  Monitor,
  Smartphone,
  Globe2,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { VisitorSession } from '../../types';

interface VisitorAnalyticsTabProps {
  sessions: VisitorSession[];
}

export const VisitorAnalyticsTab: React.FC<VisitorAnalyticsTabProps> = ({
  sessions,
}) => {
  const newCount = sessions.filter((s) => s.visitorType === 'new').length;
  const retCount = sessions.filter((s) => s.visitorType === 'returning').length;
  const convCount = sessions.filter((s) => s.converted).length;
  const avgDuration = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSec, 0) / Math.max(sessions.length, 1)
  );
  const avgEngagement = (
    sessions.reduce((acc, s) => acc + s.engagementScore, 0) / Math.max(sessions.length, 1)
  ).toFixed(1);

  // Group by country
  const countryCounts: { [key: string]: number } = {};
  sessions.forEach((s) => {
    countryCounts[s.country] = (countryCounts[s.country] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          Genuine Human Visitor Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Consent-based analytics monitoring verified human sessions, landing page performance, geographic distribution, and conversion funnels.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Analyzed Sessions</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {sessions.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="font-mono text-sky-400 tabular-nums">{newCount}</span> new · <span className="font-mono text-indigo-400 tabular-nums">{retCount}</span> returning
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Avg Session Dwell Time</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {avgDuration} <span className="text-sm font-normal text-slate-400">sec</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Math.floor(avgDuration / 60)}m {avgDuration % 60}s typical engagement
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Engagement Score</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {avgEngagement} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            High quality human interaction index
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Goal Conversions</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {convCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Conversion Rate: <span className="font-mono text-emerald-400 tabular-nums">{((convCount / Math.max(sessions.length, 1)) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Main Content: Sessions Breakdown Table & Country Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 rounded-lg bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Recent Verified Human Visitor Sessions
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Live Capture Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 pb-2">
                <tr>
                  <th className="pb-2 font-medium">Visitor Type</th>
                  <th className="pb-2 font-medium">Landing Page</th>
                  <th className="pb-2 font-medium">Referral Source</th>
                  <th className="pb-2 font-medium">Device & Browser</th>
                  <th className="pb-2 font-medium text-right">Dwell Time</th>
                  <th className="pb-2 font-medium text-right">Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-2.5">
                      <span
                        className={`font-medium ${
                          s.visitorType === 'new' ? 'text-sky-400' : 'text-indigo-400'
                        }`}
                      >
                        {s.visitorType === 'new' ? 'New Visitor' : 'Returning'}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-200">
                      {s.landingPage}
                    </td>
                    <td className="py-2.5 text-slate-400 truncate max-w-[140px]">
                      {s.referrer}
                    </td>
                    <td className="py-2.5 text-slate-300">
                      {s.device} · {s.browser}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-200">
                      {s.durationSec}s
                    </td>
                    <td className="py-2.5 text-right font-medium">
                      {s.converted ? (
                        <span className="text-emerald-400">Yes</span>
                      ) : (
                        <span className="text-slate-500">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic & Source breakdown (1 col) */}
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe2 className="w-4 h-4 text-sky-400" />
              <h2 className="text-xs font-semibold text-slate-100">
                Geographic Traffic Share
              </h2>
            </div>
            <div className="space-y-2.5">
              {Object.entries(countryCounts).map(([country, count]) => {
                const pct = Math.round((count / sessions.length) * 100);
                return (
                  <div key={country} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{country}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg bg-slate-900 border border-slate-800 p-4">
            <div className="text-xs font-semibold text-slate-100 mb-2">
              Human Behavior Policy Invariant
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In accordance with Section 7 of the master specifications, this module analyzes real organic audience data. No synthetic mouse movements or simulated human delays are generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
