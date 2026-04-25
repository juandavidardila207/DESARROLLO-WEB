const products = [
  {
    id: 1,
    name: "iPhone 15 128 GB",
    slug: "iphone-15-128gb",
    category: "smartphones",
    price: 2999000,
    oldPrice: 3499000,
    discount: 15,
    image: "/images/product-iphone-15.jpg",
    description: "El iPhone 15 llega con el nuevo sistema de cámara dual de 48 MP. La autonomía llega hasta por 20 horas de reproducción de video. Y la robusta pantalla Ceramic Shield, con diseño de material de color integrado.",
    featured: true
  },
  {
    id: 2,
    name: "Portátil Gamer",
    slug: "portatil-gamer",
    category: "portatiles",
    price: 4999000,
    oldPrice: 6249000,
    discount: 20,
    image: "/images/product-portatil-gamer.jpg",
    description: "Laptop gaming con procesador Intel Core i7, 16GB RAM, SSD 512GB y tarjeta gráfica RTX 3060. Pantalla 15.6\" Full HD 144Hz para la mejor experiencia gaming.",
    featured: true
  },
  {
    id: 3,
    name: "Memorias Ram DDR5",
    slug: "memorias-ram-ddr5",
    category: "componentes-pc",
    price: 599000,
    oldPrice: 749000,
    discount: 20,
    image: "/images/product-ram-ddr5.jpg",
    description: "Kit de memoria RAM DDR5 5200MHz, 2x16GB para un total de 32GB. Ideal para gaming y trabajo pesado con aplicaciones de diseño y edición.",
    featured: true
  },
  {
    id: 4,
    name: "Auriculares Gamer",
    slug: "auriculares-gamer",
    category: "perifericos",
    price: 399000,
    oldPrice: 499000,
    discount: 20,
    image: "/images/product-auriculares-gamer.jpg",
    description: "Auriculares gaming con sonido envolvente 7.1, micrófono flexible con cancelación de ruido, iluminación RGB personalizable y almohadillas de memory foam.",
    featured: true
  },
  {
    id: 5,
    name: "CPU Gamer",
    slug: "cpu-gamer",
    category: "componentes-pc",
    price: 8999000,
    oldPrice: 10999000,
    discount: 18,
    image: "/images/product-cpu-gamer.jpg",
    description: "Torre gamer con procesador AMD Ryzen 9, RTX 4070, 32GB RAM DDR5, SSD 1TB NVMe y refrigeración líquida. El equipo definitivo para gaming en 4K.",
    featured: true
  },
  {
    id: 6,
    name: "Monitor 27\" 165Hz",
    slug: "monitor-27-165hz",
    category: "perifericos",
    price: 1299000,
    oldPrice: 1599000,
    discount: 19,
    image: "/images/product-auriculares-gamer.jpg",
    description: "Monitor gaming 27 pulgadas con panel IPS, resolución QHD 2560x1440, tasa de refresco 165Hz, tiempo de respuesta 1ms y soporte HDR400.",
    featured: false
  },
  {
    id: 7,
    name: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    category: "smartphones",
    price: 3899000,
    oldPrice: 4299000,
    discount: 9,
    image: "/images/product-iphone-15.jpg",
    description: "Samsung Galaxy S24 con pantalla Dynamic AMOLED 2X 6.2\", procesador Snapdragon 8 Gen 3, 8GB RAM, 256GB almacenamiento y cámara triple de 50MP.",
    featured: false
  },
  {
    id: 8,
    name: "Teclado Mecánico RGB",
    slug: "teclado-mecanico-rgb",
    category: "perifericos",
    price: 299000,
    oldPrice: 399000,
    discount: 25,
    image: "/images/product-ram-ddr5.jpg",
    description: "Teclado mecánico gaming con switches red, iluminación RGB por tecla, estructura de aluminio, reposamuñecas desmontable y conectividad USB-C.",
    featured: false
  }
];

const categories = [
  { id: "portatiles", name: "Portátiles", slug: "portatiles", image: "/images/cat-portatiles.jpg", description: "Los mejores portátiles" },
  { id: "smartphones", name: "Smartphones", slug: "smartphones", image: "/images/cat-smartphones.jpg", description: "Estrena smartphone" },
  { id: "componentes-pc", name: "Componentes PC", slug: "componentes-pc", image: "/images/cat-televisores.jpg", description: "Componentes de alto rendimiento" },
  { id: "perifericos", name: "Periféricos", slug: "perifericos", image: "/images/cat-hogar.jpg", description: "Periféricos gaming y oficina" },
  { id: "televisores", name: "Televisores", slug: "televisores", image: "/images/cat-televisores.jpg", description: "Novedades en televisores" },
  { id: "audio", name: "Audio", slug: "audio", image: "/images/cat-hogar.jpg", description: "Equipos de audio y sonido" },
  { id: "zona-gamer", name: "Zona Gamer", slug: "zona-gamer", image: "/images/cat-portatiles.jpg", description: "Todo para gamers" },
  { id: "ofertas", name: "Ofertas", slug: "ofertas", image: "/images/cat-smartphones.jpg", description: "Las mejores ofertas" }
];

const footerLinks = [
  { name: "Ofertas del Día", href: "/categoria/ofertas" },
  { name: "Nuevos Productos", href: "/categoria/ofertas" },
  { name: "Arma tu PC (Configurador)", href: "/categoria/componentes-pc" },
  { name: "Rastrea tu Pedido", href: "#" },
  { name: "Métodos de Pago", href: "#" },
  { name: "Envíos y Tiempos de Entrega", href: "#" },
  { name: "Cambios y Devoluciones", href: "#" },
  { name: "Garantías", href: "#" },
  { name: "Términos y Condiciones", href: "#" },
  { name: "Política de Privacidad", href: "#" },
  { name: "Zona Gamer", href: "/categoria/zona-gamer" },
  { name: "Accesorios y Periféricos", href: "/categoria/perifericos" }
];

module.exports = { products, categories, footerLinks };
