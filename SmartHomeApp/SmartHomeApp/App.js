import React, { useState, createContext, useCallback } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { DEVICES } from './src/data/store';
import { COLORS } from './src/utils/theme';

import HomeScreen from './src/screens/HomeScreen';
import DeviceDetailScreen from './src/screens/DeviceDetailScreen';
import RemoteScreen from './src/screens/RemoteScreen';
import RoutinesScreen from './src/screens/RoutinesScreen';
import ActivityScreen from './src/screens/ActivityScreen';

export const AppContext = createContext(null);
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NAV_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: COLORS.bg },
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 0.5,
          paddingBottom: 6,
          height: 60,
        },
        tabBarActiveTintColor: COLORS.accentLight,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, marginTop: -2 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Remote: focused ? 'radio' : 'radio-outline',
            Routines: focused ? 'play-circle' : 'play-circle-outline',
            Activity: focused ? 'pulse' : 'pulse-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Remote" component={RemoteScreen} />
      <Tab.Screen name="Routines" component={RoutinesScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [devices, setDevices] = useState(DEVICES.map(d => ({ ...d })));
  const [activityLog, setActivityLog] = useState([]);

  const toggleDevice = useCallback((id) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, on: !d.on } : d));
  }, []);

  const updateDevice = useCallback((id, changes) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...changes } : d));
  }, []);

  const addLog = useCallback((entry) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLog(prev => [{ ...entry, time }, ...prev].slice(0, 50));
  }, []);

  const clearLog = useCallback(() => setActivityLog([]), []);

  return (
    <AppContext.Provider value={{ devices, toggleDevice, updateDevice, activityLog, addLog, clearLog }}>
      <NavigationContainer theme={NAV_THEME}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={HomeTabs} />
          <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} options={{ animation: 'slide_from_right' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
