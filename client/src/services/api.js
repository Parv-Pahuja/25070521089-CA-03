// All our backend calls are in this one file
import axios from 'axios';

// One Axios instance. The base URL comes from client/.env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Send the saved token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('orbit_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const signupUser = (data) => api.post('/auth/signup', data).then((res) => res.data);
export const loginUser = (data) => api.post('/auth/login', data).then((res) => res.data);
export const getMe = () => api.get('/auth/me').then((res) => res.data);

// Articles
export const getArticles = (category) =>
  api.get('/articles', { params: { category } }).then((res) => res.data);
export const getArticle = (id) => api.get(`/articles/${id}`).then((res) => res.data);
export const getTrending = () => api.get('/articles/trending').then((res) => res.data);

// Comments
export const getComments = (articleId) => api.get(`/comments/${articleId}`).then((res) => res.data);
export const postComment = (data) => api.post('/comments', data).then((res) => res.data);

// Reactions
export const getReactions = (articleId) => api.get(`/reactions/${articleId}`).then((res) => res.data);
export const addReaction = (articleId, type) =>
  api.post(`/reactions/${articleId}`, { type }).then((res) => res.data);

// Saved articles (Mission Log)
export const getSaved = () => api.get('/saved').then((res) => res.data);
export const saveArticle = (articleId) => api.post(`/saved/${articleId}`);
export const unsaveArticle = (articleId) => api.delete(`/saved/${articleId}`);

export default api;
