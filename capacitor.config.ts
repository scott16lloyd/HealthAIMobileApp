import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'healthai-mobile',
  webDir: 'build',
  server: {
    url: 'http://192.168.68.109:3000',
    cleartext: true,
    androidScheme: 'https',
  },
};

export default config;
