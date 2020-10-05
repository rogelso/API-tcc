'use strict';

const { query } = require("express");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type:Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
  
      nome: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false,
      },

      sobrenome: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false,
      },

      email: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false,
      }, 

      password: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false,
      },

      cidade: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false,
      },
      uf: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: false,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
