import React, { useState } from 'react';
import {
  Network,
  Plus,
  Trash2,
  Play,
  Download,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  RotateCw,
  Key,
} from 'lucide-react';
import { ProxyItem } from '../../types';

interface ProxyManagerTabProps {
  proxies: ProxyItem[];
  onAddProxy: (proxy: Partial<ProxyItem>) => boolean;
  onImportProxies: (text: string) => { imported: number; duplicates: number };
  onDeleteProxy: (id: number) => void;
  onTestProxy: (id: number) => void;
  onTestAllProxies: () => void;
  onExportProxies: () => void;
}

export const ProxyManagerTab: React.FC<ProxyManagerTabProps> = ({
  proxies,
  onAddProxy,
  onImportProxies,
  onDeleteProxy,
  onTestProxy,
  onTestAllProxies,
  onExportProxies,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Add Form states
  const [addr, setAddr] = useState('');
  const [port, setPort] = useState(8080);
  const [proto, setProto] = useState<'http' | 'https' | 'socks5'>('http');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [importText, setImportText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredProxies = proxies.filter((p) => {
    const matchesSearch =
      p.address.includes(searchTerm) ||
      p.errorMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProto = protocolFilter === 'All' || p.protocol === protocolFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && p.status === 'active') ||
      (statusFilter === 'Failed' && (p.status === 'failed' || p.status === 'timeout' || p.status === 'auth_error'));
    return matchesSearch && matchesProto && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addr.trim() || !port) {
      setErrorMsg('Please supply a valid IP address and port.');
      return;
    }
    const success = onAddProxy({
      address: addr.trim(),
      port: Number(port),
      protocol: proto,
      username: user.trim(),
      password: pass.trim(),
      authRequired: Boolean(user.trim()),
    });
    if (success) {
      setAddr('');
      setUser('');
      setPass('');
      setErrorMsg('');
      setShowAddModal(false);
    } else {
      setErrorMsg('Proxy already exists in database.');
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    onImportProxies(importText);
    setImportText('');
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Advanced Proxy Fleet Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Diagnostic verification for HTTP, HTTPS, and SOCKS5 proxies with authentic socket latency, TCP handshake, and 407 authentication checks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportProxies}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export List</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import TXT/CSV</span>
          </button>
          <button
            onClick={() => {
              setErrorMsg('');
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Proxy</span>
          </button>
          <button
            onClick={onTestAllProxies}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test All</span>
          </button>
        </div>
      </div>

      {/* Search & Protocol/Status Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search IP address or error message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Protocol Filters */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800/80">
            {['All', 'HTTP', 'HTTPS', 'SOCKS5'].map((p) => (
              <button
                key={p}
                onClick={() => setProtocolFilter(p)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  protocolFilter === p
                    ? 'bg-slate-800 text-sky-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800/80">
            {['All', 'Active', 'Failed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-slate-800 text-sky-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table: Matches Section 4 Column Requirements */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Proxy Address</th>
                <th className="py-3 px-4 font-medium">Protocol</th>
                <th className="py-3 px-4 font-medium">Authentication Status</th>
                <th className="py-3 px-4 font-medium">Connection Status</th>
                <th className="py-3 px-4 font-medium text-right">Response Time</th>
                <th className="py-3 px-4 font-medium">Last Checked</th>
                <th className="py-3 px-4 font-medium">Error Message / Diagnostic</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProxies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No proxies found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredProxies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/25 transition-colors">
                    {/* Proxy address */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-100">
                      {p.address}:{p.port}
                    </td>

                    {/* Protocol */}
                    <td className="py-3 px-4 font-mono text-slate-300 uppercase">
                      {p.protocol}
                    </td>

                    {/* Authentication Status */}
                    <td className="py-3 px-4">
                      {p.authRequired ? (
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          <span>Credentials Configured</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">None (Open)</span>
                      )}
                    </td>

                    {/* Connection Status */}
                    <td className="py-3 px-4 font-medium">
                      {p.status === 'active' && (
                        <span className="text-emerald-400">Active (200 OK)</span>
                      )}
                      {p.status === 'failed' && (
                        <span className="text-rose-400">Connection Failed</span>
                      )}
                      {p.status === 'timeout' && (
                        <span className="text-amber-400">Timed Out</span>
                      )}
                      {p.status === 'auth_error' && (
                        <span className="text-rose-400">407 Auth Required</span>
                      )}
                      {p.status === 'untested' && (
                        <span className="text-slate-400">Untested</span>
                      )}
                    </td>

                    {/* Response Time (Tabular Figures) */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                      {p.latencyMs > 0 ? `${p.latencyMs} ms` : '—'}
                    </td>

                    {/* Last Checked */}
                    <td className="py-3 px-4 text-slate-400">
                      {p.lastChecked}
                    </td>

                    {/* Error Message */}
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                      {p.errorMessage ? (
                        <span className="text-rose-400/90" title={p.errorMessage}>
                          {p.errorMessage}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onTestProxy(p.id)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Run connection test"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProxy(p.id)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove proxy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Proxy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <h2 className="text-base font-bold text-slate-100">
              Add New Proxy
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Supports HTTP, HTTPS, and SOCKS5 with optional username/password credentials.
            </p>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    IP Address or Host
                  </label>
                  <input
                    type="text"
                    placeholder="198.51.100.24"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Protocol
                </label>
                <select
                  value={proto}
                  onChange={(e) => setProto(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="socks5">SOCKS5</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
                >
                  Save Proxy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import TXT/CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <h2 className="text-base font-bold text-slate-100">
              Bulk Import Proxies (TXT / CSV)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Supports standard formats: <code>IP:PORT</code>, <code>IP:PORT:USER:PASS</code>, or <code>protocol://user:pass@ip:port</code>.
            </p>

            <form onSubmit={handleImportSubmit} className="mt-4 space-y-3">
              <textarea
                rows={6}
                placeholder="198.51.100.24:8080&#10;203.0.113.88:3128:ops_user:ops_secret&#10;socks5://sec_agent:pass@192.0.2.145:1080"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
                >
                  Import All
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
