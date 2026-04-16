import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function ReportScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
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
  container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },
  camera: { flex: 1, width: '100%' },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: 'white', fontSize: 16 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff3333' },
  timerText: { color: 'white', fontSize: 14, fontWeight: '600' },
  bottom: { alignItems: 'center', paddingBottom: 48, gap: 12 },
  hint: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  recordBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'white', alignItems: 'center', justifyContent: 'center' },
  recordBtnActive: { borderColor: '#ff3333' },
  recordInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ff3333' },
  recordInnerActive: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#ff3333' },
  maxText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  permText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20, paddingHorizontal: 32 },
  permBtn: { backgroundColor: '#ff3333', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  permBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
