const getPartyUrl = () => {
  const url = import.meta.env.VITE_PARTY_API_BASE_URL || '/party/api/v2';
  const normalized = url.endsWith('/api/v2') ? url : `${url.replace(/\/$/, '')}/api/v2`;
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
};

const getAccountUrl = () => {
  const url = import.meta.env.VITE_ACCOUNT_API_BASE_URL || '/account/api/v2';
  const normalized = url.endsWith('/api/v2') ? url : `${url.replace(/\/$/, '')}/api/v2`;
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
};

const ENV = {
  API_BASE_URL: getAccountUrl(),
  PARTY_API_BASE_URL: getPartyUrl(),
  ACCOUNTING_API_BASE_URL: import.meta.env.VITE_ACCOUNTING_API_BASE_URL || 'http://localhost:8082/api/v2',
  CLEARING_API_BASE_URL: import.meta.env.VITE_CLEARING_API_BASE_URL || '/clearing/api/v2',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
  APP_NAME: import.meta.env.VITE_APP_NAME || 'BanQuito Operador',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN_STAFF: 'auth/login/staff',
    LOGIN_CUSTOMER: 'auth/login',
  },

  CUSTOMERS: {
    GET_ALL: 'customers',
    GET: (id) => `customers/${id}`,
    SEARCH: (_type, identification) => `customers/${identification}`,
    CREATE: 'customers',
    UPDATE: (id) => `customers/${id}`,
    STATUS: (id, status) => `customers/${id}/status/${status}`,
    SUBTYPES: 'customer-subtypes',
  },

  ACCOUNTS: {
    GET: (accountIdOrNumber) => `accounts/${accountIdOrNumber}`,
    CREATE: 'accounts/open',
    SUBTYPES: 'accounts/subtypes',
    GET_BY_CUSTOMER: (customerId) => `accounts/customer/${customerId}`,
    BALANCE: (accountId) => `accounts/${accountId}/balance`,
    TRANSACTIONS: (accountId) => `accounts/${accountId}/transactions`,
    ACTIVATE: (accountNumber) => `accounts/${accountNumber}/activate`,
    INACTIVATE: (accountNumber) => `accounts/${accountNumber}/inactivate`,
    BLOCK: (accountNumber) => `accounts/${accountNumber}/block`,
    SUSPEND: (accountNumber) => `accounts/${accountNumber}/suspend`,
  },

  BRANCHES: {
    GET_ALL: 'branches',
    GET: (code) => `branches/${code}`,
    CREATE: 'branches',
  },

  HOLIDAYS: {
    GET_ALL: 'holidays',
    CHECK_BUSINESS_DAY: (date) => `holidays/business-day?date=${date}`,
  },
};

export default ENV;
