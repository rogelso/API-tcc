const User = require("../models/User");
const Safra = require("../models/Safra");
const Talhao = require("../models/Talhao");
const TalhaoSafra = require("../models/TalhaoSafra");


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    tipo_cultivo:{max:30, min:4, type: 'string'}
}
const filterValidatorPrepSolo = {
    data_descecacao:{type: 'date', convert: true}
}
const filterValidatorPlantio = {
    data_ini_plantio:{type: 'date', convert: true},
    data_fim_plantio:{type: 'date', convert: true},
    valor_hora_plantio:{min:1, type: 'number'},
    total_horas_plantio: {min:1, type: 'number'},
    custo_servico_plantio: {min:1, type: 'number'},
}
const filterValidatorColheita = {
    data_ini_colheita:{type: 'date', convert: true},
    data_fim_colheita:{type: 'date', convert: true},
    operador_colheita:{max:30, min:4, type: 'string'}
}
const filterValidatorStatus = {
    status:{type: 'number'}
}


module.exports = {
    async store(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao} = req.params;

            const tipo_cultivo = req.body.tipo_cultivo.trim();
        
            //ver se user existe
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
    
            //ver se talhao existe
            const talhao = await Talhao.findByPk(id_talhao);
            if (!talhao){
                return res.status(400).json({error: 'Talhão não encontrado'});           
            }
 
            if (safra.id_user != id_user){
                return res.status(400).json({error: 'Erro no cadastro. Safra selecionada não pertence ao usuário'});           
            }
            if (talhao.id_user != id_user){
                return res.status(400).json({error: 'Erro no cadastro. Talhao selecionado não pertence ao usuário'});           
            }
            

            const [safra_talhao] = await TalhaoSafra.findAll(
            { 
                where:{
                    id_user:id_user,
                    id_safra: id_safra,
                    id_talhao: id_talhao
                },
            });

            if (safra_talhao != null){
                return res.status(400).json({error: 'Esse Talhão já está sendo cultivado nessa Safra'});           
            }
            
            const talhao_safra = await TalhaoSafra.create({ 
                id_user: id_user,
                id_safra: id_safra,
                id_talhao: id_talhao,
                tipo_cultivo: tipo_cultivo,
                status: 0  
            });
            return res.json(talhao_safra);
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },



    async findAllTalhoesSafra(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;


        //ver se user existe
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }

        //ver se safra existe
        const safra = await Safra.findByPk(id_safra);
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'});           
        }

        const talhoes_safra = await TalhaoSafra.findAll({
            where:{
                id_user:id_user,
                id_safra: id_safra
            },
        });
        
        return res.json(talhoes_safra);
    },


    async findOneTalhoesSafra(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;


   
        const talhao_safra = await TalhaoSafra.findOne({
            where:{
                id: id_talhao_safra,
                id_user:id_user,
                id_safra: id_safra
            },
        });
        
        if (!talhao_safra){
            return res.status(400).json({error: 'Não foi possivel encontrar o Talhão da Safra'}); 
        }
        return res.json(talhao_safra);
    },

    
    async updatePreparoSoloTalhaoSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;

            const data_descecacao = req.body.data_descecacao;
        
            //ver se user existe
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
    
            //ver se talhao safra existe
            const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!talhao_safra){
                return res.status(400).json({error: 'Talhão Safra não encontrado'});           
            }
            if (talhao_safra.id_user != id_user){
                return res.status(400).json({error: 'Erro na atualização. Talhao Safra selecionado não pertence ao usuário'});           
            }

            const errors = v.validate({data_descecacao}, filterValidatorPrepSolo);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
                        
            const [updated] = await TalhaoSafra.update({
                data_descecacao : data_descecacao},                
                { 
                    where:{
                        id: id_talhao_safra,
                        id_user:id_user,
                        id_safra: id_safra                  
                    },
                }
            );
            if (updated) {
                const talhaoSafraUpdated = await TalhaoSafra.findByPk(id_talhao_safra);
                return res.json(talhaoSafraUpdated);
            }else{
                console.log('Erro na atualização da data de descecação');
                return res.status(400).json({Erro: 'Não foi possivel atualizar a data de descecação'}); 
            }
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    
    async updatePlantioTalhaoSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;

            const data_ini_plantio = req.body.data_ini_plantio;
            const data_fim_plantio = req.body.data_fim_plantio;
            const valor_hora_plantio = req.body.valor_hora_plantio;
            const total_horas_plantio = req.body.total_horas_plantio;
            const custo_servico_plantio = req.body.custo_servico_plantio;

            //ver se user existe
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
    
            //ver se talhao safra existe
            const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!talhao_safra){
                return res.status(400).json({error: 'Talhão Safra não encontrado'});           
            }
            if (talhao_safra.id_user != id_user){
                return res.status(400).json({error: 'Erro na atualização. Talhao Safra selecionado não pertence ao usuário'});           
            }

            const errors = v.validate({data_ini_plantio,data_fim_plantio,valor_hora_plantio,total_horas_plantio,custo_servico_plantio}, filterValidatorPlantio);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
                        
            const [updated] = await TalhaoSafra.update({
                data_ini_plantio : data_ini_plantio,
                data_fim_plantio : data_fim_plantio,
                valor_hora_plantio : valor_hora_plantio,
                total_horas_plantio : total_horas_plantio,
                custo_servico_plantio : custo_servico_plantio},                
                { 
                    where:{
                        id: id_talhao_safra,
                        id_user:id_user,
                        id_safra: id_safra                  
                    },
                }
            );
            if (updated) {
                const talhaoSafraUpdated = await TalhaoSafra.findByPk(id_talhao_safra);
                return res.json(talhaoSafraUpdated);
            }else{
                console.log('Erro na atualização do plantio');
                return res.status(400).json({Erro: 'Não foi possivel atualizar os Dados do Plantio'}); 
            }
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async updateColheitaTalhaoSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;

            const data_ini_colheita = req.body.data_ini_colheita;
            const data_fim_colheita = req.body.data_fim_colheita;
            const operador_colheita = req.body.operador_colheita.trim();
            

            //ver se user existe
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
    
            //ver se talhao safra existe
            const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!talhao_safra){
                return res.status(400).json({error: 'Talhão Safra não encontrado'});           
            }
            if (talhao_safra.id_user != id_user){
                return res.status(400).json({error: 'Erro na atualização. Talhao Safra selecionado não pertence ao usuário'});           
            }

            const errors = v.validate({data_ini_colheita,data_fim_colheita,operador_colheita}, filterValidatorColheita);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
                        
            const [updated] = await TalhaoSafra.update({
                data_ini_colheita : data_ini_colheita,
                data_fim_colheita : data_fim_colheita,
                operador_colheita : operador_colheita},                
                { 
                    where:{
                        id: id_talhao_safra,
                        id_user:id_user,
                        id_safra: id_safra                  
                    },
                }
            );
            if (updated) {
                const talhaoSafraUpdated = await TalhaoSafra.findByPk(id_talhao_safra);
                return res.json(talhaoSafraUpdated);
            }else{
                console.log('Erro na atualização do plantio');
                return res.status(400).json({Erro: 'Não foi possivel atualizar os Dados do Plantio'}); 
            }
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async updateStatusTalhaoSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;

            const status = req.body.status;
        
            //ver se user existe
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
    
            //ver se talhao safra existe
            const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!talhao_safra){
                return res.status(400).json({error: 'Talhão Safra não encontrado'});           
            }
            if (talhao_safra.id_user != id_user){
                return res.status(400).json({error: 'Erro na atualização. Talhao Safra selecionado não pertence ao usuário'});           
            }

            const errors = v.validate({status}, filterValidatorStatus);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
                        
            const [updated] = await TalhaoSafra.update({
                status : status},                
                { 
                    where:{
                        id: id_talhao_safra,
                        id_user:id_user,
                        id_safra: id_safra                  
                    },
                }
            );
            if (updated) {
                const talhaoSafraUpdated = await TalhaoSafra.findByPk(id_talhao_safra);
                return res.json(talhaoSafraUpdated);
            }else{
                console.log('Erro na atualização da data de descecação');
                return res.status(400).json({Erro: 'Não foi possivel atualizar a data de descecação'}); 
            }
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async deleteTalhoesSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;    
            
            const scanTalhaoSafra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!scanTalhaoSafra){
                return res.status(400).json({error: 'Talhão Safra não encontrado'});               
            }
            const talhao_safra = await TalhaoSafra.destroy({
                where: {
                   id: id_talhao_safra,
                   id_user:id_user,
                   id_safra:id_safra                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Cultivo do Talhao da Safra deletado'});
                }else{
                  console.log('Erro no delete do produto');
                  return res.status(400).json({Erro: 'Não foi possivel o cultivo do Talhao da Safra'});
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





