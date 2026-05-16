'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    verificationExpires: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    // FK: userCategoryId se agrega por la asociación en index.js
    userCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'UserCategories', key: 'id' }
    }
  }, {
    tableName: 'Users',
    timestamps: true
  });

  return User;
};
