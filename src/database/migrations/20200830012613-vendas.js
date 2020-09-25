'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vendas', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },

      id_safra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'safras', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },
      
      tipo_produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      data_venda: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      
      qtd_sacas_venda: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      
      preco_unitario: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      deducoes_impostos: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      receita: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('vendas');
  }
};
