/* ============================================
   RAMADAN MUBARAK 1446 H — jquery.app.js
   jQuery: Countdown Timer + Modal + THR Logic
   ============================================ */

$(function () {

  /* ── COUNTDOWN TIMER ── */
  (function () {
    // Target: Idul Fitri 1447 H — approx 30 Maret 2026
    var target = new Date('2027-03-21T00:00:00').getTime();

    function updateCountdown() {
      var now  = Date.now();
      var diff = target - now;

      if (diff <= 0) {
        $('#cd-h, #cd-j, #cd-m, #cd-s').text('00');
        return;
      }

      var h = Math.floor(diff / 864e5);
      var j = Math.floor((diff % 864e5) / 36e5);
      var m = Math.floor((diff % 36e5)  / 6e4);
      var s = Math.floor((diff % 6e4)   / 1e3);

      $('#cd-h').text(String(h).padStart(2, '0'));
      $('#cd-j').text(String(j).padStart(2, '0'));
      $('#cd-m').text(String(m).padStart(2, '0'));
      $('#cd-s').text(String(s).padStart(2, '0'));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  })();


  /* ── THR NOMINAL LIST ── */
  var thrList = [
    'Rp 500.000',
    'Rp 1.000.000',
    'Rp 2.500.000',
    'Rp 5.000.000',
    'Rp 10.000.000',
    'Rp 50.000 (lumayan)'
  ];


  /* ── BUKA MODAL THR ── */
  $('#btnTHR').on('click', function () {
    // Pilih nominal THR secara acak
    var amount = thrList[Math.floor(Math.random() * thrList.length)];

    // Reset angka
    $('#thrAmount').text('Rp 0');

    // Tampilkan overlay dengan jQuery fadeIn
    $('#modalOverlay').addClass('active').hide().fadeIn(250);

    // Re-trigger animasi modal pop
    $('#modalBox').css('animation', 'none');
    setTimeout(function () {
      $('#modalBox').css('animation', 'modalPop .45s cubic-bezier(.175,.885,.32,1.275) both');
    }, 10);

    // Launch confetti (fungsi dari main.js)
    launchConfetti();

    // Count-up animasi angka THR
    var end  = parseInt(amount.replace(/\D/g, '')) || 500000;
    var step = end / (800 / 16);
    var cur  = 0;

    var ticker = setInterval(function () {
      cur = Math.min(cur + step, end);

      var display;
      if (amount.indexOf('lumayan') !== -1 && cur >= end) {
        display = 'Rp 50.000 (lumayan kidss)';
      } else {
        display = 'Rp ' + Math.floor(cur).toLocaleString('id-ID');
      }

      $('#thrAmount').text(display);

      if (cur >= end) clearInterval(ticker);
    }, 16);
  });


  /* ── TUTUP MODAL ── */
  function closeModal() {
    $('#modalOverlay').fadeOut(300, function () {
      $(this).removeClass('active');
    });
  }

  // Tombol X dan tombol Syukuri & Tutup
  $('#modalClose, #btnClaim').on('click', closeModal);

  // Klik di luar modal box
  $('#modalOverlay').on('click', function (e) {
    if ($(e.target).is('#modalOverlay')) closeModal();
  });

  // Tekan tombol ESC
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

});