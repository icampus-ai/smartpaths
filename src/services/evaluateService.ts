import axios from 'axios';

const API_URL = '/api/upload';

export const uploadFileToBackend = async (file: File, fileType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);

  const response = await axios.post(`${API_URL}/file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const evaluateFiles = async (files: { [key: string]: File | null }, difficulty: string) => {
  const formData = new FormData();
  formData.append('difficulty', difficulty);

  Object.keys(files).forEach((key) => {
    if (files[key]) {
      formData.append(key, files[key] as File);
    }
  });

  const response = await axios.post(`${API_URL}/evaluate`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};