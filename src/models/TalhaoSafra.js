const {Model, DataTypes} = require('sequelize');

class TalhaoSafra extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            id_safra: DataTypes.INTEGER,
            id_talhao: DataTypes.INTEGER,
            tipo_cultivo: DataTypes.STRING,
            data_descecacao: DataTypes.DATE,
            data_ini_plantio: DataTypes.DATE,
            data_fim_plantio: DataTypes.DATE,
            valor_hora_plantio: DataTypes.FLOAT,
            total_horas_plantio: DataTypes.FLOAT,          
            custo_servico_plantio: DataTypes.FLOAT,
            data_ini_colheita: DataTypes.DATE,
            data_fim_colheita: DataTypes.DATE,
            operador_colheita: DataTypes.STRING,
            status: DataTypes.INTEGER
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        //this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user'});
        //this.belongsTo(models.Safra, { foreignKey: 'id_safra', as: 'safra'});

        this.hasMany( 
            models.Aplicacao, { foreignKey: 'id_talhao_safra', as: 'aplicacao'}
        );
    }
}

module.exports = TalhaoSafra;