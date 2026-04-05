// pages/table.js — DataTable CRUD (Read, Update, Delete)

let mahasiswaTable;
let deleteTargetId = null;

$(document).ready(function () {
  // Render navbar
  Navbar.render('body');

  // ── Inisialisasi DataTable ────────────────────────────────────────
  mahasiswaTable = $('#mahasiswaTable').DataTable({
    ajax:    { url: '/api/mahasiswa', type: 'GET', dataSrc: 'data' },
    columns: [
      {
        data: null,
        orderable: false,
        render: (data, type, row, meta) => `<span class="nim-mono">${meta.row + 1}</span>`
      },
      { data: 'nim',      render: d => `<span class="nim-mono">${d}</span>` },
      { data: 'nama',     render: d => `<strong>${d}</strong>` },
      { data: 'prodi' },
      { data: 'angkatan', render: d => `<span class="nim-mono">${d}</span>` },
      { data: 'semester', render: d => `<span class="nim-mono">Sem-${d}</span>` },
      {
        data: 'ipk',
        render(d) {
          const v   = parseFloat(d);
          const cls = v >= 3.5 ? 'ipk-high' : v >= 3.0 ? 'ipk-mid' : 'ipk-low';
          return `<span class="ipk-display ${cls}">${v.toFixed(2)}</span>`;
        }
      },
      {
        data: 'status',
        render(d) {
          const map = { Aktif:'badge-aktif', Cuti:'badge-cuti', Lulus:'badge-lulus', Keluar:'badge-keluar' };
          return `<span class="status-badge ${map[d] || 'badge-aktif'}">${d}</span>`;
        }
      },
      {
        data: null,
        orderable: false,
        render: (data, type, row) => `
          <div class="d-flex gap-1">
            <button class="btn-action btn-edit"   data-id="${row.id}" title="Edit data">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btn-action btn-delete" data-id="${row.id}" data-nama="${row.nama}" title="Hapus data">
              <i class="fas fa-trash-can"></i>
            </button>
          </div>`
      }
    ],
    language: {
      search:      'Cari:',
      lengthMenu:  'Tampilkan _MENU_ data',
      info:        'Menampilkan _START_–_END_ dari _TOTAL_ mahasiswa',
      infoEmpty:   'Tidak ada data',
      infoFiltered:'(difilter dari _MAX_ total)',
      paginate:    { first: '«', last: '»', next: '›', previous: '‹' },
      emptyTable:  '<div class="py-4 text-center text-muted"><i class="fas fa-inbox fa-2x mb-2 d-block"></i>Belum ada data mahasiswa</div>',
      zeroRecords: '<div class="py-3 text-center text-muted"><i class="fas fa-search me-2"></i>Tidak ada data yang cocok</div>'
    },
    pageLength: 10,
    responsive: true,
    order:      [[1, 'asc']],
    dom:        '<"row mb-3"<"col-sm-6"l><"col-sm-6"f>>rtip'
  });

  // ── Tombol Refresh ────────────────────────────────────────────────
  $('#btnRefresh').on('click', function () {
    const $btn = $(this);
    $btn.html('<i class="fas fa-arrows-rotate fa-spin me-1"></i>Memuat...').prop('disabled', true);
    mahasiswaTable.ajax.reload(function () {
      $btn.html('<i class="fas fa-arrows-rotate me-1"></i>Muat Ulang').prop('disabled', false);
      toastr.info('Data berhasil dimuat ulang');
    }, false);
  });

  // ── Tombol Edit ───────────────────────────────────────────────────
  $('#mahasiswaTable').on('click', '.btn-edit', function () {
    loadForEdit($(this).data('id'));
  });

  // ── Tombol Hapus ──────────────────────────────────────────────────
  $('#mahasiswaTable').on('click', '.btn-delete', function () {
    deleteTargetId = $(this).data('id');
    $('#deleteStudentName').text($(this).data('nama'));
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  });

  // ── Konfirmasi Hapus ──────────────────────────────────────────────
  $('#btnConfirmDelete').on('click', function () {
    if (!deleteTargetId) return;
    const $btn = $(this);
    $btn.html('<i class="fas fa-spinner fa-spin me-1"></i>Menghapus...').prop('disabled', true);

    api.remove(deleteTargetId)
      .done(function (res) {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        mahasiswaTable.ajax.reload(null, false);
        toastr.success(res.message || 'Data berhasil dihapus');
        deleteTargetId = null;
      })
      .fail(xhr => toastr.error(xhr.responseJSON?.error || 'Gagal menghapus data'))
      .always(() => $btn.html('<i class="fas fa-trash-can me-1"></i>Hapus').prop('disabled', false));
  });

  // ── Simpan Edit ───────────────────────────────────────────────────
  $('#btnSaveEdit').on('click', function () {
    const id = $('#editId').val();
    if (!id) return;

    let valid = true;
    ['editNim','editNama','editProdi','editAngkatan','editSemester','editIpk','editEmail']
      .forEach(f => {
        if (!$('#' + f).val().trim()) {
          $('#' + f).addClass('is-invalid'); valid = false;
        } else {
          $('#' + f).removeClass('is-invalid');
        }
      });

    if (!valid) { showEditAlert('Harap isi semua field yang wajib diisi.', 'danger'); return; }

    const ipkVal = parseFloat($('#editIpk').val());
    if (ipkVal < 0 || ipkVal > 4) { showEditAlert('IPK harus antara 0.00 dan 4.00', 'danger'); return; }

    const $btn = $(this);
    $btn.html('<i class="fas fa-spinner fa-spin me-1"></i>Menyimpan...').prop('disabled', true);

    api.update(id, {
      nim:      $('#editNim').val().trim(),
      nama:     $('#editNama').val().trim(),
      prodi:    $('#editProdi').val(),
      angkatan: $('#editAngkatan').val(),
      semester: $('#editSemester').val(),
      ipk:      $('#editIpk').val(),
      email:    $('#editEmail').val().trim(),
      status:   $('#editStatus').val()
    })
      .done(function (res) {
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        mahasiswaTable.ajax.reload(null, false);
        toastr.success(res.message || 'Data berhasil diperbarui');
      })
      .fail(xhr => showEditAlert(xhr.responseJSON?.error || 'Gagal memperbarui data', 'danger'))
      .always(() => $btn.html('<i class="fas fa-floppy-disk me-2"></i>Simpan Perubahan').prop('disabled', false));
  });

  $('#editModal input, #editModal select').on('change input', function () {
    $(this).removeClass('is-invalid');
  });
});

// ── Load data ke modal edit ────────────────────────────────────────
function loadForEdit(id) {
  api.getById(id)
    .done(function (d) {
      $('#editId').val(d.id);
      $('#editNim').val(d.nim);
      $('#editNama').val(d.nama);
      $('#editProdi').val(d.prodi);
      $('#editAngkatan').val(d.angkatan);
      $('#editSemester').val(d.semester);
      $('#editIpk').val(d.ipk);
      $('#editEmail').val(d.email);
      $('#editStatus').val(d.status);
      $('#editAlertArea').html('');
      new bootstrap.Modal(document.getElementById('editModal')).show();
    })
    .fail(() => toastr.error('Gagal memuat data mahasiswa'));
}

function showEditAlert(msg, type) {
  $('#editAlertArea').html(
    `<div class="alert alert-${type} py-2 small rounded-3 mb-3">
       <i class="fas fa-circle-xmark me-2"></i>${msg}
     </div>`
  );
}
