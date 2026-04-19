@extends('layouts.app')

@section('title', 'Data Mahasiswa – Praktikum Laravel AJAX')

@section('styles')
@vite('resources/css/mahasiswa.css')
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