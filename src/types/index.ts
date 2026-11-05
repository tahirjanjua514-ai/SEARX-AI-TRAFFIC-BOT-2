export type NavigationTab =
  | 'dashboard'
  | 'websites'
  | 'proxies'
  | 'browser'
  | 'privacy'
  | 'analytics'
  | 'threads'
  | 'captcha'
  | 'traffic'
  | 'ads'
  | 'seo'
  | 'security'
  | 'reports'
  | 'desktop_code';

export interface Website {
  id: number;
  url: string;
  domain: string;
  category: string;
  status: 'active' | 'degraded' | 'offline';
  uptimePercent: number;
  lastResponseTimeMs: number;
  sslValid: boolean;
  sslExpires: string;
  notes: string;
  lastChecked: string;
}

export interface ProxyItem {
  id: number;
  address: string;
  port: number;
  protocol: 'http' | 'https' | 'socks5';
  username?: string;
  password?: string;
  authRequired: boolean;
  status: 'active' | 'failed' | 'timeout' | 'untested' | 'auth_error';
  latencyMs: number;
  lastChecked: string;
  failCount: number;
  errorMessage: string;
}

export interface BrowserProfile {
  id: number;
  name: string;
  engine: 'chromium' | 'firefox';
  userAgent: string;
  viewportWidth: number;
  viewportHeight: number;
  cookiesCount: number;
  storagePath: string;
  status: 'idle' | 'running' | 'paused';
  createdAt: string;
}

export interface VisitorSession {
  id: number;
  sessionUuid: string;
  visitorType: 'new' | 'returning';
  country: string;
  countryCode: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: 'Chrome' | 'Firefox' | 'Edge' | 'Safari';
  landingPage: string;
  referrer: string;
  durationSec: number;
  engagementScore: number;
  converted: boolean;
  timestamp: string;
}

export interface TrafficCampaign {
  id: number;
  campaignName: string;
  source: string;
  medium: string;
  utmCampaign: string;
  budget: number;
  cost: number;
  clicks: number;
  conversions: number;
  roi: number;
  status: 'active' | 'paused' | 'completed';
}

export interface AdNetworkMetric {
  network: string;
  impressions: number;
  clicks: number;
  ctr: number;
  rpm: number;
  revenue: number;
  policyStatus: 'Compliant' | 'Warning' | 'High Risk';
  riskIndicator: 'Low' | 'Medium' | 'High';
}

export interface SecurityEvent {
  id: number;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  triggeredRule: string;
  resolved: boolean;
  timestamp: string;
}

export interface SystemResourceMetrics {
  cpuPercent: number;
  ramPercent: number;
  ramUsedMb: number;
  ramTotalMb: number;
  activeWorkers: number;
  maxWorkers: number;
  taskQueueCount: number;
  completedTasks: number;
  failedTasks: number;
}
