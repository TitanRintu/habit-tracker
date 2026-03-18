import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5291';
const api = axios.create({ baseURL: `${BASE}/api` });

export const register = (email: string, password: string) =>
  api.post<{ token: string }>('/auth/register', { email, password }).then(r => r.data);

export const login = (email: string, password: string) =>
  api.post<{ token: string }>('/auth/login', { email, password }).then(r => r.data);
