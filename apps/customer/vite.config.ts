import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/yakiben/customer/',
  resolve: {
    alias: {
      '@yakiben/supabase': path.resolve(__dirname, '../../libs/supabase/client.ts'),
      axios: 'axios'
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    }
  }
});
