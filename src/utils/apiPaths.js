const BASE_URL = 'http://localhost:8000/api/v1';

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    GET_USER: `${BASE_URL}/auth/getuser`,
    UPLOAD_IMAGE: `${BASE_URL}/auth/upload-image`
  },
  INCOME: {
    BASE: `${BASE_URL}/income`
  },
  EXPENSE: {
    BASE: `${BASE_URL}/expense`
  }
};