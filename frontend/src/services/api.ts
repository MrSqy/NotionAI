/// <reference types="vite/client" />
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        useAuthStore.getState().setAuth(
          useAuthStore.getState().user!,
          newAccessToken
        );
        localStorage.setItem('refreshToken', newRefreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        onRefreshed(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
};

export const notesApi = {
  getAll: (params?: { archived?: boolean; search?: string }) =>
    api.get('/notes', { params }),
  getOne: (id: string) => api.get(`/notes/${id}`),
  create: (data: { title?: string }) => api.post('/notes', data),
  update: (id: string, data: Partial<{ title: string; summary: string | null; isArchived: boolean; isPinned: boolean; aiCanRead: boolean; aiCanWrite: boolean }>) =>
    api.patch(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

export const blocksApi = {
  save: (noteId: string, blocks: any[]) =>
    api.post(`/blocks/${noteId}`, { blocks }),
};

export const tagsApi = {
  getAll: () => api.get('/tags'),
  create: (data: { name: string; color?: string }) => api.post('/tags', data),
  attach: (noteId: string, tagId: string) =>
    api.post(`/tags/${noteId}/${tagId}`),
  detach: (noteId: string, tagId: string) =>
    api.delete(`/tags/${noteId}/${tagId}`),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

export const searchApi = {
  search: (q: string) => api.get('/search', { params: { q } }),
};

export const chatApi = {
  getAll: () => api.get('/chats'),
  getOne: (id: string) => api.get(`/chats/${id}`),
  create: (data: { title?: string; aiCanEdit?: boolean; aiCanRead?: boolean }) =>
    api.post('/chats', data),
  update: (id: string, data: Partial<{ title: string; aiCanEdit: boolean; aiCanRead: boolean }>) =>
    api.patch(`/chats/${id}`, data),
  delete: (id: string) => api.delete(`/chats/${id}`),
  sendMessage: (chatId: string, content: string) =>
    api.post(`/chats/${chatId}/messages`, { content }),
};
