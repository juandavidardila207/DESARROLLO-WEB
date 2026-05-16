-- ============================================================
--  PC Componentes — structure.sql
--  Script de estructura de base de datos
--  Ejecutar: mysql -u root -p < structure.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS pc_componentes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pc_componentes;

-- ------------------------------------------------------------
-- Tabla: Categories  (categorías de productos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Categories (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  slug        VARCHAR(100)  NOT NULL,
  description VARCHAR(255)  DEFAULT NULL,
  image       VARCHAR(500)  DEFAULT NULL,
  createdAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: Brands  (marcas de productos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Brands (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_brands_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: Products  (productos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Products (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL,
  description TEXT         DEFAULT NULL,
  price       INT          NOT NULL,
  oldPrice    INT          DEFAULT NULL,
  discount    INT          DEFAULT 0,
  image       VARCHAR(500) DEFAULT NULL,
  stock       INT          DEFAULT 0,
  featured    TINYINT(1)   DEFAULT 0,
  categoryId  INT          DEFAULT NULL,
  brandId     INT          DEFAULT NULL,
  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  CONSTRAINT fk_products_category FOREIGN KEY (categoryId) REFERENCES Categories (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_products_brand    FOREIGN KEY (brandId)    REFERENCES Brands (id)     ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: UserCategories  (roles de usuarios: admin, cliente)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS UserCategories (
  id        INT         NOT NULL AUTO_INCREMENT,
  name      VARCHAR(50) NOT NULL,
  createdAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_usercategories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: Users  (usuarios)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
  id                  INT          NOT NULL AUTO_INCREMENT,
  firstName           VARCHAR(100) NOT NULL,
  lastName            VARCHAR(100) NOT NULL,
  email               VARCHAR(255) NOT NULL,
  password            VARCHAR(255) NOT NULL,
  phone               VARCHAR(20)  DEFAULT NULL,
  profileImage        VARCHAR(500) DEFAULT NULL,
  verified            TINYINT(1)   DEFAULT 0,
  verificationToken   VARCHAR(255) DEFAULT NULL,
  verificationExpires BIGINT       DEFAULT NULL,
  userCategoryId      INT          DEFAULT NULL,
  createdAt           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT fk_users_category FOREIGN KEY (userCategoryId) REFERENCES UserCategories (id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
