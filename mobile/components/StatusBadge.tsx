import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type Status = 'up' | 'down' | 'warning' | 'unknown';

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

const config: Record<Status, { label: string; color: string; bg: string }> = {
  up:      { label: 'Online',  color: Colors.accent,  bg: Colors.accentBg },
  down:    { label: 'Down',    color: Colors.danger,  bg: Colors.dangerBg },
  warning: { label: 'Slow',    color: Colors.warning, bg: Colors.warningBg },
  unknown: { label: 'Unknown', color: Colors.textMuted, bg: 'rgba(107,114,128,0.1)' },
};

export const StatusBadge = ({ status, size = 'md' }: Props) => {
  const cfg = config[status] ?? config.unknown;
  const isSmall = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, isSmall && styles.small]}>
      <View style={[styles.dot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.label, { color: cfg.color }, isSmall && styles.smallText]}>
        {cfg.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  small: { paddingHorizontal: 8, paddingVertical: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 13, fontWeight: '600' },
  smallText: { fontSize: 11 },
});
