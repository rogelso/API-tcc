'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('aplicacaos', { 
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
      id_talhao_safra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'talhao_safras', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'  //ver
      },
      cod_tipo_aplicacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      tipo_aplicacao: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nro_tratamento: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      data_ini_aplicacao: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      data_fim_aplicacao: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      total_horas_trabalhadas: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      custo_hora: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      custo_total_servico: {
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
    return queryInterface.dropTable('aplicacaos');
  }
};
