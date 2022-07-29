const Sequelize = require('sequelize');
const db = require('../config/config');
const {nanoid} = require('nanoid');

const User = db.define('user', {
    id: {
        type: Sequelize.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 6,
        max: 20
    },
    phone_no: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'
    },
    emailVerify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    img_id: {
        type: Sequelize.STRING,
    },
    img_url:{
        type: Sequelize.STRING,
    },
    balance:{
        type: Sequelize.BIGINT,
        defaultValue: 0
    }
},
{timestamps: true});

module.exports = User;
