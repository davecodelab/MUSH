import axios from 'axios';

const TOKEN_STORAGE_KEY = 'mushia_jwt_token';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // Sends HttpOnly cookies automatically
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore storage errors
    }
  }
  return config;
});

const saveAuthToken = (token?: string) => {
  if (typeof window === 'undefined' || !token) return;
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore
  }
};

export const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const getRooms = async () => {
  const response = await api.get('/rooms/');
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/auth/register/', userData);
  if (response.data?.access_token) {
    saveAuthToken(response.data.access_token);
  }
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await api.post('/auth/login/', credentials);
  if (response.data?.access_token) {
    saveAuthToken(response.data.access_token);
  }
  return response.data;
};

export const logoutUser = async () => {
  clearAuthToken();
  const response = await api.post('/auth/logout/');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};

export const holdSpace = async (data: {
  space_id?: number | string;
  room_number?: string;
  space_number?: number;
  gender?: string;
}) => {
  const response = await api.post('/bookings/hold/', data);
  return response.data;
};

export const releaseHold = async (booking_id?: number | string) => {
  const response = await api.post('/bookings/release-hold/', { booking_id });
  return response.data;
};

export const initializePayment = async (booking_id: number | string, callback_url?: string) => {
  const response = await api.post('/bookings/initialize-payment/', { booking_id, callback_url });
  return response.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await api.post('/bookings/verify-payment/', { reference });
  return response.data;
};

export const getRoommates = async (room_id: string | number) => {
  const response = await api.get(`/bookings/roommates/${room_id}/`);
  return response.data;
};

export default api;
