import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, StatusBar } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const PINS = [
  { id: '1', x: 0.3, y: 0.35, severity: 'critical', label: 'Assault', count: 3 },
  { id: '2', x: 0.65, y: 0.28, severity: 'high', label: 'Harassment', count: 1 },
  { id: '3', x: 0.5, y: 0.55, severity: 'critical', label: 'WANTED', count: 1, isWanted: true },
  { id: '4', x: 0.22, y: 0.62, severity: 'medium', label: 'Traffic', count: 2 },
  { id: '5', x: 0.78, y: 0.48, severity: 'high', label: 'Suspicious', count: 1 },
  { id: '6', x: 0.42, y: 0.72, severity: 'low', label: 'Littering', count: 4 },
];

const SEV_COLORS: Record<string, string> = { critical: '#ff3355', high: '#ffaa00', medium: '#0066ff', low: '#00ff88' };

export default function MapScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<'city' | 'state' | 'national'>('city');
  const mapH = H - 200;

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={S.header}>
          <Text style={S.title}>Live Incident Map</Text>
          <Text style={S.subtitle}>New Delhi, India</Text>
        </View>

        <View style={S.viewToggle}>
          {(['city', 'state', 'national'] as const).map(v => (
            <TouchableOpacity key={v} style={[S.viewBtn, view === v && S.viewBtnActive]} onPress={() => setView(v)}>
              <Text style={[S.viewBtnTxt, view === v && S.viewBtnTxtActive]}>{v.charAt(0).toUpperCase() + v.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[S.mapContainer, { height: mapH }]}>
          <View style={StyleSheet.absoluteFill}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} style={[S.gridLine, { top: `${(i + 1) * 8}%` }]} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={[S.gridLineV, { left: `${(i + 1) * 12.5}%` }]} />
            ))}
          </View>
          <View style={[S.mapDistrict, { top: '20%', left: '15%', width: '35%', height: '25%' }]} />
          <View style={[S.mapDistrict, { top: '45%', left: '30%', width: '45%', height: '20%', opacity: 0.5 }]} />
          <View style={[S.mapRoad, { top: '40%', left: 0, right: 0, height: 2 }]} />
          <View style={[S.mapRoad, { top: 0, bottom: 0, left: '50%', width: 2 }]} />
          <View style={[S.mapRoad, { top: '65%', left: 0, right: 0, height: 1, opacity: 0.4 }]} />

          {PINS.map((pin: any) => {
            const color = SEV_COLORS[pin.severity];
            const isSelected = selected === pin.id;
            return (
              <TouchableOpacity
                key={pin.id}
                style={[
                  S.pin,
                  {
                    left: pin.x * (W - 32) - 20,
                    top: pin.y * mapH - 20,
                    borderColor: color,
                    backgroundColor: pin.isWanted ? '#ff335522' : '#000a1a',
                    transform: [{ scale: isSelected ? 1.3 : 1 }],
                  },
                ]}
                onPress={() => setSelected(isSelected ? null : pin.id)}
                activeOpacity={0.9}
              >
                <View style={[S.pinDot, { backgroundColor: color }]} />
                <Text style={[S.pinLabel, { color }]}>{pin.label}</Text>
                {pin.count > 1 && (
                  <View style={[S.pinCount, { backgroundColor: color }]}>
                    <Text style={S.pinCountTxt}>{pin.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <View style={S.mapLegend}>
            {Object.entries(SEV_COLORS).map(([k, c]) => (
              <View key={k} style={S.legendItem}>
                <View style={[S.legendDot, { backgroundColor: c }]} />
                <Text style={S.legendTxt}>{k}</Text>
              </View>
            ))}
          </View>

          <View style={S.liveIndicator}>
            <View style={S.liveDot} />
            <Text style={S.liveTxt}>LIVE</Text>
          </View>
        </View>

        <View style={S.statsBar}>
          <View style={S.statItem}>
            <Text style={S.statNum}>6</Text>
            <Text style={S.statLbl}>Active</Text>
          </View>
          <View style={S.statItem}>
            <Text style={[S.statNum, { color: '#ff3355' }]}>2</Text>
            <Text style={S.statLbl}>Critical</Text>
          </View>
          <View style={S.statItem}>
            <Text style={[S.statNum, { color: '#ffd700' }]}>1</Text>
            <Text style={S.statLbl}>Wanted</Text>
          </View>
          <View style={S.statItem}>
            <Text style={[S.statNum, { color: '#00ff88' }]}>12</Text>
            <Text style={S.statLbl}>Resolved</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#0066ff', fontSize: 12, marginTop: 2 },
  viewToggle: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#070d1c', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#0066ff18' },
  viewBtn: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 9 },
  viewBtnActive: { backgroundColor: '#0055dd' },
  viewBtnTxt: { color: '#334455', fontSize: 12, fontWeight: '700' },
  viewBtnTxtActive: { color: '#fff' },
  mapContainer: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: '#020814', borderWidth: 1, borderColor: '#0066ff22' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#0066ff08' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#0066ff08' },
  mapDistrict: { position: 'absolute', borderWidth: 1, borderColor: '#0066ff18', borderRadius: 8, backgroundColor: '#0066ff06' },
  mapRoad: { position: 'absolute', backgroundColor: '#0066ff15' },
  pin: { position: 'absolute', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 5, minWidth: 60 },
  pinDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  pinLabel: { fontSize: 9, fontWeight: '800' },
  pinCount: { position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pinCountTxt: { color: '#000', fontSize: 9, fontWeight: '900' },
  mapLegend: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 8, padding: 8, gap: 4, borderWidth: 1, borderColor: '#0066ff18' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendTxt: { color: '#556677', fontSize: 9 },
  liveIndicator: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 8, padding: 6, borderWidth: 1, borderColor: '#ff335544' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ff3355' },
  liveTxt: { color: '#ff3355', fontSize: 10, fontWeight: '900' },
  statsBar: { flexDirection: 'row', paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#0066ff18' },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { color: '#0088ff', fontSize: 22, fontWeight: '900' },
  statLbl: { color: '#334455', fontSize: 10, marginTop: 2 },
});

