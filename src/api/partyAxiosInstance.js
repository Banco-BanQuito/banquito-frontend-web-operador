import axios from 'axios';
import ENV from '../config/environment';

const partyInstance = axios.create({
  baseURL: ENV.PARTY_API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getUserId = () => {
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
        if (maybeId) return String(maybeId);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.debug('Invalid party session payload ignored.', error);
        }
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('Unable to inspect party session.', error);
    }
  }
  return null;
};

partyInstance.interceptors.request.use((config) => {
  const userId = getUserId();
  if (userId) {
    config.headers['X-Core-User-Id'] = userId;
  }
  return config;
});

export default partyInstance;
