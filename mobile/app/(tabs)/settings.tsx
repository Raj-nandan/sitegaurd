import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  color?: string;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace('/login');
        }
      },
    ]);
  };

  const sections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Name', value: user?.name ?? '—' },
        { icon: 'mail-outline', label: 'Email', value: user?.email ?? '—' },
        { icon: 'briefcase-outline', label: 'Role', value: user?.role ?? 'Not set' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'mail-open-outline', label: 'Email Alerts',
          value: user?.alertChannels?.includes('email') ? 'Enabled' : 'Disabled',
        },
        {
          icon: 'logo-slack', label: 'Slack Alerts',
          value: user?.alertChannels?.includes('slack') ? 'Enabled' : 'Disabled',
        },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'shield-checkmark-outline', label: 'SiteGuard Mobile', value: 'v1.0.0' },
        { icon: 'server-outline', label: 'Backend', value: process.env.EXPO_PUBLIC_API_URL?.split('//')[1]?.split(':')[0] ?? 'localhost' },
      ],
    },
  ];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 20, paddingBottom: insets.bottom + 40 }]}
    >
      <Text style={styles.pageTitle}>Account</Text>

      <View style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <View>
          <Text style={styles.userName}>{user?.name ?? 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
        </View>
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.row, idx < section.items.length - 1 && styles.rowBorder]}
                onPress={item.onPress}
                activeOpacity={item.onPress ? 0.7 : 1}
              >
                <View style={styles.rowLeft}>
                  <View style={styles.rowIcon}>
                    <Ionicons name={item.icon} size={16} color={item.color ?? Colors.textSecondary} />
                  </View>
                  <Text style={[styles.rowLabel, item.color && { color: item.color }]}>{item.label}</Text>
                </View>
                <Text style={styles.rowValue} numberOfLines={1}>{item.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20 },
  avatarCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 28 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.accentBg, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700', color: Colors.accent },
  userName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  userEmail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 15, color: Colors.textPrimary },
  rowValue: { fontSize: 13, color: Colors.textMuted, maxWidth: 150 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.dangerBg, borderRadius: 14, paddingVertical: 15, marginTop: 8 },
  logoutText: { color: Colors.danger, fontWeight: '700', fontSize: 16 },
});
