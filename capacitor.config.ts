import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.navdrishti.safety',
  appName: 'Nav Drishti',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
