import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentCardModel = {
  id: string;
  severity: IncidentSeverity;
  summary: string;
  location: string;
  authority: string;
  time: string;
};

function severityColor(severity: IncidentSeverity) {
  switch (severity) {
    case 'critical':
      return '#FF3B30';
    case 'high':
      return '#FF6A00';
    case 'medium':
      return '#FFD60A';
    case 'low':
      return '#34C759';
  }
}

export function IncidentCard({ incident }: Readonly<{ incident: IncidentCardModel }>) {
  return (
    <View style={styles.card}>
      <View style={[styles.severityBar, { backgroundColor: severityColor(incident.severity) }]} />

      <View style={styles.content}>
        <Text style={styles.summary} numberOfLines={3}>
          {incident.summary}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {incident.location}
        </Text>
        <Text style={styles.time} numberOfLines={1}>
          {incident.time}
        </Text>

        <Text style={styles.verifiedByAi}>Verified by AI</Text>
      </View>

      <View style={styles.right}>
        <View
          style={[
            styles.authorityPill,
            {
              borderColor: `${severityColor(incident.severity)}55`,
              backgroundColor: `${severityColor(incident.severity)}22`,
            },
          ]}
        >
          <Text style={[styles.authorityText, { color: severityColor(incident.severity) }]} numberOfLines={1}>
            {incident.authority}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  severityBar: {
    width: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  summary: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  location: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
  },
  verifiedByAi: {
    marginTop: 4,
    color: '#34C759',
    fontSize: 11,
    fontWeight: '700',
  },
  right: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  authorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  authorityText: {
    fontSize: 12,
    fontWeight: '900',
  },
});

