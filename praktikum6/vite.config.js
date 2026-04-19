import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/mahasiswa.css',
                'resources/js/app.js',
                'resources/js/mahasiswa.js', // ← tambahan untuk halaman mahasiswa
            ],
            refresh: true,
        }),
    ],
});