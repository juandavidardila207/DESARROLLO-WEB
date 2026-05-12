require('dotenv').config();
const express        = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session        = require('express-session');
const cookieParser   = require('cookie-parser');
const multer         = require('multer');
const bcrypt         = require('bcrypt');
const nodemailer     = require('nodemailer');
const crypto         = require('crypto');
const path           = require('path');
const fs             = require('fs');

const app  = express();
const PORT     = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const SALT_ROUNDS = 10;

// ===================== JSON helpers =====================
const PRODUCTS_PATH = path.join(__dirname, 'data', 'products.json');
const USERS_PATH    = path.join(__dirname, 'data', 'users.json');

function readProducts() { return JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8')); }
function writeProducts(d) { fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(d, null, 2), 'utf-8'); }
function readUsers()    { return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8')); }
function writeUsers(d)  { fs.writeFileSync(USERS_PATH, JSON.stringify(d, null, 2), 'utf-8'); }

const { categories, footerLinks } = require('./data/products');

// ===================== NODEMAILER =====================
let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Correo real configurado en .env
    transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('📧 Usando SMTP real:', process.env.EMAIL_HOST);
  } else {
    // Modo desarrollo: Ethereal (correo falso, ver URL en consola)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    console.log('📧 Modo desarrollo: usando Ethereal (correo de prueba)');
  }
  return transporter;
}

async function sendVerificationEmail(user, token) {
  const transport = await getTransporter();
  const verifyUrl = `${BASE_URL}/usuarios/verificar/${token}`;

  const info = await transport.sendMail({
    from:    process.env.EMAIL_FROM || 'PC Componentes <noreply@pc-componentes.com>',
    to:      user.email,
    subject: 'Verificá tu cuenta en PC Componentes',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">
        <div style="background:#1a56db;padding:28px 36px">
          <div style="display:inline-block;background:#fff;border-radius:8px;padding:6px 14px;font-size:20px;font-weight:700;color:#1a56db;letter-spacing:-0.5px">PC</div>
          <span style="color:#fff;font-size:18px;font-weight:600;margin-left:10px">PC Componentes</span>
        </div>
        <div style="padding:36px">
          <h1 style="font-size:22px;color:#111827;margin:0 0 8px">¡Hola, ${user.firstName}! 👋</h1>
          <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px">
            Gracias por registrarte. Para activar tu cuenta hacé clic en el botón de abajo. 
            El enlace es válido por <strong>24 horas</strong>.
          </p>
          <a href="${verifyUrl}"
             style="display:inline-block;background:#1a56db;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px">
            Verificar mi cuenta
          </a>
          <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;line-height:1.5">
            Si no creaste esta cuenta podés ignorar este mensaje.<br>
            O copiá este enlace en tu navegador:<br>
            <a href="${verifyUrl}" style="color:#1a56db;word-break:break-all">${verifyUrl}</a>
          </p>
        </div>
        <div style="background:#f9fafb;padding:16px 36px;font-size:12px;color:#9ca3af;text-align:center">
          © ${new Date().getFullYear()} PC Componentes · Tu tienda de tecnología
        </div>
      </div>
    `
  });

  // En desarrollo mostramos la URL de previsualización de Ethereal
  if (!process.env.EMAIL_USER) {
    console.log('\n──────────────────────────────────────────────');
    console.log('📬 Correo de verificación enviado (Ethereal)');
    console.log('🔗 Previsualizá el correo en:');
    console.log('   ' + nodemailer.getTestMessageUrl(info));
    console.log('──────────────────────────────────────────────\n');
  }
  return info;
}

// ===================== MULTER =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public', 'images', 'users')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});
const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase());
  ok ? cb(null, true) : cb(new Error('Solo se permiten imágenes'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ===================== EJS =====================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// ===================== MIDDLEWARE =====================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'pc-componentes-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Usuario en res.locals para todas las vistas
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Recordar usuario via cookie
app.use((req, res, next) => {
  if (!req.session.user && req.cookies.rememberUser) {
    try {
      const remembered = JSON.parse(req.cookies.rememberUser);
      const users = readUsers();
      const user = users.find(u => u.id === remembered.id && u.email === remembered.email);
      if (user && user.verified) {
        const { password, verificationToken, verificationExpires, ...safeUser } = user;
        req.session.user = safeUser;
        res.locals.currentUser = safeUser;
      }
    } catch (e) { res.clearCookie('rememberUser'); }
  }
  next();
});

// ===================== HELPERS =====================
app.locals.formatPrice = (price) => '$ ' + Number(price).toLocaleString('es-CO');
app.locals.categories  = categories;
app.locals.footerLinks = footerLinks;

function generateSlug(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function generateId(arr) { return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1; }

// ===================== MIDDLEWARES AUTH =====================
function guestOnly(req, res, next) {
  if (req.session.user) return res.redirect('/usuarios/perfil');
  next();
}
function userOnly(req, res, next) {
  if (!req.session.user) return res.redirect('/usuarios/login');
  next();
}

// ===================== RUTAS PRINCIPALES =====================
app.get('/', (req, res) => {
  res.render('index', {
    title: 'PC Componentes - Tu tienda de tecnología',
    products: readProducts().filter(p => p.featured), categories, activeNav: 'inicio'
  });
});

app.get('/producto/:slug', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;
  res.render('producto', { title: `${product.name} - PC Componentes`, product, relatedProducts, categoryName, activeNav: product.category });
});

app.get('/categoria/:slug', (req, res) => {
  const products = readProducts();
  const category = categories.find(c => c.slug === req.params.slug);
  if (!category) return res.status(404).render('404', { title: 'Categoría no encontrada', activeNav: '' });
  const categoryProducts = req.params.slug === 'ofertas'
    ? products.filter(p => p.discount > 0)
    : products.filter(p => p.category === req.params.slug);
  res.render('categoria', { title: `${category.name} - PC Componentes`, category, products: categoryProducts, activeNav: req.params.slug });
});

app.get('/carrito', userOnly, (req, res) => {
  res.render('carrito', { title: 'Tu Carrito - PC Componentes', products: readProducts(), activeNav: '' });
});

app.get('/checkout', userOnly, (req, res) => {
  res.render('checkout', { title: 'Finalizar Compra - PC Componentes', products: readProducts(), activeNav: '' });
});

app.get('/buscar', (req, res) => {
  const products = readProducts();
  const query = (req.query.q || '').toLowerCase().trim();
  const results = query ? products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  ) : [];
  res.render('buscar', { title: query ? `Resultados para "${query}"` : 'Buscar - PC Componentes', query, results, activeNav: '' });
});

// ===================== CRUD PRODUCTOS =====================
app.get('/products', (req, res) => {
  res.render('products/index', { title: 'Administrar Productos', products: readProducts(), categories, activeNav: '' });
});
app.get('/products/create', (req, res) => {
  res.render('products/create', { title: 'Nuevo Producto', categories, activeNav: '' });
});
app.post('/products', (req, res) => {
  const { name, description, price, category, image, discount, oldPrice, featured } = req.body;
  if (!name || !description || !price || !category || !image)
    return res.render('products/create', { title: 'Nuevo Producto', categories, activeNav: '', errorMsg: 'Completá todos los campos.', formData: req.body });
  const products = readProducts();
  products.push({ id: generateId(products), name: name.trim(), slug: generateSlug(name), category, price: parseInt(price), oldPrice: oldPrice ? parseInt(oldPrice) : null, discount: discount ? parseInt(discount) : 0, image: image.trim(), description: description.trim(), featured: featured === 'true' });
  writeProducts(products);
  res.redirect('/products');
});
app.get('/products/:id/edit', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).render('404', { title: 'No encontrado', activeNav: '' });
  res.render('products/edit', { title: `Editar: ${product.name}`, product, categories, activeNav: '' });
});
app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).render('404', { title: 'No encontrado', activeNav: '' });
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;
  res.render('producto', { title: `${product.name}`, product, relatedProducts: related, categoryName, activeNav: product.category });
});
app.put('/products/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).render('404', { title: 'No encontrado', activeNav: '' });
  const { name, description, price, category, image, discount, oldPrice, featured } = req.body;
  if (!name || !description || !price || !category || !image)
    return res.render('products/edit', { title: `Editar: ${products[index].name}`, product: products[index], categories, activeNav: '', errorMsg: 'Completá todos los campos.' });
  products[index] = { ...products[index], name: name.trim(), slug: generateSlug(name), category, price: parseInt(price), oldPrice: oldPrice ? parseInt(oldPrice) : null, discount: discount ? parseInt(discount) : 0, image: image.trim(), description: description.trim(), featured: featured === 'true' };
  writeProducts(products);
  res.redirect('/products');
});
app.delete('/products/:id', (req, res) => {
  let products = readProducts();
  products = products.filter(p => p.id !== parseInt(req.params.id));
  writeProducts(products);
  res.redirect('/products');
});

// ===================== USUARIOS =====================

// ── Registro ──
app.get('/usuarios/registro', guestOnly, (req, res) => {
  res.render('users/register', { title: 'Crear cuenta - PC Componentes', activeNav: '' });
});

app.post('/usuarios/registro', guestOnly, upload.single('profileImage'), async (req, res) => {
  const renderError = (msg) => res.render('users/register', {
    title: 'Crear cuenta - PC Componentes', activeNav: '', errorMsg: msg, formData: req.body
  });
  const { firstName, lastName, email, password, confirmPassword, phone } = req.body;
  if (!firstName || !lastName || !email || !password) return renderError('Completá todos los campos obligatorios.');
  if (password !== confirmPassword) return renderError('Las contraseñas no coinciden.');
  if (password.length < 8) return renderError('La contraseña debe tener al menos 8 caracteres.');

  const users = readUsers();
  if (users.find(u => u.email === email.trim().toLowerCase()))
    return renderError('Ya existe una cuenta con ese correo.');

  const hashedPassword      = await bcrypt.hash(password, SALT_ROUNDS);
  const verificationToken   = crypto.randomBytes(32).toString('hex');
  const verificationExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 horas

  const newUser = {
    id: generateId(users),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    phone: phone || '',
    profileImage: req.file ? `/images/users/${req.file.filename}` : null,
    category: 'cliente',
    verified: false,
    verificationToken,
    verificationExpires,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  try {
    await sendVerificationEmail(newUser, verificationToken);
  } catch (err) {
    console.error('Error enviando correo:', err.message);
  }

  res.render('users/verify-pending', {
    title: 'Verificá tu correo - PC Componentes',
    activeNav: '',
    email: newUser.email,
    firstName: newUser.firstName
  });
});

// ── Verificación de correo ──
app.get('/usuarios/verificar/:token', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.verificationToken === req.params.token);

  if (index === -1) {
    return res.render('users/verify-result', {
      title: 'Enlace inválido - PC Componentes',
      activeNav: '',
      success: false,
      reason: 'El enlace de verificación no existe o ya fue usado.'
    });
  }

  if (users[index].verified) {
    return res.render('users/verify-result', {
      title: 'Ya verificado - PC Componentes',
      activeNav: '',
      success: true,
      alreadyVerified: true,
      firstName: users[index].firstName
    });
  }

  if (Date.now() > users[index].verificationExpires) {
    return res.render('users/verify-result', {
      title: 'Enlace vencido - PC Componentes',
      activeNav: '',
      success: false,
      reason: 'El enlace expiró (válido 24 horas). Registrate nuevamente o pedí un nuevo correo.',
      expiredEmail: users[index].email
    });
  }

  // ✅ Verificación exitosa
  users[index].verified           = true;
  users[index].verificationToken  = null;
  users[index].verificationExpires = null;
  writeUsers(users);

  res.render('users/verify-result', {
    title: '¡Cuenta verificada! - PC Componentes',
    activeNav: '',
    success: true,
    alreadyVerified: false,
    firstName: users[index].firstName
  });
});

// ── Reenviar correo de verificación ──
app.post('/usuarios/reenviar-verificacion', async (req, res) => {
  const { email } = req.body;
  const users = readUsers();
  const index = users.findIndex(u => u.email === email?.trim().toLowerCase());

  if (index === -1 || users[index].verified) {
    return res.redirect('/usuarios/login');
  }

  // Nuevo token y nueva expiración
  users[index].verificationToken   = crypto.randomBytes(32).toString('hex');
  users[index].verificationExpires = Date.now() + 1000 * 60 * 60 * 24;
  writeUsers(users);

  try {
    await sendVerificationEmail(users[index], users[index].verificationToken);
  } catch (err) {
    console.error('Error reenviando correo:', err.message);
  }

  res.render('users/verify-pending', {
    title: 'Verificá tu correo - PC Componentes',
    activeNav: '',
    email: users[index].email,
    firstName: users[index].firstName,
    resent: true
  });
});

// ── Login ──
app.get('/usuarios/login', guestOnly, (req, res) => {
  res.render('users/login', { title: 'Iniciar sesión - PC Componentes', activeNav: '' });
});

app.post('/usuarios/login', guestOnly, async (req, res) => {
  const renderError = (msg, extra = {}) => res.render('users/login', {
    title: 'Iniciar sesión - PC Componentes', activeNav: '', errorMsg: msg, ...extra
  });
  const { email, password, remember } = req.body;
  if (!email || !password) return renderError('Completá todos los campos.');

  const users = readUsers();
  const user  = users.find(u => u.email === email.trim().toLowerCase());
  if (!user) return renderError('El correo ingresado no está registrado.');

  // Compatibilidad con passwords de prueba sin hash
  let match = false;
  if (user.password && user.password.startsWith('$2')) {
    match = await bcrypt.compare(password, user.password);
  } else {
    match = password === user.password;
  }
  if (!match) return renderError('Contraseña incorrecta. Intentá nuevamente.');

  // Verificar si el correo fue confirmado
  if (!user.verified) {
    return renderError(
      'Todavía no verificaste tu correo electrónico.',
      { unverifiedEmail: user.email }
    );
  }

  const { password: _, verificationToken, verificationExpires, ...safeUser } = user;
  req.session.user = safeUser;

  // Recordar usuario: cookie 30 días
  if (remember === 'on') {
    res.cookie('rememberUser', JSON.stringify({ id: user.id, email: user.email }), {
      maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true
    });
  }
  res.redirect('/usuarios/perfil');
});

// ── Perfil ──
app.get('/usuarios/perfil', userOnly, (req, res) => {
  res.render('users/profile', {
    title: `Perfil de ${req.session.user.firstName} - PC Componentes`,
    activeNav: '',
    user: req.session.user
  });
});

// ── Logout ──
app.post('/usuarios/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('rememberUser');
  res.redirect('/');
});

// ===================== API =====================
app.get('/api/products', (req, res) => res.json(readProducts()));
app.get('/api/products/:id', (req, res) => {
  const p = readProducts().find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'No encontrado' });
  res.json(p);
});

// ===================== 404 =====================
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada', activeNav: '' });
});

app.listen(PORT, () => {
  console.log(`🚀 PC Componentes corriendo en http://localhost:${PORT}`);
});
