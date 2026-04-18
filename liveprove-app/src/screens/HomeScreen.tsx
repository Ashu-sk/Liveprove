import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: W } = Dimensions.get('window');

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

const INCIDENTS = [
  { id:'1', type:'video', severity:'critical', authority:'Police',
    summary:'Physical assault near metro exit — suspect fleeing north on foot',
    location:'Rajiv Chowk, Delhi', time:'2m ago', isAnonymous:true,
    views:1243, reward:null, isWanted:false,
    thumbColor:['#0d0020','#020010'] },
  { id:'2', type:'wanted', severity:'critical', authority:'Police',
    summary:'Armed robbery suspect — last seen near CP market area. Report sighting.',
    location:'Connaught Place, Delhi', time:'1h ago', isAnonymous:false,
    username:'CrimeWatch_DL', views:15420, reward:50000, isWanted:true,
    thumbColor:['#200005','#0a0002'] },
  { id:'3', type:'video', severity:'high', authority:'Police',
    summary:'Eve teasing at bus stop — 2 men harassing woman, ongoing',
    location:'Sector 18, Noida', time:'8m ago', isAnonymous:false,
    username:'Rahul_K', views:892, reward:500, isWanted:false,
    thumbColor:['#001020','#000510'] },
  { id:'4', type:'photo', severity:'high', authority:'Police',
    summary:'Suspicious person loitering outside school for over 1 hour',
    location:'Vasant Kunj, Delhi', time:'21m ago', isAnonymous:true,
    views:334, reward:null, isWanted:false,
    thumbColor:['#001a00','#000a00'] },
  { id:'5', type:'wanted', severity:'critical', authority:'Police + CBI',
    summary:'Kidnapping suspect wanted for 3 cases across Delhi NCR',
    location:'Last seen: Dwarka', time:'3h ago', isAnonymous:false,
    username:'SafetyNet_India', views:42100, reward:200000, isWanted:true,
    thumbColor:['#1a0000','#080000'] },
  { id:'6', type:'video', severity:'medium', authority:'Traffic Police',
    summary:'Reckless driving + road rage — vehicle registration captured',
    location:'NH-48, Gurugram', time:'34m ago', isAnonymous:true,
    views:556, reward:200, isWanted:false,
    thumbColor:['#001010','#000808'] },
];

const SEV: Record<string, string> = { critical:'#ff3355', high:'#ffaa00', medium:'#0066ff', low:'#00ff88' };

function PressableCard({ children, onPress, style }: Readonly<{ children: React.ReactNode; onPress?: () => void; style?: any }>) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={() => {
          Animated.sequence([
            Animated.timing(scale, { toValue: 0.98, duration: 90, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
          ]).start();
          onPress?.();
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function IncidentCard({ item }: Readonly<{ item: any }>) {
  const nav = useNavigation<any>();
  const sc = SEV[item.severity] || '#0066ff';
  const thumbH = ((W - 32) * 9) / 16;

  return (
    <PressableCard
      style={[S.card, item.isWanted && S.cardWanted]}
      onPress={() => nav.navigate('IncidentDetail' as never)}
    >
      <View style={[S.thumb, { height: thumbH, backgroundColor: item.thumbColor?.[0] ?? '#070d1c' }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: item.thumbColor?.[1] ?? '#020814', opacity: 0.65 }]} />

        {item.isWanted && (
          <View style={S.wantedRibbon}>
            <Text style={S.wantedTxt}>WANTED</Text>
          </View>
        )}

        <View style={S.geoCorner}>
          <Text style={S.geoCornerTxt}>GEO</Text>
          <View style={[S.geoDot, { backgroundColor: sc }]} />
        </View>

        <View style={S.thumbBottom}>
          <View style={[S.sevDot, { backgroundColor: sc }]} />
          <Text style={S.thumbLoc} numberOfLines={1}>📍 {item.location}</Text>
          <Text style={S.thumbTime}>{item.time}</Text>
        </View>
      </View>

      <View style={S.body}>
        <View style={S.badgesRow}>
          <View style={[S.badge, { borderColor: '#0066ff22' }]}>
            <Text style={[S.badgeTxt, { color: '#0066ff' }]}>{item.authority}</Text>
          </View>
          {item.reward ? (
            <View style={[S.badge, S.badgeReward]}>
              <Text style={S.badgeRewardTxt}>🏆 ₹{item.reward.toLocaleString()}</Text>
            </View>
          ) : null}
          <View style={[S.badge, { borderColor: `${sc}55` }]}>
            <Text style={[S.badgeTxt, { color: sc }]}>{String(item.severity).toUpperCase()}</Text>
          </View>
        </View>

        <Text style={S.summary} numberOfLines={2}>{item.summary}</Text>
        <View style={S.divider} />

        <View style={S.footer}>
          {item.isAnonymous ? (
            <View style={S.anonPill}><Text style={S.anonTxt}>🎭 Anonymous</Text></View>
          ) : (
            <View style={S.openPill}><Text style={S.openTxt}>👤 {item.username}</Text></View>
          )}
          <View style={S.footerRight}>
            <Text style={S.stat}>👁 {Number(item.views ?? 0).toLocaleString()}</Text>
            <Text style={S.aiOk}>✓ AI</Text>
          </View>
        </View>
      </View>
    </PressableCard>
  );
}

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [filter, setFilter] = useState('Nearby');
  const [state, setState] = useState('');
  const [stateModal, setStateModal] = useState(false);
  const [mode, setMode] = useState<'anon' | 'open'>('anon');

  const filtered = useMemo(() => {
    if (filter === '⚠ Wanted') return INCIDENTS.filter(i => i.isWanted);
    if (filter === '💰 Rewards') return INCIDENTS.filter(i => i.reward);
    return INCIDENTS;
  }, [filter]);

  const FILTERS = ['Nearby', 'State', 'National', '⚠ Wanted', '💰 Rewards'];

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={S.header}>
          <View>
            <Text style={S.logo}>LIVEPROVE</Text>
            <Text style={S.tagline}>CITIZEN SAFETY NETWORK</Text>
          </View>
          <View style={S.headerRight}>
            <TouchableOpacity style={[S.modePill, mode === 'open' && S.modePillOpen]} onPress={() => setMode(mode === 'anon' ? 'open' : 'anon')}>
              <Text style={{ fontSize: 13 }}>{mode === 'anon' ? '🎭' : '👤'}</Text>
              <Text style={[S.modeTxt, mode === 'open' && { color: '#ffd700' }]}>{mode === 'anon' ? 'Anon' : 'Open'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44 }} contentContainerStyle={S.filterRow}>
          {FILTERS.map(f => {
            const isActive = filter === f || (f === 'State' && state);
            const isWanted = f === '⚠ Wanted';
            const isReward = f === '💰 Rewards';
            return (
              <TouchableOpacity
                key={f}
                style={[S.fpill, isActive && S.fpillActive, isWanted && !isActive && S.fpillWanted, isReward && !isActive && S.fpillReward]}
                onPress={() => {
                  if (f === 'State') setStateModal(true);
                  else { setFilter(f); setState(''); }
                }}
              >
                <Text
                  style={[
                    S.ftxt,
                    isActive && S.ftxtActive,
                    isWanted && !isActive && { color: '#ff3355' },
                    isReward && !isActive && { color: '#ffd700' },
                  ]}
                  numberOfLines={1}
                >
                  {f === 'State' && state ? state : f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <IncidentCard item={item} />}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />

        <Modal visible={stateModal} transparent animationType="slide">
          <View style={S.modalBg}>
            <View style={S.modalBox}>
              <View style={S.modalHead}>
                <Text style={S.modalTitle}>Select State</Text>
                <TouchableOpacity onPress={() => setStateModal(false)}>
                  <Text style={{ color: '#334455', fontSize: 22 }}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                {STATES.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={S.stateRow}
                    onPress={() => { setState(s); setFilter('State'); setStateModal(false); }}
                  >
                    <Text style={S.stateTxt}>{s}</Text>
                    <Text style={{ color: '#0066ff', fontSize: 20 }}>›</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#0066ff18' },
  logo: { color: '#0066ff', fontSize: 21, fontWeight: '900', letterSpacing: 2 },
  tagline: { color: '#334455', fontSize: 9, letterSpacing: 1.5, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0a0f1e', borderWidth: 1, borderColor: '#0066ff22', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  modePillOpen: { borderColor: '#ffd70033', backgroundColor: '#120e00' },
  modeTxt: { color: '#0066ff', fontSize: 12, fontWeight: '800' },

  filterRow: { paddingHorizontal: 16, paddingVertical: 6, gap: 8, alignItems: 'center' },
  fpill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: '#1a2233', backgroundColor: '#0a0f1e', maxWidth: 180 },
  fpillActive: { backgroundColor: '#0044cc', borderColor: '#0066ff' },
  fpillWanted: { borderColor: '#ff335533', backgroundColor: '#120005' },
  fpillReward: { borderColor: '#ffd70033', backgroundColor: '#120a00' },
  ftxt: { color: '#334455', fontSize: 12, fontWeight: '700' },
  ftxtActive: { color: '#ffffff' },

  // RULE 2: identical width, marginHorizontal 16, radius 20, no nested margins
  card: { marginHorizontal: 16, marginBottom: 14, borderRadius: 20, overflow: 'hidden', backgroundColor: '#0a0f1e', borderWidth: 1, borderColor: '#0066ff22' },
  cardWanted: { borderColor: '#ff335530' },

  thumb: { width: '100%', justifyContent: 'flex-end' },
  wantedRibbon: { position: 'absolute', top: 12, left: 0, backgroundColor: '#ff3355', paddingHorizontal: 14, paddingVertical: 4, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  wantedTxt: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  geoCorner: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.72)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#0066ff22' },
  geoCornerTxt: { color: '#8899aa', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  geoDot: { width: 7, height: 7, borderRadius: 4 },
  thumbBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.72)' },
  sevDot: { width: 8, height: 8, borderRadius: 4 },
  thumbLoc: { flex: 1, color: '#ffffff', fontSize: 11, fontWeight: '700' },
  thumbTime: { color: '#8899aa', fontSize: 10, fontWeight: '700' },

  body: { padding: 14 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#050a14' },
  badgeTxt: { fontSize: 11, fontWeight: '900' },
  badgeReward: { backgroundColor: '#110d00', borderColor: '#ffd70055' },
  badgeRewardTxt: { color: '#ffd700', fontSize: 11, fontWeight: '900' },
  summary: { color: '#ffffff', fontSize: 14, lineHeight: 20, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#0066ff12', marginVertical: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  anonPill: { backgroundColor: '#020d1f', borderWidth: 1, borderColor: '#0066ff22', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  anonTxt: { color: '#0066ff', fontSize: 11, fontWeight: '800' },
  openPill: { backgroundColor: '#120e00', borderWidth: 1, borderColor: '#ffd70022', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  openTxt: { color: '#ffd700', fontSize: 11, fontWeight: '800' },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stat: { color: '#8899aa', fontSize: 11, fontWeight: '700' },
  aiOk: { color: '#00ff88', fontSize: 11, fontWeight: '900' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#060d1c', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderColor: '#0066ff22', maxHeight: '82%' },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#0066ff12' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  stateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#080f20' },
  stateTxt: { color: '#8899aa', fontSize: 15, fontWeight: '700' },
});

