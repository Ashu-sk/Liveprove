import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const MOCK_COMMENTS = [
  { id: '1', user: 'Anonymous_7821', isAnon: true, text: 'I saw this too near gate 3, the person ran towards the parking lot', time: '3m ago', upvotes: 12, hasEvidence: false },
  { id: '2', user: 'Priya_S', isAnon: false, text: 'I have a video from a different angle, submitting now', time: '5m ago', upvotes: 8, hasEvidence: true },
  { id: '3', user: 'Anonymous_4401', isAnon: true, text: 'The security guard at the metro was also a witness', time: '11m ago', upvotes: 5, hasEvidence: false },
];

export default function IncidentDetailScreen() {
  const nav = useNavigation<any>();
  const [comment, setComment] = useState('');
  const [commentMode, setCommentMode] = useState<'anon' | 'open'>('anon');
  const [comments, setComments] = useState(MOCK_COMMENTS);

  const addComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [
      {
        id: Date.now().toString(),
        user: commentMode === 'anon' ? 'Anonymous_' + Math.floor(Math.random() * 9000 + 1000) : 'You',
        isAnon: commentMode === 'anon',
        text: comment,
        time: 'Just now',
        upvotes: 0,
        hasEvidence: false,
      },
      ...prev,
    ]);
    setComment('');
  };

  return (
    <KeyboardAvoidingView style={S.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={S.header}>
          <TouchableOpacity onPress={() => nav.goBack()} style={S.backBtn}>
            <Text style={S.backTxt}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={S.headerTitle}>Incident</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={S.videoBox}>
            <Text style={{ fontSize: 48 }}>📷</Text>
            <Text style={S.videoLabel}>Video Evidence</Text>
            <View style={S.geoChip}>
              <Text style={S.geoTxt}>🌐 28.6139° N, 77.2090° E</Text>
            </View>
          </View>

          <View style={S.metaRow}>
            <View style={S.authBadge}>
              <Text style={S.authTxt}>🚔 Police</Text>
            </View>
            <View style={S.sevBadge}>
              <Text style={S.sevTxt}>● CRITICAL</Text>
            </View>
            <View style={S.rewardBadge}>
              <Text style={S.rewardTxt}>🏆 ₹500</Text>
            </View>
          </View>

          <Text style={S.summaryTxt}>Physical assault reported near metro exit — suspect fleeing north on foot. AI confidence: 94%.</Text>

          <View style={S.infoRow}>
            <Text style={S.infoItem}>📍 Rajiv Chowk, Delhi</Text>
            <Text style={S.infoItem}>🕐 2 min ago</Text>
            <Text style={S.infoItem}>👁 1,243 views</Text>
          </View>

          <View style={S.divider} />

          <View style={S.addEvidenceBox}>
            <Text style={S.addEvidenceTitle}>📎 Add Your Evidence</Text>
            <Text style={S.addEvidenceSub}>Did you witness this? Add a video, photo or eyewitness account</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity style={S.evidenceBtn}>
                <Text style={{ fontSize: 20 }}>📷</Text>
                <Text style={S.evidenceBtnTxt}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.evidenceBtn}>
                <Text style={{ fontSize: 20 }}>🎥</Text>
                <Text style={S.evidenceBtnTxt}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.evidenceBtn}>
                <Text style={{ fontSize: 20 }}>🔊</Text>
                <Text style={S.evidenceBtnTxt}>Audio</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={S.divider} />

          <View style={S.commentsHeader}>
            <Text style={S.commentsTitle}>💬 {comments.length} Witness Accounts</Text>
          </View>

          {comments.map((c) => (
            <View key={c.id} style={[S.commentCard, c.hasEvidence && S.commentCardEvidence]}>
              <View style={S.commentTop}>
                {c.isAnon ? (
                  <View style={S.commentAnonBadge}>
                    <Text style={S.commentAnonTxt}>🎭 {c.user}</Text>
                  </View>
                ) : (
                  <View style={S.commentOpenBadge}>
                    <Text style={S.commentOpenTxt}>👤 {c.user}</Text>
                  </View>
                )}
                {c.hasEvidence && (
                  <View style={S.evidencePill}>
                    <Text style={S.evidencePillTxt}>📎 Has Evidence</Text>
                  </View>
                )}
                <Text style={S.commentTime}>{c.time}</Text>
              </View>
              <Text style={S.commentTxt}>{c.text}</Text>
              <TouchableOpacity style={S.upvoteBtn}>
                <Text style={S.upvoteTxt}>▲ {c.upvotes} Helpful</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={S.inputBar}>
          <View style={S.commentModeToggle}>
            <TouchableOpacity onPress={() => setCommentMode('anon')} style={[S.cmPill, commentMode === 'anon' && S.cmPillActive]}>
              <Text style={{ fontSize: 12 }}>🎭</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCommentMode('open')} style={[S.cmPill, commentMode === 'open' && S.cmPillOpenActive]}>
              <Text style={{ fontSize: 12 }}>👤</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={S.input}
            value={comment}
            onChangeText={setComment}
            placeholder="Add witness account..."
            placeholderTextColor="#334455"
            multiline={false}
          />
          <TouchableOpacity style={S.sendBtn} onPress={addComment}>
            <Text style={S.sendTxt}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#0066ff18' },
  backBtn: {},
  backTxt: { color: '#0066ff', fontSize: 18, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  videoBox: { height: 220, backgroundColor: '#070d1c', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#0066ff22' },
  videoLabel: { color: '#556677', fontSize: 13, marginTop: 8 },
  geoChip: { marginTop: 10, backgroundColor: '#020d1f', borderWidth: 1, borderColor: '#0066ff44', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  geoTxt: { color: '#0088ff', fontSize: 11, fontWeight: '600' },
  metaRow: { flexDirection: 'row', gap: 8, padding: 14, flexWrap: 'wrap' },
  authBadge: { borderWidth: 1, borderColor: '#0066ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  authTxt: { color: '#0088ff', fontSize: 12, fontWeight: '700' },
  sevBadge: { borderWidth: 1, borderColor: '#ff335588', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  sevTxt: { color: '#ff3355', fontSize: 12, fontWeight: '700' },
  rewardBadge: { backgroundColor: '#110d00', borderWidth: 1, borderColor: '#ffd70055', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  rewardTxt: { color: '#ffd700', fontSize: 12, fontWeight: '700' },
  summaryTxt: { color: '#ccd', fontSize: 14, lineHeight: 21, paddingHorizontal: 14, marginBottom: 12 },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 14, marginBottom: 14 },
  infoItem: { color: '#445566', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#0066ff12', marginVertical: 4 },
  addEvidenceBox: { margin: 14, backgroundColor: '#070d1c', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#0066ff22' },
  addEvidenceTitle: { color: '#0088ff', fontSize: 14, fontWeight: '700' },
  addEvidenceSub: { color: '#445566', fontSize: 12, marginTop: 4, lineHeight: 17 },
  evidenceBtn: { flex: 1, backgroundColor: '#020d1f', borderRadius: 12, alignItems: 'center', paddingVertical: 12, borderWidth: 1, borderColor: '#0066ff22', gap: 6 },
  evidenceBtnTxt: { color: '#0066ff', fontSize: 11, fontWeight: '600' },
  commentsHeader: { paddingHorizontal: 14, paddingVertical: 10 },
  commentsTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  commentCard: { marginHorizontal: 14, marginBottom: 10, backgroundColor: '#070d1c', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#0066ff12' },
  commentCardEvidence: { borderColor: '#0066ff44' },
  commentTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  commentAnonBadge: { backgroundColor: '#020d1f', borderWidth: 1, borderColor: '#0066ff22', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  commentAnonTxt: { color: '#0077dd', fontSize: 11 },
  commentOpenBadge: { backgroundColor: '#120e00', borderWidth: 1, borderColor: '#ffd70022', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  commentOpenTxt: { color: '#ccaa00', fontSize: 11 },
  evidencePill: { backgroundColor: '#001530', borderWidth: 1, borderColor: '#0066ff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  evidencePillTxt: { color: '#0088ff', fontSize: 10, fontWeight: '700' },
  commentTime: { color: '#334455', fontSize: 10, marginLeft: 'auto' },
  commentTxt: { color: '#aabbcc', fontSize: 13, lineHeight: 19, marginBottom: 8 },
  upvoteBtn: { alignSelf: 'flex-start' },
  upvoteTxt: { color: '#334455', fontSize: 11, fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: '#050a14', borderTopWidth: 1, borderTopColor: '#0066ff18' },
  commentModeToggle: { flexDirection: 'row', gap: 4 },
  cmPill: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0a0f1e', borderWidth: 1, borderColor: '#1a2233', alignItems: 'center', justifyContent: 'center' },
  cmPillActive: { borderColor: '#0066ff', backgroundColor: '#020d1f' },
  cmPillOpenActive: { borderColor: '#ffd700', backgroundColor: '#120e00' },
  input: { flex: 1, backgroundColor: '#0a0f1e', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, color: '#fff', fontSize: 13, borderWidth: 1, borderColor: '#0066ff22' },
  sendBtn: { backgroundColor: '#0055ee', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 },
  sendTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
});

