'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('produtos_fertilizacao_talhaos', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      
      variedade_fertilizante: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      qtd_adubo_ha: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      qtd_total_adubo: {
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
    return queryInterface.dropTable('produtos_fertilizacao_talhaos');
  }
};
