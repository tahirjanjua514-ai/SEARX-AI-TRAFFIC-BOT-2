import React, { useState } from 'react';
import {
  KeyRound,
  ShieldAlert,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCw,
} from 'lucide-react';

export const CaptchaTab: React.FC = () => {
  const [challenges, setChallenges] = useState([
    {
      id: 'CAP-104',
      type: 'Cloudflare Turnstile Verification',
      url: 'https://searx.me/preferences',
      detectedAt: 'Today 13:12',
      status: 'Awaiting Operator Approval',
    },
    {
      id: 'CAP-102',
      type: 'Google reCAPTCHA v2 Checkbox',
      url: 'https://example.com/login',
      detectedAt: 'Today 10:45',
      status: 'Manually Confirmed by Operator',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'queue' | 'rules'>('queue');

  const handleResolve = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'Manually Confirmed by Operator' } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          CAPTCHA Detection & Authorized Operator Workflows
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detects challenge barriers (reCAPTCHA, Cloudflare Turnstile, hCaptcha) and routes them to a manual verification queue for desktop operator inspection.
        </p>
      </div>

      {/* Compliance Box */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <KeyRound className="w-4 h-4 text-sky-400" />
          <span>Authorized Workflow Policy (Section 9 Compliance)</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          In strict compliance with terms of service, SEARX AI Traffic Bot does not perform illegal CAPTCHA bypasses or automated solving on third-party domains. Any challenge triggers an interactive operator notification for manual resolution.
        </p>
      </div>

      {/* Challenges Queue */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Challenge Detection Queue
          </h2>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {challenges.filter((c) => c.status !== 'Manually Confirmed by Operator').length} pending review
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {challenges.map((c) => (
            <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-200">
                    {c.type}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    ID: {c.id}
                  </span>
                </div>
                <div className="text-xs text-sky-400 font-mono">
                  {c.url}
                </div>
                <div className="text-[11px] text-slate-500">
                  Detected: {c.detectedAt} · Status: <span className={c.status.includes('Confirmed') ? 'text-emerald-400' : 'text-amber-400'}>{c.status}</span>
                </div>
              </div>

              {c.status !== 'Manually Confirmed by Operator' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolve(c.id)}
                    className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
                  >
                    Confirm Manually Solved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
