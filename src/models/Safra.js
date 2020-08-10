const {Model, DataTypes} = require('sequelize');

class Safra extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            ano_safra: DataTypes.STRING,
            custos_fixos_totais: DataTypes.FLOAT,
            manutencoes_maq: DataTypes.FLOAT
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'id_user', as: 'users'});

        this.hasMany( 
            models.Estoque, { foreignKey: 'id_safra', as: 'produtos'}
        );
    }
}


module.exports = Safra;