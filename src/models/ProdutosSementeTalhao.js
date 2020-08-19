const {Model, DataTypes} = require('sequelize');

class ProdutosSementeTalhao extends Model{
    static init(connection){
        super.init({
            id_talhao_safra: DataTypes.INTEGER,
            id_produto: DataTypes.INTEGER,
            variedade_semente: DataTypes.STRING,
            populacao_metro: DataTypes.FLOAT,
            qtd_total_semente: DataTypes.FLOAT
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.TalhaoSafra, { foreignKey: 'id_talhao_safra', as: 'sementes_area'});
    }
}

module.exports = ProdutosSementeTalhao;