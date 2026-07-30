const state = { page: 1, limit: 24, search: '', type: '' };

const grid = document.getElementById('entity-grid');
const searchInput = document.getElementById('search-input');
const typeSelect = document.getElementById('type-select');
const pagination = document.getElementById('pagination');

function entityThumbStyle(entity) {
  const img = entity.hero_image_url || entity.cover_url;
  return img ? `background-image:url('${img}')` : '';
}

function renderEntities(entities) {
  if (!entities.length) {
    grid.innerHTML = `<div class="empty-state">No businesses found${state.search ? ` for "${state.search}"` : ''}.</div>`;
    return;
  }

  grid.innerHTML = entities
    .map(
      (e) => `
    <a class="entity-card" href="entity.html?slug=${encodeURIComponent(e.slug)}">
      <div class="thumb" style="${entityThumbStyle(e)}">${e.hero_image_url || e.cover_url ? '' : 'No photo'}</div>
      <div class="body">
        <h3>${e.name}</h3>
        <div class="meta">
          ${e.entity_subtype || e.entity_type || ''}${e.city ? ` &middot; ${e.city}` : ''}
          ${e.rating ? ` &middot; ${e.rating}&#9733; (${e.review_count || 0})` : ''}
        </div>
      </div>
    </a>`
    )
    .join('');
}

function renderPagination(total) {
  const totalPages = Math.max(Math.ceil(total / state.limit), 1);
  pagination.innerHTML = `
    <button id="prev-page" ${state.page <= 1 ? 'disabled' : ''}>Prev</button>
    <span>Page ${state.page} of ${totalPages}</span>
    <button id="next-page" ${state.page >= totalPages ? 'disabled' : ''}>Next</button>
  `;
  document.getElementById('prev-page').onclick = () => {
    state.page = Math.max(state.page - 1, 1);
    load();
  };
  document.getElementById('next-page').onclick = () => {
    state.page = Math.min(state.page + 1, totalPages);
    load();
  };
}

async function load() {
  grid.innerHTML = '<div class="empty-state">Loading&hellip;</div>';
  pagination.innerHTML = '';
  try {
    const params = { page: state.page, limit: state.limit };
    if (state.search) params.search = state.search;
    if (state.type) params.type = state.type;
    const { entities, total } = await Api.listEntities(params);
    renderEntities(entities);
    renderPagination(total);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't reach the API: ${err.message}</div>`;
  }
}

let searchDebounce;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.search = e.target.value.trim();
    state.page = 1;
    load();
  }, 300);
});

typeSelect.addEventListener('change', (e) => {
  state.type = e.target.value;
  state.page = 1;
  load();
});

load();
