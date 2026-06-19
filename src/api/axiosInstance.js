import axios from 'axios';
import ENV from '../config/environment';

const instance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use((config) => {
  try {
    const candidates = [
      localStorage.getItem('banquito_auth'),
      localStorage.getItem('banquito_session'),
      localStorage.getItem('banquitoSession'),
      localStorage.getItem('banquitoSession'.toLowerCase())
    ].filter(Boolean);

    for (const raw of candidates) {
      try {
        const obj = JSON.parse(raw);
        const maybeId = obj?.user?.id || obj?.coreUserId || obj?.userId || obj?.session?.coreUserId || obj?.session?.user?.id || obj?.session?.userId;
        if (maybeId) {
          config.headers['X-Core-User-Id'] = String(maybeId);
          break;
        }
      } catch (_) {
        // ignore parse errors
      }
    }
  } catch (e) {
    // ignore storage errors
  }

  if (import.meta.env.DEV && !config.headers['X-Core-User-Id']) {
    console.warn('axios - No X-Core-User-Id found in localStorage.');
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (import.meta.env.DEV && error.response?.status >= 500) {
      console.error('API Server Error:', {
        status: error.response.status,
        message: error.response.data?.message,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
