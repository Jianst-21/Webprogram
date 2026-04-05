// main.js — Konfigurasi global SIAKAD

// Toastr options
if (typeof toastr !== 'undefined') {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: 3500,
    extendedTimeOut: 1500,
    showMethod: 'slideDown',
    hideMethod: 'slideUp'
  };
}

// Auto-set active navbar link based on current path
$(document).ready(function () {
  const path = window.location.pathname;
  $('.navbar-nav .nav-link').each(function () {
    const href = $(this).attr('href');
    if (href === path) {
      $(this).addClass('active');
    } else if (href !== '/') {
      $(this).removeClass('active');
    } else if (path === '/') {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
});
