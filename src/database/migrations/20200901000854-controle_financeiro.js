'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('controle_financeiros', { 
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
    
      receita_bruta_total: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      deducoes_impostos_total: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      receita_liquida_total: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      
      custos_variaveis_total: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      
      lucro_bruto: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      gastos_fixos_operacionais: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      
      lucro_liquido: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
        
      custos_depreciacoes: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      lucro_saca_mcu: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      ponto_equilibrio: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      margem_seguranca: {
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
    return queryInterface.dropTable('controle_financeiros');
  }
};
