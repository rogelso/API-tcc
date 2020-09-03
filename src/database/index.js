const { Sequelize } = require('sequelize');
const dbConfig = require ('../config/database');

const User = require ('../models/User');
const Talhao = require ('../models/Talhao');
const Safra = require ('../models/Safra');
const Estoque = require('../models/Estoque');
const TalhaoSafra = require('../models/TalhaoSafra');
const Aplicacao = require('../models/Aplicacao');
const ProdutosAplicados = require('../models/ProdutosAplicados');
const ProdutosSementeTalhao = require('../models/ProdutosSementeTalhao');
const ProdutosFertilizacaoTalhao = require('../models/ProdutosFertilizacaoTalhao');
const Carga = require('../models/Carga');
const Venda = require('../models/Venda');
const Bem = require('../models/Bem');
const ControleFinanceiro = require('../models/ControleFinanceiro');



const connection = new Sequelize(dbConfig);

User.init(connection);
Talhao.init(connection);
Safra.init(connection);
Estoque.init(connection);
TalhaoSafra.init(connection);
Aplicacao.init(connection);
ProdutosAplicados.init(connection);
ProdutosSementeTalhao.init(connection);
ProdutosFertilizacaoTalhao.init(connection);
Carga.init(connection);
Venda.init(connection);
Bem.init(connection);
ControleFinanceiro.init(connection);

User.associate(connection.models);
Talhao.associate(connection.models);
Safra.associate(connection.models);
Estoque.associate(connection.models);
TalhaoSafra.associate(connection.models);
Aplicacao.associate(connection.models);
ProdutosAplicados.associate(connection.models);
ProdutosSementeTalhao.associate(connection.models);
ProdutosFertilizacaoTalhao.associate(connection.models);
Carga.associate(connection.models);
Venda.associate(connection.models);
Bem.associate(connection.models);
ControleFinanceiro.associate(connection.models);

module.exports= connection;