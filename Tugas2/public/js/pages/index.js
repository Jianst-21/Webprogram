// pages/index.js — Script halaman Beranda

$(document).ready(function () {
  // Render navbar (dari component)
  Navbar.render('body');

  // Konfigurasi toastr
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: 3500
  };

  // ── Muat Statistik ────────────────────────────────────────────────
  api.getStats().done(function (data) {
    $('#statTotal').text(data.total);
    $('#statAktif').text(data.aktif);
    $('#statIpk').text(data.avgIpk);
    $('#statProdi').text(Object.keys(data.prodiCount).length);

    // Grafik distribusi prodi
    const colors = ['#1565c0', '#7209b7', '#e65100', '#2e7d32', '#006064'];
    const total  = data.total || 1;
    let html = '';

    Object.entries(data.prodiCount).forEach(function ([prodi, count], i) {
      const pct = Math.round((count / total) * 100);
      html += `
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="fw-500 small">${prodi}</span>
            <span class="badge-count">${count} mhs</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${pct}%;background:${colors[i % colors.length]}"></div>
          </div>
        </div>`;
    });

    $('#prodiDistChart').html(
      html || '<p class="text-muted text-center py-3">Belum ada data</p>'
    );
  });

  // ── Muat Pendaftaran Terbaru ──────────────────────────────────────
  api.getAll().done(function (res) {
    const recent = res.data.slice(-4).reverse();

    if (recent.length === 0) {
      $('#recentStudents').html(
        '<p class="text-muted text-center py-3">Belum ada mahasiswa terdaftar</p>'
      );
      return;
    }

    const getStatusClass = s =>
      ({ Aktif: 'badge-aktif', Cuti: 'badge-cuti', Lulus: 'badge-lulus', Keluar: 'badge-keluar' })[s] || 'badge-aktif';

    let html = '<div class="student-list">';
    recent.forEach(function (s) {
      const initials = s.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      html += `
        <div class="student-list-item">
          <div class="student-avatar">${initials}</div>
          <div class="student-info">
            <div class="student-name">${s.nama}</div>
            <div class="student-meta">${s.nim} · ${s.prodi} · Angkatan ${s.angkatan}</div>
          </div>
          <div class="text-end">
            <span class="ipk-badge">IPK ${s.ipk.toFixed(2)}</span>
            <div class="mt-1"><span class="status-badge ${getStatusClass(s.status)}">${s.status}</span></div>
          </div>
        </div>`;
    });
    html += '</div>';
    $('#recentStudents').html(html);
  });
});
