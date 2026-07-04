import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../App';
import { COLORS } from '../utils/theme';
import { IR_PROFILES } from '../data/store';

const PROFILE_KEYS = Object.keys(IR_PROFILES);

export default function RemoteScreen() {
  const { addLog } = useContext(AppContext);
  const [active, setActive] = useState('tv');
  const [lastSignal, setLastSignal] = useState(null);

  const profile = IR_PROFILES[active];

  function sendIR(label, code) {
    const entry = { label: `${label}`, type: 'ir', code };
    addLog(entry);
    setLastSignal({ label, code, time: new Date().toLocaleTimeString() });
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <Text style={s.title}>IR remote</Text>
        <Text style={s.sub}>Tap to send signal</Text>
      </View>

      {/* Device selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {PROFILE_KEYS.map(k => (
          <TouchableOpacity key={k} style={[s.chip, active === k && s.chipActive]} onPress={() => setActive(k)}>
            <Text style={[s.chipText, active === k && s.chipTextActive]}>
              {IR_PROFILES[k].name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile badge */}
        <View style={s.profileBadge}>
          <View style={s.badgeDot} />
          <Text style={s.badgeText}>{profile.proto}</Text>
        </View>

        {/* D-pad for TV */}
        {profile.hasDpad && (
          <>
            <Text style={s.sectionLabel}>Navigation</Text>
            <View style={s.dpadWrap}>
              <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Up', '0x20DF02FD')}>
                <Ionicons name="chevron-up" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <View style={s.dpadRow}>
                <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Left', '0x20DFE21D')}>
                  <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={s.okBtn} onPress={() => sendIR('OK', '0x20DF22DD')}>
                  <Text style={s.okText}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Right', '0x20DF629D')}>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Down', '0x20DF827D')}>
                <Ionicons name="chevron-down" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={s.sectionLabel}>Controls</Text>
        <View style={s.irGrid}>
          {profile.buttons.map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={[s.irBtn, btn.isPower && s.irBtnPower, btn.isPower && { width: '100%' }]}
              onPress={() => sendIR(btn.label, btn.code)}
              activeOpacity={0.7}
            >
              <Ionicons name={btn.icon} size={22} color={btn.isPower ? COLORS.danger : COLORS.textPrimary} />
              <Text style={[s.irLabel, btn.isPower && { color: COLORS.danger }]}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Last signal */}
        <Text style={s.sectionLabel}>Last signal</Text>
        <View style={s.signalBox}>
          <Ionicons name="radio-outline" size={18} color={COLORS.textMuted} />
          {lastSignal ? (
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.sigLabel}>{lastSignal.label}</Text>
              <Text style={s.sigCode}>{lastSignal.code} · {lastSignal.time}</Text>
            </View>
          ) : (
            <Text style={[s.sigLabel, { color: COLORS.textMuted, marginLeft: 10 }]}>No signal sent yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '600', color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  chipScroll: { marginVertical: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 0.5, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.warnBg, borderColor: COLORS.warn },
  chipText: { fontSize: 13, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.warn, fontWeight: '600' },
  profileBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 16, marginBottom: 4 },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.warn },
  badgeText: { fontSize: 11, color: COLORS.textMuted, fontFamily: 'monospace' },
  sectionLabel: { fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginHorizontal: 16, marginTop: 14, marginBottom: 8 },
  dpadWrap: { alignItems: 'center', gap: 6, marginBottom: 8 },
  dpadRow: { flexDirection: 'row', gap: 6 },
  dpadBtn: { width: 56, height: 56, backgroundColor: COLORS.card, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: COLORS.border },
  okBtn: { width: 56, height: 56, backgroundColor: COLORS.accent, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  okText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  irGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  irBtn: { width: '30.5%', backgroundColor: COLORS.card, borderRadius: 12, padding: 14, alignItems: 'center', gap: 6, borderWidth: 0.5, borderColor: COLORS.border },
  irBtnPower: { backgroundColor: COLORS.dangerBg, borderColor: COLORS.danger },
  irLabel: { fontSize: 11, color: COLORS.textPrimary, textAlign: 'center' },
  signalBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: COLORS.border },
  sigLabel: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
  sigCode: { fontSize: 11, color: COLORS.textMuted, fontFamily: 'monospace', marginTop: 2 },
});
