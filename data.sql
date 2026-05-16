-- ============================================================
--  PC Componentes — data.sql
--  Script de datos iniciales
--  Ejecutar DESPUÉS de structure.sql:
--    mysql -u root -p pc_componentes < data.sql
--
--  NOTA: las contraseñas de usuarios están hasheadas con bcrypt.
--  Password de prueba para todos: Test1234!
--  Para regenerar los hashes podés usar el seed:
--    node database/seeders/seed.js
-- ============================================================

USE pc_componentes;

-- ------------------------------------------------------------
-- Roles de usuario
-- ------------------------------------------------------------
INSERT IGNORE INTO UserCategories (name) VALUES
  ('admin'),
  ('cliente');

-- ------------------------------------------------------------
-- Categorías de productos
-- ------------------------------------------------------------
INSERT IGNORE INTO Categories (name, slug, description, image) VALUES
  ('Portátiles',     'portatiles',     'Los mejores portátiles',            '/images/cat-portatiles.jpg'),
  ('Smartphones',    'smartphones',    'Estrena smartphone',                '/images/cat-smartphones.jpg'),
  ('Componentes PC', 'componentes-pc', 'Componentes de alto rendimiento',   '/images/cat-televisores.jpg'),
  ('Periféricos',    'perifericos',    'Periféricos gaming y oficina',      '/images/cat-hogar.jpg'),
  ('Televisores',    'televisores',    'Novedades en televisores',          '/images/cat-televisores.jpg'),
  ('Audio',          'audio',          'Equipos de audio y sonido',         '/images/cat-hogar.jpg'),
  ('Zona Gamer',     'zona-gamer',     'Todo para gamers',                  '/images/cat-portatiles.jpg');

-- ------------------------------------------------------------
-- Marcas
-- ------------------------------------------------------------
INSERT IGNORE INTO Brands (name) VALUES
  ('Apple'),
  ('Samsung'),
  ('Corsair'),
  ('HyperX'),
  ('MSI'),
  ('LG'),
  ('Logitech'),
  ('Genérico');

-- ------------------------------------------------------------
-- Productos
-- (categoryId: 1=Portátiles, 2=Smartphones, 3=Componentes PC,
--              4=Periféricos | brandId: 1=Apple, 2=Samsung,
--  3=Corsair, 4=HyperX, 5=MSI, 6=LG, 7=Logitech, 8=Genérico)
-- ------------------------------------------------------------
INSERT IGNORE INTO Products (name, slug, description, price, oldPrice, discount, image, stock, featured, categoryId, brandId) VALUES
  ('iPhone 15 128 GB',
   'iphone-15-128gb',
   'El iPhone 15 llega con el nuevo sistema de cámara dual de 48 MP. La autonomía llega hasta por 20 horas de reproducción de video. Y la robusta pantalla Ceramic Shield, con diseño de material de color integrado.',
   2999000, 3499000, 15, '/images/product-iphone-15.jpg', 25, 1, 2, 1),

  ('Portátil Gamer',
   'portatil-gamer',
   'Laptop gaming con procesador Intel Core i7, 16GB RAM, SSD 512GB y tarjeta gráfica RTX 3060. Pantalla 15.6" Full HD 144Hz para la mejor experiencia gaming.',
   4999000, 6249000, 20, '/images/product-portatil-gamer.jpg', 10, 1, 1, 5),

  ('Memorias Ram DDR5',
   'memorias-ram-ddr5',
   'Kit de memoria RAM DDR5 5200MHz, 2x16GB para un total de 32GB. Ideal para gaming y trabajo pesado con aplicaciones de diseño y edición.',
   599000, 749000, 20, '/images/product-ram-ddr5.jpg', 50, 1, 3, 3),

  ('Auriculares Gamer',
   'auriculares-gamer',
   'Auriculares gaming con sonido envolvente 7.1, micrófono flexible con cancelación de ruido, iluminación RGB personalizable y almohadillas de memory foam.',
   399000, 499000, 20, '/images/product-auriculares-gamer.jpg', 30, 1, 4, 4),

  ('CPU Gamer',
   'cpu-gamer',
   'Torre gamer con procesador AMD Ryzen 9, RTX 4070, 32GB RAM DDR5, SSD 1TB NVMe y refrigeración líquida. El equipo definitivo para gaming en 4K.',
   8999000, 10999000, 18, '/images/product-cpu-gamer.jpg', 8, 1, 3, 8),

  ('Monitor 27" 165Hz',
   'monitor-27-165hz',
   'Monitor gaming 27 pulgadas con panel IPS, resolución QHD 2560x1440, tasa de refresco 165Hz, tiempo de respuesta 1ms y soporte HDR400.',
   1299000, 1599000, 19, '/images/product-auriculares-gamer.jpg', 15, 0, 4, 6),

  ('Samsung Galaxy S24',
   'samsung-galaxy-s24',
   'Samsung Galaxy S24 con pantalla Dynamic AMOLED 2X 6.2", procesador Snapdragon 8 Gen 3, 8GB RAM, 256GB almacenamiento y cámara triple de 50MP.',
   3899000, 4299000, 9, '/images/product-iphone-15.jpg', 20, 0, 2, 2),

  ('Teclado Mecánico RGB',
   'teclado-mecanico-rgb',
   'Teclado mecánico gaming con switches red, iluminación RGB por tecla, estructura de aluminio, reposamuñecas desmontable y conectividad USB-C.',
   299000, 399000, 25, '/images/product-ram-ddr5.jpg', 40, 0, 4, 7),

  ('SSD NVMe 1TB',
   'ssd-nvme-1tb',
   'Unidad SSD NVMe PCIe 4.0 de 1TB con velocidades de lectura de hasta 7000 MB/s. Ideal para reducir tiempos de carga en juegos y acelerar el sistema operativo.',
   449000, 549000, 18, '/images/product-ram-ddr5.jpg', 60, 0, 3, 2),

  ('Mouse Gamer Inalámbrico',
   'mouse-gamer-inalambrico',
   'Mouse gamer inalámbrico con sensor óptico de 25600 DPI, batería de 70 horas, 6 botones programables e iluminación RGB. Conexión 2.4GHz sin lag.',
   259000, 319000, 19, '/images/product-auriculares-gamer.jpg', 35, 0, 4, 7);

-- ------------------------------------------------------------
-- Usuarios  (password bcrypt de "Test1234!")
-- ------------------------------------------------------------
INSERT IGNORE INTO Users (firstName, lastName, email, password, phone, verified, userCategoryId) VALUES
  ('Juan',   'García',    'juan.garcia@email.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3156419521', 1, 1),
  ('María',  'López',     'maria.lopez@email.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3108765432', 1, 2),
  ('Carlos', 'Martínez',  'carlos.martinez@email.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3204567890', 1, 2);

-- NOTA: el hash de arriba corresponde a la password "password" de Laravel.
-- Para insertar con "Test1234!", ejecutá primero el seeder de Node:
--   node database/seeders/seed.js
