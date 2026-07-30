var API_BASE = window.GCR_API_BASE || 'http://localhost:3001';

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

const Api = {
  listEntities(params) {
    const query = new URLSearchParams(params || {}).toString();
    return apiGet('/api/entities' + (query ? `?${query}` : ''));
  },
  getEntity(slug) {
    return apiGet(`/api/entities/${encodeURIComponent(slug)}`);
  },
};
