import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const REWARDS = [
  { id: '1', title: 'Report Verified', desc: 'Your report was confirmed by AI', points: '+50 XP', amount: null, icon: '✓' },
  { id: '2', title: 'Wanted Tip Accepted', desc: 'Your tip led to a suspect location', points: '+500 XP', amount: '₹2,000', icon: '🏆' },
  { id: '3', title: 'Evidence Added', desc: 'You added corroborating evidence', points: '+30 XP', amount: null, icon: '📎' },
  { id: '4', title: '7-Day Streak', desc: 'Reported for 7 consecutive days', points: '+100 XP', amount: null, icon: '🔥' },
];

export default function RewardsScreen() {
  return (
    <View style={S.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={S.header}>
          <Text style={S.title}>Rewards</Text>
          <View style={S.balanceChip}>
            <Text style={S.balance}>₹2,000</Text>
            <Text style={S.balanceSub}>earned</Text>
          </View>
        </View>
        <View style={S.xpCard}>
          <Text style={S.xpLabel}>Total XP</Text>
          <Text style={S.xpNum}>340 XP</Text>
          <View style={S.xpBar}>
            <View style={S.xpFill} />
          </View>
          <Text style={S.xpNext}>160 XP to next level</Text>
        </View>
        <Text style={S.sectionLabel}>Recent Earnings</Text>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
          {REWARDS.map((r) => (
            <View key={r.id} style={S.rewardRow}>
              <View style={S.rewardIcon}>
                <Text style={{ fontSize: 20 }}>{r.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={S.rewardTitle}>{r.title}</Text>
                <Text style={S.rewardDesc}>{r.desc}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 3 }}>
                <Text style={S.rewardXp}>{r.points}</Text>
                {r.amount && <Text style={S.rewardAmt}>{r.amount}</Text>}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#0066ff18' },
  title: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  balanceChip: { backgroundColor: '#110d00', borderWidth: 1, borderColor: '#ffd70055', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, alignItems: 'center' },
  balance: { color: '#ffd700', fontSize: 16, fontWeight: '800' },
  balanceSub: { color: '#665500', fontSize: 9 },
  xpCard: { margin: 16, backgroundColor: '#070d1c', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#0066ff22' },
  xpLabel: { color: '#445566', fontSize: 12, marginBottom: 4 },
  xpNum: { color: '#0088ff', fontSize: 32, fontWeight: '900' },
  xpBar: { height: 6, backgroundColor: '#0a1530', borderRadius: 3, marginVertical: 10 },
  xpFill: { width: '34%', height: '100%', backgroundColor: '#0066ff', borderRadius: 3 },
  xpNext: { color: '#334455', fontSize: 11 },
  sectionLabel: { color: '#334455', fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 16, marginBottom: 4 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#070d1c', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#0066ff12' },
  rewardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#020d1f', borderWidth: 1, borderColor: '#0066ff22', alignItems: 'center', justifyContent: 'center' },
  rewardTitle: { color: '#ddeeff', fontSize: 13, fontWeight: '700' },
  rewardDesc: { color: '#445566', fontSize: 11, marginTop: 2 },
  rewardXp: { color: '#0088ff', fontSize: 12, fontWeight: '700' },
  rewardAmt: { color: '#ffd700', fontSize: 12, fontWeight: '700' },
});

