const {Model, DataTypes} = require('sequelize');

class Estoque extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            id_safra: DataTypes.INTEGER,
            nome_produto: DataTypes.STRING,
            cod_tipo_produto: DataTypes.INTEGER,
            variedade_insumo: DataTypes.STRING,
            qtd_adquirida: DataTypes.FLOAT,
            unidade: DataTypes.STRING,
            kg_sc: DataTypes.FLOAT,          
            valor_unitario: DataTypes.FLOAT,
            valor_total: DataTypes.FLOAT,
            data_compra: DataTypes.DATE,
            qtd_disponivel: DataTypes.FLOAT,
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

module.exports = Estoque;