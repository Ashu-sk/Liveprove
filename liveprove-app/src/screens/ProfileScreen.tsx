import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, TextInput, Modal } from 'react-native';

type VerifyStep = 'none' | 'phone' | 'otp' | 'done';

export default function ProfileScreen() {
  const [verifyStep, setVerifyStep] = useState<VerifyStep>('none');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [mode, setMode] = useState<'anon' | 'open'>('anon');
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const sendOTP = () => {
    if (phone.length < 10) {
      Alert.alert('Enter valid phone number');
      return;
    }
    setVerifyStep('otp');
  };

  const verifyOTP = () => {
    if (otp === '1234' || otp.length === 6) {
      setIsVerified(true);
      setVerifyStep('done');
      setShowVerifyModal(false);
      Alert.alert('Verified!', 'Your account is now verified. You can earn rewards.');
    } else {
      Alert.alert('Wrong OTP', 'Enter the 6-digit code sent to your phone');
    }
  };

  return (
    <View style={S.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={S.header}>
            <Text style={S.title}>Profile</Text>
            {!isVerified && (
              <TouchableOpacity style={S.verifyBtn} onPress={() => setShowVerifyModal(true)}>
                <Text style={S.verifyBtnTxt}>⚡ Verify Now</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={S.avatarSection}>
            <View style={[S.avatar, isVerified && S.avatarVerified]}>
              <Text style={{ fontSize: 36 }}>{mode === 'anon' ? '🎭' : '👤'}</Text>
              {isVerified && (
                <View style={S.verifiedBadgeOnAvatar}>
                  <Text style={{ fontSize: 10 }}>✓</Text>
                </View>
              )}
            </View>
            <View style={S.avatarInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={S.username}>{mode === 'anon' ? 'Anonymous_7821' : 'Ashutosh K.'}</Text>
                {isVerified && (
                  <View style={S.verifiedChip}>
                    <Text style={S.verifiedChipTxt}>✓ Verified</Text>
                  </View>
                )}
              </View>
              <Text style={S.userLevel}>Level 3 — Civic Guardian</Text>
            </View>
          </View>

          {!isVerified && (
            <TouchableOpacity style={S.verifyBanner} onPress={() => setShowVerifyModal(true)}>
              <Text style={{ fontSize: 24 }}>🔒</Text>
              <View style={{ flex: 1 }}>
                <Text style={S.verifyBannerTitle}>Verify to unlock rewards</Text>
                <Text style={S.verifyBannerSub}>
                  Phone verification required to earn ₹ rewards and report wanted criminals
                </Text>
              </View>
              <Text style={{ color: '#0066ff', fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          )}

          <View style={S.modeSection}>
            <Text style={S.sectionLabel}>REPORT MODE</Text>
            <View style={S.modeRow}>
              <TouchableOpacity style={[S.modePill, mode === 'anon' && S.modePillActive]} onPress={() => setMode('anon')}>
                <Text style={{ fontSize: 24 }}>🎭</Text>
                <Text style={[S.modeTitle, mode === 'anon' && { color: '#0088ff' }]}>Anonymous</Text>
                <Text style={S.modeSub}>Identity fully hidden{'\n'}No rewards</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[S.modePill, mode === 'open' && S.modePillOpen]}
                onPress={() => {
                  if (!isVerified) {
                    setShowVerifyModal(true);
                    return;
                  }
                  setMode('open');
                }}
              >
                <Text style={{ fontSize: 24 }}>👤</Text>
                <Text style={[S.modeTitle, mode === 'open' && { color: '#ffd700' }]}>Open</Text>
                <Text style={S.modeSub}>Visible profile{'\n'}Earn rewards</Text>
                {!isVerified && (
                  <View style={S.lockOverlay}>
                    <Text style={{ fontSize: 16 }}>🔒</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={S.statsGrid}>
            {[
              ['12', 'Reports Sent'],
              ['3', 'Verified'],
              ['340', 'Total XP'],
              ['₹2K', 'Earned'],
            ].map(([v, l]) => (
              <View key={l} style={S.statCard}>
                <Text style={S.statVal}>{v}</Text>
                <Text style={S.statLbl}>{l}</Text>
              </View>
            ))}
          </View>

          <Text style={S.sectionLabel}>SETTINGS</Text>
          <View style={S.settingsCard}>
            {[
              { label: 'Notification Preferences', icon: '🔔' },
              { label: 'Privacy & Anonymity', icon: '🔒' },
              { label: 'Payout Method', icon: '💳' },
              { label: 'Legal & Compliance', icon: '⚖️' },
              { label: 'About LiveProve', icon: 'ℹ️' },
              { label: 'Sign Out', icon: '🚪', danger: true },
            ].map(item => (
              <TouchableOpacity key={item.label} style={S.settingRow}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text style={[S.settingTxt, item.danger && { color: '#ff3355' }]}>{item.label}</Text>
                <Text style={{ color: '#223344', fontSize: 18, marginLeft: 'auto' }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Modal visible={showVerifyModal} transparent animationType="slide">
          <View style={S.modalBg}>
            <View style={S.modalBox}>
              <Text style={S.modalTitle}>Verify Your Account</Text>
              <Text style={S.modalSub}>
                Required for rewards and wanted criminal reporting. Your identity stays hidden from public.
              </Text>

              {verifyStep !== 'otp' ? (
                <>
                  <View style={S.phoneRow}>
                    <View style={S.countryCode}>
                      <Text style={{ color: '#0088ff', fontWeight: '700' }}>+91</Text>
                    </View>
                    <TextInput
                      style={S.phoneInput}
                      placeholder="Phone number"
                      placeholderTextColor="#334455"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                  <TouchableOpacity style={S.primaryBtn} onPress={sendOTP}>
                    <Text style={S.primaryBtnTxt}>Send OTP</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={S.otpLabel}>Enter 6-digit OTP sent to +91 {phone}</Text>
                  <TextInput
                    style={[S.phoneInput, { textAlign: 'center', fontSize: 24, letterSpacing: 8, marginBottom: 20 }]}
                    placeholder="------"
                    placeholderTextColor="#334455"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  <TouchableOpacity style={S.primaryBtn} onPress={verifyOTP}>
                    <Text style={S.primaryBtnTxt}>Verify OTP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setVerifyStep('none')} style={{ marginTop: 12, alignItems: 'center' }}>
                    <Text style={{ color: '#334455', fontSize: 13 }}>Change number</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity onPress={() => setShowVerifyModal(false)} style={{ marginTop: 16, alignItems: 'center' }}>
                <Text style={{ color: '#334455', fontSize: 14 }}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { color: '#fff', fontSize: 24, fontWeight: '900' },
  verifyBtn: { backgroundColor: '#0055ee', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  verifyBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingVertical: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#070d1c', borderWidth: 2, borderColor: '#0066ff33', alignItems: 'center', justifyContent: 'center' },
  avatarVerified: { borderColor: '#00ff88', borderWidth: 2 },
  verifiedBadgeOnAvatar: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: '#00ff88', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#000' },
  avatarInfo: { flex: 1 },
  username: { color: '#fff', fontSize: 18, fontWeight: '800' },
  userLevel: { color: '#0066ff', fontSize: 12, marginTop: 4 },
  verifiedChip: { backgroundColor: '#001a0d', borderWidth: 1, borderColor: '#00ff88', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  verifiedChipTxt: { color: '#00ff88', fontSize: 10, fontWeight: '700' },
  verifyBanner: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 16, marginBottom: 16, backgroundColor: '#020d1f', borderWidth: 1, borderColor: '#0066ff44', borderRadius: 16, padding: 16 },
  verifyBannerTitle: { color: '#0088ff', fontSize: 14, fontWeight: '700' },
  verifyBannerSub: { color: '#334455', fontSize: 11, marginTop: 3, lineHeight: 16 },
  modeSection: { paddingHorizontal: 16, marginBottom: 16 },
  sectionLabel: { color: '#223344', fontSize: 10, fontWeight: '800', letterSpacing: 2, paddingHorizontal: 16, marginBottom: 10, marginTop: 4 },
  modeRow: { flexDirection: 'row', gap: 12 },
  modePill: { flex: 1, backgroundColor: '#070d1c', borderRadius: 16, padding: 16, alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#1a2233' },
  modePillActive: { borderColor: '#0066ff', backgroundColor: '#020d1f' },
  modePillOpen: { borderColor: '#ffd700', backgroundColor: '#120e00' },
  modeTitle: { color: '#556677', fontSize: 14, fontWeight: '800' },
  modeSub: { color: '#334455', fontSize: 10, textAlign: 'center', lineHeight: 15 },
  lockOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#070d1c', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#0066ff12' },
  statVal: { color: '#0088ff', fontSize: 18, fontWeight: '900' },
  statLbl: { color: '#334455', fontSize: 9, marginTop: 3, textAlign: 'center' },
  settingsCard: { marginHorizontal: 16, backgroundColor: '#070d1c', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#0066ff10' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#0066ff08' },
  settingTxt: { color: '#aabbcc', fontSize: 14, flex: 1 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#060d1c', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderColor: '#0066ff22', padding: 24, paddingBottom: 40 },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 8 },
  modalSub: { color: '#445566', fontSize: 13, lineHeight: 19, marginBottom: 24 },
  phoneRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  countryCode: { backgroundColor: '#0a0f1e', borderWidth: 1, borderColor: '#0066ff33', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, justifyContent: 'center' },
  phoneInput: { flex: 1, backgroundColor: '#0a0f1e', borderWidth: 1, borderColor: '#0066ff22', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 16 },
  otpLabel: { color: '#445566', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#0055ee', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  primaryBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

