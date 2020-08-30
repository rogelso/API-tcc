'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cargas', { 
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
      
      tipo_produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      
      destinatario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      placa: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nome_motorista: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      peso_liquido: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      total_descontos: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      peso_liquido_final: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      qtd_sacas_final: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      cod_tipo_custo_frete: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      valor_unitario_frete: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      valor_total_frete: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      status_valor_frete: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      cod_tipo_custo_colheita: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      valor_unitario_colheita: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      valor_colheita: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      status_valor_colheita: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('cargas');
  }
};
