const User = require("../models/User");
const Safra = require("../models/Safra");

// validator
const Validator = require('fastest-validator');
const v = new Validator();

 require('str-trim');

module.exports = {

    async store(req, res){
        const {id_user} = req.params;
        //const {nome, localizacao, desc_talhao, qtda_ha} = req.body;
        const ano_safra = req.body.ano_safra.trim();
        
        //ver se user existe
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }

        const filterValidator = {
            ano_safra: {max:30, min:7, type: 'string'},
        }
        const errors = v.validate(req.body, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const safra = await Safra.create({ 
            id_user,
            ano_safra   
        });

        return res.json(safra);
    }, 

    async findAllSafrasUser(req, res){   
        const {id_user} = req.params;
                
        const user = await User.findByPk(id_user, {  //busca o user e vincula as safras
            include: {association: 'safras_user'}
        });
        
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'}); 
            //passa um usuario invalido e não acha nenhuma safra
        }
        return res.json(user);
    },


    async findOneSafrasUser(req, res){   
        const {id_safra} = req.params;
              
        const safra = await Safra.findByPk(id_safra);
        

        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'}); 
        }

        return res.json(safra);
    },


    async addCustosFixosSafra(req, res){
        try{
            const {id_safra} = req.params;
            const {id_user} = req.params;
            const custos_fixos_add = req.body.custos_fixos_totais;
            

            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});               
            } else{
                const current_value = safra.custos_fixos_totais;
                custos_fixos_totais = current_value + custos_fixos_add;
                custos_fixos_totais = parseFloat(custos_fixos_totais.toFixed(2));

            }
            const [updated] = await Safra.update({
                custos_fixos_totais : custos_fixos_totais},                
                { 
                    where:{
                        id: id_safra,
                        id_user:id_user                        
                    },
                }
            );
            if (updated) {
                const safraUpdated = await Safra.findByPk(id_safra);
                return res.json(safraUpdated);
            }else{
                console.log('Erro na atualização dos custos fixos');
                return res.status(400).json({Erro: 'Não foi possivel atualizar os custos fixos'}); 
            }
            
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

    async removeCustosFixosSafra(req, res){
        try{
            const {id_safra} = req.params;
            const {id_user} = req.params;
            const custos_fixos_remove = req.body.custos_fixos_totais;
            

            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});               
            } else{
                const current_value = safra.custos_fixos_totais;
                custos_fixos_totais = current_value - custos_fixos_remove;
                custos_fixos_totais = parseFloat(custos_fixos_totais.toFixed(2));
            }
            const [updated] = await Safra.update({
                custos_fixos_totais : custos_fixos_totais},                
                { 
                    where:{
                        id: id_safra,
                        id_user:id_user                        
                    },
                }
            );
            if (updated) {
                const safraUpdated = await Safra.findByPk(id_safra);
                return res.json(safraUpdated);
            }else{
                console.log('Erro na atualização dos custos fixos');
                return res.status(400).json({Erro: 'Não foi possivel atualizar os custos fixos'}); 
            }
            
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

    async addCustosManutencoesMaq(req, res){
        try{
            const {id_safra} = req.params;
            const {id_user} = req.params;
            const manutencoes_maq_add = req.body.manutencoes_maq;
            

            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});               
            } else{
                const current_value = safra.manutencoes_maq;
                manutencoes_maq = current_value + manutencoes_maq_add;
                manutencoes_maq = parseFloat(manutencoes_maq.toFixed(2));
            }
            const [updated] = await Safra.update({
                manutencoes_maq : manutencoes_maq},                
                { 
                    where:{
                        id: id_safra,
                        id_user:id_user                        
                    },
                }
            );
            if (updated) {
                const safraUpdated = await Safra.findByPk(id_safra);
                return res.json(safraUpdated);
            }else{
                console.log('Erro na atualização dos custos de Manutencões de Máquinas');
                return res.status(400).json({Erro: 'Não foi possivel atualizar os custos de Manutencões de Máquinas'}); 
            }
            
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

    async removeCustosManutencoesMaq(req, res){
        try{
            const {id_safra} = req.params;
            const {id_user} = req.params;
            const manutencoes_maq_remove = req.body.manutencoes_maq;
            

            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});               
            } else{
                const current_value = safra.manutencoes_maq;
                manutencoes_maq = current_value - manutencoes_maq_remove;
                manutencoes_maq = parseFloat(manutencoes_maq.toFixed(2));    
            }
            const [updated] = await Safra.update({
                manutencoes_maq : manutencoes_maq},                
                { 
                    where:{
                        id: id_safra,
                        id_user:id_user                        
                    },
                }
            );
            if (updated) {
                const safraUpdated = await Safra.findByPk(id_safra);
                return res.json(safraUpdated);
            }else{
                console.log('Erro na atualização dos custos fixos');
                return res.status(400).json({Erro: 'Não foi possivel atualizar os custos fixos'}); 
            }
            
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async deleteSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;    
            
            const scanSafra = await Safra.findByPk(id_safra);
            if (!scanSafra){
                return res.status(400).json({error: 'Safra não encontrada'});               
            }
            const safra = await Safra.destroy({
                where: {
                   id: id_safra,
                   id_user:id_user                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Safra deletada'});
                }else{
                  console.log('Erro no delete da safra');
                  return res.status(400).json({Erro: 'Não foi possivel deletar a Safra'});
                }
             }, function(err){
                 console.log(err);
                 return res.status(400).json({Erro: 'Não foi possivel deletar a Safra'}); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },
    
}