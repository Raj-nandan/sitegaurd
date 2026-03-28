import { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, RefreshControl, ActivityIndicator, Modal,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { api } from '@/lib/api';
import { Colors } from '@/constants/colors';
import { ClientCard } from '@/components/ClientCard';

interface Client {
  _id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'warning' | 'unknown';
  responseTime?: number;
  uptime?: number;
}

export default function ClientsScreen() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [formError, setFormError] = useState('');
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const { data: clients = [], isLoading, isFetching, refetch } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      const res = await api.get('/clients');
      return res.data;
    },
    refetchInterval: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/clients', { name: newName.trim(), url: newUrl.trim() });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/clients'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowModal(false);
      setNewName(''); setNewUrl(''); setFormError('');
    },
    onError: (e: any) => {
      setFormError(e?.response?.data?.message || 'Failed to add site');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/clients/${id}`); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['/api/clients'] }); },
  });

  const handleAdd = () => {
    if (!newName || !newUrl) { setFormError('Please fill in all fields'); return; }
    if (!newUrl.startsWith('http')) { setFormError('URL must start with http:// or https://'); return; }
    setFormError('');
    addMutation.mutate();
  };

  const handleDelete = (client: Client) => {
    Alert.alert('Remove Site', `Remove "${client.name}" from monitoring?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(client._id) },
    ]);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Sites</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search sites..."
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.accent} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={Colors.accent} />
          }
          renderItem={({ item }) => (
            <ClientCard
              client={item}
              onPress={() => router.push(`/client/${item._id}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="globe-outline" size={36} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>{search ? 'No results' : 'No sites yet'}</Text>
              <Text style={styles.emptySubtitle}>
                {search ? 'Try a different search' : 'Tap + to add your first site'}
              </Text>
            </View>
          }
        />
      )}

      <Modal visible={showModal} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowModal(false)} />
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Site</Text>
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Site Name</Text>
              <TextInput style={styles.input} value={newName} onChangeText={setNewName}
                placeholder="My Client Site" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>URL</Text>
              <TextInput style={styles.input} value={newUrl} onChangeText={setNewUrl}
                placeholder="https://example.com" placeholderTextColor={Colors.textMuted}
                keyboardType="url" autoCapitalize="none" autoCorrect={false} />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd} disabled={addMutation.isPending}>
              {addMutation.isPending
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.submitText}>Add Site</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, marginHorizontal: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  searchIcon: { paddingLeft: 14 },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15, color: Colors.textPrimary },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  emptySubtitle: { fontSize: 13, color: Colors.textMuted },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { backgroundColor: Colors.surfaceElevated, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  formError: { color: Colors.danger, fontSize: 13 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  input: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: Colors.textPrimary },
  submitBtn: { backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
