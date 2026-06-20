import axios from 'axios';
import ENV from '../config/environment';

const clearingInstance = axios.create({
  baseURL: ENV.CLEARING_API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
});

export default clearingInstance;
