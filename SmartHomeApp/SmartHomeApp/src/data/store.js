// Central state - in a real app this would use Context/Redux + real APIs
export const DEVICES = [
  { id: 'l1',   name: 'Living room light', room: 'Living room', type: 'wifi', icon: 'bulb-outline',      on: true,  brightness: 75, color: '#FFE066' },
  { id: 'tv1',  name: 'Living room TV',    room: 'Living room', type: 'ir',   icon: 'tv-outline',         on: true,  ir: 'tv'   },
  { id: 'sb1',  name: 'Soundbar',          room: 'Living room', type: 'ir',   icon: 'volume-high-outline', on: false, ir: 'audio'},
  { id: 'th1',  name: 'Thermostat',        room: 'Living room', type: 'wifi', icon: 'thermometer-outline', on: true,  temp: 22, humidity: 54 },
  { id: 'ac1',  name: 'Bedroom AC',        room: 'Bedroom',     type: 'ir',   icon: 'snow-outline',        on: false, ir: 'ac'  },
  { id: 's1',   name: 'Bedroom strip',     room: 'Bedroom',     type: 'wifi', icon: 'bulb-outline',        on: false, brightness: 60, color: '#A0C4FF' },
  { id: 'fan1', name: 'Ceiling fan',       room: 'Bedroom',     type: 'ir',   icon: 'refresh-outline',     on: false, ir: 'fan' },
  { id: 'p1',   name: 'Kitchen plug',      room: 'Kitchen',     type: 'wifi', icon: 'flash-outline',       on: true,  power: 120 },
];

export const IR_PROFILES = {
  tv: {
    name: 'Television', proto: 'NEC · 38kHz', hasDpad: true,
    buttons: [
      { label: 'Power',   icon: 'power',              code: '0x20DF10EF', isPower: true },
      { label: 'Vol +',   icon: 'volume-high-outline', code: '0x20DF40BF' },
      { label: 'Mute',    icon: 'volume-mute-outline', code: '0x20DF906F' },
      { label: 'Vol −',   icon: 'volume-low-outline',  code: '0x20DFC03F' },
      { label: 'Ch +',    icon: 'chevron-up-outline',  code: '0x20DF00FF' },
      { label: 'Source',  icon: 'swap-horizontal-outline', code: '0x20DFD02F' },
      { label: 'Ch −',    icon: 'chevron-down-outline',code: '0x20DF807F' },
      { label: 'Back',    icon: 'arrow-back-outline',  code: '0x20DF14EB' },
      { label: 'Home',    icon: 'home-outline',        code: '0x20DF3EC1' },
      { label: 'Info',    icon: 'information-circle-outline', code: '0x20DF55AA' },
    ],
  },
  ac: {
    name: 'Air conditioner', proto: 'Daikin · HVAC', hasDpad: false,
    buttons: [
      { label: 'Power',   icon: 'power',              code: '0xC5D5F1A0', isPower: true },
      { label: 'Cool',    icon: 'snow-outline',        code: '0xC5D50110' },
      { label: 'Heat',    icon: 'flame-outline',       code: '0xC5D50140' },
      { label: 'Fan',     icon: 'refresh-outline',     code: '0xC5D50180' },
      { label: 'Temp +',  icon: 'add-outline',         code: '0xC5D5A030' },
      { label: 'Temp −',  icon: 'remove-outline',      code: '0xC5D5A060' },
      { label: 'Auto',    icon: 'sync-outline',        code: '0xC5D5B0A0' },
      { label: 'Sleep',   icon: 'moon-outline',        code: '0xC5D5D010' },
      { label: 'Swing',   icon: 'expand-outline',      code: '0xC5D5C010' },
      { label: 'Turbo',   icon: 'flash-outline',       code: '0xC5D5E010' },
    ],
  },
  audio: {
    name: 'Soundbar', proto: 'Sony · SIRC', hasDpad: false,
    buttons: [
      { label: 'Power',   icon: 'power',              code: '0xA8BF40BF', isPower: true },
      { label: 'Vol +',   icon: 'volume-high-outline', code: '0xA8BF40BF' },
      { label: 'Mute',    icon: 'volume-mute-outline', code: '0xA8BFA05F' },
      { label: 'Vol −',   icon: 'volume-low-outline',  code: '0xA8BFC03F' },
      { label: 'HDMI 1',  icon: 'easel-outline',       code: '0xA8BF0AF5' },
      { label: 'HDMI 2',  icon: 'easel-outline',       code: '0xA8BF8A75' },
      { label: 'BT',      icon: 'bluetooth-outline',   code: '0xA8BF2AD5' },
      { label: 'Movie',   icon: 'film-outline',        code: '0xA8BF12ED' },
      { label: 'Music',   icon: 'musical-notes-outline',code: '0xA8BF9267'},
      { label: 'Voice',   icon: 'mic-outline',         code: '0xA8BF52AD' },
    ],
  },
  fan: {
    name: 'Ceiling fan', proto: 'RC5', hasDpad: false,
    buttons: [
      { label: 'Power',   icon: 'power',              code: '0x00C5006B', isPower: true },
      { label: 'Low',     icon: 'leaf-outline',        code: '0x00C5016B' },
      { label: 'Med',     icon: 'refresh-outline',     code: '0x00C5026B' },
      { label: 'High',    icon: 'speedometer-outline', code: '0x00C5036B' },
      { label: 'Light',   icon: 'bulb-outline',        code: '0x00C5030B' },
      { label: 'Dim +',   icon: 'sunny-outline',       code: '0x00C5040B' },
      { label: 'Dim −',   icon: 'moon-outline',        code: '0x00C5050B' },
      { label: '1h',      icon: 'timer-outline',       code: '0x00C5060B' },
      { label: '4h',      icon: 'timer-outline',       code: '0x00C5070B' },
      { label: '8h',      icon: 'timer-outline',       code: '0x00C5080B' },
    ],
  },
};

export const ROUTINES = [
  {
    id: 'r1', name: 'Good morning', icon: 'sunny-outline',
    color: '#FAEEDA', iconColor: '#854F0B', trigger: '7:00 AM daily',
    steps: [
      { label: 'Turn on living room light — 70%', type: 'wifi', icon: 'bulb-outline', deviceId: 'l1' },
      { label: 'TV power on',                     type: 'ir',   icon: 'tv-outline',   irCode: '0x20DF10EF' },
      { label: 'AC to 24°C cool mode',            type: 'ir',   icon: 'snow-outline', irCode: '0xC5D50110' },
      { label: 'Turn on kitchen plug',            type: 'wifi', icon: 'flash-outline',deviceId: 'p1'  },
    ],
  },
  {
    id: 'r2', name: 'Movie night', icon: 'film-outline',
    color: '#EEEDFE', iconColor: '#534AB7', trigger: 'Manual',
    steps: [
      { label: 'Dim lights to 15%',               type: 'wifi', icon: 'bulb-outline',       deviceId: 'l1'  },
      { label: 'TV power on',                     type: 'ir',   icon: 'tv-outline',          irCode: '0x20DF10EF' },
      { label: 'Soundbar on + Movie mode',        type: 'ir',   icon: 'volume-high-outline', irCode: '0xA8BF40BF' },
      { label: 'Thermostat to 20°C',             type: 'wifi', icon: 'thermometer-outline', deviceId: 'th1' },
    ],
  },
  {
    id: 'r3', name: 'Good night', icon: 'moon-outline',
    color: '#E1F5EE', iconColor: '#0F6E56', trigger: '10:30 PM daily',
    steps: [
      { label: 'Turn off all lights',   type: 'wifi', icon: 'bulb-outline',  deviceId: 'l1'  },
      { label: 'TV power off',          type: 'ir',   icon: 'tv-outline',    irCode: '0x20DF10EF' },
      { label: 'AC sleep mode 26°C',   type: 'ir',   icon: 'snow-outline',  irCode: '0xC5D5D010' },
      { label: 'Turn off kitchen plug', type: 'wifi', icon: 'flash-outline', deviceId: 'p1'  },
    ],
  },
  {
    id: 'r4', name: 'Away mode', icon: 'home-outline',
    color: '#FCEBEB', iconColor: '#A32D2D', trigger: 'Manual',
    steps: [
      { label: 'Turn off all Wi-Fi devices', type: 'wifi', icon: 'flash-outline',  deviceId: 'p1'  },
      { label: 'AC power off',               type: 'ir',   icon: 'snow-outline',   irCode: '0xC5D5F1A0' },
      { label: 'Fan power off',              type: 'ir',   icon: 'refresh-outline',irCode: '0x00C5006B' },
    ],
  },
];
