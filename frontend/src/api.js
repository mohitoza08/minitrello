const BASE = '/api/tasks';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export const getTasks = () => request(BASE);

export const createTask = (payload) =>
  request(BASE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateTask = (id, payload) =>
  request(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const moveTask = (id, direction) =>
  request(`${BASE}/${id}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ direction }),
  });

export const deleteTask = (id) =>
  request(`${BASE}/${id}`, { method: 'DELETE' });
