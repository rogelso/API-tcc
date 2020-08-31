const {Model, DataTypes} = require('sequelize');

class Venda extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            id_safra: DataTypes.INTEGER,
            tipo_produto: DataTypes.STRING,
            data_venda: DataTypes.DATE,
            qtd_sacas_venda: DataTypes.FLOAT,
            preco_unitario: DataTypes.FLOAT,
            deducoes_impostos: DataTypes.FLOAT,
            receita:DataTypes.FLOAT
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user'});
        this.belongsTo(models.Safra, { foreignKey: 'id_safra', as: 'venda'});

    }
}

module.exports = Venda;