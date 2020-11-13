const User = require("../models/User");
const Safra = require("../models/Safra");
const ControleFinanceiro = require("../models/ControleFinanceiro");


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
        const errors = v.validate({ano_safra}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const safra = await Safra.create({ 
            id_user,
            ano_safra   
        });

        if (safra){
            var id_safra = safra.id;
            var receita_bruta_total = 0;
            var receita_bruta_total = 0;
            var deducoes_impostos_total= 0;
            var receita_liquida_total = 0;
            var custos_variaveis_total = 0;
            var lucro_bruto = 0;
            var gastos_fixos_operacionais = 0;         
            var lucro_liquido = 0;
            var custos_depreciacoes = 0;
            var lucro_saca_mcu = 0;
            var ponto_equilibrio = 0;
            var margem_seguranca = 0;
            
            controle_financeiro = await ControleFinanceiro.create({
                id_user, 
                id_safra,
                receita_bruta_total,
                deducoes_impostos_total,
                receita_liquida_total,
                custos_variaveis_total,
                lucro_bruto,
                gastos_fixos_operacionais,
                lucro_liquido,
                custos_depreciacoes,
                lucro_saca_mcu,
                ponto_equilibrio,
                margem_seguranca
            });
        
            if(controle_financeiro){
                //var _idSafra = safra.id;
                //var _anosafra = safra.ano_safra;
                //return res.json({id:safra.id,ano_safra:safra.ano_safra});
                return res.json([{id:safra.id,id_user:safra.id_user,ano_safra:safra.ano_safra,custos_fixos_totais:safra.custos_fixos_totais,manutencoesMaq:safra.manutencoes_maq}]);

            }else{
                return res.json({error: 'Ocorreu algo de errado'})
            }
        }
    }, 

    async findAllSafrasUser(req, res){   
        const {id_user} = req.params;
                
        const user = await User.findByPk(id_user, {  //busca o user e vincula as safras
            include: {association: 'safras_user'}
        });
        
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'}); 
        }
        return res.json(user['safras_user']);
    },


    async findOneSafrasUser(req, res){   
        const {id_safra} = req.params;
        const {id_user} = req.params;

              
        const safra = await Safra.findOne(  //era findbypk
            {  
                attributes: ['id','id_user', 'ano_safra','custos_fixos_totais'],
                where:{
                    id: id_safra,
                    id_user:id_user                        
                },
            }
        );
        

        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'}); 
        }

        return res.json([safra]);
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
                                
                //== ATUALIZA CONTROLE FINANCEIRO==//
                const scan_controle_financeiro = await ControleFinanceiro.findOne({
                    where:{
                        id_user:id_user, 
                        id_safra:id_safra}
                });
                const  custos_fixos_total = scan_controle_financeiro.gastos_fixos_operacionais + custos_fixos_add;                
                
                const [update_controle_financeiro] = await ControleFinanceiro.update({
                    gastos_fixos_operacionais : custos_fixos_total
                },                
                    { 
                        where:{
                            id_user:id_user,
                            id_safra:id_safra                        
                        },
                    }
                );
                if (update_controle_financeiro) {
                    console.log('atualizado controle financeiro');
                    return res.json(safraUpdated);               
                }else{
                    console.log('Erro na atualização do controle financeiro');
                    return res.status(400).json({Erro: 'Não foi possivel atualizar o controle financeiro'}); 
                }
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
                                
                //== ATUALIZA CONTROLE FINANCEIRO==//
                const scan_controle_financeiro = await ControleFinanceiro.findOne({
                    where:{
                        id_user:id_user, 
                        id_safra:id_safra
                    }
                });
                const  custos_fixos_total = scan_controle_financeiro.gastos_fixos_operacionais - custos_fixos_remove;                
                
                const [update_controle_financeiro] = await ControleFinanceiro.update({
                    gastos_fixos_operacionais : custos_fixos_total
                },                
                    { 
                        where:{
                            id_user:id_user,
                            id_safra:id_safra                        
                        },
                    }
                );
                if (update_controle_financeiro) {
                    console.log('atualizado controle financeiro');
                    return res.json(safraUpdated);               
                }else{
                    console.log('Erro na atualização do controle financeiro');
                    return res.status(400).json({Erro: 'Não foi possivel atualizar o controle financeiro'}); 
                }                
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
                //== ATUALIZA CONTROLE FINANCEIRO==//
                const scan_controle_financeiro = await ControleFinanceiro.findOne({
                    where:{
                        id_user:id_user, 
                        id_safra:id_safra
                    }
                });
                const  custos_variaveis_totais = scan_controle_financeiro.custos_variaveis_total + manutencoes_maq_add;                
                
                const [update_controle_financeiro] = await ControleFinanceiro.update({
                    custos_variaveis_total : custos_variaveis_totais
                },                
                    { 
                        where:{
                            id_user:id_user,
                            id_safra:id_safra                        
                        },
                    }
                );
                if (update_controle_financeiro) {
                    console.log('atualizado controle financeiro');
                    return res.json(safraUpdated);               
                }else{
                    console.log('Erro na atualização do controle financeiro');
                    return res.status(400).json({Erro: 'Não foi possivel atualizar o controle financeiro'}); 
                } 
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
            }else{
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
                //== ATUALIZA CONTROLE FINANCEIRO==//
                const scan_controle_financeiro = await ControleFinanceiro.findOne({
                    where:{
                        id_user:id_user, 
                        id_safra:id_safra
                    }
                });
                const  custos_variaveis_totais = scan_controle_financeiro.custos_variaveis_total - manutencoes_maq_remove;                
                
                const [update_controle_financeiro] = await ControleFinanceiro.update({
                    custos_variaveis_total : custos_variaveis_totais
                },                
                    { 
                        where:{
                            id_user:id_user,
                            id_safra:id_safra                        
                        },
                    }
                );
                if (update_controle_financeiro) {
                    console.log('atualizado controle financeiro');
                    return res.json(safraUpdated);               
                }else{
                    console.log('Erro na atualização do controle financeiro');
                    return res.status(400).json({Erro: 'Não foi possivel atualizar o controle financeiro'}); 
                }
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