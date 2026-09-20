import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.refinery.sif',
  appName: 'Refinery SIF Intelligence',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
