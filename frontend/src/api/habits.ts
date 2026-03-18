import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5291';
const api = axios.create({ baseURL: `${BASE}/api` });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ht_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Habit {
  id: number;
  name: string;
  emoji: string;
  createdAt: string;
  completedToday: boolean;
  streak: number;
  completedDates: string[];
}

export const getHabits = () => api.get<Habit[]>('/habits').then(r => r.data);

export const createHabit = (name: string, emoji: string) =>
  api.post<Habit>('/habits', { name, emoji }).then(r => r.data);

export const deleteHabit = (id: number) => api.delete(`/habits/${id}`);

export const toggleHabit = (id: number, date?: string) =>
  api.post<Habit>(`/habits/${id}/toggle`, null, { params: date ? { date } : {} }).then(r => r.data);
