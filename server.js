require('dotenv').config();
const express        = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const path           = require('path');
const fs             = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ===================== RUTAS DE ARCHIVOS JSON =====================
const PRODUCTS_PATH = path.join(__dirname, 'data', 'products.json');
const USERS_PATH    = path.join(__dirname, 'data', 'users.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));
}
function writeProducts(data) {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
}
function writeUsers(data) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

const { categories, footerLinks } = require('./data/products');

// ===================== CONFIGURACIÓN EJS =====================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// ===================== MIDDLEWARE =====================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ===================== HELPERS GLOBALES =====================
app.locals.formatPrice = function(price) {
  return '$ ' + Number(price).toLocaleString('es-CO');
};
app.locals.categories  = categories;
app.locals.footerLinks = footerLinks;

function generateSlug(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function generateId(arr) {
  return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

// ===================== RUTAS PRINCIPALES =====================

app.get('/', (req, res) => {
  const products = readProducts();
  res.render('index', { title: 'PC Componentes - Tu tienda de tecnología', products: products.filter(p => p.featured), categories, activeNav: 'inicio' });
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
  const categoryProducts = req.params.slug === 'ofertas' ? products.filter(p => p.discount > 0) : products.filter(p => p.category === req.params.slug);
  res.render('categoria', { title: `${category.name} - PC Componentes`, category, products: categoryProducts, activeNav: req.params.slug });
});

app.get('/carrito', (req, res) => {
  res.render('carrito', { title: 'Tu Carrito - PC Componentes', products: readProducts(), activeNav: '' });
});

app.get('/checkout', (req, res) => {
  res.render('checkout', { title: 'Finalizar Compra - PC Componentes', products: readProducts(), activeNav: '' });
});

app.get('/buscar', (req, res) => {
  const products = readProducts();
  const query = (req.query.q || '').toLowerCase().trim();
  const results = query ? products.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)) : [];
  res.render('buscar', { title: query ? `Resultados para "${query}" - PC Componentes` : 'Buscar - PC Componentes', query, results, activeNav: '' });
});

// ===================== CRUD PRODUCTOS (/products) =====================

// 1. GET /products — Listado
app.get('/products', (req, res) => {
  const products = readProducts();
  res.render('products/index', { title: 'Administrar Productos - PC Componentes', products, categories, activeNav: '' });
});

// 2. GET /products/create — Formulario de creación
app.get('/products/create', (req, res) => {
  res.render('products/create', { title: 'Nuevo Producto - PC Componentes', categories, activeNav: '' });
});

// 3. POST /products — Crear producto
app.post('/products', (req, res) => {
  const { name, description, price, category, image, discount, oldPrice, featured } = req.body;
  if (!name || !description || !price || !category || !image) {
    return res.render('products/create', { title: 'Nuevo Producto - PC Componentes', categories, activeNav: '', errorMsg: 'Por favor completá todos los campos obligatorios.', formData: req.body });
  }
  const products = readProducts();
  products.push({ id: generateId(products), name: name.trim(), slug: generateSlug(name), category, price: parseInt(price), oldPrice: oldPrice ? parseInt(oldPrice) : null, discount: discount ? parseInt(discount) : 0, image: image.trim(), description: description.trim(), featured: featured === 'true' });
  writeProducts(products);
  res.redirect('/products');
});

// 4. GET /products/:id/edit — Formulario de edición
app.get('/products/:id/edit', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  res.render('products/edit', { title: `Editar: ${product.name} - PC Componentes`, product, categories, activeNav: '' });
});

// 5. GET /products/:id — Detalle
app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;
  res.render('producto', { title: `${product.name} - PC Componentes`, product, relatedProducts, categoryName, activeNav: product.category });
});

// 6. PUT /products/:id — Editar producto
app.put('/products/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  const { name, description, price, category, image, discount, oldPrice, featured } = req.body;
  if (!name || !description || !price || !category || !image) {
    return res.render('products/edit', { title: `Editar: ${products[index].name} - PC Componentes`, product: products[index], categories, activeNav: '', errorMsg: 'Por favor completá todos los campos obligatorios.' });
  }
  products[index] = { ...products[index], name: name.trim(), slug: generateSlug(name), category, price: parseInt(price), oldPrice: oldPrice ? parseInt(oldPrice) : null, discount: discount ? parseInt(discount) : 0, image: image.trim(), description: description.trim(), featured: featured === 'true' };
  writeProducts(products);
  res.redirect('/products');
});

// 7. DELETE /products/:id — Eliminar producto
app.delete('/products/:id', (req, res) => {
  let products = readProducts();
  if (!products.find(p => p.id === parseInt(req.params.id))) return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  products = products.filter(p => p.id !== parseInt(req.params.id));
  writeProducts(products);
  res.redirect('/products');
});

// ===================== USUARIOS =====================

app.get('/usuarios/login', (req, res) => {
  res.render('users/login', { title: 'Iniciar sesión - PC Componentes', activeNav: '' });
});

app.post('/usuarios/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.render('users/login', { title: 'Iniciar sesión - PC Componentes', activeNav: '', errorMsg: 'Por favor completá todos los campos.' });
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.render('users/login', { title: 'Iniciar sesión - PC Componentes', activeNav: '', errorMsg: 'El correo ingresado no está registrado.' });
  res.redirect('/');
});

app.get('/usuarios/registro', (req, res) => {
  res.render('users/register', { title: 'Crear cuenta - PC Componentes', activeNav: '' });
});

app.post('/usuarios/registro', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, phone } = req.body;
  if (!firstName || !lastName || !email || !password) return res.render('users/register', { title: 'Crear cuenta - PC Componentes', activeNav: '', errorMsg: 'Por favor completá todos los campos obligatorios.', formData: req.body });
  if (password !== confirmPassword) return res.render('users/register', { title: 'Crear cuenta - PC Componentes', activeNav: '', errorMsg: 'Las contraseñas no coinciden.', formData: req.body });
  if (password.length < 8) return res.render('users/register', { title: 'Crear cuenta - PC Componentes', activeNav: '', errorMsg: 'La contraseña debe tener al menos 8 caracteres.', formData: req.body });
  const users = readUsers();
  if (users.find(u => u.email === email)) return res.render('users/register', { title: 'Crear cuenta - PC Componentes', activeNav: '', errorMsg: 'Ya existe una cuenta con ese correo electrónico.', formData: req.body });
  users.push({ id: generateId(users), firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim().toLowerCase(), password, phone: phone || '', category: 'cliente', createdAt: new Date().toISOString() });
  writeUsers(users);
  res.render('users/login', { title: 'Iniciar sesión - PC Componentes', activeNav: '', successMsg: `¡Cuenta creada exitosamente! Bienvenid@ ${firstName}. Ya podés iniciar sesión.` });
});

// ===================== API =====================
app.get('/api/products', (req, res) => res.json(readProducts()));
app.get('/api/products/:id', (req, res) => {
  const product = readProducts().find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// ===================== 404 =====================
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada - PC Componentes', activeNav: '' });
});

app.listen(PORT, () => {
  console.log(`🚀 PC Componentes corriendo en http://localhost:${PORT}`);
});
