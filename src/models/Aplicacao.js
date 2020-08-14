const {Model, DataTypes} = require('sequelize');

class Aplicacao extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            id_talhao_safra: DataTypes.INTEGER,
            cod_tipo_aplicacao: DataTypes.INTEGER,
            tipo_aplicacao: DataTypes.STRING,
            nro_tratamento: DataTypes.INTEGER,
            data_ini_aplicacao: DataTypes.DATE,
            data_fim_aplicacao: DataTypes.DATE,
            total_horas_trabalhadas: DataTypes.FLOAT,          
            custo_hora: DataTypes.FLOAT,
            custo_total_servico: DataTypes.FLOAT
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.TalhaoSafra, { foreignKey: 'id_talhao_safra', as: 'aplicacoes'});
    }
}

module.exports = Aplicacao;