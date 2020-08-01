const {Model, DataTypes} = require('sequelize');

class Talhao extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            nome: DataTypes.STRING,
            localizacao: DataTypes.STRING,
            desc_talhao: DataTypes.STRING,
            qtda_ha: DataTypes.FLOAT          
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user'});
    }
}


module.exports = Talhao;