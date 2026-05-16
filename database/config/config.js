require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || null,
    database: process.env.DB_NAME     || 'pc_componentes',
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     process.env.DB_PORT     || 3306,
    dialect:  'mysql',
    logging:  false
  },
  test: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || null,
    database: process.env.DB_NAME     || 'pc_componentes_test',
    host:     process.env.DB_HOST     || '127.0.0.1',
    dialect:  'mysql',
    logging:  false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT     || 3306,
    dialect:  'mysql',
    logging:  false
  }
};
