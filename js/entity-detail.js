const root = document.getElementById('entity-root');
const slug = new URLSearchParams(window.location.search).get('slug');

function renderTags(tags) {
  if (!tags || !tags.length) return '';
  return `<div class="tag-list">${tags.map((t) => `<span class="tag-pill">${t.tag}</span>`).join('')}</div>`;
}

function renderHours(hours) {
  if (!hours || !hours.length) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const rows = hours
    .slice()
    .sort((a, b) => a.day_of_week - b.day_of_week)
    .map(
      (h) =>
        `<tr><td>${days[h.day_of_week] ?? h.day_of_week}</td><td>${
          h.is_closed ? 'Closed' : `${h.open_time || ''} &ndash; ${h.close_time || ''}`
        }</td></tr>`
    )
    .join('');
  return `<div class="section-block"><h2>Hours</h2><table class="hours-table">${rows}</table></div>`;
}

function renderPhotos(photos) {
  if (!photos || !photos.length) return '';
  return `<div class="section-block"><h2>Photos</h2><div class="photo-strip">${photos
    .map((p) => `<img src="${p.image_url}" alt="${p.caption || ''}">`)
    .join('')}</div></div>`;
}

function renderSectionContent(section) {
  const c = section.content;
  if (!c) return '';
  switch (section.section_type) {
    case 'rich_text':
      return `<p>${(c[0] && c[0].body_text) || ''}</p>`;
    case 'bullets':
      return `<ul>${c.map((b) => `<li>${b.bullet_text}</li>`).join('')}</ul>`;
    case 'items':
      return `<ul>${c
        .map((i) => `<li>${i.item_name}${i.price_text ? ` &mdash; ${i.price_text}` : ''}</li>`)
        .join('')}</ul>`;
    case 'groups':
      return c
        .map(
          (g) => `
        <h3>${g.title || ''}</h3>
        <ul>${(g.items || [])
          .map((i) => `<li>${i.item_name}${i.price_text ? ` &mdash; ${i.price_text}` : ''}</li>`)
          .join('')}</ul>`
        )
        .join('');
    case 'cards':
      return `<div class="entity-grid">${c
        .map(
          (card) => `
        <div class="entity-card">
          <div class="thumb" style="${card.image_url ? `background-image:url('${card.image_url}')` : ''}">${
            card.image_url ? '' : 'No photo'
          }</div>
          <div class="body"><h3>${card.title || ''}</h3><div class="meta">${card.subtitle || ''}</div></div>
        </div>`
        )
        .join('')}</div>`;
    case 'photos':
      return `<div class="photo-strip">${c.map((p) => `<img src="${p.image_url}" alt="${p.caption || ''}">`).join('')}</div>`;
    case 'location':
      return `<p>${[c.address_line_1, c.city, c.state, c.zip].filter(Boolean).join(', ')}</p>`;
    case 'hours':
      return `<table class="hours-table">${c
        .map((h) => `<tr><td>${h.day_of_week}</td><td>${h.is_closed ? 'Closed' : `${h.open_time || ''} &ndash; ${h.close_time || ''}`}</td></tr>`)
        .join('')}</table>`;
    default:
      return '';
  }
}

async function load() {
  if (!slug) {
    root.innerHTML = '<div class="empty-state">No business specified.</div>';
    return;
  }
  root.innerHTML = '<div class="empty-state">Loading&hellip;</div>';
  try {
    const data = await Api.getEntity(slug);
    const e = data.entity;
    const heroImg = e.hero_image_url || e.cover_url;

    document.title = `${e.name} — GCR`;

    root.innerHTML = `
      <a class="back-link" href="index.html">&larr; Back to businesses</a>
      <div class="hero" style="${heroImg ? `background-image:url('${heroImg}')` : ''}"></div>
      <div class="detail-header">
        <h1>${e.name}</h1>
        <div class="meta">
          ${e.entity_subtype || e.entity_type || ''}
          ${e.city ? ` &middot; ${e.city}, ${e.state || ''}` : ''}
          ${e.rating ? ` &middot; ${e.rating}&#9733; (${e.review_count || 0} reviews)` : ''}
        </div>
        ${e.description ? `<p>${e.description}</p>` : ''}
        ${renderTags(data.tags)}
      </div>
      ${renderHours(data.hours)}
      ${renderPhotos(data.photos)}
      ${data.sections
        .map(
          (s) => `<div class="section-block"><h2>${s.section_label}</h2>${renderSectionContent(s)}</div>`
        )
        .join('')}
    `;
  } catch (err) {
    root.innerHTML = `<div class="empty-state">Couldn't load this business: ${err.message}</div>`;
  }
}

load();
