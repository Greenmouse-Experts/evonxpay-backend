
const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');
const User = require('./user');

const Transaction = db.define('usertransaction', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userId:{
        type: Sequelize.STRING,
        references:{ 
        model: 'users',
        key: 'id',
    }
    },
    description:{
        type: Sequelize.TEXT
    },
    ref_no: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
    },
    status:{
        type: Sequelize.STRING
    }
},{timestamps: true});

Transaction.belongsTo(User, {foreignKey: 'userId'})
User.hasMany(Transaction, {foreignKey: 'userId'});

module.exports = Transaction;



       