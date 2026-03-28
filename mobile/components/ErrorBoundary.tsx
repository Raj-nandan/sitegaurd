import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reloadAppAsync } from 'expo';
import { Colors } from '@/constants/colors';

interface State { hasError: boolean; error?: Error }

const ErrorFallback = ({ error, onReload }: { error?: Error; onReload: () => void }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <Text style={styles.title}>Something went wrong</Text>
      {__DEV__ && error && <Text style={styles.message}>{error.message}</Text>}
      <TouchableOpacity style={styles.btn} onPress={onReload}>
        <Text style={styles.btnText}>Reload App</Text>
      </TouchableOpacity>
    </View>
  );
};

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error) { console.error('ErrorBoundary caught:', error); }
  render() {
    if (this.state.hasError)
      return <ErrorFallback error={this.state.error} onReload={() => reloadAppAsync()} />;
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  message: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: Colors.accent, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
