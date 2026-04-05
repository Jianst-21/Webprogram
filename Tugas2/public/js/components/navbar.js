// components/navbar.js — Komponen navbar yang dapat digunakan ulang

const Navbar = {
  // Render HTML navbar ke dalam selector yang diberikan
  render(selector = 'body') {
    const html = `
      <nav class="navbar navbar-expand-lg navbar-dark sticky-top" id="mainNav">
        <div class="container-fluid px-4">
          <a class="navbar-brand d-flex align-items-center gap-2" href="/">
            <div class="brand-icon"><i class="fas fa-university"></i></div>
            <span class="brand-text">SIAKAD</span>
          </a>
          <button class="navbar-toggler border-0" type="button"
                  data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav ms-auto gap-1">
              <li class="nav-item">
                <a class="nav-link" href="/"><i class="fas fa-house me-1"></i>Beranda</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/data"><i class="fas fa-table me-1"></i>Rekap Data</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/form"><i class="fas fa-user-plus me-1"></i>Daftarkan</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>`;

    $(selector).prepend(html);
    this.setActiveLink();
  },

  // Tandai link yang aktif berdasarkan URL saat ini
  setActiveLink() {
    const currentPath = window.location.pathname;
    $('.navbar-nav .nav-link').each(function () {
      const href = $(this).attr('href');
      const isActive = href === currentPath ||
                       (href === '/' && currentPath === '/');
      $(this).toggleClass('active', isActive);
    });
  }
};
