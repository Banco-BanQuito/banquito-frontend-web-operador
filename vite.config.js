import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const coreTarget = env.VITE_CORE_GATEWAY_TARGET || 'http://localhost:8000';
  const accountCoreTarget = env.VITE_ACCOUNT_CORE_TARGET || 'http://localhost:8081';

  return {
    plugins: [react()],
    server: {
      port: 3004,
      proxy: {
        '/api/v2/auth/login/staff': {
          target: accountCoreTarget,
          changeOrigin: true,
        },
        '/api/v2': {
          target: coreTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
