const {Model, DataTypes} = require('sequelize');

class User extends Model{
    static init(connection){
        super.init({
            nome:DataTypes.STRING,
            sobrenome: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            cidade: DataTypes.STRING,
        },
        {
            sequelize: connection   
        }) 
    } 


    static associate(models){
        this.hasMany(models.Talhao, { foreignKey: 'id_user', as: 'talhaos_user'});
    }
}


module.exports = User;