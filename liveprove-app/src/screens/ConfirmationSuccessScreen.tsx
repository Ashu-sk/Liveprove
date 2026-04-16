import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SEVERITY_COLORS = { critical: '#ff3333', high: '#ff8c00', medium: '#f5c518', low: '#00c853' };

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
          <View style={[styles.pill, { borderColor: '#ff3333' }]}>
            <Text style={[styles.pillText, { color: '#ff3333' }]}>🚔 {authority}</Text>
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
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  checkCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#00c85322', borderWidth: 2, borderColor: '#00c853', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  checkMark: { fontSize: 48, color: '#00c853' },
  title: { color: 'white', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  summary: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  detailRow: { flexDirection: 'row', gap: 12, marginBottom: 48 },
  pill: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  pillText: { fontSize: 13, fontWeight: '600' },
  homeBtn: { backgroundColor: '#ff3333', width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  homeBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  anotherBtn: { borderWidth: 1, borderColor: '#333', width: '100%', padding: 18, borderRadius: 16, alignItems: 'center' },
  anotherBtnText: { color: '#888', fontSize: 16 },
});

