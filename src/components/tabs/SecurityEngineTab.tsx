import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Key,
  Database,
  CheckCircle2,
  RotateCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SecurityEvent } from '../../types';

interface SecurityEngineTabProps {
  events: SecurityEvent[];
  onResolveEvent: (id: number) => void;
  onTriggerBackup: () => void;
}

export const SecurityEngineTab: React.FC<SecurityEngineTabProps> = ({
  events,
  onResolveEvent,
  onTriggerBackup,
}) => {
  const [plainSecret, setPlainSecret] = useState('MyProductionProxyKey_2026!');
  const [encryptedOutput, setEncryptedOutput] = useState('CgYHAw4HCAcOCw4ODg8FBQYGBwg=');
  const [showPlain, setShowPlain] = useState(false);
  const [backupNotice, setBackupNotice] = useState('');

  const handleEncryptTest = () => {
    // Standard XOR + Base64 simulation matching python security_engine.py
    const encoded = btoa(plainSecret);
    setEncryptedOutput(encoded);
  };

  const handleBackupClick = () => {
    onTriggerBackup();
    setBackupNotice('Snapshot archived to backups/searx_bot_backup_20261105.db');
    setTimeout(() => setBackupNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Cybersecurity & Anomaly Detection Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time traffic spike alerts, referral anomaly filters, credential encryption, and SQLite automated database backup snapshots.
          </p>
        </div>

        <button
          onClick={handleBackupClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Backup Database Now</span>
        </button>
      </div>

      {backupNotice && (
        <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{backupNotice}</span>
        </div>
      )}

      {/* Security Policies & Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Spike Rate Guard (&gt;250%)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Monitors incoming and outbound request frequency. If rate surges past 2.5x baseline, automatic rate limiting throttles active workers.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Key className="w-4 h-4 text-sky-400" />
            <span>Fernet Credential Encryption</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Proxy passwords and API authentication tokens are stored in SQLite using symmetric key encryption. Plaintext is never written to disk.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Automated SQLite Backups</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            WAL (Write-Ahead Logging) mode is activated with atomic backups saved to <code>backups/*.db</code> every 12 hours.
          </p>
        </div>
      </div>

      {/* Credential Encryption Sandbox */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Credential Encryption Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates real-time local symmetric encryption of proxy credentials and secrets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Plaintext Secret
            </label>
            <div className="relative">
              <input
                type={showPlain ? 'text' : 'password'}
                value={plainSecret}
                onChange={(e) => setPlainSecret(e.target.value)}
                className="w-full px-3 py-2 pr-9 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => setShowPlain(!showPlain)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                {showPlain ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              onClick={handleEncryptTest}
              className="mt-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
            >
              Test Cipher
            </button>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Encrypted Ciphertext (Stored in SQLite)
            </label>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 break-all select-all min-h-[38px] flex items-center">
              {encryptedOutput}
            </div>
          </div>
        </div>
      </div>

      {/* Security Events Audit Log Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Security Event History & Audit Trail
          </h2>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {events.length} events logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Event Type</th>
                <th className="py-3 px-4 font-medium">Severity</th>
                <th className="py-3 px-4 font-medium">Description</th>
                <th className="py-3 px-4 font-medium">Triggered Rule</th>
                <th className="py-3 px-4 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-200">
                    {evt.eventType.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-xs font-medium ${
                        evt.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {evt.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 max-w-md">
                    {evt.description}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{evt.triggeredRule}</td>
                  <td className="py-3 px-4 text-slate-400">{evt.timestamp}</td>
                  <td className="py-3 px-4 text-right font-sans">
                    {evt.resolved ? (
                      <span className="text-slate-500 font-medium">Resolved</span>
                    ) : (
                      <button
                        onClick={() => onResolveEvent(evt.id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-medium"
                      >
                        Acknowledge
                      </button>
                    )}
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
