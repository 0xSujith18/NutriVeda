import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (id: string, data: any) => api.put(`/users/${id}`, data),
};

export const foodAPI = {
  getFoods: (params?: any) => api.get('/foods', { params }),
  getFood: (id: string) => api.get(`/foods/${id}`),
};

export const dietPlanAPI = {
  getDietPlans: (params?: any) => api.get('/diet-plans', { params }),
  createDietPlan: (data: any) => api.post('/diet-plans', data),
  updateDietPlan: (id: string, data: any) => api.put(`/diet-plans/${id}`, data),
  deleteDietPlan: (id: string) => api.delete(`/diet-plans/${id}`),
};

export const progressAPI = {
  logProgress: (data: any) => api.post('/progress', data),
  getProgress: (userId: string, params?: any) =>
    api.get(`/progress/${userId}`, { params }),
};

export default api;