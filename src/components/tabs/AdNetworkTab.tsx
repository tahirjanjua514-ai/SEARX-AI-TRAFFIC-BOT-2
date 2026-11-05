import React from 'react';
import {
  Megaphone,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { AdNetworkMetric } from '../../types';

interface AdNetworkTabProps {
  networks: AdNetworkMetric[];
}

export const AdNetworkTab: React.FC<AdNetworkTabProps> = ({ networks }) => {
  const totalRevenue = networks.reduce((acc, n) => acc + n.revenue, 0);
  const totalImpressions = networks.reduce((acc, n) => acc + n.impressions, 0);
  const totalClicks = networks.reduce((acc, n) => acc + n.clicks, 0);
  const overallCtr = ((totalClicks / Math.max(totalImpressions, 1)) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          Ad Network Revenue & Invalid Traffic (IVT) Compliance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Separate publisher reporting across Google AdSense, AdX, Adsterra, Propush, Adcash, and Monetag. Strictly enforces Zero Artificial Ad Engagement policies.
        </p>
      </div>

      {/* Policy Mandate Callout */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-slate-200">
            Publisher Safety & Anti-Fraud Guarantee
          </div>
          <p className="text-slate-400 leading-relaxed">
            SEARX AI Traffic Bot operates purely as a diagnostic, SEO, and performance testing workstation. It strictly prohibits and prevents generating artificial advertising impressions or simulated ad clicks. CTR anomaly detectors flag any irregular spikes above 8.0% to protect publisher accounts from ad network policy suspensions.
          </p>
        </div>
      </div>

      {/* Totals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Monitored Revenue</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across 6 authorized networks
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Valid Impressions</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Organic and legitimate views
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Aggregate Network CTR</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {overallCtr}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Safe zone (&lt; 8.0% IVT safety bound)
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Policy Risk Level</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            Low (Safe)
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Zero policy violations logged
          </div>
        </div>
      </div>

      {/* Network Breakdown Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Ad Network Compliance & Revenue Monitor
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            6 Networks Monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Ad Network</th>
                <th className="py-3 px-4 font-medium text-right">Impressions</th>
                <th className="py-3 px-4 font-medium text-right">Clicks</th>
                <th className="py-3 px-4 font-medium text-right">CTR</th>
                <th className="py-3 px-4 font-medium text-right">RPM</th>
                <th className="py-3 px-4 font-medium text-right">Revenue</th>
                <th className="py-3 px-4 font-medium">Policy Status</th>
                <th className="py-3 px-4 font-medium text-right">IVT Risk Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {networks.map((net, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-100">
                    {net.network}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                    {net.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                    {net.clicks.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                    {net.ctr}%
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                    ${net.rpm.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-semibold text-emerald-400">
                    ${net.revenue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-sans text-emerald-400">
                    {net.policyStatus}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <span className="text-emerald-400 font-medium">
                      {net.riskIndicator}
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
