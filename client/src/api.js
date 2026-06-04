const isProd = !window.location.hostname.includes('localhost');
const API_BASE = isProd ? 'https://newsetu-caow.onrender.com' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export const api = {
  signup: `${API_BASE}/api/provider/signup`,
  login: `${API_BASE}/api/provider/login`,
  adminLogin: `${API_BASE}/api/provider/admin/login`,
  adminAll: (pwd, page = 1, limit = 20, q = '') => `${API_BASE}/api/provider/admin/all?adminPwd=${pwd}&page=${page}&limit=${limit}${q ? '&q=' + encodeURIComponent(q) : ''}`,
  adminDelete: (id, pwd) => `${API_BASE}/api/provider/admin/delete/${id}?adminPwd=${pwd}`,
  updateProvider: (slug) => `${API_BASE}/api/provider/update/${slug}`,
  getProvider: (slug) => `${API_BASE}/api/provider/slug/${slug}`,
  search: `${API_BASE}/api/provider/search`,
  deleteProfile: `${API_BASE}/api/provider/delete-profile`,
  report: (slug) => `${API_BASE}/api/provider/report/${slug}`,
  trackCall: (slug) => `${API_BASE}/api/provider/track-call/${slug}`,
  similarProviders: (category, exclude) => `${API_BASE}/api/provider/similar/${category}?exclude=${exclude}`,
};
