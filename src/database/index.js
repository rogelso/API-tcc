const { Sequelize } = require('sequelize');
const dbConfig = require ('../config/database');

const User = require ('../models/User');
const Talhao = require ('../models/Talhao');

const connection = new Sequelize(dbConfig);

User.init(connection);
Talhao.init(connection);

User.associate(connection.models);
Talhao.associate(connection.models);
module.exports= connection;