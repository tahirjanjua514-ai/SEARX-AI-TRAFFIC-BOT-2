import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  RotateCw,
  Search,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Website } from '../../types';

interface WebsiteManagerTabProps {
  websites: Website[];
  onAddWebsite: (url: string, category: string, notes: string) => boolean;
  onBulkImport: (text: string) => { imported: number; duplicates: number };
  onDeleteWebsite: (id: number) => void;
  onCheckHealth: (id: number) => void;
}

export const WebsiteManagerTab: React.FC<WebsiteManagerTabProps> = ({
  websites,
  onAddWebsite,
  onBulkImport,
  onDeleteWebsite,
  onCheckHealth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Form states
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [bulkText, setBulkText] = useState('');

  const categories = ['All', 'Search & Aggregator', 'Development', 'Testing', 'Search & Privacy', 'General'];

  const filteredWebsites = websites.filter((w) => {
    const matchesSearch =
      w.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || w.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      setFormError('Please provide a valid URL or domain.');
      return;
    }
    const success = onAddWebsite(newUrl.trim(), newCategory, newNotes.trim());
    if (success) {
      setNewUrl('');
      setNewNotes('');
      setFormError('');
      setShowAddModal(false);
    } else {
      setFormError('Website domain is already registered or URL format is invalid.');
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    onBulkImport(bulkText);
    setBulkText('');
    setShowBulkModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Website Target Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register authorized domains, monitor real HTTP response times, inspect SSL certificates, and configure resource limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={() => {
              setFormError('');
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Website</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search domain or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Segmented Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-0.5 bg-slate-950 rounded-lg border border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Websites Table */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Domain & URL</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium text-right">Uptime</th>
                <th className="py-3 px-4 font-medium text-right">Response Time</th>
                <th className="py-3 px-4 font-medium">SSL Status</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredWebsites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No websites matching search query. Click "Add Website" to register a target.
                  </td>
                </tr>
              ) : (
                filteredWebsites.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-100 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{w.domain}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {w.url}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {w.category}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                      {w.uptimePercent}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                      {w.lastResponseTimeMs} ms
                    </td>
                    <td className="py-3 px-4">
                      {w.sslValid ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Lock className="w-3 h-3" />
                          <span>Valid ({w.sslExpires})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Invalid / Expired</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {w.status === 'active' ? (
                        <span className="text-emerald-400">Active</span>
                      ) : (
                        <span className="text-amber-400">Degraded</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onCheckHealth(w.id)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-400 transition-colors"
                          title="Check live response time"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteWebsite(w.id)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete website"
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

      {/* Add Website Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <h2 className="text-base font-bold text-slate-100">
              Register Authorized Website
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add a target website for automated health monitoring, SSL inspection, and SEO audits.
            </p>

            {formError && (
              <div className="mt-3 p-2.5 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Website URL or Domain
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="Search & Aggregator">Search & Aggregator</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Search & Privacy">Search & Privacy</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Operational Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary production endpoint"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
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
                  Save Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg bg-slate-900 border border-slate-800 p-5 shadow-2xl">
            <h2 className="text-base font-bold text-slate-100">
              Bulk Import Websites
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Paste one URL per line or comma-separated CSV list. Duplicate domains are automatically identified and skipped.
            </p>

            <form onSubmit={handleBulkSubmit} className="mt-4 space-y-3">
              <textarea
                rows={6}
                placeholder="https://site1.com&#10;https://site2.org&#10;https://searx.me"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
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
