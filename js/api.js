var API_BASE = window.GCR_API_BASE || 'http://localhost:3001';

async function apiRequest(path, options) {
  const res = await fetch(API_BASE + path, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

function apiGet(path) {
  return apiRequest(path);
}

function apiPost(path, body) {
  return apiRequest(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const Api = {
  listEntities(params) {
    const query = new URLSearchParams(params || {}).toString();
    return apiGet('/api/entities' + (query ? `?${query}` : ''));
  },
  getEntity(slug) {
    return apiGet(`/api/entities/${encodeURIComponent(slug)}`);
  },
  submitBooking(slug, payload) {
    return apiPost(`/api/entities/${encodeURIComponent(slug)}/bookings`, payload);
  },
  submitSongRequest(slug, payload) {
    return apiPost(`/api/entities/${encodeURIComponent(slug)}/song-requests`, payload);
  },
};
