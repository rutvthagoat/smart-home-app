import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../App';
import { COLORS } from '../utils/theme';
import { ROUTINES } from '../data/store';

const ROOMS = ['All', 'Living room', 'Bedroom', 'Kitchen'];

export default function HomeScreen({ navigation }) {
  const { devices, toggleDevice } = useContext(AppContext);
  const [room, setRoom] = useState('All');

  const filtered = room === 'All' ? devices : devices.filter(d => d.room === room);
  const activeCount = devices.filter(d => d.on).length;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning 👋</Text>
            <Text style={s.sub}>{activeCount} device{activeCount !== 1 ? 's' : ''} on</Text>
          </View>
          <TouchableOpacity style={s.iconBtn} onPress={() => {}}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={s.statRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Active</Text>
            <Text style={s.statVal}>{activeCount}</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Energy today</Text>
            <Text style={s.statVal}>1.4 kWh</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Temp</Text>
            <Text style={s.statVal}>22°C</Text>
          </View>
        </View>

        {/* Room chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {ROOMS.map(r => (
            <TouchableOpacity key={r} style={[s.chip, room === r && s.chipActive]} onPress={() => setRoom(r)}>
              <Text style={[s.chipText, room === r && s.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Devices */}
        <Text style={s.sectionTitle}>Devices</Text>
        <View style={s.deviceGrid}>
          {filtered.map(d => (
            <TouchableOpacity
              key={d.id}
              style={[s.deviceCard, d.on && s.deviceCardOn]}
              onPress={() => navigation.navigate('DeviceDetail', { deviceId: d.id })}
            >
              <View style={[s.deviceIcon, d.on && s.deviceIconOn]}>
                <Ionicons name={d.icon} size={22} color={d.on ? '#fff' : COLORS.textSecondary} />
              </View>
              <Text style={s.deviceName} numberOfLines={2}>{d.name}</Text>
              <Text style={[s.deviceStatus, d.on && { color: COLORS.accentLight }]}>
                {d.on ? 'On' : 'Off'}
              </Text>
              <View style={s.tagRow}>
                <View style={[s.tag, d.type === 'wifi' ? s.tagWifi : s.tagIR]}>
                  <Text style={[s.tagText, d.type === 'wifi' ? s.tagWifiText : s.tagIRText]}>
                    {d.type === 'wifi' ? 'Wi-Fi' : 'IR'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick routines */}
        <Text style={s.sectionTitle}>Quick routines</Text>
        {ROUTINES.slice(0, 2).map(r => (
          <TouchableOpacity
            key={r.id}
            style={s.routineRow}
            onPress={() => navigation.navigate('Routines', { runId: r.id })}
          >
            <View style={[s.routineIcon, { backgroundColor: r.color }]}>
              <Ionicons name={r.icon} size={18} color={r.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.routineName}>{r.name}</Text>
              <Text style={s.routineSub}>{r.steps.length} actions · {r.trigger}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  greeting: { fontSize: 22, fontWeight: '600', color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginVertical: 12 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, borderWidth: 0.5, borderColor: COLORS.border },
  statLabel: { fontSize: 11, color: COLORS.textMuted },
  statVal: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginTop: 2 },
  chipScroll: { marginVertical: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 0.5, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.accentBg, borderColor: COLORS.accent },
  chipText: { fontSize: 13, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.accentLight },
  sectionTitle: { fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginHorizontal: 16, marginTop: 16, marginBottom: 10 },
  deviceGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  deviceCard: { width: '47%', backgroundColor: COLORS.card, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: COLORS.border },
  deviceCardOn: { borderColor: COLORS.accent, backgroundColor: COLORS.accentBg },
  deviceIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  deviceIconOn: { backgroundColor: COLORS.accent },
  deviceName: { fontSize: 13, fontWeight: '500', color: COLORS.textPrimary },
  deviceStatus: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  tagRow: { marginTop: 8 },
  tag: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagWifi: { backgroundColor: COLORS.accentBg },
  tagWifiText: { fontSize: 10, color: COLORS.accentLight, fontWeight: '600' },
  tagIR: { backgroundColor: COLORS.warnBg },
  tagIRText: { fontSize: 10, color: COLORS.warn, fontWeight: '600' },
  tagText: {},
  routineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: COLORS.border },
  routineIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  routineName: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  routineSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
