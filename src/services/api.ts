import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (window.location.port === '80' || window.location.port === '' || !window.location.port ? '/api' : 'http://localhost:8000/api'),
  withCredentials: true, // This allows HttpOnly cookies (JWTs) to be sent automatically
});

export const getRooms = async () => {
  const response = await api.get('/rooms/');
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout/');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};

export const holdSpace = async (data: { space_id?: number | string; room_number?: string; space_number?: number }) => {
  const response = await api.post('/bookings/hold/', data);
  return response.data;
};

export const releaseHold = async (booking_id?: number | string) => {
  const response = await api.post('/bookings/release-hold/', { booking_id });
  return response.data;
};

export const initializePayment = async (booking_id: number | string) => {
  const response = await api.post('/bookings/initialize-payment/', { booking_id });
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
