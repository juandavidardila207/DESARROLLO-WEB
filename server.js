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

const { sequelize, Category, Brand, Product, UserCategory, User } = require('./database/models');
const { Op } = require('sequelize');
const { categories: navCategories, footerLinks } = require('./data/products');

const app      = express();
const PORT     = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const SALT_ROUNDS = 10;

// ── Multer ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public', 'images', 'users')),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});
const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase());
  ok ? cb(null, true) : cb(new Error('Solo se permiten imágenes'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Nodemailer ────────────────────────────────────────────────
let transporter;
async function getTransporter() {
  if (transporter) return transporter;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', port: 587, secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    console.log('📧 Modo desarrollo: usando Ethereal (correo de prueba)');
  }
  return transporter;
}

async function sendVerificationEmail(user, token) {
  const transport  = await getTransporter();
  const verifyUrl  = `${BASE_URL}/usuarios/verificar/${token}`;
  const info = await transport.sendMail({
    from:    process.env.EMAIL_FROM || 'PC Componentes <noreply@pc-componentes.com>',
    to:      user.email,
    subject: 'Verificá tu cuenta en PC Componentes',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)">
        <div style="background:#1a56db;padding:28px 36px">
          <div style="display:inline-block;background:#fff;border-radius:8px;padding:6px 14px;font-size:20px;font-weight:700;color:#1a56db">PC</div>
          <span style="color:#fff;font-size:18px;font-weight:600;margin-left:10px">PC Componentes</span>
        </div>
        <div style="padding:36px">
          <h1 style="font-size:22px;color:#111827;margin:0 0 8px">¡Hola, ${user.firstName}! 👋</h1>
          <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px">
            Gracias por registrarte. Para activar tu cuenta hacé clic en el botón de abajo.
            El enlace es válido por <strong>24 horas</strong>.
          </p>
          <a href="${verifyUrl}" style="display:inline-block;background:#1a56db;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px">
            Verificar mi cuenta
          </a>
          <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;line-height:1.5">
            Si no creaste esta cuenta podés ignorar este mensaje.<br>
            <a href="${verifyUrl}" style="color:#1a56db;word-break:break-all">${verifyUrl}</a>
          </p>
        </div>
        <div style="background:#f9fafb;padding:16px 36px;font-size:12px;color:#9ca3af;text-align:center">
          © ${new Date().getFullYear()} PC Componentes
        </div>
      </div>`
  });
  if (!process.env.EMAIL_USER) {
    console.log('\n── Correo de verificación (Ethereal) ──');
    console.log('🔗 ' + nodemailer.getTestMessageUrl(info));
    console.log('────────────────────────────────────────\n');
  }
}

// ── EJS ───────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// ── Middleware ────────────────────────────────────────────────
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

// Usuario en res.locals
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Recordar usuario (cookie)
app.use(async (req, res, next) => {
  if (!req.session.user && req.cookies.rememberUser) {
    try {
      const remembered = JSON.parse(req.cookies.rememberUser);
      const user = await User.findOne({ where: { id: remembered.id, email: remembered.email, verified: true } });
      if (user) {
        const { password, verificationToken, verificationExpires, ...safeUser } = user.toJSON();
        req.session.user = safeUser;
        res.locals.currentUser = safeUser;
      }
    } catch (e) { res.clearCookie('rememberUser'); }
  }
  next();
});

// ── Helpers globales ──────────────────────────────────────────
app.locals.formatPrice = (price) => '$ ' + Number(price).toLocaleString('es-CO');
app.locals.categories  = navCategories;
app.locals.footerLinks = footerLinks;

function generateSlug(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Middlewares de autenticación ──────────────────────────────
function guestOnly(req, res, next) {
  if (req.session.user) return res.redirect('/usuarios/perfil');
  next();
}
function userOnly(req, res, next) {
  if (!req.session.user) return res.redirect('/usuarios/login');
  next();
}

// ═══════════════════════════════════════════════════════════════
//  RUTAS PRINCIPALES
// ═══════════════════════════════════════════════════════════════

app.get('/', async (req, res) => {
  const products = await Product.findAll({
    where: { featured: true },
    include: [{ model: Category, as: 'category' }, { model: Brand, as: 'brand' }]
  });
  res.render('index', { title: 'PC Componentes - Tu tienda de tecnología', products, activeNav: 'inicio' });
});

app.get('/producto/:slug', async (req, res) => {
  const product = await Product.findOne({
    where: { slug: req.params.slug },
    include: [{ model: Category, as: 'category' }, { model: Brand, as: 'brand' }]
  });
  if (!product) return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  const relatedProducts = await Product.findAll({
    where: { categoryId: product.categoryId, id: { [Op.ne]: product.id } },
    include: [{ model: Category, as: 'category' }],
    limit: 4
  });
  res.render('producto', { title: `${product.name} - PC Componentes`, product, relatedProducts, categoryName: product.category?.name || '', activeNav: product.category?.slug || '' });
});

app.get('/categoria/:slug', async (req, res) => {
  const cat = await Category.findOne({ where: { slug: req.params.slug } });
  const navCat = navCategories.find(c => c.slug === req.params.slug);
  if (!cat && !navCat) return res.status(404).render('404', { title: 'Categoría no encontrada', activeNav: '' });

  let products;
  if (req.params.slug === 'ofertas') {
    products = await Product.findAll({ where: { discount: { [Op.gt]: 0 } }, include: [{ model: Category, as: 'category' }] });
  } else if (cat) {
    products = await Product.findAll({ where: { categoryId: cat.id }, include: [{ model: Category, as: 'category' }] });
  } else {
    products = [];
  }
  const category = cat || navCat;
  res.render('categoria', { title: `${category.name} - PC Componentes`, category, products, activeNav: req.params.slug });
});

app.get('/buscar', async (req, res) => {
  const query = (req.query.q || '').trim();
  const results = query ? await Product.findAll({
    where: {
      [Op.or]: [
        { name:        { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } }
      ]
    },
    include: [{ model: Category, as: 'category' }]
  }) : [];
  res.render('buscar', { title: query ? `Resultados para "${query}"` : 'Buscar', query, results, activeNav: '' });
});

app.get('/carrito',  userOnly, (req, res) => res.render('carrito',  { title: 'Tu Carrito - PC Componentes', activeNav: '' }));
app.get('/checkout', userOnly, (req, res) => res.render('checkout', { title: 'Finalizar Compra - PC Componentes', activeNav: '' }));

// ═══════════════════════════════════════════════════════════════
//  CRUD PRODUCTOS
// ═══════════════════════════════════════════════════════════════

app.get('/products', async (req, res) => {
  const products = await Product.findAll({ include: [{ model: Category, as: 'category' }, { model: Brand, as: 'brand' }], order: [['id', 'ASC']] });
  const dbCategories = await Category.findAll();
  const brands       = await Brand.findAll();
  res.render('products/index', { title: 'Administrar Productos', products, categories: dbCategories, brands, activeNav: '' });
});

app.get('/products/create', async (req, res) => {
  const dbCategories = await Category.findAll();
  const brands       = await Brand.findAll();
  res.render('products/create', { title: 'Nuevo Producto', categories: dbCategories, brands, activeNav: '' });
});

app.post('/products', async (req, res) => {
  const { name, description, price, categoryId, brandId, image, discount, oldPrice, featured, stock } = req.body;
  const dbCategories = await Category.findAll();
  const brands       = await Brand.findAll();
  if (!name || !price) return res.render('products/create', { title: 'Nuevo Producto', categories: dbCategories, brands, activeNav: '', errorMsg: 'Nombre y precio son obligatorios.', formData: req.body });
  await Product.create({ name: name.trim(), slug: generateSlug(name), description, price: parseInt(price), oldPrice: oldPrice || null, discount: discount || 0, image, stock: stock || 0, featured: featured === 'true', categoryId: categoryId || null, brandId: brandId || null });
  res.redirect('/products');
});

app.get('/products/:id/edit', async (req, res) => {
  const product      = await Product.findByPk(req.params.id);
  const dbCategories = await Category.findAll();
  const brands       = await Brand.findAll();
  if (!product) return res.status(404).render('404', { title: 'No encontrado', activeNav: '' });
  res.render('products/edit', { title: `Editar: ${product.name}`, product, categories: dbCategories, brands, activeNav: '' });
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: [{ model: Category, as: 'category' }, { model: Brand, as: 'brand' }] });
  if (!product) return res.status(404).render('404', { title: 'No encontrado', activeNav: '' });
  const related = await Product.findAll({ where: { categoryId: product.categoryId, id: { [Op.ne]: product.id } }, limit: 4 });
  res.render('producto', { title: product.name, product, relatedProducts: related, categoryName: product.category?.name || '', activeNav: product.category?.slug || '' });
});

app.put('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).render('404', { title: 'No encontrado', activeNav: '' });
  const { name, description, price, categoryId, brandId, image, discount, oldPrice, featured, stock } = req.body;
  if (!name || !price) {
    const dbCategories = await Category.findAll();
    const brands       = await Brand.findAll();
    return res.render('products/edit', { title: `Editar: ${product.name}`, product, categories: dbCategories, brands, activeNav: '', errorMsg: 'Nombre y precio son obligatorios.' });
  }
  await product.update({ name: name.trim(), slug: generateSlug(name), description, price: parseInt(price), oldPrice: oldPrice || null, discount: discount || 0, image, stock: stock || 0, featured: featured === 'true', categoryId: categoryId || null, brandId: brandId || null });
  res.redirect('/products');
});

app.delete('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (product) await product.destroy();
  res.redirect('/products');
});

// ═══════════════════════════════════════════════════════════════
//  USUARIOS
// ═══════════════════════════════════════════════════════════════

// Registro
app.get('/usuarios/registro', guestOnly, (req, res) =>
  res.render('users/register', { title: 'Crear cuenta - PC Componentes', activeNav: '' })
);

app.post('/usuarios/registro', guestOnly, upload.single('profileImage'), async (req, res) => {
  const renderError = (msg) => res.render('users/register', { title: 'Crear cuenta', activeNav: '', errorMsg: msg, formData: req.body });
  const { firstName, lastName, email, password, confirmPassword, phone } = req.body;
  if (!firstName || !lastName || !email || !password) return renderError('Completá todos los campos obligatorios.');
  if (password !== confirmPassword) return renderError('Las contraseñas no coinciden.');
  if (password.length < 8) return renderError('La contraseña debe tener al menos 8 caracteres.');

  const exists = await User.findOne({ where: { email: email.trim().toLowerCase() } });
  if (exists) return renderError('Ya existe una cuenta con ese correo.');

  const hashedPassword      = await bcrypt.hash(password, SALT_ROUNDS);
  const verificationToken   = crypto.randomBytes(32).toString('hex');
  const verificationExpires = Date.now() + 1000 * 60 * 60 * 24;

  const roleCliente = await UserCategory.findOne({ where: { name: 'cliente' } });

  const newUser = await User.create({
    firstName: firstName.trim(),
    lastName:  lastName.trim(),
    email:     email.trim().toLowerCase(),
    password:  hashedPassword,
    phone:     phone || null,
    profileImage: req.file ? `/images/users/${req.file.filename}` : null,
    verified: false,
    verificationToken,
    verificationExpires,
    userCategoryId: roleCliente?.id || null
  });

  try { await sendVerificationEmail(newUser, verificationToken); } catch (e) { console.error('Error enviando correo:', e.message); }

  res.render('users/verify-pending', { title: 'Verificá tu correo', activeNav: '', email: newUser.email, firstName: newUser.firstName });
});

// Verificación
app.get('/usuarios/verificar/:token', async (req, res) => {
  const user = await User.findOne({ where: { verificationToken: req.params.token } });
  if (!user) return res.render('users/verify-result', { title: 'Enlace inválido', activeNav: '', success: false, reason: 'El enlace no existe o ya fue usado.' });
  if (user.verified) return res.render('users/verify-result', { title: 'Ya verificado', activeNav: '', success: true, alreadyVerified: true, firstName: user.firstName });
  if (Date.now() > user.verificationExpires) return res.render('users/verify-result', { title: 'Enlace vencido', activeNav: '', success: false, reason: 'El enlace expiró (válido 24 horas). Reenvía un nuevo correo.', expiredEmail: user.email });
  await user.update({ verified: true, verificationToken: null, verificationExpires: null });
  res.render('users/verify-result', { title: '¡Cuenta verificada!', activeNav: '', success: true, alreadyVerified: false, firstName: user.firstName });
});

app.post('/usuarios/reenviar-verificacion', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email?.trim().toLowerCase() } });
  if (!user || user.verified) return res.redirect('/usuarios/login');
  await user.update({ verificationToken: crypto.randomBytes(32).toString('hex'), verificationExpires: Date.now() + 1000 * 60 * 60 * 24 });
  try { await sendVerificationEmail(user, user.verificationToken); } catch (e) { console.error(e.message); }
  res.render('users/verify-pending', { title: 'Verificá tu correo', activeNav: '', email: user.email, firstName: user.firstName, resent: true });
});

// Login
app.get('/usuarios/login', guestOnly, (req, res) =>
  res.render('users/login', { title: 'Iniciar sesión - PC Componentes', activeNav: '' })
);

app.post('/usuarios/login', guestOnly, async (req, res) => {
  const renderError = (msg, extra = {}) => res.render('users/login', { title: 'Iniciar sesión', activeNav: '', errorMsg: msg, ...extra });
  const { email, password, remember } = req.body;
  if (!email || !password) return renderError('Completá todos los campos.');

  const user = await User.findOne({ where: { email: email.trim().toLowerCase() }, include: [{ model: UserCategory, as: 'role' }] });
  if (!user) return renderError('El correo ingresado no está registrado.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return renderError('Contraseña incorrecta. Intentá nuevamente.');
  if (!user.verified) return renderError('Todavía no verificaste tu correo electrónico.', { unverifiedEmail: user.email });

  const { password: _, verificationToken, verificationExpires, ...safeUser } = user.toJSON();
  req.session.user = safeUser;

  if (remember === 'on') {
    res.cookie('rememberUser', JSON.stringify({ id: user.id, email: user.email }), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
  }
  res.redirect('/usuarios/perfil');
});

// Perfil
app.get('/usuarios/perfil', userOnly, (req, res) =>
  res.render('users/profile', { title: `Perfil de ${req.session.user.firstName}`, activeNav: '', user: req.session.user })
);

// Logout
app.post('/usuarios/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('rememberUser');
  res.redirect('/');
});

// ═══════════════════════════════════════════════════════════════
//  API
// ═══════════════════════════════════════════════════════════════
app.get('/api/products', async (req, res) => {
  const products = await Product.findAll({ include: [{ model: Category, as: 'category' }, { model: Brand, as: 'brand' }] });
  res.json(products);
});
app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: [{ model: Category, as: 'category' }, { model: Brand, as: 'brand' }] });
  if (!product) return res.status(404).json({ error: 'No encontrado' });
  res.json(product);
});

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => res.status(404).render('404', { title: 'Página no encontrada', activeNav: '' }));

// ── Arranque ──────────────────────────────────────────────────
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');
    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas');
    app.listen(PORT, () => console.log(`🚀 PC Componentes corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    console.error('   Verificá las variables DB_HOST, DB_USER, DB_PASS, DB_NAME en tu .env');
    process.exit(1);
  }
}

startServer();
