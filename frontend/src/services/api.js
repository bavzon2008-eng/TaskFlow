const TOKEN_KEY = 'taskflow_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
res = await fetch(`${API_BASE_URL}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event('taskflow:unauthorized'));
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  signup: (b) => request('/auth/signup', { method: 'POST', body: b }),
  login: (b) => request('/auth/login', { method: 'POST', body: b }),
  me: () => request('/auth/me'),
  listTasks: () => request('/tasks'),
  createTask: (b) => request('/tasks', { method: 'POST', body: b }),
  updateTask: (id, b) => request(`/tasks/${id}`, { method: 'PUT', body: b }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
