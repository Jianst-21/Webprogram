<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MahasiswaController;


// Halaman utama - menampilkan view blade
Route::get('/', [MahasiswaController::class, 'index'])->name('mahasiswa.index');

// API endpoint - mengembalikan data JSON untuk AJAX
Route::get('/api/mahasiswa', [MahasiswaController::class, 'getData'])->name('mahasiswa.data');
