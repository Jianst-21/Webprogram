// utils/api.js — Helper untuk semua request ke backend

const API_BASE = '/api/mahasiswa';

const api = {
  // GET semua mahasiswa
  getAll() {
    return $.getJSON(API_BASE);
  },

  // GET mahasiswa by ID
  getById(id) {
    return $.getJSON(`${API_BASE}/${id}`);
  },

  // POST tambah mahasiswa baru
  create(payload) {
    return $.ajax({
      url: API_BASE,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload)
    });
  },

  // PUT update mahasiswa
  update(id, payload) {
    return $.ajax({
      url: `${API_BASE}/${id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(payload)
    });
  },

  // DELETE hapus mahasiswa
  remove(id) {
    return $.ajax({ url: `${API_BASE}/${id}`, type: 'DELETE' });
  },

  // GET statistik
  getStats() {
    return $.getJSON(`${API_BASE}/stats`);
  }
};
