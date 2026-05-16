'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Category, Brand, Product, UserCategory, User } = require('../models');

const SALT_ROUNDS = 10;

async function seed() {
  try {
    // Sincronizar tablas (crear si no existen)
    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas');

    // ── Categorías de productos ──────────────────────────────
    const [catPortatiles]    = await Category.findOrCreate({ where: { slug: 'portatiles' },    defaults: { name: 'Portátiles',      description: 'Los mejores portátiles',             image: '/images/cat-portatiles.jpg'  } });
    const [catSmartphones]   = await Category.findOrCreate({ where: { slug: 'smartphones' },   defaults: { name: 'Smartphones',     description: 'Estrena smartphone',                 image: '/images/cat-smartphones.jpg' } });
    const [catComponentes]   = await Category.findOrCreate({ where: { slug: 'componentes-pc' },defaults: { name: 'Componentes PC',  description: 'Componentes de alto rendimiento',    image: '/images/cat-televisores.jpg' } });
    const [catPerifericos]   = await Category.findOrCreate({ where: { slug: 'perifericos' },   defaults: { name: 'Periféricos',     description: 'Periféricos gaming y oficina',       image: '/images/cat-hogar.jpg'       } });
    const [catTelevisores]   = await Category.findOrCreate({ where: { slug: 'televisores' },   defaults: { name: 'Televisores',     description: 'Novedades en televisores',            image: '/images/cat-televisores.jpg' } });
    const [catAudio]         = await Category.findOrCreate({ where: { slug: 'audio' },         defaults: { name: 'Audio',           description: 'Equipos de audio y sonido',          image: '/images/cat-hogar.jpg'       } });
    console.log('✅ Categorías de productos insertadas');

    // ── Marcas ────────────────────────────────────────────────
    const [apple]    = await Brand.findOrCreate({ where: { name: 'Apple'    } });
    const [samsung]  = await Brand.findOrCreate({ where: { name: 'Samsung'  } });
    const [corsair]  = await Brand.findOrCreate({ where: { name: 'Corsair'  } });
    const [hyperx]   = await Brand.findOrCreate({ where: { name: 'HyperX'   } });
    const [msi]      = await Brand.findOrCreate({ where: { name: 'MSI'      } });
    const [lg]       = await Brand.findOrCreate({ where: { name: 'LG'       } });
    const [logitech] = await Brand.findOrCreate({ where: { name: 'Logitech' } });
    const [generic]  = await Brand.findOrCreate({ where: { name: 'Genérico' } });
    console.log('✅ Marcas insertadas');

    // ── Productos ─────────────────────────────────────────────
    const productosData = [
      { name: 'iPhone 15 128 GB',        slug: 'iphone-15-128gb',        description: 'El iPhone 15 llega con el nuevo sistema de cámara dual de 48 MP. La autonomía llega hasta por 20 horas de reproducción de video.',       price: 2999000, oldPrice: 3499000, discount: 15, image: '/images/product-iphone-15.jpg',        stock: 25, featured: true,  categoryId: catSmartphones.id, brandId: apple.id    },
      { name: 'Portátil Gamer',           slug: 'portatil-gamer',          description: 'Laptop gaming con procesador Intel Core i7, 16GB RAM, SSD 512GB y tarjeta gráfica RTX 3060. Pantalla 15.6" Full HD 144Hz.',              price: 4999000, oldPrice: 6249000, discount: 20, image: '/images/product-portatil-gamer.jpg',    stock: 10, featured: true,  categoryId: catPortatiles.id,  brandId: msi.id      },
      { name: 'Memorias Ram DDR5',        slug: 'memorias-ram-ddr5',       description: 'Kit de memoria RAM DDR5 5200MHz, 2x16GB para un total de 32GB. Ideal para gaming y trabajo pesado.',                                      price: 599000,  oldPrice: 749000,  discount: 20, image: '/images/product-ram-ddr5.jpg',          stock: 50, featured: true,  categoryId: catComponentes.id, brandId: corsair.id  },
      { name: 'Auriculares Gamer',        slug: 'auriculares-gamer',       description: 'Auriculares gaming con sonido envolvente 7.1, micrófono con cancelación de ruido, iluminación RGB y almohadillas de memory foam.',       price: 399000,  oldPrice: 499000,  discount: 20, image: '/images/product-auriculares-gamer.jpg', stock: 30, featured: true,  categoryId: catPerifericos.id, brandId: hyperx.id   },
      { name: 'CPU Gamer',                slug: 'cpu-gamer',               description: 'Torre gamer con procesador AMD Ryzen 9, RTX 4070, 32GB RAM DDR5, SSD 1TB NVMe y refrigeración líquida.',                                 price: 8999000, oldPrice: 10999000,discount: 18, image: '/images/product-cpu-gamer.jpg',         stock: 8,  featured: true,  categoryId: catComponentes.id, brandId: generic.id  },
      { name: 'Monitor 27" 165Hz',        slug: 'monitor-27-165hz',        description: 'Monitor gaming 27 pulgadas con panel IPS, resolución QHD 2560x1440, 165Hz, tiempo de respuesta 1ms y soporte HDR400.',                   price: 1299000, oldPrice: 1599000, discount: 19, image: '/images/product-auriculares-gamer.jpg', stock: 15, featured: false, categoryId: catPerifericos.id, brandId: lg.id       },
      { name: 'Samsung Galaxy S24',       slug: 'samsung-galaxy-s24',      description: 'Samsung Galaxy S24 con pantalla Dynamic AMOLED 2X 6.2", procesador Snapdragon 8 Gen 3, 8GB RAM y cámara triple de 50MP.',               price: 3899000, oldPrice: 4299000, discount: 9,  image: '/images/product-iphone-15.jpg',         stock: 20, featured: false, categoryId: catSmartphones.id, brandId: samsung.id  },
      { name: 'Teclado Mecánico RGB',     slug: 'teclado-mecanico-rgb',    description: 'Teclado mecánico gaming con switches red, iluminación RGB por tecla, estructura de aluminio y conectividad USB-C.',                      price: 299000,  oldPrice: 399000,  discount: 25, image: '/images/product-ram-ddr5.jpg',          stock: 40, featured: false, categoryId: catPerifericos.id, brandId: logitech.id },
      { name: 'SSD NVMe 1TB',             slug: 'ssd-nvme-1tb',            description: 'Unidad SSD NVMe PCIe 4.0 de 1TB con velocidades de lectura de hasta 7000 MB/s. Ideal para reducir tiempos de carga en juegos.',          price: 449000,  oldPrice: 549000,  discount: 18, image: '/images/product-ram-ddr5.jpg',          stock: 60, featured: false, categoryId: catComponentes.id, brandId: samsung.id  },
      { name: 'Mouse Gamer Inalámbrico',  slug: 'mouse-gamer-inalambrico', description: 'Mouse gamer inalámbrico con sensor óptico de 25600 DPI, batería de 70 horas, 6 botones programables e iluminación RGB.',               price: 259000,  oldPrice: 319000,  discount: 19, image: '/images/product-auriculares-gamer.jpg', stock: 35, featured: false, categoryId: catPerifericos.id, brandId: logitech.id }
    ];

    for (const prod of productosData) {
      await Product.findOrCreate({ where: { slug: prod.slug }, defaults: prod });
    }
    console.log('✅ Productos insertados');

    // ── Roles de usuario ──────────────────────────────────────
    const [roleAdmin]   = await UserCategory.findOrCreate({ where: { name: 'admin'   } });
    const [roleCliente] = await UserCategory.findOrCreate({ where: { name: 'cliente' } });
    console.log('✅ Roles de usuario insertados');

    // ── Usuarios de prueba ────────────────────────────────────
    const password = await bcrypt.hash('Test1234!', SALT_ROUNDS);

    await User.findOrCreate({
      where: { email: 'juan.garcia@email.com' },
      defaults: { firstName: 'Juan', lastName: 'García', email: 'juan.garcia@email.com', password, phone: '3156419521', verified: true, userCategoryId: roleAdmin.id }
    });
    await User.findOrCreate({
      where: { email: 'maria.lopez@email.com' },
      defaults: { firstName: 'María', lastName: 'López', email: 'maria.lopez@email.com', password, phone: '3108765432', verified: true, userCategoryId: roleCliente.id }
    });
    await User.findOrCreate({
      where: { email: 'carlos.martinez@email.com' },
      defaults: { firstName: 'Carlos', lastName: 'Martínez', email: 'carlos.martinez@email.com', password, phone: '3204567890', verified: true, userCategoryId: roleCliente.id }
    });
    console.log('✅ Usuarios de prueba insertados (password: Test1234!)');

    console.log('\n🎉 Seed completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    process.exit(1);
  }
}

seed();
