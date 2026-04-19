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