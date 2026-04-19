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
    @vite('resources/css/app.css')

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

            <span>Aji Noto Sutrisno &middot; AJAX</span>
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