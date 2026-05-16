'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    oldPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // FK: categoryId y brandId se agregan automáticamente por las asociaciones en index.js
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Categories', key: 'id' }
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Brands', key: 'id' }
    }
  }, {
    tableName: 'Products',
    timestamps: true
  });

  return Product;
};
