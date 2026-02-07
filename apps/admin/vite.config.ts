import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/yakiben/admin/',
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
