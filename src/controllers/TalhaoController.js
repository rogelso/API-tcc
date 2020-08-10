const User = require("../models/User");
const Talhao = require("../models/Talhao");
const {Op} = require('sequelize');

// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    nome: {max:30, min:4, type: 'string'},
    localizacao: {max:30, min:5, type: 'string'},
    desc_talhao: {max:30, type: 'string'},
    qtda_ha: {min:1,type: 'number', optional: false}
}
require('str-trim');

module.exports = {
    async store(req, res){
        const {id_user} = req.params;
        //const {nome, localizacao, desc_talhao, qtda_ha} = req.body;
        const nome = req.body.nome.trim();
        const localizacao = req.body.localizacao.trim();
        const desc_talhao = req.body.desc_talhao.trim();
        const qtda_ha = req.body.qtda_ha;
        
        //ver se user existe
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }

        const errors = v.validate({nome,localizacao,desc_talhao,qtda_ha}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const talhao = await Talhao.create({ 
            id_user,
            nome,
            localizacao,
            desc_talhao,
            qtda_ha    
        });

        return res.json(talhao);
    },


    async findAllTalhoesUser(req, res){   
        const {id_user} = req.params;
        
        //jeito 1
        //const user = await User.findByPk(id_user);
        // const talhoes = await Talhao.findAll({ where: {id_user}});
        //return res.json(talhoes);
        
        const user = await User.findByPk(id_user, { //busca o user e vincula os talhao
            include: {association: 'talhaos_user'}
        });
        
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'}); 
        }
        return res.json(user);
    },


    async findOneTalhoesUser(req, res){   
        const {id_talhao} = req.params;
        const {id_user} = req.params;

              
        const talhao = await Talhao.findOne( //era findbypk
            { 
                where:{
                    id: id_talhao,
                    id_user:id_user                        
                },
            }
            );
        
        if (!talhao){
            return res.status(400).json({error: 'Talhão não encontrado'}); 
        }

        return res.json(talhao);

        //SELECT t.id, t.id_user, t.nome, t.localizacao, t.desc_talhao, t.qtda_ha, t.created_at, t.updated_at, u.id FROM talhaos t , users  u where t.id_user = 1 and t.id = 7 and u.id =1 ;
    },


    async updateTalhao(req, res){
        try{
            const {id_talhao} = req.params;
            const {id_user} = req.params;

            const nome = req.body.nome.trim();
            const localizacao = req.body.localizacao.trim();
            const desc_talhao = req.body.desc_talhao.trim();
            const qtda_ha = req.body.qtda_ha;

            const talhao = await Talhao.findByPk(id_talhao);
            if (!talhao){
                return res.status(400).json({error: 'Talhão não encontrado'});               
            }

            const errors = v.validate({nome,localizacao,desc_talhao,qtda_ha}, filterValidator);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
            
            const [updated] = await Talhao.update({
                nome : nome, 
                localizacao: localizacao,
                desc_talhao: desc_talhao,
                qtda_ha: qtda_ha},                
                { 
                    where:{
                        id: id_talhao,
                        id_user:id_user                        
                    },
                }
            );
            if (updated) {
                const talhaoUpdated = await Talhao.findByPk(id_talhao);
                return res.json(talhaoUpdated);
            }else{
                console.log('Erro na atualização do Talhao');
                return res.status(400).json({Erro: 'Não foi possivel atualizar o Talhão'}); 
            }

            
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async deleteTalhao(req, res){
        try{
            const {id_user} = req.params;
            const {id_talhao} = req.params;    
            
            const scanTalhao = await Talhao.findByPk(id_talhao);
            if (!scanTalhao){
                return res.status(400).json({error: 'Talhão não encontrado'});               
            }
            const talhao = await Talhao.destroy({
                where: {
                   id: id_talhao,
                   id_user:id_user                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Talhão deletado'});
                }else{
                  console.log('Erro no delete do talhao');
                  return res.status(400).json({Erro: 'Não foi possivel deletar o Talhão'});
                }
             }, function(err){
                 console.log(err);
                 return res.status(400).json({Erro: 'Não foi possivel deletar o Talhão'}); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

}