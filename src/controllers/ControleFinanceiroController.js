const User = require("../models/User");
const Safra = require("../models/Safra");
const ControleFinanceiro = require("../models/ControleFinanceiro");


require('str-trim');

module.exports = {


    async findOneControle(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        
        //ver se user existe so pra ter
        const controle_financeiro = await ControleFinanceiro.findOne(
            { 
                where:{
                    id_user: id_user,
                    id_safra: id_safra
                },
            }
        );
        if (!controle_financeiro){
            return res.status(400).json({error: 'Algo de errado ocorreu ao carregar as informações.'});           
        }
     
        
        return res.json(controle_financeiro);
    }

}