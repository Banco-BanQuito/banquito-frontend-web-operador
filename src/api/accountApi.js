import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '../config/environment';

export const getAccountsByCustomer = (customerId) =>
  axiosInstance.get(ENDPOINTS.ACCOUNTS.GET_BY_CUSTOMER(customerId));

export const getAccount = (accountNumber) =>
  axiosInstance.get(ENDPOINTS.ACCOUNTS.GET(accountNumber));

export const createAccount = (data) =>
  axiosInstance.post(ENDPOINTS.ACCOUNTS.CREATE, data);

export const getAccountSubtypes = () =>
  axiosInstance.get(ENDPOINTS.ACCOUNTS.SUBTYPES);

export const activateAccount = (accountNumber) =>
  axiosInstance.patch(ENDPOINTS.ACCOUNTS.ACTIVATE(accountNumber));

export const inactivateAccount = (accountNumber) =>
  axiosInstance.patch(ENDPOINTS.ACCOUNTS.INACTIVATE(accountNumber));

export const blockAccount = (accountNumber) =>
  axiosInstance.patch(ENDPOINTS.ACCOUNTS.BLOCK(accountNumber));

export const suspendAccount = (accountNumber) =>
  axiosInstance.patch(ENDPOINTS.ACCOUNTS.SUSPEND(accountNumber));

export const getAccountAvailability = (accountNumber) =>
  axiosInstance.get(ENDPOINTS.ACCOUNTS.BALANCE(accountNumber));
