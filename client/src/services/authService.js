const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const login = (payload) =>
  request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const requestActivationOtp = (payload) =>
  request('/api/auth/activate/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const verifyActivationOtp = (payload) =>
  request('/api/auth/activate/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const requestForgotPasswordOtp = (payload) =>
  request('/api/auth/forgot/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const verifyForgotPasswordOtp = (payload) =>
  request('/api/auth/forgot/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getMe = (token) =>
  request('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateMe = (token, payload) =>
  request('/api/auth/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
