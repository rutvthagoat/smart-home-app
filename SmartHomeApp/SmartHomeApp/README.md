# SmartHome IR — Mobile App

Control IR devices (TV, AC, Soundbar, Fan) and Wi-Fi smart devices from one app. Run automated routines that combine both.

## Features
- **Home tab** — All devices with on/off toggle, room filter
- **Remote tab** — Full IR remote for TV, AC, Soundbar, Ceiling fan
- **Device detail** — Brightness slider, colour picker, temp control, IR button grid
- **Routines tab** — Run routines with animated step progress (Good morning, Movie night, Good night, Away mode)
- **Activity tab** — Full log of every IR signal, Wi-Fi command, and routine event

## Run on your phone in 3 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npx expo start
```

### 3. Open on your phone
- Install the **Expo Go** app from the App Store or Google Play
- Scan the QR code shown in the terminal
- The app opens instantly — no build needed

## Connect real hardware

### IR blaster (send real IR codes)
Replace the `sendIR` calls in `RemoteScreen.js` and `DeviceDetailScreen.js` with HTTP requests to:
- **Broadlink RM4 Pro** — use the `broadlink` npm package or a local HTTP bridge
- **ESP32 + IRremoteESP8266** — flash the ESP32 and POST to its HTTP endpoint
- **Raspberry Pi + LIRC** — POST to a local Flask/Express server

Example (ESP32):
```js
async function sendIR(label, code) {
  await fetch('http://192.168.1.50/ir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
}
```

### Smart devices (Wi-Fi)
Replace toggle/slider handlers in `DeviceDetailScreen.js` with calls to:
- **Tuya / Smart Life** — Tuya Cloud API
- **Home Assistant** — REST API at `http://homeassistant.local:8123/api`
- **MQTT** — `mqtt` npm package for direct broker connection

Example (Home Assistant):
```js
async function toggleDevice(entityId, turnOn) {
  await fetch(`http://homeassistant.local:8123/api/services/light/${turnOn ? 'turn_on' : 'turn_off'}`, {
    method: 'POST',
    headers: { Authorization: 'Bearer YOUR_LONG_LIVED_TOKEN', 'Content-Type': 'application/json' },
    body: JSON.stringify({ entity_id: entityId }),
  });
}
```

## Build a standalone APK (Android)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```
This gives you a `.apk` you can sideload directly — no Play Store needed.
