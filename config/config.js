const Sequelize = require('sequelize');
require('dotenv').config();

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST

const url = process.env.DB_URL


var db = new Sequelize("evonexpay", "root", "Gooday@23", {
    host: "127.0.0.1",
    dialect: 'mysql',
    pool: {
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 10000
    }
});

module.exports = db