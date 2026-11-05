import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  DollarSign,
  Copy,
  Check,
  Plus,
  ArrowUpRight,
  Calculator,
} from 'lucide-react';
import { TrafficCampaign } from '../../types';

interface TrafficIntelligenceTabProps {
  campaigns: TrafficCampaign[];
  onCreateCampaign: (campaign: Omit<TrafficCampaign, 'id'>) => void;
}

export const TrafficIntelligenceTab: React.FC<TrafficIntelligenceTabProps> = ({
  campaigns,
  onCreateCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'organic' | 'paid' | 'utm_builder'>('organic');

  // UTM Builder States
  const [baseUrl, setBaseUrl] = useState('https://searx.me/download');
  const [utmSource, setUtmSource] = useState('google');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('winter_promotion');
  const [utmTerm, setUtmTerm] = useState('desktop traffic bot');
  const [copied, setCopied] = useState(false);

  // New Campaign Form
  const [newCampName, setNewCampName] = useState('');
  const [newBudget, setNewBudget] = useState(500);

  const generatedUtm = `${baseUrl}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}${utmTerm ? `&utm_term=${encodeURIComponent(utmTerm)}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUtm);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) return;
    onCreateCampaign({
      campaignName: newCampName.trim(),
      source: utmSource,
      medium: utmMedium,
      utmCampaign: utmCampaign,
      budget: Number(newBudget),
      cost: 0,
      clicks: 0,
      conversions: 0,
      roi: 0,
      status: 'active',
    });
    setNewCampName('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Segmented Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Traffic Intelligence & Campaign Performance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Separate organic Google Search Console metrics from paid marketing campaigns, UTM tracking links, and ROI analytics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('organic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'organic'
                ? 'bg-slate-800 text-sky-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Organic (Search Console)
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'paid'
                ? 'bg-slate-800 text-sky-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paid Campaigns & ROI
          </button>
          <button
            onClick={() => setActiveTab('utm_builder')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'utm_builder'
                ? 'bg-slate-800 text-sky-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            UTM URL Builder
          </button>
        </div>
      </div>

      {/* VIEW 1: ORGANIC */}
      {activeTab === 'organic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total Search Clicks</div>
              <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
                14,280
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                +12.4% vs last period
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total Impressions</div>
              <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
                284,500
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Organic search visibility
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Average Search CTR</div>
              <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
                5.02%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Normalized click-through rate
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Average Search Position</div>
              <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
                8.4
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                Page 1 average ranking
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900 border border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">
              Top Organic Search Queries
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-800 pb-2">
                  <tr>
                    <th className="pb-2 font-medium">Query String</th>
                    <th className="pb-2 font-medium text-right">Clicks</th>
                    <th className="pb-2 font-medium text-right">Impressions</th>
                    <th className="pb-2 font-medium text-right">CTR</th>
                    <th className="pb-2 font-medium text-right">Avg Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {[
                    { q: 'searx privacy search setup', c: '3,410', i: '48,200', ctr: '7.07%', p: '2.8' },
                    { q: 'python playwright isolated browser profile', c: '2,180', i: '36,100', ctr: '6.04%', p: '4.1' },
                    { q: 'proxy latency checker desktop tool', c: '1,840', i: '29,800', ctr: '6.17%', p: '3.6' },
                    { q: 'ad compliance invalid traffic scanner', c: '1,210', i: '24,500', ctr: '4.94%', p: '6.2' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-2.5 font-sans text-slate-200">{row.q}</td>
                      <td className="py-2.5 text-right tabular-nums text-slate-300">{row.c}</td>
                      <td className="py-2.5 text-right tabular-nums text-slate-400">{row.i}</td>
                      <td className="py-2.5 text-right tabular-nums text-emerald-400">{row.ctr}</td>
                      <td className="py-2.5 text-right tabular-nums text-sky-400">{row.p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PAID CAMPAIGNS */}
      {activeTab === 'paid' && (
        <div className="space-y-6">
          <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Active Marketing Campaigns & ROI Analysis
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {campaigns.length} campaigns tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">Campaign Name</th>
                    <th className="py-3 px-4 font-medium">Channel / Medium</th>
                    <th className="py-3 px-4 font-medium text-right">Budget</th>
                    <th className="py-3 px-4 font-medium text-right">Cost Incurred</th>
                    <th className="py-3 px-4 font-medium text-right">Clicks</th>
                    <th className="py-3 px-4 font-medium text-right">Conversions</th>
                    <th className="py-3 px-4 font-medium text-right">Return on Investment (ROI)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-100">
                        {c.campaignName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {c.source} / {c.medium}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                        ${c.budget.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                        ${c.cost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                        {c.clicks}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-medium">
                        {c.conversions}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                        +{c.roi.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: UTM BUILDER */}
      {activeTab === 'utm_builder' && (
        <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 space-y-4 max-w-2xl">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Canonical UTM Link Constructor
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Assemble standard Google Analytics / Search Console parameters for transparent channel tracking.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Landing Page URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">utm_source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">utm_medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">utm_campaign</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">utm_term (Optional)</label>
                <input
                  type="text"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-slate-300 font-medium mb-1">Generated Tracking URL</label>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-sky-400 break-all select-all flex items-center justify-between gap-2">
                <span>{generatedUtm}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
