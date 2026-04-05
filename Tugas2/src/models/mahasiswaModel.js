const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/mahasiswa.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { mahasiswa: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getAll() {
  return readData().mahasiswa;
}

function getById(id) {
  return readData().mahasiswa.find(s => s.id === id) || null;
}

function create(mhs) {
  const db = readData();
  db.mahasiswa.push(mhs);
  writeData(db);
  return mhs;
}

function update(id, updated) {
  const db = readData();
  const index = db.mahasiswa.findIndex(s => s.id === id);
  if (index === -1) return null;
  db.mahasiswa[index] = { ...db.mahasiswa[index], ...updated };
  writeData(db);
  return db.mahasiswa[index];
}

function remove(id) {
  const db = readData();
  const index = db.mahasiswa.findIndex(s => s.id === id);
  if (index === -1) return null;
  const deleted = db.mahasiswa.splice(index, 1)[0];
  writeData(db);
  return deleted;
}

function nimExists(nim, excludeId = null) {
  return readData().mahasiswa.some(s => s.nim === nim && s.id !== excludeId);
}

module.exports = { getAll, getById, create, update, remove, nimExists };
