const User = require("../models/User");
const Safra = require("../models/Safra");
const ControleFinanceiro = require("../models/ControleFinanceiro");


require('str-trim');

module.exports = {


    async findOneControle(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        
        //ver se user existe 
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
     
        //atualiza lucro bruto e lucro liquido
        const lucro_bruto  = load_controle_financeiro.receita_liquida_total - load_controle_financeiro.custos_variaveis_total;
        const lucro_liquido_ebitda  = lucro_bruto - load_controle_financeiro.gastos_fixos_operacionais;
        
        const controle_financeiro_refresh = await ControleFinanceiro.update(
            { 
                lucro_bruto:lucro_bruto,
                lucro_liquido: lucro_liquido_ebitda
            }, 
            { 
                where:{
                    id_user: id_user,
                    id_safra: id_safra
                },
            }
        );


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
    }


}