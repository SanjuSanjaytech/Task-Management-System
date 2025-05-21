import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;
if (!baseURL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined!');
}


const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (user) => api.post('/api/auth/register', user);
export const getTasks = (filters = {}) => api.get('/api/tasks', { params: filters });
export const createTask = (task) => api.post('/api/tasks', task);
export const updateTask = (id, task) => api.put(`/api/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
export const assignTask = (taskId, data) => api.post(`/api/tasks/${taskId}/assign`, data);
export const getUsers = () => api.get('/api/users');
export const getDashboard = () => api.get('/api/tasks/dashboard');