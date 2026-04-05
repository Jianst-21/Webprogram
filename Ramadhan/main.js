
//    Vanilla JavaScript: Stars Canvas + Confetti

/* ── STARS CANVAS ── */
(function () {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [], W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function init() {
    stars = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x  : Math.random() * W,
        y  : Math.random() * H,
        r  : Math.random() * 1.4 + 0.3,
        a  : Math.random(),
        da : (0.003 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1)
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(function (s) {
      s.a += s.da;
      if (s.a > 1 || s.a < 0) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,248,220,' + s.a + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ── CONFETTI ENGINE ── */
var confettis  = [];
var confActive = false;
var confRAF;
var cc         = document.getElementById('confetti-canvas');
var ctx2       = cc.getContext('2d');

cc.width  = window.innerWidth;
cc.height = window.innerHeight;

window.addEventListener('resize', function () {
  cc.width  = window.innerWidth;
  cc.height = window.innerHeight;
});

function launchConfetti() {
  confActive = true;
  confettis  = [];

  var colors = ['#f0c040','#ff6b35','#e63946','#2ec4b6','#c77dff','#ffe48a','#a8edea','#ffb347'];

  for (var i = 0; i < 180; i++) {
    confettis.push({
      x     : Math.random() * cc.width,
      y     : -20 - Math.random() * 200,
      w     : 8  + Math.random() * 8,
      h     : 14 + Math.random() * 8,
      rot   : Math.random() * 360,
      drot  : 4  + Math.random() * 6,
      vx    : (Math.random() - 0.5) * 5,
      vy    : 3  + Math.random() * 5,
      color : colors[Math.floor(Math.random() * colors.length)],
      alpha : 1,
      shape : Math.random() < 0.5 ? 'rect' : 'circle'
    });
  }

  animConf();
  setTimeout(function () { confActive = false; }, 4500);
}

function animConf() {
  ctx2.clearRect(0, 0, cc.width, cc.height);

  confettis.forEach(function (p) {
    p.x   += p.vx;
    p.y   += p.vy;
    p.rot += p.drot;
    p.vy  += 0.12; // gravity

    if (p.y > cc.height) p.alpha -= 0.06;

    ctx2.save();
    ctx2.globalAlpha = Math.max(0, p.alpha);
    ctx2.translate(p.x, p.y);
    ctx2.rotate(p.rot * Math.PI / 180);
    ctx2.fillStyle = p.color;

    if (p.shape === 'rect') {
      ctx2.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      ctx2.beginPath();
      ctx2.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx2.fill();
    }

    ctx2.restore();
  });

  confettis = confettis.filter(function (p) { return p.alpha > 0; });

  if (confettis.length > 0) {
    confRAF = requestAnimationFrame(animConf);
  } else {
    ctx2.clearRect(0, 0, cc.width, cc.height);
  }
}