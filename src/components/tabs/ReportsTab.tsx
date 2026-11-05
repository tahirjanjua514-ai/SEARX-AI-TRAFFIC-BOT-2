import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  CheckCircle2,
  Calendar,
  FileCode,
} from 'lucide-react';
import { Website, ProxyItem, AdNetworkMetric, SecurityEvent } from '../../types';

interface ReportsTabProps {
  websites: Website[];
  proxies: ProxyItem[];
  adNetworks: AdNetworkMetric[];
  securityEvents: SecurityEvent[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  websites,
  proxies,
  adNetworks,
  securityEvents,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const triggerDownload = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(`Generated and downloaded ${filename}`);
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  const exportWebsitesCsv = () => {
    const headers = ['ID', 'Domain', 'URL', 'Category', 'Status', 'UptimePercent', 'ResponseTimeMs', 'SSLValid', 'SSLExpires'];
    const rows = websites.map((w) => [
      w.id,
      w.domain,
      `"${w.url}"`,
      w.category,
      w.status,
      w.uptimePercent,
      w.lastResponseTimeMs,
      w.sslValid ? 'YES' : 'NO',
      w.sslExpires,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerDownload(`searx_websites_report_${Date.now()}.csv`, csvContent, 'text/csv');
  };

  const exportProxiesCsv = () => {
    const headers = ['ID', 'Address', 'Port', 'Protocol', 'AuthRequired', 'Status', 'LatencyMs', 'LastChecked', 'ErrorMessage'];
    const rows = proxies.map((p) => [
      p.id,
      p.address,
      p.port,
      p.protocol,
      p.authRequired ? 'YES' : 'NO',
      p.status,
      p.latencyMs,
      `"${p.lastChecked}"`,
      `"${p.errorMessage}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerDownload(`searx_proxies_report_${Date.now()}.csv`, csvContent, 'text/csv');
  };

  const exportAdRevenueCsv = () => {
    const headers = ['Network', 'Impressions', 'Clicks', 'CTR_Percent', 'RPM_USD', 'Revenue_USD', 'PolicyStatus', 'IVTRisk'];
    const rows = adNetworks.map((n) => [
      n.network,
      n.impressions,
      n.clicks,
      n.ctr,
      n.rpm,
      n.revenue,
      n.policyStatus,
      n.riskIndicator,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerDownload(`searx_ad_compliance_report_${Date.now()}.csv`, csvContent, 'text/csv');
  };

  const exportExecutiveJson = () => {
    const data = {
      report: 'SEARX AI TRAFFIC BOT — Consolidated Executive Audit',
      generatedAt: new Date().toISOString(),
      summary: {
        totalWebsites: websites.length,
        operationalWebsites: websites.filter((w) => w.status === 'active').length,
        totalProxies: proxies.length,
        activeProxies: proxies.filter((p) => p.status === 'active').length,
        adNetworksMonitored: adNetworks.length,
        totalAdRevenue: adNetworks.reduce((acc, a) => acc + a.revenue, 0),
        securityEventsCount: securityEvents.length,
      },
      websites,
      proxies,
      adNetworks,
    };
    triggerDownload(`searx_executive_audit_${Date.now()}.json`, JSON.stringify(data, null, 2), 'application/json');
  };

  const printPdfSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          Reporting & Data Export Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate structured CSV spreadsheets, executive JSON audits, and formatted PDF summaries for all system modules.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Websites CSV */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs">
              <FileSpreadsheet className="w-4 h-4 text-sky-400" />
              <span>Websites Health & Uptime (CSV)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Exports all registered domains, SSL expiration dates, uptime percentages, and response latencies.
            </p>
          </div>
          <button
            onClick={exportWebsitesCsv}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Proxies CSV */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span>Proxy Fleet Diagnostic Report (CSV)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Exports IP addresses, protocols (HTTP/HTTPS/SOCKS5), authentication status, latency, and error logs.
            </p>
          </div>
          <button
            onClick={exportProxiesCsv}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Ad Compliance CSV */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Ad Network Compliance & Revenue (CSV)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Consolidated earnings, impression counts, CTR anomalies, and policy verification metrics.
            </p>
          </div>
          <button
            onClick={exportAdRevenueCsv}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Executive JSON */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Complete System Audit (JSON)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Full machine-readable backup containing websites, proxies, security alerts, and system state.
            </p>
          </div>
          <button
            onClick={exportExecutiveJson}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download JSON</span>
          </button>
        </div>

        {/* Printable PDF */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-semibold text-xs">
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Printable Executive Summary (PDF)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Formatted print sheet with high-contrast executive summary cards and compliance sign-off.
            </p>
          </div>
          <button
            onClick={printPdfSummary}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
