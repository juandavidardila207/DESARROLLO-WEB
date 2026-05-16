'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserCategory = sequelize.define('UserCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'UserCategories',
    timestamps: true
  });

  return UserCategory;
};
