const express    = require('express');
const bodyParser = require('body-parser');
const path       = require('path');

const mahasiswaRoutes = require('./src/routes/mahasiswaRoutes');

const app  = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── View Engine ───────────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('express-handlebars').engine({
  extname: '.html',
  defaultLayout: false
}));
app.set('view engine', 'html');

// ── Page Routes ───────────────────────────────────────────────────
app.get('/',      (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')));
app.get('/form',  (req, res) => res.sendFile(path.join(__dirname, 'views/form.html')));
app.get('/data',  (req, res) => res.sendFile(path.join(__dirname, 'views/table.html')));

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/mahasiswa', mahasiswaRoutes);

// ── Start Server ──────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
