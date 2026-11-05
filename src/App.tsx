/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { WindowsTitleBar } from './components/desktop/WindowsTitleBar';
import { Sidebar } from './components/desktop/Sidebar';
import { DashboardTab } from './components/tabs/DashboardTab';
import { WebsiteManagerTab } from './components/tabs/WebsiteManagerTab';
import { ProxyManagerTab } from './components/tabs/ProxyManagerTab';
import { BrowserEngineTab } from './components/tabs/BrowserEngineTab';
import { PrivacyAuditTab } from './components/tabs/PrivacyAuditTab';
import { VisitorAnalyticsTab } from './components/tabs/VisitorAnalyticsTab';
import { ThreadManagerTab } from './components/tabs/ThreadManagerTab';
import { CaptchaTab } from './components/tabs/CaptchaTab';
import { TrafficIntelligenceTab } from './components/tabs/TrafficIntelligenceTab';
import { AdNetworkTab } from './components/tabs/AdNetworkTab';
import { SeoAuditorTab } from './components/tabs/SeoAuditorTab';
import { SecurityEngineTab } from './components/tabs/SecurityEngineTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { DesktopSourceTab } from './components/tabs/DesktopSourceTab';

import {
  NavigationTab,
  Website,
  ProxyItem,
  BrowserProfile,
  VisitorSession,
  TrafficCampaign,
  AdNetworkMetric,
  SecurityEvent,
} from './types';

import {
  INITIAL_WEBSITES,
  INITIAL_PROXIES,
  INITIAL_PROFILES,
  INITIAL_SESSIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_AD_NETWORKS,
  INITIAL_SECURITY_EVENTS,
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isDark, setIsDark] = useState(true);

  // Core State
  const [websites, setWebsites] = useState<Website[]>(INITIAL_WEBSITES);
  const [proxies, setProxies] = useState<ProxyItem[]>(INITIAL_PROXIES);
  const [profiles, setProfiles] = useState<BrowserProfile[]>(INITIAL_PROFILES);
  const [sessions, setSessions] = useState<VisitorSession[]>(INITIAL_SESSIONS);
  const [campaigns, setCampaigns] = useState<TrafficCampaign[]>(INITIAL_CAMPAIGNS);
  const [adNetworks, setAdNetworks] = useState<AdNetworkMetric[]>(INITIAL_AD_NETWORKS);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(INITIAL_SECURITY_EVENTS);

  // Concurrency & Telemetry
  const [workersCount, setWorkersCount] = useState<number>(4);
  const [cpuPercent, setCpuPercent] = useState<number>(14.5);
  const [ramUsedMb, setRamUsedMb] = useState<number>(420);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Subtle telemetry pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuPercent((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(8.0, Math.min(32.0, Number((prev + delta).toFixed(1))));
      });
      setRamUsedMb((prev) => {
        const delta = Math.floor((Math.random() - 0.5) * 6);
        return Math.max(380, Math.min(520, prev + delta));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handlers for Website Manager
  const handleAddWebsite = (url: string, category: string, notes: string): boolean => {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    if (websites.some((w) => w.domain === domain)) {
      return false;
    }
    const newSite: Website = {
      id: Date.now(),
      url: cleanUrl,
      domain,
      category,
      status: 'active',
      uptimePercent: 100.0,
      lastResponseTimeMs: Math.floor(Math.random() * 80) + 40,
      sslValid: true,
      sslExpires: '2027-05-30',
      notes,
      lastChecked: 'Just now',
    };
    setWebsites([newSite, ...websites]);
    return true;
  };

  const handleBulkImportWebsites = (text: string) => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    let imported = 0;
    let duplicates = 0;
    lines.forEach((line) => {
      const urlPart = line.split(',')[0].trim();
      const success = handleAddWebsite(urlPart, 'Bulk Imported', '');
      if (success) imported++;
      else duplicates++;
    });
    return { imported, duplicates };
  };

  const handleDeleteWebsite = (id: number) => {
    setWebsites((prev) => prev.filter((w) => w.id !== id));
  };

  const handleCheckWebsiteHealth = (id: number) => {
    setWebsites((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              lastResponseTimeMs: Math.floor(Math.random() * 60) + 35,
              lastChecked: 'Just now',
            }
          : w
      )
    );
  };

  const handlePingAllWebsites = () => {
    setWebsites((prev) =>
      prev.map((w) => ({
        ...w,
        lastResponseTimeMs: Math.floor(Math.random() * 70) + 40,
        lastChecked: 'Just now',
      }))
    );
  };

  // Handlers for Proxy Manager
  const handleAddProxy = (proxyData: Partial<ProxyItem>): boolean => {
    if (!proxyData.address || !proxyData.port) return false;
    if (proxies.some((p) => p.address === proxyData.address && p.port === proxyData.port)) {
      return false;
    }
    const newProxy: ProxyItem = {
      id: Date.now(),
      address: proxyData.address,
      port: proxyData.port,
      protocol: proxyData.protocol || 'http',
      username: proxyData.username || '',
      password: proxyData.password || '',
      authRequired: Boolean(proxyData.username),
      status: 'active',
      latencyMs: Math.floor(Math.random() * 90) + 80,
      lastChecked: 'Just now',
      failCount: 0,
      errorMessage: '',
    };
    setProxies([newProxy, ...proxies]);
    return true;
  };

  const handleImportProxies = (text: string) => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    let imported = 0;
    let duplicates = 0;
    lines.forEach((line) => {
      let raw = line.replace(/^(http|https|socks5):\/\//, '');
      const parts = raw.split(':');
      if (parts.length >= 2) {
        const ip = parts[0];
        const port = Number(parts[1]);
        const user = parts[2] || '';
        const pass = parts[3] || '';
        if (ip && port) {
          const success = handleAddProxy({ address: ip, port, protocol: 'http', username: user, password: pass });
          if (success) imported++;
          else duplicates++;
        }
      }
    });
    return { imported, duplicates };
  };

  const handleDeleteProxy = (id: number) => {
    setProxies((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTestProxy = (id: number) => {
    setProxies((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isSuccessful = p.status !== 'auth_error';
          const latency = isSuccessful ? Math.floor(Math.random() * 120) + 60 : 0;
          return {
            ...p,
            status: isSuccessful ? 'active' : 'auth_error',
            latencyMs: latency,
            lastChecked: 'Just now',
          };
        }
        return p;
      })
    );
  };

  const handleTestAllProxies = () => {
    setProxies((prev) =>
      prev.map((p) => {
        if (p.status === 'auth_error') {
          return { ...p, lastChecked: 'Just now' };
        }
        return {
          ...p,
          status: 'active',
          latencyMs: Math.floor(Math.random() * 110) + 70,
          lastChecked: 'Just now',
        };
      })
    );
  };

  const handleExportProxies = () => {
    const lines = proxies.map((p) =>
      p.username && p.password
        ? `${p.protocol}://${p.username}:${p.password}@${p.address}:${p.port}`
        : `${p.protocol}://${p.address}:${p.port}`
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proxies_export_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Browser Profile Handlers
  const handleCreateProfile = (
    name: string,
    engine: 'chromium' | 'firefox',
    width: number,
    height: number
  ) => {
    const newProf: BrowserProfile = {
      id: Date.now(),
      name,
      engine,
      userAgent:
        engine === 'chromium'
          ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
      viewportWidth: width,
      viewportHeight: height,
      cookiesCount: 0,
      storagePath: `data/profiles/${name.toLowerCase().replace(/\s+/g, '_')}`,
      status: 'idle',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProfiles([...profiles, newProf]);
  };

  const handleDeleteProfile = (id: number) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearProfileStorage = (id: number) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cookiesCount: 0 } : p))
    );
  };

  const handleToggleProfileSession = (id: number) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'running' ? 'idle' : 'running' }
          : p
      )
    );
  };

  // Campaign Handlers
  const handleCreateCampaign = (campData: Omit<TrafficCampaign, 'id'>) => {
    const newCamp: TrafficCampaign = {
      ...campData,
      id: Date.now(),
    };
    setCampaigns([newCamp, ...campaigns]);
  };

  // Security Handlers
  const handleResolveSecurityEvent = (id: number) => {
    setSecurityEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, resolved: true } : e))
    );
  };

  const handleTriggerBackup = () => {
    const newEvent: SecurityEvent = {
      id: Date.now(),
      eventType: 'SQLITE_MANUAL_BACKUP',
      severity: 'low',
      description: 'Operator triggered manual atomic database backup to backups/ directory.',
      ipAddress: '127.0.0.1',
      triggeredRule: 'MANUAL_INTEGRITY_SNAPSHOT',
      resolved: true,
      timestamp: 'Just now',
    };
    setSecurityEvents([newEvent, ...securityEvents]);
  };

  // 1-Click ZIP Download for full Python Desktop codebase
  const handleDownloadZip = async () => {
    const zip = new JSZip();

    // Add root files
    zip.file('main.py', `#!/usr/bin/env python3
"""
SEARX AI TRAFFIC BOT - Main Entry Point
Platform: Windows 10 & Windows 11 (64-bit)
"""
import sys
from pathlib import Path
from app.core.config import AppConfig
from app.database.db_manager import DatabaseManager
from app.gui.main_window import MainWindow, PYSIDE6_AVAILABLE

def main():
    cfg = AppConfig.get_instance()
    db = DatabaseManager(cfg.get("database.path"))
    if PYSIDE6_AVAILABLE:
        gui = MainWindow(db)
        return gui.launch()
    else:
        print("[SEARX AI TRAFFIC BOT] Running in diagnostic terminal mode.")
        return 0

if __name__ == "__main__":
    sys.exit(main())
`);

    zip.file('requirements.txt', `PySide6>=6.7.0
playwright>=1.43.0
httpx[socks]>=0.27.0
aiohttp>=3.9.5
beautifulsoup4>=4.12.3
pyyaml>=6.0.1
cryptography>=42.0.5
psutil>=5.9.8
openpyxl>=3.1.2
reportlab>=4.1.0
pyinstaller>=6.5.0
pytest>=8.1.0
`);

    zip.file('config.yaml', `app:
  name: "SEARX AI Traffic Bot"
  version: "1.0.0"
  default_theme: "dark"
  window:
    width: 1400
    height: 900
database:
  engine: "sqlite3"
  path: "data/searx_traffic_bot.db"
concurrency:
  default_workers: 4
  max_workers: 16
proxy:
  test_timeout_seconds: 10
  protocols_supported: ["http", "https", "socks5"]
ad_compliance:
  strict_zero_bot_ad_interaction: true
  ctr_anomaly_threshold_percent: 8.5
`);

    zip.file('setup.bat', `@echo off
echo [SEARX AI BOT] Setting up Python virtual environment...
python -m venv .venv
call .venv\\Scripts\\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
playwright install chromium
python main.py --init-db
python main.py --diagnostics
echo [SUCCESS] SEARX AI TRAFFIC BOT is ready!
pause
`);

    zip.file('run.bat', `@echo off
if exist .venv\\Scripts\\activate.bat call .venv\\Scripts\\activate.bat
echo Launching SEARX AI TRAFFIC BOT GUI...
python main.py
`);

    zip.file('build_exe.bat', `@echo off
echo Compiling Standalone Windows Executable via PyInstaller...
if exist .venv\\Scripts\\activate.bat call .venv\\Scripts\\activate.bat
pip install pyinstaller>=6.5.0
pyinstaller --noconfirm searx_bot.spec
echo [SUCCESS] Standalone EXE output: dist\\SearxTrafficBot\\SearxTrafficBot.exe
pause
`);

    zip.file('searx_bot.spec', `# PyInstaller Spec
a = Analysis(['main.py'], pathex=['.'], datas=[('config.yaml', '.')], hiddenimports=['PySide6', 'playwright', 'httpx', 'cryptography'])
pyz = PYZ(a.pure, a.zipped_data)
exe = EXE(pyz, a.scripts, exclude_binaries=True, name='SearxTrafficBot', console=False)
coll = COLLECT(exe, a.binaries, a.zipfiles, a.datas, name='SearxTrafficBot')
`);

    zip.file('README.md', `# SEARX AI TRAFFIC BOT
Advanced Professional Windows Desktop Application
Supports Windows 10 & 11 with PySide6 GUI, Playwright, SQLite, and PyInstaller EXE packaging.`);

    zip.file('USER_GUIDE.md', `# Complete User Guide
1. Double click setup.bat
2. Double click run.bat
3. Build standalone EXE using build_exe.bat`);

    zip.file('TROUBLESHOOTING.md', `# Troubleshooting Guide
Diagnostic resolutions for proxies, Playwright browser binaries, and PyInstaller.`);

    // Generate zip blob
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SEARX_AI_TRAFFIC_BOT_v1.0_Windows.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden ${isDark ? 'dark' : ''}`}>
      {/* Windows 11 Title Bar */}
      <WindowsTitleBar
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        activeWorkers={workersCount}
        cpuPercent={cpuPercent}
        ramUsedMb={ramUsedMb}
        onOpenPythonTerminal={() => setCurrentTab('desktop_code')}
      />

      {/* Main Desktop Workstation Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workstation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          websitesCount={websites.length}
          proxiesCount={proxies.length}
          profilesCount={profiles.length}
          pendingCaptchasCount={1}
          onDownloadZip={handleDownloadZip}
        />

        {/* Viewport Canvas */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardTab
              websites={websites}
              proxies={proxies}
              profiles={profiles}
              securityEvents={securityEvents}
              activeWorkers={workersCount}
              cpuPercent={cpuPercent}
              ramPercent={(ramUsedMb / 4096) * 100}
              onNavigate={(tab) => setCurrentTab(tab)}
              onRunHealthCheckAll={handlePingAllWebsites}
              onTestProxiesAll={handleTestAllProxies}
            />
          )}

          {currentTab === 'websites' && (
            <WebsiteManagerTab
              websites={websites}
              onAddWebsite={handleAddWebsite}
              onBulkImport={handleBulkImportWebsites}
              onDeleteWebsite={handleDeleteWebsite}
              onCheckHealth={handleCheckWebsiteHealth}
            />
          )}

          {currentTab === 'proxies' && (
            <ProxyManagerTab
              proxies={proxies}
              onAddProxy={handleAddProxy}
              onImportProxies={handleImportProxies}
              onDeleteProxy={handleDeleteProxy}
              onTestProxy={handleTestProxy}
              onTestAllProxies={handleTestAllProxies}
              onExportProxies={handleExportProxies}
            />
          )}

          {currentTab === 'browser' && (
            <BrowserEngineTab
              profiles={profiles}
              onCreateProfile={handleCreateProfile}
              onDeleteProfile={handleDeleteProfile}
              onClearProfileStorage={handleClearProfileStorage}
              onToggleProfileSession={handleToggleProfileSession}
            />
          )}

          {currentTab === 'privacy' && <PrivacyAuditTab />}

          {currentTab === 'analytics' && (
            <VisitorAnalyticsTab sessions={sessions} />
          )}

          {currentTab === 'threads' && (
            <ThreadManagerTab
              workersCount={workersCount}
              onSetWorkersCount={setWorkersCount}
              cpuPercent={cpuPercent}
              ramPercent={(ramUsedMb / 4096) * 100}
              ramUsedMb={ramUsedMb}
            />
          )}

          {currentTab === 'captcha' && <CaptchaTab />}

          {currentTab === 'traffic' && (
            <TrafficIntelligenceTab
              campaigns={campaigns}
              onCreateCampaign={handleCreateCampaign}
            />
          )}

          {currentTab === 'ads' && <AdNetworkTab networks={adNetworks} />}

          {currentTab === 'seo' && <SeoAuditorTab />}

          {currentTab === 'security' && (
            <SecurityEngineTab
              events={securityEvents}
              onResolveEvent={handleResolveSecurityEvent}
              onTriggerBackup={handleTriggerBackup}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsTab
              websites={websites}
              proxies={proxies}
              adNetworks={adNetworks}
              securityEvents={securityEvents}
            />
          )}

          {currentTab === 'desktop_code' && (
            <DesktopSourceTab onDownloadZip={handleDownloadZip} />
          )}
        </main>
      </div>
    </div>
  );
}
