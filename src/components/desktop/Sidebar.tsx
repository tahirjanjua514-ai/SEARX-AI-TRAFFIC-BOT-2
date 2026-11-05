import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Network,
  Compass,
  ShieldAlert,
  Users,
  Sliders,
  KeyRound,
  TrendingUp,
  Megaphone,
  Search,
  Lock,
  FileSpreadsheet,
  FileCode2,
  Download,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  websitesCount: number;
  proxiesCount: number;
  profilesCount: number;
  pendingCaptchasCount: number;
  onDownloadZip: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  websitesCount,
  proxiesCount,
  profilesCount,
  pendingCaptchasCount,
  onDownloadZip,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'websites', label: 'Websites Manager', icon: <Globe className="w-4 h-4" />, badge: websitesCount },
    { id: 'proxies', label: 'Proxy Manager', icon: <Network className="w-4 h-4" />, badge: proxiesCount },
    { id: 'browser', label: 'Browser Engine', icon: <Compass className="w-4 h-4" />, badge: profilesCount },
    { id: 'privacy', label: 'Privacy & WebRTC', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'analytics', label: 'Visitor Analytics', icon: <Users className="w-4 h-4" /> },
    { id: 'threads', label: 'Thread Manager', icon: <Sliders className="w-4 h-4" /> },
    { id: 'captcha', label: 'CAPTCHA Support', icon: <KeyRound className="w-4 h-4" />, badge: pendingCaptchasCount > 0 ? pendingCaptchasCount : undefined },
    { id: 'traffic', label: 'Traffic Intelligence', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'ads', label: 'Ad Compliance', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO Intelligence', icon: <Search className="w-4 h-4" /> },
    { id: 'security', label: 'Security Engine', icon: <Lock className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Exports', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'desktop_code', label: 'Windows EXE & Source', icon: <FileCode2 className="w-4 h-4 text-sky-400" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm">
            SX
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 tracking-tight leading-tight">
              Searx Traffic Bot
            </div>
            <div className="text-[11px] text-slate-400">
              Desktop Edition v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-2 space-y-0.5 flex-1" aria-label="Workstation Navigation">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-sky-600/15 text-sky-300 border border-sky-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Download Package Card */}
      <div className="p-3 border-t border-slate-800">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-200">
            Windows 10/11 Package
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            Complete standalone Python codebase + PyInstaller EXE builder script.
          </div>
          <button
            onClick={onDownloadZip}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ZIP</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
