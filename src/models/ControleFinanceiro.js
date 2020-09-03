const {Model, DataTypes} = require('sequelize');

class ControleFinanceiro extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            id_safra: DataTypes.INTEGER,
            receita_bruta_total: DataTypes.FLOAT,
            deducoes_impostos_total: DataTypes.FLOAT,
            receita_liquida_total: DataTypes.FLOAT,
            custos_variaveis_total: DataTypes.FLOAT,
            lucro_bruto: DataTypes.FLOAT,
            gastos_fixos_operacionais: DataTypes.FLOAT,          
            lucro_liquido: DataTypes.FLOAT,
            custos_depreciacoes: DataTypes.FLOAT,
            lucro_saca_mcu: DataTypes.FLOAT,
            ponto_equilibrio: DataTypes.FLOAT,
            margem_seguranca: DataTypes.FLOAT
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user'});
        this.belongsTo(models.Safra, { foreignKey: 'id_safra', as: 'safra'});
    }
}

module.exports = ControleFinanceiro;