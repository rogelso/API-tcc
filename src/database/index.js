const { Sequelize } = require('sequelize');
const dbConfig = require ('../config/database');

const User = require ('../models/User');
const Talhao = require ('../models/Talhao');
const Safra = require ('../models/Safra');
const Estoque = require('../models/Estoque');


const connection = new Sequelize(dbConfig);

User.init(connection);
Talhao.init(connection);
Safra.init(connection);
Estoque.init(connection);

User.associate(connection.models);
Talhao.associate(connection.models);
Safra.associate(connection.models);
Estoque.associate(connection.models);


module.exports= connection;