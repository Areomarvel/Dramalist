const PRIMARY_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:2150';
const FALLBACK_BASE_URL = 'http://127.0.0.1:2150';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('asiandrama_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;

  try {
    // Attempt 1: Try configured URL (or http://localhost:2150)
    response = await fetch(`${PRIMARY_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  } catch (primaryErr) {
    // Attempt 2: Fallback to http://127.0.0.1:2150 if localhost IPv6 resolution failed
    try {
      if (PRIMARY_BASE_URL !== FALLBACK_BASE_URL) {
        response = await fetch(`${FALLBACK_BASE_URL}${endpoint}`, {
          ...options,
          headers
        });
      } else {
        throw primaryErr;
      }
    } catch (fallbackErr) {
      console.error('API Network Error:', fallbackErr);
      throw new Error(
        'Unable to connect to backend server. Please make sure your backend (node index.js in Database folder) is started on port 2150.'
      );
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const authApi = {
  register: (username, email, password) =>
    apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    }),

  login: (email, password) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  getCurrentUser: () => apiFetch('/api/auth/me')
};

export const userApi = {
  getWatchlist: () => apiFetch('/api/users/watchlist'),

  addToWatchlist: (drama) =>
    apiFetch('/api/users/watchlist', {
      method: 'POST',
      body: JSON.stringify(drama)
    }),

  removeFromWatchlist: (id) =>
    apiFetch(`/api/users/watchlist/${id}`, {
      method: 'DELETE'
    }),

  updateProfile: (profileData) =>
    apiFetch('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
};
