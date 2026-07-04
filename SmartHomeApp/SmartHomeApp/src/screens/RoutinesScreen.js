import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../App';
import { COLORS } from '../utils/theme';
import { ROUTINES } from '../data/store';

export default function RoutinesScreen({ route }) {
  const { addLog, toggleDevice, devices } = useContext(AppContext);
  const [runningId, setRunningId] = useState(null);
  const [stepsDone, setStepsDone] = useState({});
  const [completedId, setCompletedId] = useState(null);
  const progressAnims = useRef({});

  useEffect(() => {
    if (route?.params?.runId) {
      setTimeout(() => startRoutine(route.params.runId), 400);
    }
  }, [route?.params?.runId]);

  function startRoutine(id) {
    if (runningId) return;
    const routine = ROUTINES.find(r => r.id === id);
    if (!routine) return;

    setRunningId(id);
    setStepsDone(prev => ({ ...prev, [id]: [] }));
    setCompletedId(null);
    addLog({ label: `Routine started: ${routine.name}`, type: 'routine' });

    routine.steps.forEach((step, i) => {
      setTimeout(() => {
        setStepsDone(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), i],
        }));
        addLog({ label: step.label, type: step.type });

        // Apply device changes
        if (step.deviceId) {
          const dev = devices.find(d => d.id === step.deviceId);
          if (dev) {
            const shouldBeOn = routine.id !== 'r3' && routine.id !== 'r4';
            if (dev.on !== shouldBeOn) toggleDevice(step.deviceId);
          }
        }

        if (i === routine.steps.length - 1) {
          setTimeout(() => {
            setCompletedId(id);
            addLog({ label: `Routine complete: ${routine.name}`, type: 'routine' });
            setTimeout(() => {
              setRunningId(null);
              setStepsDone(prev => ({ ...prev, [id]: [] }));
              setCompletedId(null);
            }, 3000);
          }, 500);
        }
      }, i * 800 + 300);
    });
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <Text style={s.title}>Routines</Text>
        <Text style={s.sub}>Automate your home</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {ROUTINES.map(routine => {
          const isRunning = runningId === routine.id;
          const isDone = completedId === routine.id;
          const done = stepsDone[routine.id] || [];

          return (
            <View key={routine.id} style={s.card}>
              {/* Header row */}
              <View style={s.cardHead}>
                <View style={[s.rIcon, { backgroundColor: routine.color }]}>
                  <Ionicons name={routine.icon} size={18} color={routine.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.routineName}>{routine.name}</Text>
                  <View style={s.triggerRow}>
                    <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                    <Text style={s.routineSub}> {routine.trigger}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[s.runBtn, isRunning && s.runBtnActive, isDone && s.runBtnDone]}
                  onPress={() => startRoutine(routine.id)}
                  disabled={!!runningId}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={16} color={COLORS.success} />
                  ) : isRunning ? (
                    <Text style={s.runBtnTextWarn}>Running…</Text>
                  ) : (
                    <>
                      <Ionicons name="play" size={13} color={COLORS.textPrimary} />
                      <Text style={s.runBtnText}>Run</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Progress bar */}
              {isRunning && (
                <View style={s.progressBar}>
                  <View style={[s.progressFill, { width: `${(done.length / routine.steps.length) * 100}%` }]} />
                </View>
              )}

              {/* Steps */}
              <View style={s.stepsWrap}>
                {routine.steps.map((step, i) => {
                  const isDoneStep = done.includes(i);
                  const isActive = isRunning && done.length === i;
                  return (
                    <View key={i} style={[s.step, i > 0 && s.stepBorder]}>
                      <View style={[s.stepDot, isDoneStep && s.stepDotDone, isActive && s.stepDotActive]} />
                      <Ionicons
                        name={step.icon}
                        size={14}
                        color={isDoneStep ? COLORS.success : isActive ? COLORS.accentLight : COLORS.textMuted}
                      />
                      <Text style={[s.stepLabel, isDoneStep && { color: COLORS.success }, isActive && { color: COLORS.textPrimary }]} numberOfLines={1}>
                        {step.label}
                      </Text>
                      <View style={[s.stepTag, step.type === 'wifi' ? s.tagWifi : s.tagIR]}>
                        <Text style={[s.stepTagText, step.type === 'wifi' ? s.tagWifiText : s.tagIRText]}>
                          {step.type === 'wifi' ? 'Wi-Fi' : 'IR'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Create routine CTA */}
        <TouchableOpacity style={s.addCard}>
          <Ionicons name="add-circle-outline" size={22} color={COLORS.textMuted} />
          <Text style={s.addText}>Create custom routine</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '600', color: COLORS.textPrimary },
  sub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  card: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  routineName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  triggerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  routineSub: { fontSize: 11, color: COLORS.textMuted },
  runBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 0.5, borderColor: COLORS.border },
  runBtnActive: { backgroundColor: COLORS.warnBg, borderColor: COLORS.warn },
  runBtnDone: { backgroundColor: COLORS.successBg, borderColor: COLORS.success },
  runBtnText: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '500' },
  runBtnTextWarn: { fontSize: 12, color: COLORS.warn, fontWeight: '500' },
  progressBar: { height: 3, backgroundColor: COLORS.border, marginHorizontal: 14 },
  progressFill: { height: 3, backgroundColor: COLORS.accent, borderRadius: 2 },
  stepsWrap: { paddingHorizontal: 14, paddingBottom: 10, paddingTop: 6, backgroundColor: COLORS.surface },
  step: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7 },
  stepBorder: { borderTopWidth: 0.5, borderTopColor: COLORS.border },
  stepDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.border },
  stepDotDone: { backgroundColor: COLORS.success },
  stepDotActive: { backgroundColor: COLORS.accent },
  stepLabel: { flex: 1, fontSize: 12, color: COLORS.textSecondary },
  stepTag: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  tagWifi: { backgroundColor: COLORS.accentBg },
  tagWifiText: { fontSize: 10, color: COLORS.accentLight, fontWeight: '600' },
  tagIR: { backgroundColor: COLORS.warnBg },
  tagIRText: { fontSize: 10, color: COLORS.warn, fontWeight: '600' },
  stepTagText: {},
  addCard: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', padding: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  addText: { fontSize: 14, color: COLORS.textMuted },
});
