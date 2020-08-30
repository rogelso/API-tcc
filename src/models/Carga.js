const {Model, DataTypes} = require('sequelize');

class Carga extends Model{
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            id_talhao_safra: DataTypes.INTEGER,
            id_safra: DataTypes.INTEGER,
            tipo_produto: DataTypes.STRING,
            data:DataTypes.DATE,
            destinatario: DataTypes.STRING,
            placa: DataTypes.STRING,
            nome_motorista: DataTypes.STRING,
            peso_liquido: DataTypes.FLOAT,
            total_descontos: DataTypes.FLOAT,
            peso_liquido_final: DataTypes.FLOAT,          
            qtd_sacas_final: DataTypes.FLOAT,
            cod_tipo_custo_frete: DataTypes.INTEGER,
            valor_unitario_frete: DataTypes.FLOAT,
            valor_total_frete: DataTypes.FLOAT,
            status_valor_frete: DataTypes.STRING,
            cod_tipo_custo_colheita: DataTypes.INTEGER,
            valor_unitario_colheita: DataTypes.FLOAT,
            valor_colheita: DataTypes.FLOAT,
            status_valor_colheita: DataTypes.STRING 
        },
        {
            sequelize: connection   
        }) 
    }
     
    static associate(models){
        this.belongsTo(models.TalhaoSafra, { foreignKey: 'id_talhao_safra', as: 'carga'});
    }
}

module.exports = Carga;