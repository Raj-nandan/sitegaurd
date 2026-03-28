// Client types
export type SiteStatus = 'up' | 'down' | 'warn';

export interface Client {
  _id: string;
  name: string;
  url: string;
  status: SiteStatus;
  uptime90d: number;
  avgResponseMs: number;
  sslExpiresInDays: number;
  domainExpiresInDays: number;
  lastChecked: string;
  createdAt: string;
}

export interface AddClientPayload {
  name: string;
  url: string;
  contactEmail?: string;
  checkInterval?: number;
  alertChannels?: string[];
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface ClientMetrics {
  responseTimeSeries: MetricPoint[];
  uptimeHistory: boolean[];
  endpointStats: { endpoint: string; avgMs: number }[];
}

export interface LogEntry {
  id: string;
  statusCode: number;
  method: string;
  path: string;
  responseMs: number;
  timestamp: string;
}

export interface WebVitals {
  LCP: number;
  FID: number;
  CLS: number;
  TTFB: number;
  FCP: number;
  INP: number;
  lighthouseScore: number;
}

export interface SSLInfo {
  issuer: string;
  expiresInDays: number;
  protocol: string;
  grade: string;
}

export interface DomainInfo {
  registrar: string;
  expiresInDays: number;
  nameservers: string[];
  dnssec: boolean;
}
