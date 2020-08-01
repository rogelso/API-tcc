'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('talhaos', { 
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
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      localizacao: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      desc_talhao: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      qtda_ha: {
        type: Sequelize.FLOAT ,
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
    return queryInterface.dropTable('talhoes');
  }
};