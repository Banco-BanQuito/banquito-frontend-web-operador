import clearingInstance from './clearingAxiosInstance';

export const getClearingFiles = () => clearingInstance.get('/clearing/files');

export const getClearingFileDownloadUrl = (id, format) =>
  `${clearingInstance.defaults.baseURL}/clearing/files/${id}/${format}`;

export const consolidateClearingFiles = (date) =>
  clearingInstance.post('/clearing/files/consolidate', null, { params: date ? { date } : {} });
