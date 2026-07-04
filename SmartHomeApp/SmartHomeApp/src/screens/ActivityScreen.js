import React, { useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../App';
import { COLORS } from '../utils/theme';

const TYPE_CONFIG = {
  ir:      { color: COLORS.ir,      icon: 'radio-outline',        label: 'IR' },
  wifi:    { color: COLORS.wifi,    icon: 'wifi-outline',          label: 'Wi-Fi' },
  routine: { color: COLORS.routine, icon: 'git-branch-outline',    label: 'Routine' },
};

export default function ActivityScreen() {
  const { activityLog, clearLog } = useContext(AppContext);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <View>
          <Text style={s.title}>Activity</Text>
          <Text style={s.sub}>{activityLog.length} events</Text>
        </View>
        {activityLog.length > 0 && (
          <TouchableOpacity onPress={clearLog} style={s.clearBtn}>
            <Text style={s.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Legend */}
      <View style={s.legend}>
        {Object.entries(TYPE_CONFIG).map(([k, v]) => (
          <View key={k} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: v.color }]} />
            <Text style={s.legendLabel}>{v.label}</Text>
          </View>
        ))}
      </View>

      {activityLog.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="pulse-outline" size={40} color={COLORS.textMuted} />
          <Text style={s.emptyText}>No activity yet</Text>
          <Text style={s.emptySub}>Control a device or run a routine to see events here.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={s.logCard}>
            {activityLog.map((entry, i) => {
              const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.wifi;
              return (
                <View key={i} style={[s.logRow, i > 0 && s.logRowBorder]}>
                  <View style={[s.dot, { backgroundColor: cfg.color }]} />
                  <Ionicons name={cfg.icon} size={15} color={cfg.color} style={{ width: 18 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.logLabel}>{entry.label}</Text>
                    {entry.code && <Text style={s.logCode}>{entry.code}</Text>}
                  </View>
                  <Text style={s.logTime}>{entry.time}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '600', color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  clearBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 0.5, borderColor: COLORS.border, marginTop: 4 },
  clearText: { fontSize: 13, color: COLORS.textSecondary },
  legend: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, color: COLORS.textMuted },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 32 },
  emptyText: { fontSize: 16, fontWeight: '500', color: COLORS.textSecondary },
  emptySub: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  logCard: { marginHorizontal: 16, marginTop: 4, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border, overflow: 'hidden' },
  logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12 },
  logRowBorder: { borderTopWidth: 0.5, borderTopColor: COLORS.border },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  logLabel: { fontSize: 13, color: COLORS.textPrimary, flex: 1 },
  logCode: { fontSize: 11, color: COLORS.textMuted, fontFamily: 'monospace', marginTop: 2 },
  logTime: { fontSize: 11, color: COLORS.textMuted, flexShrink: 0 },
});
