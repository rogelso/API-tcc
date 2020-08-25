const {Model, DataTypes} = require('sequelize');

class ProdutosFertilizacaoTalhao extends Model{
    static init(connection){
        super.init({
            id_talhao_safra: DataTypes.INTEGER,
            id_produto: DataTypes.INTEGER,
            variedade_fertilizante: DataTypes.STRING,
            qtd_adubo_ha: DataTypes.FLOAT,
            qtd_total_adubo: DataTypes.FLOAT
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.TalhaoSafra, { foreignKey: 'id_talhao_safra', as: 'fertilizantes_talhao'});
    }
}

module.exports = ProdutosFertilizacaoTalhao;