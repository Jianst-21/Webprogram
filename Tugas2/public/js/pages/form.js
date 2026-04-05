// pages/form.js — Validasi form & submit tambah mahasiswa

$(document).ready(function () {
  // Render navbar
  Navbar.render('body');

  // ── jQuery Validate ─────────────────────────────────────────────
  $('#studentForm').validate({
    rules: {
      nim:      { required: true, minlength: 5, maxlength: 10 },
      nama:     { required: true, minlength: 3 },
      email:    { required: true, email: true },
      prodi:    { required: true },
      angkatan: { required: true },
      semester: { required: true },
      ipk:      { required: true, min: 0, max: 4, number: true }
    },
    messages: {
      nim:      { required: 'NIM wajib diisi', minlength: 'Minimal 5 karakter', maxlength: 'Maksimal 10 karakter' },
      nama:     { required: 'Nama wajib diisi', minlength: 'Minimal 3 karakter' },
      email:    { required: 'Email wajib diisi', email: 'Format email tidak valid' },
      prodi:    { required: 'Program studi wajib dipilih' },
      angkatan: { required: 'Angkatan wajib dipilih' },
      semester: { required: 'Semester wajib dipilih' },
      ipk:      { required: 'IPK wajib diisi', min: 'Minimal 0.00', max: 'Maksimal 4.00', number: 'Harus berupa angka' }
    },
    errorElement: 'div',
    errorClass:   'invalid-feedback',
    highlight:    el => $(el).addClass('is-invalid').removeClass('is-valid'),
    unhighlight:  el => $(el).removeClass('is-invalid').addClass('is-valid'),
    errorPlacement(error, element) {
      element.parent().hasClass('input-group')
        ? error.insertAfter(element.parent())
        : error.insertAfter(element);
    },
    submitHandler: () => submitForm()
  });

  // ── Submit Form (CREATE) ─────────────────────────────────────────
  function submitForm() {
    const $btn = $('#btnSubmit');
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Menyimpan...').prop('disabled', true);
    $('#formAlertArea').html('');

    const payload = {
      nim:      $('#nim').val().trim(),
      nama:     $('#nama').val().trim(),
      email:    $('#email').val().trim(),
      prodi:    $('#prodi').val(),
      angkatan: $('#angkatan').val(),
      semester: $('#semester').val(),
      ipk:      $('#ipk').val(),
      status:   $('input[name="status"]:checked').val() || 'Aktif'
    };

    api.create(payload)
      .done(function (res) {
        toastr.success(res.message);
        $('#formAlertArea').html(`
          <div class="alert alert-success d-flex align-items-center gap-2 rounded-3">
            <i class="fas fa-circle-check"></i>
            <div><strong>Berhasil!</strong> Mahasiswa <strong>${res.data.nama}</strong> telah terdaftar.
            <a href="/data" class="alert-link">Lihat rekap data →</a></div>
          </div>`);
        resetForm();
        $('#previewSection').slideUp(200);
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON?.error || 'Terjadi kesalahan pada server';
        toastr.error(msg);
        $('#formAlertArea').html(`
          <div class="alert alert-danger d-flex align-items-center gap-2 rounded-3">
            <i class="fas fa-circle-xmark"></i>
            <div><strong>Gagal!</strong> ${msg}</div>
          </div>`);
      })
      .always(() => $btn.html('<i class="fas fa-floppy-disk me-2"></i>Simpan').prop('disabled', false));
  }

  // ── Tombol Pratinjau ─────────────────────────────────────────────
  $('#btnPreview').on('click', function () {
    if (!$('#studentForm').valid()) {
      toastr.warning('Lengkapi semua field yang wajib diisi terlebih dahulu');
      return;
    }
    const ipk = parseFloat($('#ipk').val()).toFixed(2);
    $('#previewContent').html(`
      <div class="col-6 col-md-3">
        <div class="preview-item-label">NIM</div>
        <div class="preview-item-val">${$('#nim').val()}</div>
      </div>
      <div class="col-6 col-md-5">
        <div class="preview-item-label">Nama</div>
        <div class="preview-item-val">${$('#nama').val()}</div>
      </div>
      <div class="col-12 col-md-4">
        <div class="preview-item-label">Email</div>
        <div class="preview-item-val" style="font-size:.8rem">${$('#email').val()}</div>
      </div>
      <div class="col-6 col-md-4">
        <div class="preview-item-label">Program Studi</div>
        <div class="preview-item-val">${$('#prodi').val()}</div>
      </div>
      <div class="col-6 col-md-2">
        <div class="preview-item-label">Angkatan</div>
        <div class="preview-item-val">${$('#angkatan').val()}</div>
      </div>
      <div class="col-6 col-md-2">
        <div class="preview-item-label">Semester</div>
        <div class="preview-item-val">Sem-${$('#semester').val()}</div>
      </div>
      <div class="col-6 col-md-2">
        <div class="preview-item-label">IPK</div>
        <div class="preview-item-val" style="color:var(--warning)">${ipk}</div>
      </div>
      <div class="col-6 col-md-2">
        <div class="preview-item-label">Status</div>
        <div class="preview-item-val">${$('input[name="status"]:checked').val() || 'Aktif'}</div>
      </div>`);
    $('#previewSection').slideDown(300);
    $('html, body').animate({ scrollTop: $('#previewSection').offset().top - 100 }, 500);
  });

  // ── Tombol Reset ─────────────────────────────────────────────────
  $('#btnReset').on('click', function () {
    resetForm();
    $('#previewSection').slideUp(200);
    $('#formAlertArea').html('');
    toastr.info('Form berhasil direset');
  });

  function resetForm() {
    $('#studentForm')[0].reset();
    $('#studentForm .is-invalid, #studentForm .is-valid').removeClass('is-invalid is-valid');
    $('#statusAktif').prop('checked', true);
  }

  // ── Input Filtering ───────────────────────────────────────────────
  $('#nim').on('input', function () {
    $(this).val($(this).val().replace(/\D/g, ''));
  });

  $('#ipk').on('input', function () {
    const v = parseFloat($(this).val());
    if (v > 4) $(this).val(4);
    if (v < 0) $(this).val(0);
  });

  $('input, select').on('focus', function () {
    $(this).closest('.input-group').find('.input-group-text').addClass('ig-focused');
  }).on('blur', function () {
    $(this).closest('.input-group').find('.input-group-text').removeClass('ig-focused');
  });
});
