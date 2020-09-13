const User = require("../models/User");
const Bem = require("../models/Bem");


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    nome_bem: {max:30, min:4, type: 'string'},
    tipo: {max:30, min:4, type: 'string'},
    valor_bem: {min:1, type: 'number'},
    data_ini_dep: {type: 'date', convert: true},
    data_fim_dep: {type: 'date', convert: true},
}
require('str-trim');

module.exports = {
    async store(req, res){
        try{
            const {id_user} = req.params;

            const nome_bem = req.body.nome_bem.trim();
            const tipo = req.body.tipo.trim();
            const valor_bem = req.body.valor_bem;
            var valor_depreciavel=0;
            const data_ini_dep = req.body.data_ini_dep;
            const data_fim_dep = req.body.data_fim_dep;

            const errors = v.validate({nome_bem, tipo, valor_bem, data_ini_dep, data_fim_dep}, filterValidator);

            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }

            if (tipo == 'Máquinas e Equipamentos' || tipo == "Trator"){
                valor_depreciavel = (valor_bem - (valor_bem * 5 /100)) / 20;
            } else if (tipo == 'Edificações'){
                valor_depreciavel = (valor_bem - (valor_bem * 4 /100)) / 25;
            }else{
                valor_depreciavel = (valor_bem - (valor_bem * 10 /100)) / 10;
            }
            
            const bem = await Bem.create({
                id_user,
                nome_bem, 
                tipo,
                valor_bem,
                valor_depreciavel,
                data_ini_dep,
                data_fim_dep
            });

            return res.json(bem);
        } catch (err){
            return res.status(400).json({error: err.message});
        }
    },

    async findAllBens(req, res){   
        const {id_user} = req.params;
        
        const bens = await User.findByPk(id_user, {
            include: {association: 'bens_user'}
            
        });
        
        if (!bens){
            return res.status(400).json({error: 'Bens não encontrados'}); 
        }
        return res.json(bens);
    },
    
    async findOneBem(req, res){   
        const {id_user} = req.params;
        const {id_bem} = req.params;

        try{
            const bem = await Bem.findByPk(id_bem);

            if (!bem){
                return res.status(400).json({error: 'Bem não encontrado'});               
            }
            
            if (bem.id_user != id_user){
                return res.status(400).json({error: 'Bem não pertence ao usuário'});               
            }

            return res.json(bem);
        }catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    

    async deleteBem(req, res){
        try{
            const {id_user} = req.params;
            const {id_bem} = req.params;
                
            const scanBem = await Bem.findByPk(id_bem);

            if (!scanBem){
                return res.status(400).json({error: 'Bem não encontrado'});               
            }
                       
            const bem = await Bem.destroy({
                where: {
                   id: id_bem,
                   id_user:id_user 
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Bem deletado'});
                }else{
                    console.log('Erro no delete o Bem');
                    return res.status(400).json({Erro: 'Não foi possível deletar o Bem'});
                }
             }, function(err){
                 console.log(err); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

}