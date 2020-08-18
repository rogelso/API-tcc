const {Model, DataTypes} = require('sequelize');

class ProdutosAplicados extends Model{
    static init(connection){
        super.init({
            id_aplicacao: DataTypes.INTEGER,
            id_talhao_safra: DataTypes.INTEGER,
            id_produto: DataTypes.INTEGER,
            qtda_ha: DataTypes.INTEGER,
            unidade_medida: DataTypes.STRING,
            qtd_total_usada: DataTypes.FLOAT
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.Aplicacao, { foreignKey: 'id_aplicacao', as: 'produtos'});
    }
}

module.exports = ProdutosAplicados;