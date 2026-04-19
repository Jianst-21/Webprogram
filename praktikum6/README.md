AJI NOTO SUTRISNO
2311102262

***

# Laporan Pengembangan Sistem Informasi Data Mahasiswa Berbasis Laravel dan AJAX

## 1. Pendahuluan
Proyek ini merupakan sebuah aplikasi web sederhana yang dibangun menggunakan kerangka kerja Laravel. Tujuan utama dari aplikasi ini adalah untuk mendemonstrasikan integrasi antara backend PHP dengan frontend JavaScript menggunakan teknik AJAX (Asynchronous JavaScript and XML). Aplikasi ini memungkinkan pengguna untuk memuat, menampilkan, dan menyaring data mahasiswa secara dinamis tanpa melakukan pemuatan ulang halaman (page reload).

## 2. Penjelasan dan Implementasi Kode

Sistem ini terdiri dari lima komponen utama yang saling terhubung: Routing, Controller, Layout Blade, View Blade, dan JavaScript. Berikut adalah penjelasan beserta kode sumber untuk masing-masing komponen.

### 2.1. Jalur Akses (Routing) - `routes/web.php`
File ini mendefinisikan rute untuk aplikasi. Terdapat dua rute: rute pertama untuk memuat halaman antarmuka utama, dan rute kedua sebagai titik akhir (endpoint) API untuk mengambil data mahasiswa.

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MahasiswaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Halaman utama - menampilkan view blade
Route::get('/', [MahasiswaController::class, 'index'])->name('mahasiswa.index');

// API endpoint - mengembalikan data JSON untuk AJAX
Route::get('/api/mahasiswa', [MahasiswaController::class, 'getData'])->name('mahasiswa.data');
```

### 2.2. Logika Backend (Controller) - `MahasiswaController.php`
Controller ini bertugas menangani permintaan dari klien. Fungsi `index()` mengembalikan tampilan, sedangkan fungsi `getData()` membaca file `mahasiswa.json` di direktori penyimpanan, melakukan validasi ketersediaan dan format file, lalu mengembalikannya sebagai respons JSON.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MahasiswaController extends Controller
{
    /**
     * Tampilkan halaman utama
     */
    public function index()
    {
        return view('mahasiswa.index');
    }

    /**
     * Ambil data mahasiswa dari file JSON dan kembalikan sebagai JSON response
     */
    public function getData()
    {
        // Path ke file JSON di storage
        $filePath = storage_path('app/data/mahasiswa.json');

        // Cek apakah file ada
        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File data mahasiswa tidak ditemukan.',
                'data' => []
            ], 404);
        }

        // Baca isi file JSON
        $jsonContent = file_get_contents($filePath);

        // Decode JSON menjadi array PHP
        $mahasiswa = json_decode($jsonContent, true);

        // Cek apakah JSON valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'success' => false,
                'message' => 'Format file JSON tidak valid.',
                'data' => []
            ], 500);
        }

        // Kembalikan data sebagai JSON response
        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dimuat.',
            'total' => count($mahasiswa),
            'data' => $mahasiswa
        ]);
    }
}
```

### 2.3. Struktur Tampilan Utama (Layout) - `app.blade.php`
Ini adalah kerangka dasar HTML yang digunakan oleh seluruh halaman. File ini memuat meta tag (termasuk CSRF token untuk keamanan AJAX), pustaka font dari Google, dan pustaka ikon Lucide.

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Data Mahasiswa')</title>

    {{-- Google Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">

    {{-- Lucide Icons (CDN) --}}
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    {{-- Base CSS --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    {{-- CSS tambahan per halaman --}}
    @yield('styles')
</head>
<body>

    {{-- NAVBAR --}}
    <nav class="navbar">
        <div class="navbar-brand">
            <div class="navbar-logo-icon">
                <i data-lucide="graduation-cap"></i>
            </div>
            <span class="navbar-title">Sistem Mahasiswa</span>
        </div>
        <div class="navbar-info">
            <i data-lucide="database"></i>
            <span>Data tanpa database &middot; AJAX</span>
        </div>
    </nav>

    {{-- MAIN CONTENT --}}
    <main>
        @yield('content')
    </main>

    {{-- FOOTER --}}
    <footer class="footer">
        <div class="footer-inner">
            <i data-lucide="code-2"></i>
            <span>Praktikum Laravel + AJAX &mdash; Dibuat dengan Laravel Blade &amp; Vanilla JS</span>
        </div>
    </footer>

    {{-- Init Lucide Icons --}}
    <script>lucide.createIcons();</script>

    @yield('scripts')
</body>
</html>
```

### 2.4. Halaman Dashboard (View) - `index.blade.php`
File ini mewarisi `app.blade.php` dan berisi struktur visual utama seperti tombol pemuat data, kartu statistik, kolom pencarian, dan tabel data kosong yang nantinya akan diisi oleh JavaScript. File ini juga menggunakan direktif Vite untuk memuat aset JavaScript.

```html
@extends('layouts.app')

@section('title', 'Data Mahasiswa – Praktikum Laravel AJAX')

@section('styles')
    <link rel="stylesheet" href="{{ asset('css/mahasiswa.css') }}">
@endsection

@section('content')

<div class="hero">
    <div class="hero-badge">
        <i data-lucide="zap"></i>
        Tugas Praktikum Laravel
    </div>
    <h1>Data <span>Mahasiswa</span><br>Universitas</h1>
    <p>Ambil dan tampilkan data mahasiswa secara dinamis menggunakan AJAX tanpa reload halaman.</p>
    <button class="btn-primary" id="btn-load" onclick="loadMahasiswa()">
        <div class="spinner" id="btn-spinner"></div>
        <i data-lucide="database" id="btn-icon"></i>
        <span id="btn-text">Tampilkan Data</span>
    </button>
</div>

<div class="stats-row" id="stats-row" style="display:none;">
    <div class="stat-card">
        <div class="stat-icon stat-icon--blue"><i data-lucide="users"></i></div>
        <div>
            <div class="stat-label">Total Mahasiswa</div>
            <div class="stat-value" id="stat-total">0</div>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon--green"><i data-lucide="layers"></i></div>
        <div>
            <div class="stat-label">Jumlah Prodi</div>
            <div class="stat-value" id="stat-prodi">0</div>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon--amber"><i data-lucide="book-open"></i></div>
        <div>
            <div class="stat-label">Jumlah Kelas</div>
            <div class="stat-value" id="stat-kelas">0</div>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon--purple"><i data-lucide="trending-up"></i></div>
        <div>
            <div class="stat-label">Rata-rata IPK</div>
            <div class="stat-value" id="stat-ipk">0.00</div>
        </div>
    </div>
</div>

<div class="container" style="padding-top:40px;">
    <div id="result-area">

        <div class="empty-state" id="empty-state">
            <div class="icon-wrap">
                <i data-lucide="mouse-pointer-click"></i>
            </div>
            <h3>Belum ada data ditampilkan</h3>
            <p>Klik tombol <strong>"Tampilkan Data"</strong> di atas untuk memuat data mahasiswa</p>
        </div>

        <div id="table-section" style="display:none;">
            <div class="section-header">
                <div class="section-title">
                    <i data-lucide="table-2"></i>
                    Daftar Mahasiswa
                    <span class="badge-count" id="badge-count">0</span>
                </div>
                <div class="search-wrap">
                    <i data-lucide="search" class="search-icon"></i>
                    <input type="text" id="search-input" placeholder="Cari nama / NIM..." oninput="filterTable()">
                </div>
            </div>

            <div class="table-wrapper">
                <table id="mahasiswa-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>NIM</th>
                            <th>Nama Mahasiswa</th>
                            <th>Kelas</th>
                            <th>Program Studi</th>
                            <th>IPK</th>
                            <th>Angkatan</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        {{-- Diisi oleh JavaScript via AJAX --}}
                    </tbody>
                </table>
            </div>

            <div class="no-filter-result" id="no-filter-result">
                <i data-lucide="search-x"></i>
                Tidak ada data yang cocok dengan pencarian.
            </div>
        </div>

    </div>
</div>

<div id="toast">
    <i data-lucide="check-circle" class="toast-icon" id="toast-icon"></i>
    <span id="toast-msg"></span>
</div>

@endsection

@section('scripts')
    {{-- Kirim URL route dari Blade ke file JS eksternal --}}
    <script>
        window.MAHASISWA_URL = '{{ route("mahasiswa.data") }}';
    </script>

    {{-- Load file JS via Vite --}}
    @vite(['resources/js/mahasiswa.js'])
@endsection
```

### 2.5. Logika Antarmuka AJAX - `mahasiswa.js`
File ini adalah inti dari interaktivitas sistem. File ini mengeksekusi Fetch API untuk mengambil data dari rute Laravel, mengubah DOM untuk merender tabel dan animasi, menghitung statistik secara otomatis, serta menangani fungsi pencarian data berdasarkan input pengguna.

```javascript
/**
 * mahasiswa.js
 * Semua fungsi JavaScript untuk halaman Data Mahasiswa
 * Dipanggil via Vite: @vite(['resources/js/mahasiswa.js'])
 *
 * URL AJAX diambil dari variabel global window.MAHASISWA_URL
 * yang di-set di blade: <script> window.MAHASISWA_URL = '{{ route(...) }}' </script>
 */

// Simpan semua data untuk keperluan filter search
let allData = [];

/**
 * Load data mahasiswa via AJAX (Fetch API)
 * Dipanggil saat tombol "Tampilkan Data" diklik
 */
function loadMahasiswa() {
    const btn     = document.getElementById('btn-load');
    const spinner = document.getElementById('btn-spinner');
    const btnIcon = document.getElementById('btn-icon');
    const btnText = document.getElementById('btn-text');

    // Set state loading
    btn.disabled          = true;
    spinner.style.display = 'block';
    btnIcon.style.display = 'none';
    btnText.textContent   = 'Memuat...';

    // Ambil URL dari variabel global yang di-set di blade
    const url       = window.MAHASISWA_URL;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // AJAX request ke endpoint Laravel
    fetch(url, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept'          : 'application/json',
            'X-CSRF-TOKEN'    : csrfToken
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    })
    .then(json => {
        if (json.success && json.data.length > 0) {
            allData = json.data;
            renderTable(allData);
            renderStats(allData);
            showToast('success', `${json.total} data mahasiswa berhasil dimuat!`);

            // Ubah tombol jadi "Refresh Data"
            btnText.textContent = 'Refresh Data';
            btnIcon.style.display = 'block';
            btnIcon.setAttribute('data-lucide', 'refresh-cw');
            lucide.createIcons();
        } else {
            showToast('error', 'Data kosong atau gagal dimuat.');
        }
    })
    .catch(err => {
        console.error(err);
        showToast('error', 'Terjadi kesalahan koneksi. Coba lagi.');
    })
    .finally(() => {
        btn.disabled          = false;
        spinner.style.display = 'none';
        btnIcon.style.display = 'block';
    });
}

/**
 * Render baris tabel dari array data mahasiswa
 * @param {Array} data - Array objek mahasiswa
 */
function renderTable(data) {
    const tbody   = document.getElementById('table-body');
    const section = document.getElementById('table-section');
    const empty   = document.getElementById('empty-state');
    const badge   = document.getElementById('badge-count');

    tbody.innerHTML   = '';
    badge.textContent = data.length;

    data.forEach((mhs, index) => {
        const ipk      = parseFloat(mhs.ipk) || 0;
        const ipkColor = ipk >= 3.5 ? '#059669' : ipk >= 3.0 ? '#D97706' : '#DC2626';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="no-cell">${String(index + 1).padStart(2, '0')}</td>
            <td><span class="nim-badge">${mhs.nim}</span></td>
            <td class="nama-cell">${mhs.nama}</td>
            <td><span class="kelas-tag"><i data-lucide="tag"></i>${mhs.kelas}</span></td>
            <td class="prodi-cell">${mhs.prodi}</td>
            <td class="ipk-cell" style="color:${ipkColor};">${mhs.ipk || '-'}</td>
            <td class="angkatan-cell">${mhs.angkatan || '-'}</td>
        `;

        // Animasi stagger masuk per baris
        tr.style.opacity    = '0';
        tr.style.transform  = 'translateY(10px)';
        tr.style.transition = `opacity 0.3s ease ${index * 60}ms, transform 0.3s ease ${index * 60}ms`;
        tbody.appendChild(tr);

        requestAnimationFrame(() => setTimeout(() => {
            tr.style.opacity   = '1';
            tr.style.transform = 'translateY(0)';
        }, 10));
    });

    empty.style.display   = 'none';
    section.style.display = 'block';
    lucide.createIcons();
}

/**
 * Render kartu statistik (total, prodi, kelas, rata-rata IPK)
 * @param {Array} data - Array objek mahasiswa
 */
function renderStats(data) {
    const statsRow = document.getElementById('stats-row');
    const totalMhs = data.length;
    const prodiSet = new Set(data.map(m => m.prodi));
    const kelasSet = new Set(data.map(m => m.kelas));
    const avgIpk   = data.reduce((sum, m) => sum + (parseFloat(m.ipk) || 0), 0) / totalMhs;

    document.getElementById('stat-total').textContent = totalMhs;
    document.getElementById('stat-prodi').textContent = prodiSet.size;
    document.getElementById('stat-kelas').textContent = kelasSet.size;
    document.getElementById('stat-ipk').textContent   = avgIpk.toFixed(2);

    // Animasi slide-down masuk
    statsRow.style.display    = 'flex';
    statsRow.style.opacity    = '0';
    statsRow.style.transform  = 'translateY(-10px)';
    statsRow.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    requestAnimationFrame(() => setTimeout(() => {
        statsRow.style.opacity   = '1';
        statsRow.style.transform = 'translateY(0)';
    }, 10));
}

/**
 * Filter tabel real-time berdasarkan nama atau NIM
 * Dipanggil dari oninput di input search
 */
function filterTable() {
    const keyword  = document.getElementById('search-input').value.toLowerCase().trim();
    const rows     = document.querySelectorAll('#table-body tr');
    const noResult = document.getElementById('no-filter-result');
    const badge    = document.getElementById('badge-count');
    let visible    = 0;

    rows.forEach(row => {
        const nama = row.cells[2]?.textContent.toLowerCase() || '';
        const nim  = row.cells[1]?.textContent.toLowerCase() || '';
        if (nama.includes(keyword) || nim.includes(keyword)) {
            row.style.display        = '';
            row.cells[0].textContent = String(++visible).padStart(2, '0');
        } else {
            row.style.display = 'none';
        }
    });

    badge.textContent      = visible;
    noResult.style.display = visible === 0 ? 'block' : 'none';
    if (visible === 0) lucide.createIcons();
}

/**
 * Tampilkan toast notification
 * @param {string} type    - 'success' atau 'error'
 * @param {string} message - Pesan yang ditampilkan
 */
function showToast(type, message) {
    const toast     = document.getElementById('toast');
    const toastMsg  = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    toast.className      = `show ${type}`;
    toastMsg.textContent = message;
    toastIcon.setAttribute('data-lucide', type === 'success' ? 'check-circle' : 'x-circle');
    lucide.createIcons();

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.className = ''; }, 3500);
}

// Expose fungsi ke global scope agar bisa dipanggil dari HTML (onclick="...")
window.loadMahasiswa = loadMahasiswa;
window.filterTable   = filterTable;
```

## 3. Panduan Penggunaan dan Instalasi

### 3.1. Persiapan Lingkungan
Pastikan perangkat Anda telah terinstal perangkat lunak berikut:
* PHP (versi yang kompatibel dengan instalasi Laravel Anda)
* Composer (Manajer paket PHP)
* Node.js dan NPM (Manajer paket JavaScript)

### 3.2. Struktur Penempatan File
Tempatkan file-file di atas pada direktori Laravel yang tepat:
1. `MahasiswaController.php` diletakkan di `app/Http/Controllers/`.
2. `web.php` diletakkan di `routes/` (atau ditambahkan ke file web.php yang sudah ada).
3. `app.blade.php` diletakkan di `resources/views/layouts/`.
4. `index.blade.php` diletakkan di `resources/views/mahasiswa/`.
5. `mahasiswa.js` diletakkan di `resources/js/`.

### 3.3. Pembuatan Sumber Data JSON
Karena sistem ini tidak menggunakan database relasional (SQL), data dimuat dari sistem file.
1. Buat direktori bernama `data` di dalam folder `storage/app/`.
2. Buat file baru dengan nama `mahasiswa.json` di dalam `storage/app/data/`.
3. Isi file tersebut dengan format JSON yang valid, contoh:
```json
[
    {
        "nim": "10119001",
        "nama": "Budi Santoso",
        "kelas": "IF-1",
        "prodi": "Teknik Informatika",
        "ipk": "3.75",
        "angkatan": "2019"
    }
]
```

### 3.4. Instalasi Dependensi
Buka antarmuka baris perintah (terminal) pada direktori proyek Laravel Anda, kemudian jalankan:
1. `composer install` (untuk memastikan dependensi backend siap).
2. `npm install` (untuk menginstal dependensi frontend Vite).

### 3.5. Menjalankan Aplikasi
Dikarenakan proyek ini menggunakan Vite sebagai pengelola aset, diperlukan dua layanan yang berjalan secara paralel. Buka dua jendela terminal terpisah:

**Terminal 1 (Backend Server):**
Jalankan perintah berikut untuk mengaktifkan server lokal PHP Laravel.
```bash
php artisan serve
```

**Terminal 2 (Frontend Server):**
Jalankan perintah berikut untuk mengaktifkan server Vite yang akan melakukan kompilasi aset JavaScript secara otomatis.
```bash
npm run dev
```

Setelah kedua server berjalan, buka peramban web dan akses alamat `http://localhost:8000`. Klik tombol "Tampilkan Data" untuk memulai proses pengambilan data asinkron.

## 4. Kesimpulan
Implementasi sistem ini berhasil menunjukkan bagaimana pemisahan antara pengolahan data di sisi server (PHP/Laravel) dan rendering tampilan di sisi klien (JavaScript/DOM) dapat menciptakan antarmuka yang lebih responsif. Penggunaan metode Fetch API memastikan pengguna tidak perlu mengalami pemuatan ulang halaman penuh ketika melakukan tindakan interaktif seperti pengambilan dan penyaringan data.

***
