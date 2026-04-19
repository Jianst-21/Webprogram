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
