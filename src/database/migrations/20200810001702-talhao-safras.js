'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('talhao_safras', { 
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
      id_talhao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'talhaos', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'   // não pode deletar um talhao caso esse talaho tenha safras feitas
      },

      tipo_cultivo: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      data_descecacao: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      
      data_ini_plantio: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      data_fim_plantio: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      valor_hora_plantio: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      total_horas_plantio: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      custo_servico_plantio: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      data_ini_colheita: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      data_fim_colheita: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      operador_colheita: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      status: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('talhao_safras');
  }
};
