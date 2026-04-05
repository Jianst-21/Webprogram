const { v4: uuidv4 } = require('uuid');
const model = require('../models/mahasiswaModel');

// GET /api/mahasiswa
function getAll(req, res) {
  res.json({ data: model.getAll() });
}

// GET /api/mahasiswa/:id
function getById(req, res) {
  const mhs = model.getById(req.params.id);
  if (!mhs) return res.status(404).json({ error: 'Data tidak ditemukan' });
  res.json(mhs);
}

// POST /api/mahasiswa
function create(req, res) {
  const { nim, nama, prodi, angkatan, semester, ipk, email, status } = req.body;

  if (!nim || !nama || !prodi || !angkatan || !semester || !ipk || !email)
    return res.status(400).json({ error: 'Semua field wajib diisi' });

  if (model.nimExists(nim))
    return res.status(400).json({ error: 'NIM sudah terdaftar' });

  const newMhs = {
    id: uuidv4(), nim, nama, prodi,
    angkatan: parseInt(angkatan),
    semester:  parseInt(semester),
    ipk:       parseFloat(ipk),
    email,
    status:    status || 'Aktif',
    createdAt: new Date().toISOString()
  };

  model.create(newMhs);
  res.status(201).json({ success: true, message: 'Data berhasil ditambahkan', data: newMhs });
}

// PUT /api/mahasiswa/:id
function update(req, res) {
  const { nim, nama, prodi, angkatan, semester, ipk, email, status } = req.body;

  if (model.nimExists(nim, req.params.id))
    return res.status(400).json({ error: 'NIM sudah digunakan mahasiswa lain' });

  const updated = model.update(req.params.id, {
    nim, nama, prodi,
    angkatan:  parseInt(angkatan),
    semester:  parseInt(semester),
    ipk:       parseFloat(ipk),
    email,
    status:    status || 'Aktif',
    updatedAt: new Date().toISOString()
  });

  if (!updated) return res.status(404).json({ error: 'Data tidak ditemukan' });
  res.json({ success: true, message: 'Data berhasil diperbarui', data: updated });
}

// DELETE /api/mahasiswa/:id
function remove(req, res) {
  const deleted = model.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Data tidak ditemukan' });
  res.json({ success: true, message: `Data ${deleted.nama} berhasil dihapus` });
}

// GET /api/stats
function getStats(req, res) {
  const list  = model.getAll();
  const total = list.length;
  const aktif = list.filter(s => s.status === 'Aktif').length;
  const avgIpk = total > 0
    ? (list.reduce((sum, s) => sum + s.ipk, 0) / total).toFixed(2)
    : 0;

  const prodiCount = {};
  list.forEach(s => { prodiCount[s.prodi] = (prodiCount[s.prodi] || 0) + 1; });

  res.json({ total, aktif, avgIpk, prodiCount });
}

module.exports = { getAll, getById, create, update, remove, getStats };
