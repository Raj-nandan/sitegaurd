import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { Colors } from '@/constants/colors';

interface AlertItem {
  _id: string;
  clientName: string;
  type: 'down' | 'slow' | 'ssl';
  message: string;
  resolved: boolean;
  createdAt: string;
}

const alertConfig = {
  down:  { icon: 'close-circle' as const,    color: Colors.danger,  label: 'Down' },
  slow:  { icon: 'timer-outline' as const,   color: Colors.warning, label: 'Slow' },
  ssl:   { icon: 'lock-open-outline' as const, color: Colors.blue,  label: 'SSL' },
};

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const { data: alerts = [], isLoading, isFetching, refetch } = useQuery<AlertItem[]>({
    queryKey: ['/api/alerts'],
    queryFn: async () => {
      try {
        const res = await api.get('/alerts');
        return res.data;
      } catch {
        return [];
      }
    },
    refetchInterval: 60_000,
  });

  const active = alerts.filter(a => !a.resolved);
  const resolved = alerts.filter(a => a.resolved);

  const renderItem = ({ item }: { item: AlertItem }) => {
    const cfg = alertConfig[item.type] ?? alertConfig.down;
    const date = new Date(item.createdAt);
    const timeStr = date.toLocaleString();
    return (
      <View style={[styles.card, item.resolved && styles.resolvedCard]}>
        <View style={[styles.iconWrap, { backgroundColor: `${cfg.color}18` }]}>
          <Ionicons name={cfg.icon} size={18} color={item.resolved ? Colors.textMuted : cfg.color} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardTop}>
            <Text style={styles.clientName}>{item.clientName}</Text>
            <View style={[styles.typePill, { backgroundColor: `${cfg.color}18` }]}>
              <Text style={[styles.typeLabel, { color: item.resolved ? Colors.textMuted : cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.time}>{timeStr}</Text>
        </View>
        {item.resolved && (
          <Ionicons name="checkmark-circle" size={18} color={Colors.accent} />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        {active.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{active.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={[...active, ...resolved]}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={Colors.accent} />
        }
        ListHeaderComponent={
          resolved.length > 0 && active.length > 0 ? (
            <View style={styles.separator}>
              <Text style={styles.separatorText}>Active · {active.length}</Text>
            </View>
          ) : null
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No alerts</Text>
            <Text style={styles.emptySubtitle}>All your sites are healthy</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary },
  badge: { backgroundColor: Colors.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  separator: { marginBottom: 12 },
  separatorText: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  resolvedCard: { opacity: 0.55 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardInfo: { flex: 1, gap: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clientName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  typePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  typeLabel: { fontSize: 11, fontWeight: '700' },
  message: { fontSize: 13, color: Colors.textSecondary },
  time: { fontSize: 11, color: Colors.textMuted },
  empty: { alignItems: 'center', paddingVertical: 80, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  emptySubtitle: { fontSize: 13, color: Colors.textMuted },
});
