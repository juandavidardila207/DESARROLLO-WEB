'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// ── Importar modelos ──────────────────────────────────────────
const Category    = require('./Category')(sequelize, DataTypes);
const Brand       = require('./Brand')(sequelize, DataTypes);
const Product     = require('./Product')(sequelize, DataTypes);
const UserCategory = require('./UserCategory')(sequelize, DataTypes);
const User        = require('./User')(sequelize, DataTypes);

// ── Asociaciones ──────────────────────────────────────────────

// Producto pertenece a una Categoría
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product,   { foreignKey: 'categoryId', as: 'products' });

// Producto pertenece a una Marca
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });
Brand.hasMany(Product,   { foreignKey: 'brandId', as: 'products' });

// Usuario pertenece a una Categoría de usuario (rol)
User.belongsTo(UserCategory, { foreignKey: 'userCategoryId', as: 'role' });
UserCategory.hasMany(User,   { foreignKey: 'userCategoryId', as: 'users' });

// ── Exportar ──────────────────────────────────────────────────
module.exports = {
  sequelize,
  Sequelize,
  Category,
  Brand,
  Product,
  UserCategory,
  User
};
