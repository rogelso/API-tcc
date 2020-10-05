const {Model, DataTypes} = require('sequelize');

class User extends Model{
    static init(connection){
        super.init({
            nome:DataTypes.STRING,
            sobrenome: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            cidade: DataTypes.STRING,
            uf: DataTypes.STRING,
        },
        {
            sequelize: connection   
        }) 
    } 


    static associate(models){
        this.hasMany(
            models.Talhao, { foreignKey: 'id_user', as: 'talhaos_user'}
            
        );
        this.hasMany( 
            models.Safra, { foreignKey: 'id_user', as: 'safras_user'}
        );
        this.hasMany( 
            models.Estoque, { foreignKey: 'id_user', as: 'estoque_user'}
        );
        this.hasMany( 
            models.Venda, { foreignKey: 'id_user', as: 'vendas_user'}
        );
        this.hasMany( 
            models.Bem, { foreignKey: 'id_user', as: 'bens_user'}
        );
        this.hasMany( 
            models.ControleFinanceiro, { foreignKey: 'id_user', as: 'controle_financeiro'}
        );

    }

}


module.exports = User;