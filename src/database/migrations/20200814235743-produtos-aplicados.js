'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('produtos_aplicados', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_aplicacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'aplicacaos', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },
      id_talhao_safra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'talhao_safras', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'  
      },

      id_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'estoques', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },
      qtda_ha: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      unidade_medida: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      qtd_total_usada: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
    return queryInterface.dropTable('produtos_aplicados');
  }
};
