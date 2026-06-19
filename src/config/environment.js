function trimTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function hostUrl(port) {
  if (typeof window === 'undefined') {
    return `http://localhost:${port}`;
  }
  return `${window.location.protocol}//${window.location.hostname}:${port}`;
}

const coreGateway = trimTrailingSlash(import.meta.env.VITE_CORE_API_BASE_URL || `${hostUrl(8000)}/api/v2`);
const accountCoreDirect = trimTrailingSlash(import.meta.env.VITE_ACCOUNT_CORE_BASE_URL || `${hostUrl(8081)}/api/v2`);

const ENV = {
  API_BASE_URL: coreGateway,
  ACCOUNT_CORE_BASE_URL: accountCoreDirect,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
  APP_NAME: import.meta.env.VITE_APP_NAME || 'BanQuito Operador',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
};

export const ENDPOINTS = {
  CUSTOMERS: {
    GET_ALL: '/customers',
    GET: (id) => `/customers/${id}`,
    SEARCH: (_type, identification) => `/customers/${identification}`,
    CREATE: '/customers',
    UPDATE: (id) => `/customers/${id}`,
    STATUS: (id, status) => `/customers/${id}/status/${status}`,
  },

  CUSTOMER_SUBTYPES: {
    GET_ALL: '/customer-subtypes',
    GET_BY_TYPE: (customerType) => `/customer-subtypes?customerType=${encodeURIComponent(customerType)}`,
  },

  ACCOUNTS: {
    GET: (accountIdOrNumber) => `/accounts/${accountIdOrNumber}`,
    CREATE: '/accounts',
    SUBTYPES: '/account-subtypes',
    GET_BY_CUSTOMER: (customerId) => `/accounts/customer/${customerId}`,
    BALANCE: (accountId) => `/accounts/${accountId}/balance`,
    TRANSACTIONS: (accountId) => `/accounts/${accountId}/transactions`,
    ACTIVATE: (accountNumber) => `/accounts/${accountNumber}/activate`,
    INACTIVATE: (accountNumber) => `/accounts/${accountNumber}/inactivate`,
    BLOCK: (accountNumber) => `/accounts/${accountNumber}/block`,
    SUSPEND: (accountNumber) => `/accounts/${accountNumber}/suspend`,
    CREDIT: () => '/accounts/teller/deposit',
    DEPOSIT: '/accounts/teller/deposit',
    WITHDRAWAL: '/accounts/teller/withdrawal',
    TRANSFER: '/accounts/transfer/p2p',
    GET_FAVORITE: (customerId) => `/accounts/customer/${customerId}/favorite`,
    AVAILABILITY: (accountId) => `/accounts/${accountId}/balance`,
  },

  TRANSACTIONS: {
    DEBIT: '/accounts/teller/withdrawal',
    CREDIT: '/accounts/teller/deposit',
    TRANSFER: '/accounts/transfer/p2p',
    HISTORY: (accountId) => `/accounts/${accountId}/transactions`,
  },

  BRANCHES: {
    GET_ALL: '/branches',
    GET: (code) => `/branches/${code}`,
    CREATE: '/branches',
  },

  HOLIDAYS: {
    CHECK_BUSINESS_DAY: (date) => `/calendar/holidays/check?date=${encodeURIComponent(date)}`,
  },
};

export default ENV;
