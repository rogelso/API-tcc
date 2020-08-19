'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('estoques', { 
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

      nome_produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      cod_tipo_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      variedade_insumo: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      qtd_adquirida: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      unidade: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      kg_sc: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      valor_unitario: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      valor_total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      data_compra: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      qtd_disponivel: {
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
    return queryInterface.dropTable('estoques');
  }
};
