'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bems', { 
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
      
      nome_bem: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      valor_bem: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      
      valor_depreciavel: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      
      data_ini_dep: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      data_fim_dep: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('cargas');
  }
};
