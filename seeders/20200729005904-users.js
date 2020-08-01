'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTyInteger,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false, 
      },
      nome:{
        type: Sequelize.STRING,
        allowNull: false, 
      }, 
      sobrenome:{
        type: Sequelize.STRING,
        allowNull: false, 
      }, 
      email:{
        type: Sequelize.STRING,
        allowNull: false, 
      }, 
      password:{
        type: Sequelize.STRING,
        allowNull: false, 
      },
      cidade:{
        type: Sequelize.STRING,
        allowNull: false, 
      },  

      created_at: {
        type: Sequelize.Date,
        allowNull: false,
      },

      update_at: {
        type: Sequelize.Date,
        allowNull: false,
      }

    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
