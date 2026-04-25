const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const { products, categories, footerLinks } = require('./data/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper: formato de precio en pesos colombianos
app.locals.formatPrice = function(price) {
  return '$ ' + price.toLocaleString('es-CO');
};

// Helper: categorías disponibles para el nav
app.locals.categories = categories;
app.locals.footerLinks = footerLinks;

// ===================== RUTAS =====================

// Home
app.get('/', (req, res) => {
  const featuredProducts = products.filter(p => p.featured);
  res.render('index', { 
    title: 'PC Componentes - Tu tienda de tecnología',
    products: featuredProducts,
    categories,
    activeNav: 'inicio'
  });
});

// Producto individual
app.get('/producto/:slug', (req, res) => {
  const product = products.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).render('404', { title: 'Producto no encontrado' });
  }
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;
  res.render('producto', { 
    title: `${product.name} - PC Componentes`,
    product,
    relatedProducts,
    categoryName,
    activeNav: product.category
  });
});

// Categoría
app.get('/categoria/:slug', (req, res) => {
  const category = categories.find(c => c.slug === req.params.slug);
  if (!category) {
    return res.status(404).render('404', { title: 'Categoría no encontrada' });
  }
  const categoryProducts = req.params.slug === 'ofertas' 
    ? products.filter(p => p.discount > 0)
    : products.filter(p => p.category === req.params.slug);
  res.render('categoria', { 
    title: `${category.name} - PC Componentes`,
    category,
    products: categoryProducts,
    activeNav: req.params.slug
  });
});

// Carrito
app.get('/carrito', (req, res) => {
  res.render('carrito', { 
    title: 'Tu Carrito - PC Componentes',
    products,
    activeNav: ''
  });
});

// Checkout
app.get('/checkout', (req, res) => {
  res.render('checkout', { 
    title: 'Finalizar Compra - PC Componentes',
    products,
    activeNav: ''
  });
});

// Búsqueda
app.get('/buscar', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const results = query 
    ? products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    : [];
  res.render('buscar', { 
    title: query ? `Resultados para "${query}" - PC Componentes` : 'Buscar - PC Componentes',
    query,
    results,
    activeNav: ''
  });
});

// ===================== USUARIOS =====================

// GET: Formulario de login
app.get('/usuarios/login', (req, res) => {
  res.render('users/login', {
    title: 'Iniciar sesión - PC Componentes',
    activeNav: ''
  });
});

// POST: Procesar login (simulado, sin base de datos)
app.post('/usuarios/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('users/login', {
      title: 'Iniciar sesión - PC Componentes',
      activeNav: '',
      errorMsg: 'Por favor completá todos los campos.'
    });
  }
  // Simulación: redirigir a home con mensaje de éxito
  res.redirect('/');
});

// GET: Formulario de registro
app.get('/usuarios/registro', (req, res) => {
  res.render('users/register', {
    title: 'Crear cuenta - PC Componentes',
    activeNav: ''
  });
});

// POST: Procesar registro (simulado, sin base de datos)
app.post('/usuarios/registro', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.render('users/register', {
      title: 'Crear cuenta - PC Componentes',
      activeNav: '',
      errorMsg: 'Por favor completá todos los campos obligatorios.',
      formData: req.body
    });
  }

  if (password !== confirmPassword) {
    return res.render('users/register', {
      title: 'Crear cuenta - PC Componentes',
      activeNav: '',
      errorMsg: 'Las contraseñas no coinciden.',
      formData: req.body
    });
  }

  if (password.length < 8) {
    return res.render('users/register', {
      title: 'Crear cuenta - PC Componentes',
      activeNav: '',
      errorMsg: 'La contraseña debe tener al menos 8 caracteres.',
      formData: req.body
    });
  }

  // Simulación: redirigir a login con mensaje de éxito
  res.render('users/login', {
    title: 'Iniciar sesión - PC Componentes',
    activeNav: '',
    successMsg: `¡Cuenta creada exitosamente! Bienvenid@ ${firstName}. Ya podés iniciar sesión.`
  });
});

// ===================== ADMIN PRODUCTOS =====================

// GET: Formulario de creación de producto
app.get('/admin/productos/crear', (req, res) => {
  res.render('products/create', {
    title: 'Nuevo Producto - PC Componentes',
    activeNav: ''
  });
});

// POST: Procesar creación de producto (simulado, sin base de datos)
app.post('/admin/productos/crear', (req, res) => {
  const { name, description, price, category, image } = req.body;

  if (!name || !description || !price || !category || !image) {
    return res.render('products/create', {
      title: 'Nuevo Producto - PC Componentes',
      activeNav: '',
      errorMsg: 'Por favor completá todos los campos obligatorios.',
      formData: req.body
    });
  }

  // Simulación: en un proyecto real se guardaría en BD
  res.render('products/create', {
    title: 'Nuevo Producto - PC Componentes',
    activeNav: '',
    successMsg: `¡El producto "${name}" fue creado exitosamente!`
  });
});

// GET: Formulario de edición de producto
app.get('/admin/productos/editar/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  }
  res.render('products/edit', {
    title: `Editar: ${product.name} - PC Componentes`,
    product,
    activeNav: ''
  });
});

// POST: Procesar edición de producto (simulado, sin base de datos)
app.post('/admin/productos/editar/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).render('404', { title: 'Producto no encontrado', activeNav: '' });
  }

  const { name, description, price, category, image } = req.body;

  if (!name || !description || !price || !category || !image) {
    return res.render('products/edit', {
      title: `Editar: ${product.name} - PC Componentes`,
      product,
      activeNav: '',
      errorMsg: 'Por favor completá todos los campos obligatorios.'
    });
  }

  // Simulación: en un proyecto real se actualizaría en BD
  // Actualizamos el objeto en memoria para que se vea el cambio en la misma sesión
  product.name        = name;
  product.description = description;
  product.price       = parseInt(price);
  product.oldPrice    = req.body.oldPrice ? parseInt(req.body.oldPrice) : product.oldPrice;
  product.discount    = req.body.discount ? parseInt(req.body.discount) : 0;
  product.category    = category;
  product.image       = image;
  product.featured    = req.body.featured === 'true';

  res.render('products/edit', {
    title: `Editar: ${product.name} - PC Componentes`,
    product,
    activeNav: '',
    successMsg: `¡El producto "${product.name}" fue actualizado exitosamente!`
  });
});

// API: obtener todos los productos (para el carrito en frontend)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// API: obtener producto por ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada - PC Componentes', activeNav: '' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 PC Componentes corriendo en http://localhost:${PORT}`);
});
