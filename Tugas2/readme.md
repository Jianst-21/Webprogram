# Laporan Praktikum: Aplikasi Berbasis Platform — Modul 6

## Identitas Mahasiswa
* **Nama**: Aji Noto Sutrisno
* **NIM**: 2311102262
* **Kelas**: S1 IF-11-4
* **Program Studi**: S1 Informatika, Fakultas Informatika
* **Institusi**: Institut Teknologi Telkom Purwokerto (Tahun 2023/2024)
* **Dosen Pengampu**: Cahyo Prihantoro, S.Kom., M.Eng

## Deskripsi Proyek
Proyek ini adalah Sistem Informasi Akademik (SIAKAD) berupa aplikasi web berbasis Node.js yang mengimplementasikan arsitektur *Model-View-Controller* (MVC). Aplikasi ini dirancang dengan pemisahan struktur yang jelas antara *backend* (sisi peladen) dan *frontend* (sisi klien).

## Struktur Program
Berikut adalah rincian fungsionalitas dari setiap komponen utama dalam struktur direktori aplikasi:

### 1. Root Directory (Konfigurasi & Entry Point)
* **`server.js`**: Berfungsi sebagai berkas utama (*entry point*) untuk menginisialisasi dan menjalankan peladen aplikasi.
* **`package.json` & `package-lock.json`**: Berkas konfigurasi Node.js yang menyimpan informasi metadata proyek dan daftar *dependencies*.
* **`node_modules/`**: Direktori yang memuat seluruh pustaka yang diinstal.

### 2. Direktori `src/` (Backend)
* **`controllers/`**: Mengatur alur logika antara Model dan View.
* **`models/`**: Menangani logika manipulasi data mahasiswa.
* **`routes/`**: Mendefinisikan titik akhir (*endpoints/URL*) dari aplikasi.
* **`views/`**: Menyimpan berkas kerangka antarmuka pengguna berbasis HTML (`form.html`, `index.html`, `table.html`).
* **`data/`**: Berisi file `mahasiswa.json` yang bertindak sebagai *database* sementara.

### 3. Direktori `public/` (Frontend)
* **`css/`**: Menyimpan aturan *Cascading Style Sheets*.
* **`js/`**: Skrip sisi klien yang diorganisasi secara modular (`components/`, `pages/`, dan `utils/`).

---

## Source Code Program

*(Klik untuk memperluas kode)*

### 1. Source Code Program (Function View/)

<details>
<summary><b>index.html</b></summary>

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIAKAD — Sistem Informasi Akademik</title>
  <link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css](https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css)">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="hero-section">
    <div class="container py-5">
      <h1 class="hero-title animate-fade-up delay-1">Sistem Informasi <span class="text-accent">Akademik</span> Mahasiswa</h1>
    </div>
  </div>
  <script src="/js/components/navbar.js"></script>
  <script src="/js/pages/index.js"></script>
</body>
</html>
````

\</details\>

\<details\>
\<summary\>\<b\>form.html\</b\>\</summary\>

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daftarkan Mahasiswa — SIAKAD</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="container-fluid px-4 py-4">
    <h2 class="page-title mb-0"><i class="fas fa-user-plus me-2"></i>Formulir Pendaftaran Mahasiswa</h2>
    </div>
  <script src="/js/pages/form.js"></script>
</body>
</html>
```

\</details\>

\<details\>
\<summary\>\<b\>table.html\</b\>\</summary\>

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rekap Data Mahasiswa — SIAKAD</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="container-fluid px-4 py-4">
    <h2 class="page-title mb-0"><i class="fas fa-table me-2"></i>Rekap Data Mahasiswa</h2>
    </div>
  <script src="/js/pages/table.js"></script>
</body>
</html>
```

\</details\>

### 2\. Source Code Program (Function src/)

\<details\>
\<summary\>\<b\>mahasiswaController.js (Controller)\</b\>\</summary\>

```javascript
const { v4: uuidv4 } = require('uuid');
const model = require('../models/mahasiswaModel');

// GET /api/mahasiswa
function getAll(req, res) {
  res.json({ data: model.getAll() });
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
    semester: parseInt(semester),
    ipk: parseFloat(ipk),
    email,
    status: status || 'Aktif',
    createdAt: new Date().toISOString()
  };

  model.create(newMhs);
  res.status(201).json({ success: true, message: 'Data berhasil ditambahkan', data: newMhs });
}

module.exports = { getAll, create };
```

\</details\>

\<details\>
\<summary\>\<b\>mahasiswaModel.js (Model)\</b\>\</summary\>

```javascript
const fs = require('fs');
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

module.exports = { getAll };
```

\</details\>

\<details\>
\<summary\>\<b\>mahasiswaRoute.js (Routes)\</b\>\</summary\>

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/mahasiswaController');

router.get('/', controller.getAll);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
```

\</details\>

### 3\. Source Code Program (Function js/)

\<details\>
\<summary\>\<b\>navbar.js (Components)\</b\>\</summary\>

```javascript
// components/navbar.js — Komponen navbar yang dapat digunakan ulang

const Navbar = {
  render(selector = 'body') {
    const html = `
      <nav class="navbar navbar-expand-lg navbar-dark sticky-top" id="mainNav">
        </nav>`;
    $(selector).prepend(html);
    this.setActiveLink();
  },
  setActiveLink() {
    const currentPath = window.location.pathname;
    $('.navbar-nav .nav-link').each(function () {
      const href = $(this).attr('href');
      const isActive = href === currentPath || (href === '/' && currentPath === '/');
      $(this).toggleClass('active', isActive);
    });
  }
};
```

\</details\>

-----

## Output Program

*(Sertakan *screenshot* tampilan aplikasi Anda di folder repositori dan panggil dengan sintaks Markdown seperti di bawah ini)*

  * **Dashboard**: <img width="940" height="1095" alt="image" src="https://github.com/user-attachments/assets/a0bd523a-dca0-478a-8f33-f4a9308ec4fb" />

  * **Rekap Data**: <img width="940" height="561" alt="image" src="https://github.com/user-attachments/assets/1dcfd8d5-9cb6-4412-a51d-1dd7b655851f" />

  * **Daftarkan**: <img width="940" height="690" alt="image" src="https://github.com/user-attachments/assets/8794a983-626b-4cea-92a2-bff922b643ad" />


## Tautan Repositori

  * **GitHub**: [Webprogram/Ramadhan at main · Jianst-21/Webprogram](https://www.google.com/search?q=https://github.com/Jianst-21/Webprogram)

<!-- end list -->

```

[cite_start]*(Catatan: Mengingat kode aslinya sangat panjang dan memakan ribuan baris[cite: 42, 44, 46, 49, 53, 60, 62, 64], saya merangkum sebagian representasi isi kode di bagian HTML dan JS agar `README` Anda tidak terlalu penuh hingga sulit di-*scroll* (menjaga prinsip* clean documentation*). Namun jika Anda membutuhkan seluruh sintaks penuhnya dimasukkan tanpa disingkat, Anda dapat menyalin file aslinya ke dalam kolom di antara tanda 
```
