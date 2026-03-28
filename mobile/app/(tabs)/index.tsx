import { ScrollView, View, Text, StyleSheet, RefreshControl, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { Colors } from '@/constants/colors';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';

interface Overview {
  totalSites: number;
  avgUptime: number;
  incidentsToday: number;
  sslExpiring: number;
  recentActivity?: Array<{ name: string; status: string; time: string }>;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, refetch, isFetching } = useQuery<Overview>({
    queryKey: ['/api/metrics/overview'],
    queryFn: async () => {
      const res = await api.get('/metrics/overview');
      return res.data;
    },
    refetchInterval: 30_000,
  });

  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 20, paddingBottom: insets.bottom + 24 }]}
      refreshControl={
        <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={Colors.accent} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {isError && (
        <View style={styles.errorBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color={Colors.danger} />
          <Text style={styles.errorText}>Could not reach backend. Check your connection.</Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingGrid}>
          {[0,1,2,3].map(i => <View key={i} style={styles.skeleton} />)}
        </View>
      ) : (
        <View style={styles.grid}>
          <StatCard
            label="Total Sites"
            value={data?.totalSites ?? 0}
            icon="globe-outline"
            color={Colors.blue}
          />
          <StatCard
            label="Avg Uptime (30d)"
            value={data?.avgUptime != null ? `${data.avgUptime.toFixed(1)}%` : '—'}
            icon="trending-up-outline"
            color={Colors.accent}
          />
          <StatCard
            label="Incidents Today"
            value={data?.incidentsToday ?? 0}
            icon="warning-outline"
            color={data?.incidentsToday ? Colors.danger : Colors.textMuted}
          />
          <StatCard
            label="SSL Expiring"
            value={data?.sslExpiring ?? 0}
            icon="lock-closed-outline"
            color={data?.sslExpiring ? Colors.warning : Colors.textMuted}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {data?.recentActivity?.length ? (
        data.recentActivity.map((item, i) => (
          <View key={i} style={styles.activityRow}>
            <StatusBadge status={item.status as any} size="sm" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityName}>{item.name}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={32} color={Colors.accent} />
          <Text style={styles.emptyText}>All systems operational</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontSize: 13, color: Colors.textMuted, marginBottom: 2 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.accentBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.accent },
  liveText: { fontSize: 12, fontWeight: '600', color: Colors.accent },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.dangerBg, borderRadius: 10, padding: 12, marginBottom: 20 },
  errorText: { color: Colors.danger, fontSize: 13, flex: 1 },
  loadingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  skeleton: { width: '47%', height: 100, backgroundColor: Colors.surface, borderRadius: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  activityTime: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
