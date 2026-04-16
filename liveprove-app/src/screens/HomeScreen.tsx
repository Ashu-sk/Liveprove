import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MOCK_INCIDENTS = [
  { id: '1', severity: 'critical', summary: 'Physical assault reported near metro exit, suspect fleeing north', location: 'Rajiv Chowk, Delhi', authority: 'Police', time: '2 min ago' },
  { id: '2', severity: 'high', summary: 'Eve teasing incident at bus stop, 2 men harassing woman', location: 'Sector 18, Noida', authority: 'Police', time: '8 min ago' },
  { id: '3', severity: 'high', summary: 'Suspicious person loitering outside school premises for 1 hour', location: 'Vasant Kunj, Delhi', authority: 'Police', time: '21 min ago' },
  { id: '4', severity: 'medium', summary: 'Illegal garbage dumping beside residential colony gate', location: 'Dwarka Sector 7, Delhi', authority: 'Municipal Corp', time: '45 min ago' },
  { id: '5', severity: 'low', summary: 'Traffic signal violation, vehicles jumping red light repeatedly', location: 'ITO Crossing, Delhi', authority: 'Traffic Police', time: '1 hr ago' },
];

const SEVERITY_COLORS: Record<string, string> = { critical: '#ff3333', high: '#ff8c00', medium: '#f5c518', low: '#00c853' };

function IncidentCard({ item }: Readonly<{ item: any }>) {
  const color = SEVERITY_COLORS[item.severity] || '#888';
  return (
    <View style={styles.card}>
      <View style={[styles.severityBar, { backgroundColor: color }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
          <View style={[styles.authorityBadge, { borderColor: color }]}>
            <Text style={[styles.authorityText, { color }]}>{item.authority}</Text>
          </View>
        </View>
        <View style={styles.cardBottom}>
          <Text style={styles.location}>📍 {item.location}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.verified}>✓ Verified by AI</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('Nearby');
  const filters = ['Nearby', 'State', 'National'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.logo}>LiveProve</Text>
          <Text style={styles.city}>New Delhi</Text>
        </View>
        <View style={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterPill, filter === f && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={MOCK_INCIDENTS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <IncidentCard item={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.reportBtn} onPress={() => navigation.navigate('Report' as never)}>
          <Text style={styles.reportBtnText}>🚨</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  logo: { color: '#ff3333', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  city: { color: '#888', fontSize: 13 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  filterPillActive: { backgroundColor: '#ff3333', borderColor: '#ff3333' },
  filterText: { color: '#888', fontSize: 13 },
  filterTextActive: { color: 'white', fontWeight: '600' },
  card: { flexDirection: 'row', backgroundColor: '#1a1a1a', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, borderWidth: 1, borderColor: '#2a2a2a', overflow: 'hidden' },
  severityBar: { width: 4 },
  cardContent: { flex: 1, padding: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  summary: { flex: 1, color: 'white', fontSize: 14, lineHeight: 20 },
  authorityBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  authorityText: { fontSize: 11, fontWeight: '600' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  location: { color: '#888', fontSize: 12 },
  time: { color: '#555', fontSize: 11 },
  verified: { color: '#00c853', fontSize: 11, marginTop: 6 },
  reportBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', width: 64, height: 64, borderRadius: 32, backgroundColor: '#ff3333', alignItems: 'center', justifyContent: 'center', shadowColor: '#ff3333', shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  reportBtnText: { fontSize: 28 },
});

