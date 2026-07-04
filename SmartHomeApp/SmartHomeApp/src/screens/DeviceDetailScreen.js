import React, { useContext, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../App';
import { COLORS } from '../utils/theme';
import { IR_PROFILES } from '../data/store';
import Slider from '@react-native-community/slider';

const LIGHT_COLORS = [
  { hex: '#FFE066', name: 'Warm' },
  { hex: '#FFB347', name: 'Sunset' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#A0C4FF', name: 'Cool' },
  { hex: '#B5EAD7', name: 'Mint' },
  { hex: '#FF6B6B', name: 'Red' },
  { hex: '#C9A0DC', name: 'Purple' },
];

export default function DeviceDetailScreen({ route, navigation }) {
  const { deviceId } = route.params;
  const { devices, toggleDevice, updateDevice, addLog } = useContext(AppContext);
  const device = devices.find(d => d.id === deviceId);
  const [lastSignal, setLastSignal] = useState(null);

  if (!device) return null;

  function sendIR(label, code) {
    setLastSignal({ label, code, time: new Date().toLocaleTimeString() });
    addLog({ label: `IR: ${label} → ${device.name}`, type: 'ir', code });
  }

  // IR device view
  if (device.type === 'ir') {
    const profile = IR_PROFILES[device.ir];
    return (
      <View style={s.root}>
        <StatusBar barStyle="light-content" />
        <View style={s.navbar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={s.navTitle}>{device.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Header card */}
          <View style={s.deviceHeader}>
            <View style={[s.bigIcon, { backgroundColor: COLORS.warnBg }]}>
              <Ionicons name={device.icon} size={30} color={COLORS.warn} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.deviceTitle}>{device.name}</Text>
              <Text style={s.deviceMeta}>{device.room} · <Text style={{ color: COLORS.warn }}>IR</Text> · {profile.proto}</Text>
            </View>
          </View>

          {/* D-pad for TV */}
          {profile.hasDpad && (
            <>
              <Text style={s.sectionLabel}>Navigation</Text>
              <View style={s.dpadWrap}>
                <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Up', '0x20DF02FD')}>
                  <Ionicons name="chevron-up" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={s.dpadRow}>
                  <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Left', '0x20DFE21D')}>
                    <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.okBtn} onPress={() => sendIR('OK', '0x20DF22DD')}>
                    <Text style={s.okText}>OK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Right', '0x20DF629D')}>
                    <Ionicons name="chevron-forward" size={22} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={s.dpadBtn} onPress={() => sendIR('Down', '0x20DF827D')}>
                  <Ionicons name="chevron-down" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </>
          )}

          <Text style={s.sectionLabel}>Controls</Text>
          <View style={s.irGrid}>
            {profile.buttons.map((btn, idx) => (
              <TouchableOpacity
                key={idx}
                style={[s.irBtn, btn.isPower && s.irBtnPower, btn.isPower && { width: '100%' }]}
                onPress={() => sendIR(btn.label, btn.code)}
                activeOpacity={0.7}
              >
                <Ionicons name={btn.icon} size={20} color={btn.isPower ? COLORS.danger : COLORS.textPrimary} />
                <Text style={[s.irBtnLabel, btn.isPower && { color: COLORS.danger }]}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {lastSignal && (
            <>
              <Text style={s.sectionLabel}>Last signal</Text>
              <View style={s.signalCard}>
                <Ionicons name="radio-outline" size={16} color={COLORS.textMuted} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={s.signalLabel}>{lastSignal.label}</Text>
                  <Text style={s.signalCode}>{lastSignal.code}</Text>
                </View>
                <Text style={s.signalTime}>{lastSignal.time}</Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // Wi-Fi device view
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <View style={s.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={s.navTitle}>{device.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={s.deviceHeader}>
          <View style={[s.bigIcon, { backgroundColor: device.on ? COLORS.accent : COLORS.surface }]}>
            <Ionicons name={device.icon} size={30} color={device.on ? '#fff' : COLORS.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.deviceTitle}>{device.name}</Text>
            <Text style={s.deviceMeta}>{device.room} · <Text style={{ color: COLORS.accentLight }}>Wi-Fi</Text></Text>
          </View>
          <Switch
            value={device.on}
            onValueChange={() => { toggleDevice(device.id); addLog({ label: (device.on ? 'Off: ' : 'On: ') + device.name, type: 'wifi' }); }}
            trackColor={{ false: COLORS.border, true: COLORS.accent }}
            thumbColor="#fff"
          />
        </View>

        {device.brightness !== undefined && (
          <>
            <Text style={s.sectionLabel}>Brightness</Text>
            <View style={s.controlCard}>
              <View style={s.sliderRow}>
                <Ionicons name="moon-outline" size={16} color={COLORS.textMuted} />
                <Slider
                  style={{ flex: 1, marginHorizontal: 8 }}
                  minimumValue={1} maximumValue={100} step={1}
                  value={device.brightness}
                  minimumTrackTintColor={COLORS.accent}
                  maximumTrackTintColor={COLORS.border}
                  thumbTintColor={COLORS.accentLight}
                  onValueChange={v => updateDevice(device.id, { brightness: Math.round(v) })}
                />
                <Ionicons name="sunny-outline" size={16} color={COLORS.textSecondary} />
                <Text style={s.sliderVal}>{device.brightness}%</Text>
              </View>
            </View>
          </>
        )}

        {device.color !== undefined && (
          <>
            <Text style={s.sectionLabel}>Light colour</Text>
            <View style={s.controlCard}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, padding: 4 }}>
                {LIGHT_COLORS.map(c => (
                  <TouchableOpacity key={c.hex} onPress={() => updateDevice(device.id, { color: c.hex })}>
                    <View style={[s.colorDot, { backgroundColor: c.hex }, device.color === c.hex && s.colorDotSel]} />
                    <Text style={s.colorName}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {device.temp !== undefined && (
          <>
            <Text style={s.sectionLabel}>Temperature setpoint</Text>
            <View style={s.controlCard}>
              <View style={s.sliderRow}>
                <Text style={s.sliderEdge}>16°</Text>
                <Slider
                  style={{ flex: 1, marginHorizontal: 8 }}
                  minimumValue={16} maximumValue={30} step={1}
                  value={device.temp}
                  minimumTrackTintColor={COLORS.accent}
                  maximumTrackTintColor={COLORS.border}
                  thumbTintColor={COLORS.accentLight}
                  onValueChange={v => updateDevice(device.id, { temp: Math.round(v) })}
                />
                <Text style={s.sliderEdge}>30°</Text>
                <Text style={s.sliderVal}>{device.temp}°C</Text>
              </View>
              {device.humidity !== undefined && (
                <View style={s.infoRow}>
                  <Ionicons name="water-outline" size={14} color={COLORS.textMuted} />
                  <Text style={s.infoLabel}>Humidity</Text>
                  <Text style={s.infoVal}>{device.humidity}%</Text>
                </View>
              )}
            </View>
          </>
        )}

        {device.power !== undefined && (
          <>
            <Text style={s.sectionLabel}>Power</Text>
            <View style={s.controlCard}>
              <View style={s.infoRow}>
                <Ionicons name="flash-outline" size={14} color={COLORS.textMuted} />
                <Text style={s.infoLabel}>Current draw</Text>
                <Text style={s.infoVal}>{device.power} W</Text>
              </View>
            </View>
          </>
        )}

        <Text style={s.sectionLabel}>Options</Text>
        <View style={s.controlCard}>
          {[
            { icon: 'time-outline', label: 'Schedule', sub: 'Add time-based trigger' },
            { icon: 'create-outline', label: 'Rename device', sub: null },
            { icon: 'share-outline', label: 'Share access', sub: null },
          ].map((opt, i) => (
            <View key={i}>
              {i > 0 && <View style={s.divider} />}
              <View style={s.optRow}>
                <Ionicons name={opt.icon} size={18} color={COLORS.textSecondary} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={s.optLabel}>{opt.label}</Text>
                  {opt.sub && <Text style={s.optSub}>{opt.sub}</Text>}
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  navbar: { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  navTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },
  deviceHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, margin: 16, backgroundColor: COLORS.card, borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: COLORS.border },
  bigIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  deviceTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  deviceMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  sectionLabel: { fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  dpadWrap: { alignItems: 'center', gap: 4, marginBottom: 8 },
  dpadRow: { flexDirection: 'row', gap: 4 },
  dpadBtn: { width: 52, height: 52, backgroundColor: COLORS.card, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: COLORS.border },
  okBtn: { width: 52, height: 52, backgroundColor: COLORS.accent, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  okText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  irGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  irBtn: { width: '30.5%', backgroundColor: COLORS.card, borderRadius: 12, padding: 12, alignItems: 'center', gap: 6, borderWidth: 0.5, borderColor: COLORS.border },
  irBtnPower: { backgroundColor: COLORS.dangerBg, borderColor: COLORS.danger },
  irBtnLabel: { fontSize: 11, color: COLORS.textPrimary, textAlign: 'center' },
  signalCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: COLORS.border },
  signalLabel: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
  signalCode: { fontSize: 11, color: COLORS.textMuted, fontFamily: 'monospace', marginTop: 2 },
  signalTime: { fontSize: 11, color: COLORS.textMuted },
  controlCard: { marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: COLORS.border },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  sliderEdge: { fontSize: 11, color: COLORS.textMuted, width: 24 },
  sliderVal: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, width: 42, textAlign: 'right' },
  colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'transparent' },
  colorDotSel: { borderColor: COLORS.accent },
  colorName: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  infoLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  infoVal: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  divider: { height: 0.5, backgroundColor: COLORS.border, marginVertical: 8 },
  optRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  optLabel: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
  optSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
});
