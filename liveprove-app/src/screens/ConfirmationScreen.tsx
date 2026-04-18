import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { analyzeReport } from '../services/ai';

const TAGS = ['🚨 Emergency', '⚠️ Suspicious', '🚫 Rule Breaking', '🔍 Wanted Person'];

export default function ConfirmationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { videoUri } = route.params as { videoUri: string };
  const [title, setTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!selectedTag) { Alert.alert('Select a tag', 'Please choose what type of incident this is.'); return; }
    setLoading(true);
    try {
      const result = await analyzeReport(videoUri, title, selectedTag);
      navigation.navigate('ConfirmationSuccess' as never, {
        aiSummary: String(result?.ai_summary ?? ''),
        authority: String(result?.authority_needed ?? ''),
        severity: String(result?.severity ?? 'medium'),
      } as never);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Submission failed. Try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Review Report</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoIcon}>🎥</Text>
            <Text style={styles.videoText}>Video recorded</Text>
          </View>

          <Text style={styles.label}>What's happening? (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description..."
            placeholderTextColor="#556677"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <Text style={styles.label}>Tag this incident</Text>
          <View style={styles.tagGrid}>
            {TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagPill, selectedTag === tag && styles.tagPillActive]}
                onPress={() => setSelectedTag(tag)}
              >
                <Text style={[styles.tagText, selectedTag === tag && styles.tagTextActive]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.anonRow}>
            <View>
              <Text style={styles.anonTitle}>Stay anonymous</Text>
              <Text style={styles.anonSub}>Your identity stays hidden</Text>
            </View>
            <Switch value={isAnonymous} onValueChange={setIsAnonymous} trackColor={{ true: '#0066ff', false: '#1a2a3a' }} thumbColor="white" />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, (!selectedTag || loading) && styles.submitBtnDisabled]}
            onPress={submit}
            disabled={!selectedTag || loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.submitText}>Analyzing with AI...</Text>
              </View>
            ) : (
              <Text style={styles.submitText}>Submit Report</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  back: { color: '#0066ff', fontSize: 15 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  videoPlaceholder: { backgroundColor: '#0a0f1e', borderRadius: 16, height: 180, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#0066ff33' },
  videoIcon: { fontSize: 48, marginBottom: 8 },
  videoText: { color: '#8899aa', fontSize: 14 },
  label: { color: '#8899aa', fontSize: 13, marginBottom: 10, marginTop: 8 },
  input: { backgroundColor: '#0a0f1e', borderRadius: 12, padding: 14, color: '#ffffff', fontSize: 15, borderWidth: 1, borderColor: '#1a2a3a', marginBottom: 20 },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  tagPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#1a2a3a', backgroundColor: '#0a0f1e' },
  tagPillActive: { backgroundColor: '#0066ff', borderColor: '#0066ff' },
  tagText: { color: '#8899aa', fontSize: 14 },
  tagTextActive: { color: '#ffffff', fontWeight: '600' },
  anonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0f1e', padding: 16, borderRadius: 12, marginBottom: 32, borderWidth: 1, borderColor: '#0066ff22' },
  anonTitle: { color: '#ffffff', fontSize: 15, fontWeight: '500' },
  anonSub: { color: '#556677', fontSize: 12, marginTop: 2 },
  submitBtn: { backgroundColor: '#0066ff', padding: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#0044cc', shadowColor: '#0066ff', shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  submitBtnDisabled: { backgroundColor: '#1a2a3a', borderColor: '#1a2a3a' },
  submitText: { color: 'white', fontSize: 16, fontWeight: '700' },
});

