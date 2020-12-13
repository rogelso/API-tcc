const User = require("../models/User");
const Safra = require("../models/Safra");
const ControleFinanceiro = require("../models/ControleFinanceiro");
const Bem = require("../models/Bem");
const { Op } = require('sequelize')


require('str-trim');

module.exports = {


    async findOneControle(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        
        const load_controle_financeiro = await ControleFinanceiro.findOne(
            { 
                where:{
                    id_user: id_user,
                    id_safra: id_safra
                },
            }
        );
        if (!load_controle_financeiro){
            return res.status(400).json({error: 'Algo de errado ocorreu ao carregar as informações.'});           
        }

        // Atualizacao custos de Depreciações
        const safra = await Safra.findOne({
            where:{
                id: id_safra,
                id_user:id_user                                     
            },          
        });       
        if(safra.ano_safra.match(/Safra/)){
            console.log('Não e safrinha');          
            const date_safra = safra.ano_safra.substr(11);

            //carrega bens
            const bens = await Bem.findAll({
                where:{
                    id_user:id_user,

                    data_fim_dep: {
                        [Op.gte]: new Date(Date.UTC(date_safra)),                                                
                    },
                },          
            });

            if(bens){
                var valor_depreciavel_total = 0;
                for(let i = 0; i < bens.length; i = i + 1 ) {
                    console.log('[for]', bens[i].nome_bem);
                    valor_depreciavel_total = valor_depreciavel_total+ bens[i].valor_depreciavel
                }
            }
        }

        

        //atualiza lucro bruto e lucro liquido
        const lucro_bruto  = load_controle_financeiro.receita_liquida_total - load_controle_financeiro.custos_variaveis_total;
        const lucro_liquido_ebitda  = lucro_bruto - load_controle_financeiro.gastos_fixos_operacionais;
        
        
        // registra as atualizações
        const controle_financeiro_refresh = await ControleFinanceiro.update(
            { 
                lucro_bruto:lucro_bruto,
                lucro_liquido: lucro_liquido_ebitda,
                custos_depreciacoes: valor_depreciavel_total
            }, 
            { 
                where:{
                    id_user: id_user,
                    id_safra: id_safra
                },
            }
        );

        // retorna os dados atualizados
        const controle_financeiro = await ControleFinanceiro.findOne(
            { 
                attributes: ['id', 'id_user','id_safra', 'receita_bruta_total', 'deducoes_impostos_total', 'receita_liquida_total', 'custos_variaveis_total', 'lucro_bruto', 'gastos_fixos_operacionais', 'lucro_liquido', 'custos_depreciacoes', 'lucro_saca_mcu', 'ponto_equilibrio', 'margem_seguranca' ],
                where:{
                    id_user: id_user,
                    id_safra: id_safra
                },
            }
        );  

        return res.json([controle_financeiro]);
    },

}