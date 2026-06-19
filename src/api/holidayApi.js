import axiosInstance from './partyAxiosInstance';
import { ENDPOINTS } from '../config/environment';

export const getAllHolidays = () =>
  axiosInstance.get(ENDPOINTS.HOLIDAYS.GET_ALL);

export const checkBusinessDay = (date) =>
  axiosInstance.get(ENDPOINTS.HOLIDAYS.CHECK_BUSINESS_DAY(date));
