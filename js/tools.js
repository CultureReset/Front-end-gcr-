// Each tool is self-contained: given a tool row ({tool_key, label, config}) and the
// entity slug, it renders itself into the shared modal. Nobody leaves the page.

function openModal(title, bodyHtml) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'tool-modal-overlay';
  overlay.id = 'tool-modal-overlay';
  overlay.innerHTML = `
    <div class="tool-modal">
      <div class="tool-modal-head">
        <h3>${title}</h3>
        <button type="button" class="tool-modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="tool-modal-body">${bodyHtml}</div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('.tool-modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const existing = document.getElementById('tool-modal-overlay');
  if (existing) existing.remove();
}

function renderBookingTool(tool, slug) {
  openModal(tool.label || 'Book Now', `
    <form id="tool-booking-form">
      <div class="tool-field"><label>Name</label><input name="customer_name" required></div>
      <div class="tool-field"><label>Email</label><input name="customer_email" type="email"></div>
      <div class="tool-field"><label>Phone</label><input name="customer_phone" type="tel"></div>
      <div class="tool-field"><label>Party size</label><input name="party_size" type="number" min="1" value="2"></div>
      <div class="tool-field"><label>Date</label><input name="booking_date" type="date" required></div>
      <div class="tool-field"><label>Time</label><input name="booking_time" type="time" required></div>
      <div class="tool-field"><label>Notes</label><textarea name="notes" rows="2"></textarea></div>
      <div class="tool-status" id="tool-form-status"></div>
      <button type="submit" class="tool-submit-btn">Request Booking</button>
    </form>
  `);

  document.getElementById('tool-booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('tool-form-status');
    const payload = Object.fromEntries(new FormData(e.target).entries());
    status.textContent = 'Sending…';
    try {
      await Api.submitBooking(slug, payload);
      status.textContent = 'Request sent. The business will confirm shortly.';
      e.target.reset();
    } catch (err) {
      status.textContent = `Couldn't send request: ${err.message}`;
    }
  });
}

function renderSongRequestTool(tool, slug) {
  openModal(tool.label || 'Request a Song', `
    <form id="tool-song-request-form">
      <div class="tool-field"><label>Your name</label><input name="requester_name"></div>
      <div class="tool-field"><label>Song</label><input name="song_name" required></div>
      <div class="tool-field"><label>Tip amount</label><input name="tip_amount" type="number" min="0" step="0.01"></div>
      <div class="tool-field">
        <label>Tip via</label>
        <select name="tip_method">
          <option value="">None</option>
          <option value="cashapp">Cash App</option>
          <option value="venmo">Venmo</option>
        </select>
      </div>
      <div class="tool-status" id="tool-form-status"></div>
      <button type="submit" class="tool-submit-btn">Send Request</button>
    </form>
  `);

  document.getElementById('tool-song-request-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('tool-form-status');
    const payload = Object.fromEntries(new FormData(e.target).entries());
    status.textContent = 'Sending…';
    try {
      await Api.submitSongRequest(slug, payload);
      status.textContent = 'Request added to the queue.';
      e.target.reset();
    } catch (err) {
      status.textContent = `Couldn't send request: ${err.message}`;
    }
  });
}

function renderUnknownTool(tool) {
  openModal(tool.label || tool.tool_key, `<p>This tool isn't wired up yet.</p>`);
}

const TOOL_RENDERERS = {
  booking: renderBookingTool,
  song_requests: renderSongRequestTool,
};

function openTool(tool, slug) {
  const renderer = TOOL_RENDERERS[tool.tool_key] || renderUnknownTool;
  renderer(tool, slug);
}
