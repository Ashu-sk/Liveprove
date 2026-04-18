import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function ReportScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<'anon' | 'open'>('anon');
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t >= 59) { stopRecording(); return 0; }
          return t + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setRecording(true);
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 60 });
      if (video?.uri) {
        navigation.navigate('Confirmation' as never, { videoUri: video.uri } as never);
      }
    } catch (e) {
      console.warn('Video recording failed', e);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
    setRecording(false);
  };

  const formatTime = (s: number) => `00:${s.toString().padStart(2, '0')}`;

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permText}>Camera access needed to report incidents</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView ref={cameraRef} style={styles.camera} facing="back" mode="video">
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>✕</Text>
            </TouchableOpacity>
            {recording && (
              <View style={styles.timerBadge}>
                <View style={styles.recDot} />
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
              </View>
            )}
          </View>
          <View style={styles.bottom}>
            <Text style={styles.hint}>Record the incident clearly</Text>
            <View style={styles.modeBar}>
              <TouchableOpacity
                style={[styles.modePill, mode === 'anon' && styles.modePillActive]}
                onPress={() => setMode('anon')}
                activeOpacity={0.9}
              >
                <Text style={{ fontSize: 16 }}>🎭</Text>
                <Text style={[styles.modeLabel, mode === 'anon' && { color: '#0066ff' }]}>Anonymous</Text>
                <Text style={styles.modeSub}>Identity hidden</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modePill, mode === 'open' && styles.modePillOpenActive]}
                onPress={() => setMode('open')}
                activeOpacity={0.9}
              >
                <Text style={{ fontSize: 16 }}>👤</Text>
                <Text style={[styles.modeLabel, mode === 'open' && { color: '#ffd700' }]}>Open</Text>
                <Text style={styles.modeSub}>Earn rewards</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.recordBtn, recording && styles.recordBtnActive]}
              onPress={recording ? stopRecording : startRecording}
            >
              <View style={[styles.recordInner, recording && styles.recordInnerActive]} />
            </TouchableOpacity>
            <Text style={styles.maxText}>Max 60 seconds</Text>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  camera: { flex: 1, width: '100%' },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#0066ff44' },
  backText: { color: '#ffffff', fontSize: 16 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(10,15,30,0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: '#0066ff33' },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff3355' },
  timerText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  bottom: { alignItems: 'center', paddingBottom: 48, gap: 12 },
  hint: { color: '#8899aa', fontSize: 14 },
  modeBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  modePill: { flex: 1, alignItems: 'center', backgroundColor: '#0a0f1e', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#1a2233', gap: 4 },
  modePillActive: { borderColor: '#0066ff', backgroundColor: '#020d1f' },
  modePillOpenActive: { borderColor: '#ffd700', backgroundColor: '#120e00' },
  modeLabel: { color: '#556677', fontSize: 13, fontWeight: '700' },
  modeSub: { color: '#334455', fontSize: 10 },
  recordBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#0066ff', alignItems: 'center', justifyContent: 'center', shadowColor: '#0066ff', shadowOpacity: 0.55, shadowRadius: 18, elevation: 10 },
  recordBtnActive: { borderColor: '#ff3355' },
  recordInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#0066ff' },
  recordInnerActive: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#ff3355' },
  maxText: { color: '#556677', fontSize: 12 },
  permText: { color: '#ffffff', fontSize: 16, textAlign: 'center', marginBottom: 20, paddingHorizontal: 32 },
  permBtn: { backgroundColor: '#0066ff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#0044cc' },
  permBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
