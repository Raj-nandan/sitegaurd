import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { Colors } from '@/constants/colors';
import { StatusBadge } from '@/components/StatusBadge';

interface ClientDetail {
  _id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'warning' | 'unknown';
  responseTime?: number;
  uptime?: number;
  sslValid?: boolean;
  sslDaysLeft?: number;
  lastChecked?: string;
}

interface Metrics {
  uptime30d?: number;
  avgResponseTime?: number;
  totalChecks?: number;
  totalDowntime?: number;
}

interface LogEntry {
  _id: string;
  status: string;
  responseTime: number;
  checkedAt: string;
  statusCode?: number;
}

const TABS = ['Overview', 'Logs', 'SSL'] as const;
type Tab = typeof TABS[number];

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const { data: client, isLoading } = useQuery<ClientDetail>({
    queryKey: ['/api/clients', id],
    queryFn: async () => (await api.get(`/clients/${id}`)).data,
    enabled: !!id,
  });

  const { data: metrics } = useQuery<Metrics>({
    queryKey: ['/api/clients', id, 'metrics'],
    queryFn: async () => (await api.get(`/clients/${id}/metrics`)).data,
    enabled: !!id && activeTab === 'Overview',
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery<LogEntry[]>({
    queryKey: ['/api/clients', id, 'logs'],
    queryFn: async () => (await api.get(`/clients/${id}/logs`)).data,
    enabled: !!id && activeTab === 'Logs',
  });

  const { data: ssl } = useQuery<{ valid: boolean; daysLeft?: number; issuer?: string; expires?: string }>({
    queryKey: ['/api/clients', id, 'ssl'],
    queryFn: async () => (await api.get(`/clients/${id}/ssl`)).data,
    enabled: !!id && activeTab === 'SSL',
  });

  if (isLoading) {
    return (
      <View style={[styles.root, { paddingTop: topPad, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.clientName} numberOfLines={1}>{client?.name ?? '—'}</Text>
          <Text style={styles.clientUrl} numberOfLines={1}>{client?.url ?? ''}</Text>
        </View>
        {client && <StatusBadge status={client.status} size="sm" />}
      </View>

      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        {activeTab === 'Overview' && (
          <View style={styles.section}>
            <View style={styles.metricGrid}>
              <MetricBox label="Uptime (30d)" value={metrics?.uptime30d != null ? `${metrics.uptime30d.toFixed(1)}%` : client?.uptime != null ? `${client.uptime.toFixed(1)}%` : '—'} icon="trending-up-outline" color={Colors.accent} />
              <MetricBox label="Avg Response" value={metrics?.avgResponseTime != null ? `${metrics.avgResponseTime}ms` : client?.responseTime != null ? `${client.responseTime}ms` : '—'} icon="speedometer-outline" color={Colors.blue} />
              <MetricBox label="Total Checks" value={metrics?.totalChecks ?? '—'} icon="checkmark-circle-outline" color={Colors.textSecondary} />
              <MetricBox label="Total Downtime" value={metrics?.totalDowntime != null ? `${metrics.totalDowntime}m` : '—'} icon="time-outline" color={Colors.warning} />
            </View>
            {client?.lastChecked && (
              <Text style={styles.lastChecked}>
                Last checked: {new Date(client.lastChecked).toLocaleString()}
              </Text>
            )}
          </View>
        )}

        {activeTab === 'Logs' && (
          <View style={styles.section}>
            {logsLoading ? (
              <ActivityIndicator color={Colors.accent} style={{ marginTop: 30 }} />
            ) : logs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={32} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No logs yet</Text>
              </View>
            ) : logs.slice(0, 50).map((log, i) => (
              <View key={log._id ?? i} style={styles.logRow}>
                <View style={[styles.logDot, { backgroundColor: log.status === 'up' ? Colors.accent : Colors.danger }]} />
                <View style={styles.logInfo}>
                  <Text style={styles.logTime}>{new Date(log.checkedAt).toLocaleString()}</Text>
                  {log.statusCode && <Text style={styles.logCode}>HTTP {log.statusCode}</Text>}
                </View>
                <Text style={[styles.logMs, { color: log.responseTime > 2000 ? Colors.warning : Colors.textSecondary }]}>
                  {log.responseTime}ms
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'SSL' && (
          <View style={styles.section}>
            {ssl ? (
              <View style={styles.sslCard}>
                <View style={[styles.sslStatus, { backgroundColor: ssl.valid ? Colors.accentBg : Colors.dangerBg }]}>
                  <Ionicons name={ssl.valid ? 'shield-checkmark' : 'shield-outline'} size={24} color={ssl.valid ? Colors.accent : Colors.danger} />
                  <Text style={[styles.sslStatusText, { color: ssl.valid ? Colors.accent : Colors.danger }]}>
                    {ssl.valid ? 'Valid Certificate' : 'Invalid / Expired'}
                  </Text>
                </View>
                <SslRow label="Days Until Expiry" value={ssl.daysLeft != null ? `${ssl.daysLeft} days` : '—'} />
                <SslRow label="Expiry Date" value={ssl.expires ? new Date(ssl.expires).toLocaleDateString() : '—'} />
                <SslRow label="Issuer" value={ssl.issuer ?? '—'} />
              </View>
            ) : (
              <View style={styles.emptyState}>
                <ActivityIndicator color={Colors.accent} />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MetricBox({ label, value, icon, color }: { label: string; value: string | number; icon: keyof typeof Ionicons.glyphMap; color: string }) {
  return (
    <View style={mbStyles.box}>
      <Ionicons name={icon} size={18} color={color} style={{ marginBottom: 8 }} />
      <Text style={mbStyles.value}>{value}</Text>
      <Text style={mbStyles.label}>{label}</Text>
    </View>
  );
}

function SslRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={sslStyles.row}>
      <Text style={sslStyles.label}>{label}</Text>
      <Text style={sslStyles.value}>{value}</Text>
    </View>
  );
}

const mbStyles = StyleSheet.create({
  box: { width: '47%', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.border },
  value: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  label: { fontSize: 12, color: Colors.textSecondary },
});

const sslStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { fontSize: 14, color: Colors.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  headerInfo: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  clientUrl: { fontSize: 12, color: Colors.textMuted },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  activeTab: { backgroundColor: Colors.accentBg, borderColor: Colors.accent },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  activeTabText: { color: Colors.accent },
  content: { paddingHorizontal: 16 },
  section: { gap: 10 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  lastChecked: { fontSize: 12, color: Colors.textMuted, marginTop: 4, textAlign: 'center' },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.border },
  logDot: { width: 8, height: 8, borderRadius: 4 },
  logInfo: { flex: 1 },
  logTime: { fontSize: 12, color: Colors.textSecondary },
  logCode: { fontSize: 11, color: Colors.textMuted },
  logMs: { fontSize: 13, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { color: Colors.textMuted, fontSize: 14 },
  sslCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: Colors.border, gap: 4 },
  sslStatus: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 14, marginBottom: 8 },
  sslStatusText: { fontSize: 16, fontWeight: '700' },
});
