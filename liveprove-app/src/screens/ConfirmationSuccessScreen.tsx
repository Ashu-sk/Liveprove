import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SEVERITY_COLORS = { critical: '#ff3355', high: '#ffaa00', medium: '#0066ff', low: '#00ff88' };

export default function ConfirmationSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { aiSummary, authority, severity } = route.params as any;
  const sevKey = severity as keyof typeof SEVERITY_COLORS;
  const sevColor = SEVERITY_COLORS[sevKey] ?? '#888';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.inner}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.title}>Report Submitted</Text>
        <Text style={styles.summary}>{aiSummary}</Text>
        <View style={styles.detailRow}>
          <View style={[styles.pill, { borderColor: '#0066ff' }]}>
            <Text style={[styles.pillText, { color: '#0066ff' }]}>🚔 {authority}</Text>
          </View>
          <View style={[styles.pill, { borderColor: sevColor }]}>
            <Text style={[styles.pillText, { color: sevColor }]}>⚡ {severity}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home' as never)}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.anotherBtn} onPress={() => navigation.navigate('Report' as never)}>
          <Text style={styles.anotherBtnText}>Report Another</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  checkCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#00ff8822', borderWidth: 2, borderColor: '#00ff88', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  checkMark: { fontSize: 48, color: '#00ff88' },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  summary: { color: '#8899aa', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  detailRow: { flexDirection: 'row', gap: 12, marginBottom: 48 },
  pill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#0a0f1e' },
  pillText: { fontSize: 13, fontWeight: '600' },
  homeBtn: { backgroundColor: '#0066ff', width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#0044cc' },
  homeBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  anotherBtn: { borderWidth: 1, borderColor: '#0066ff33', width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', backgroundColor: '#0a0f1e' },
  anotherBtnText: { color: '#8899aa', fontSize: 16 },
});

