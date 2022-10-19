const Sequelize = require('sequelize');
require('dotenv').config();

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST

const url = process.env.DB_URL


var db = new Sequelize("heroku_64732accca4c7ae", "bef984dbce5528", "14ca73dc", {
    host: "us-cdbr-east-06.cleardb.net",
    dialect: 'mysql',
    pool: {
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 10000
    }
});

module.exports = db