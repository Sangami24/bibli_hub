const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('biblihub_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('biblihub_token');
    localStorage.removeItem('biblihub_user');
    // Don't redirect if already on auth pages
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  googleLogin: (credential) => request('/auth/google', { method: 'POST', body: { credential } }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, newPassword) => request('/auth/reset-password', { method: 'POST', body: { token, newPassword } }),
  getMe: () => request('/auth/me'),
};

// Books API
export const booksAPI = {
  browse: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/books?${queryString}`);
  },
  getCategories: () => request('/books/categories'),
  getBook: (id) => request(`/books/${id}`),
  donate: (data) => request('/books/donate', { method: 'POST', body: data }),
  claim: (id, data) => request(`/books/${id}/claim`, { method: 'POST', body: data }),
};

// Users API
export const usersAPI = {
  getProfile: () => request('/users/profile'),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),
  getDonations: () => request('/users/donations'),
  getOrders: () => request('/users/orders'),
  getStats: () => request('/users/stats'),
};

// Pickup API
export const pickupAPI = {
  getPickups: () => request('/pickup'),
  getPickup: (id) => request(`/pickup/${id}`),
};
