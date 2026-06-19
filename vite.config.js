import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const partyTarget = env.VITE_PARTY_API_TARGET || 'http://localhost:8083';
  const accountCoreTarget = env.VITE_ACCOUNT_CORE_TARGET || 'http://localhost:8081';

  return {
    plugins: [react()],
    server: {
      port: 3004,
      proxy: {
        '/account': {
          target: accountCoreTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/account/, ''),
        },
        '/party': {
          target: partyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/party/, ''),
        },
      },
    },
  };
});
