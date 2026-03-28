import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { StatusBadge } from './StatusBadge';

interface Client {
  _id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'warning' | 'unknown';
  responseTime?: number;
  uptime?: number;
}

interface Props {
  client: Client;
  onPress: () => void;
}

export const ClientCard = ({ client, onPress }: Props) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
    <View style={styles.header}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{client.name}</Text>
        <Text style={styles.url} numberOfLines={1}>{client.url}</Text>
      </View>
      <StatusBadge status={client.status} size="sm" />
    </View>
    <View style={styles.footer}>
      <View style={styles.metric}>
        <Ionicons name="speedometer-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.metricText}>
          {client.responseTime != null ? `${client.responseTime}ms` : '—'}
        </Text>
      </View>
      <View style={styles.metric}>
        <Ionicons name="trending-up-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.metricText}>
          {client.uptime != null ? `${client.uptime.toFixed(1)}%` : '—'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 3 },
  url: { fontSize: 12, color: Colors.textMuted },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { fontSize: 12, color: Colors.textSecondary },
});
