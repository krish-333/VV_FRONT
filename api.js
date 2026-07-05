// =========================================================================
// VIVAH VERSE — API CLIENT
// Change API_BASE_URL to your Railway deployment URL once it's live.
// e.g. const API_BASE_URL = "https://vivahverse-backend.up.railway.app";
// =========================================================================

const API_BASE_URL = "http://localhost:8000"; // <-- swap this for your Railway URL

const api = {
  async request(path, { method = 'GET', body = null, auth = false, isForm = false } = {}) {
    const headers = {};
    if (!isForm) headers['Content-Type'] = 'application/json';
    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });

    let data = null;
    try { data = await res.json(); } catch (e) { /* empty response, fine */ }

    if (!res.ok) {
      const message = (data && (data.detail || data.message)) || `Request failed (${res.status})`;
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
    return data;
  },

  // ---- Auth ----
  register(payload) {
    return api.request('/auth/register', { method: 'POST', body: payload });
  },
  login(email, password) {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    return api.request('/auth/login', { method: 'POST', body: form, isForm: true });
  },
  me() {
    return api.request('/auth/me', { auth: true });
  },

  // ---- Categories ----
  listCategories() {
    return api.request('/categories');
  },

  // ---- Vendors ----
  listVendors(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return api.request(`/vendors${qs ? '?' + qs : ''}`);
  },
  getVendor(id) {
    return api.request(`/vendors/${id}`);
  },
  getVendorServices(id) {
    return api.request(`/vendors/${id}/services`);
  },
  getVendorReviews(id) {
    return api.request(`/reviews/vendor/${id}`);
  },
  getVendorAvailability(id, start, end) {
    const qs = new URLSearchParams({ ...(start && { start }), ...(end && { end }) }).toString();
    return api.request(`/availability/vendor/${id}${qs ? '?' + qs : ''}`);
  },
  createVendorProfile(payload) {
    return api.request('/vendors/profile', { method: 'POST', body: payload, auth: true });
  },
  getMyVendorProfile() {
    return api.request('/vendors/profile/me', { auth: true });
  },
  updateMyVendorProfile(payload) {
    return api.request('/vendors/profile/me', { method: 'PATCH', body: payload, auth: true });
  },
  createService(payload) {
    return api.request('/vendors/services', { method: 'POST', body: payload, auth: true });
  },

  // ---- Availability (vendor side) ----
  setMyAvailability(entries) {
    return api.request('/availability/me', { method: 'PUT', body: { entries }, auth: true });
  },
  getMyAvailability(start, end) {
    const qs = new URLSearchParams({ ...(start && { start }), ...(end && { end }) }).toString();
    return api.request(`/availability/me${qs ? '?' + qs : ''}`, { auth: true });
  },

  // ---- Bookings ----
  createBooking(payload) {
    return api.request('/bookings', { method: 'POST', body: payload, auth: true });
  },
  getMyBookings(statusFilter) {
    const qs = statusFilter ? `?status_filter=${statusFilter}` : '';
    return api.request(`/bookings/me${qs}`, { auth: true });
  },
  updateBookingStatus(id, status) {
    return api.request(`/bookings/${id}/status`, { method: 'PATCH', body: { status }, auth: true });
  },
  getBooking(id) {
    return api.request(`/bookings/${id}`, { auth: true });
  },

  // ---- Payments ----
  createPaymentOrder(bookingId, amount) {
    return api.request('/payments/create-order', { method: 'POST', body: { booking_id: bookingId, amount }, auth: true });
  },
  verifyPayment(payload) {
    return api.request('/payments/verify', { method: 'POST', body: payload, auth: true });
  },

  // ---- Reviews ----
  createReview(payload) {
    return api.request('/reviews', { method: 'POST', body: payload, auth: true });
  },
};
