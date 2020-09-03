const {Model, DataTypes} = require('sequelize');

class Bem extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            nome_bem: DataTypes.STRING,
            tipo: DataTypes.STRING,
            valor_bem: DataTypes.FLOAT,
            valor_depreciavel: DataTypes.FLOAT,
            data_ini_dep: DataTypes.DATE,
            data_fim_dep: DataTypes.DATE
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'id_user', as: 'bens'});   
    }
}


module.exports = Bem;