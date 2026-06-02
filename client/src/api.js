const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  signup: `${API_BASE}/api/provider/signup`,
  getProvider: (slug) => `${API_BASE}/api/provider/slug/${slug}`,
  search: `${API_BASE}/api/provider/search`,
};
