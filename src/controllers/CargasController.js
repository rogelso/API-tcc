const User = require("../models/User");
const Safra = require("../models/Safra");
const TalhaoSafra = require("../models/TalhaoSafra");
const Carga = require("../models/Carga");


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator1 = {
    tipo_produto:{max:30, min:4, type: 'string'},
    data: {type: 'date', convert: true},
    destinatario: {min:1, max:30, type: 'string'},
    placa: {min:1, max:30, type: 'string'},
    nome_motorista: {max:30, min:2, type: 'string'},
    peso_liquido: {min:1, type: 'number'},
    total_descontos:{type: 'number'},
    peso_liquido_final: {min:1, type: 'number'},
    qtd_sacas_final: {min:1, type: 'number'}
}

const filterValidatorFrete = {
    cod_tipo_custo_frete:{min:1, type: 'number'},
    valor_unitario_frete:{min:1, type: 'number'},
    valor_total_frete:{min:1, type: 'number'},
    status_valor_frete: {min:1, max:30, type: 'string'}
}

const filterValidatorColheita = {
    cod_tipo_custo_colheita:{min:0, type: 'number'},
    valor_unitario_colheita:{min:1, type: 'number'},
    valor_colheita:{min:1, type: 'number'},
    status_valor_colheita: {min:1, max:30, type: 'string'}
}

require('str-trim');

module.exports = {

    async store(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_talhao_safra} = req.params;
        
            const tipo_produto = req.body.tipo_produto.trim();
            const data = req.body.data;
            const destinatario = req.body.destinatario.trim();
            const placa = req.body.placa.trim();
            const nome_motorista = req.body.nome_motorista.trim();
            const peso_liquido = req.body.peso_liquido;
            const total_descontos = req.body.total_descontos;          
            const peso_liquido_final = req.body.peso_liquido_final;
            const qtd_sacas_final = req.body.qtd_sacas_final;
            
            //ver se user existe so pra ter
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }
        
            //ver se talhao safra existe
            const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!talhao_safra){
                return res.status(400).json({error: 'Talhao Safra não encontrado'});           
            }
            if (talhao_safra.id_user != id_user){
                return res.status(400).json({error: 'Erro no cadastro. Talhão Safra selecionado não pertence ao usuário'});           
            }

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
            if (talhao_safra.id_safra != id_safra){
                return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
            }
            

            const errors = v.validate({tipo_produto,data,destinatario,placa, nome_motorista, peso_liquido,total_descontos, peso_liquido_final, qtd_sacas_final}, filterValidator1);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }

            const carga = await Carga.create({ 
                id_talhao_safra,
                id_user,
                id_safra,
                tipo_produto,
                data,
                destinatario,
                placa,
                nome_motorista,
                peso_liquido,
                total_descontos,
                peso_liquido_final,
                qtd_sacas_final
            });

            console.log('Carga Criada');
            return res.json(carga);
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    }, 

    async findAllCargasTalhao(req, res){   
        const {id_talhao_safra} = req.params;
        const {id_user} = req.params;
        const {id_safra} = req.params;
        
        //ver se user existe so pra ter
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }
     
        //ver se talhao safra existe
        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
        if (!talhao_safra){
            return res.status(400).json({error: 'Talhão Safra não encontrado'});           
        }
        if (talhao_safra.id_user != id_user){
            return res.status(400).json({error: 'Erro. Talhão Safra selecionado não pertence ao usuário'});           
        }

        //ver se safra existe
        const safra = await Safra.findByPk(id_safra);
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'});           
        }
        if (talhao_safra.id_safra != id_safra){
            return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
        }
        const cargas_talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra, { //busca o safra e vincula os produtos
            include: {association: 'cargas'}
            
        });
        
        if (!cargas_talhao_safra){
            return res.status(400).json({error: 'Nenhuma Carga não encontrada'}); 
        }
        return res.json(cargas_talhao_safra);
    },

    async findAllCargasSafra(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        
        //ver se user existe so pra ter
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }
     
        //ver se safra existe
        const safra = await Safra.findByPk(id_safra);
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'});           
        }

        const cargas_safra = await Carga.findAll({ 
            where:{
                id_user: id_user,
                id_safra: id_safra
            },
        });
        
        if (!cargas_safra){
            return res.status(400).json({error: 'Nenhuma Carga não encontrada'}); 
        }
        return res.json(cargas_safra);
    },


    async findOneCargas(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_carga} = req.params;
        
        //ver se user existe so pra ter
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }
     
        //ver se talhao safra existe
        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
        if (!talhao_safra){
            return res.status(400).json({error: 'Talhão Safra não encontrado'});           
        }
        if (talhao_safra.id_user != id_user){
            return res.status(400).json({error: 'Erro. Talhão Safra selecionado não pertence ao usuário'});           
        }

        //ver se safra existe
        const safra = await Safra.findByPk(id_safra);
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'});           
        }
        if (talhao_safra.id_safra != id_safra){
            return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
        }
       
        const carga = await Carga.findOne(
            { 
                where:{
                    id: id_carga,
                    id_talhao_safra: id_talhao_safra,
                    id_user: id_user
                },
            }
        );
        
        if (!carga){
            return res.status(400).json({error: 'Não foi possível encontrar a Carga'}); 
        }

        return res.json(carga);
    },

    
    async updateCarga(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_carga} = req.params;

            const tipo_produto = req.body.tipo_produto.trim();
            const data = req.body.data;
            const destinatario = req.body.destinatario.trim();
            const placa = req.body.placa.trim();
            const nome_motorista = req.body.nome_motorista.trim();
            const peso_liquido = req.body.peso_liquido;
            const total_descontos = req.body.total_descontos;          
            const peso_liquido_final = req.body.peso_liquido_final;
            const qtd_sacas_final = req.body.qtd_sacas_final;
        

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

            const errors = v.validate({tipo_produto,data,destinatario,placa, nome_motorista, peso_liquido,total_descontos, peso_liquido_final, qtd_sacas_final}, filterValidator1);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
                        
            const [updated] = await Carga.update({
                tipo_produto:tipo_produto,
                data:data,
                destinatario:destinatario,
                placa:placa,
                nome_motorista:nome_motorista,
                peso_liquido:peso_liquido,
                total_descontos:total_descontos,
                peso_liquido_final:peso_liquido_final,
                qtd_sacas_final:qtd_sacas_final},                
                { 
                    where:{
                        id: id_carga,
                        id_user:id_user,
                        id_safra: id_safra,                  
                    },
                }
            );
            if (updated) {
                const cargaUpdated = await Carga.findByPk(id_carga);
                return res.json(cargaUpdated);
            }else{
                console.log('Erro na atualização da Carga');
                return res.status(400).json({Erro: 'Não foi possivel atualizar o regitro da Carga '}); 
            }
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

    async updateFreteCarga(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            //const {id_talhao_safra} = req.params;
            const {id_carga} = req.params;

            const cod_tipo_custo_frete = req.body.cod_tipo_custo_frete;
            const valor_unitario_frete = parseFloat(req.body.valor_unitario_frete.toFixed(2));
            const valor_total_frete = parseFloat(req.body.valor_total_frete.toFixed(2));
            const status_valor_frete = req.body.status_valor_frete.trim();
        

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
            // if (talhao_safra.id_safra != id_safra){
            //     return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
            // }

            const errors = v.validate({cod_tipo_custo_frete, valor_unitario_frete, valor_total_frete, status_valor_frete }, filterValidatorFrete);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
                        
            const [updated] = await Carga.update({
                cod_tipo_custo_frete : cod_tipo_custo_frete,
                valor_unitario_frete:valor_unitario_frete,
                valor_total_frete:valor_total_frete,
                status_valor_frete:status_valor_frete},                
                { 
                    where:{
                        id: id_carga,
                        id_user:id_user,
                        id_safra: id_safra,                  
                    },
                }
            );
            if (updated) {
                const cargaUpdated = await Carga.findByPk(id_carga);
                return res.json(cargaUpdated);
            }else{
                console.log('Erro na atualização da Carga');
                return res.status(400).json({Erro: 'Não foi possivel atualizar o regitro da Carga '}); 
            }
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

    async updateColheitaCarga(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            //const {id_talhao_safra} = req.params;
            const {id_carga} = req.params;

            const cod_tipo_custo_colheita = req.body.cod_tipo_custo_colheita;
            const valor_unitario_colheita = parseFloat(req.body.valor_unitario_colheita.toFixed(2));
            const valor_colheita = parseFloat(req.body.valor_colheita.toFixed(2));
            const status_valor_colheita = req.body.status_valor_colheita.trim();
        

            //ver se user existe so pra ter
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }
        

            //ver se safra existe
            const safra = await Safra.findByPk(id_safra);
            if (!safra){
                return res.status(400).json({error: 'Safra não encontrada'});           
            }
            // if (talhao_safra.id_safra != id_safra){
            //     return res.status(400).json({error: 'O talhão selecionado não pertence a safra correspondente'});           
            // }

            const errors = v.validate({cod_tipo_custo_colheita, valor_unitario_colheita, valor_colheita, status_valor_colheita }, filterValidatorColheita);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
                        
            const [updated] = await Carga.update({
                cod_tipo_custo_colheita : cod_tipo_custo_colheita,
                valor_unitario_colheita: valor_unitario_colheita,
                valor_colheita: valor_colheita,
                status_valor_colheita: status_valor_colheita},                
                { 
                    where:{
                        id: id_carga,
                        id_user:id_user,
                        id_safra: id_safra,                  
                    },
                }
            );
            if (updated) {
                const cargaUpdated = await Carga.findByPk(id_carga);
                return res.json(cargaUpdated);
            }else{
                console.log('Erro na atualização da Carga');
                return res.status(400).json({Erro: 'Não foi possivel atualizar o regitro da Carga '}); 
            }
        
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },



    async deleteCarga(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_carga} = req.params;    
            
            const scanCarga = await Carga.findByPk(id_carga);
            if (!scanCarga){
                return res.status(400).json({error: 'Carga não encontrada'});               
            }
            const carga = await Carga.destroy({
                where: {
                   id: id_carga,
                   id_safra:id_safra,
                   id_user:id_user                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Carga deletada'});
                }else{
                  console.log('Erro no delete da Carga');
                  return res.status(400).json({Erro: 'Não foi possivel deletar a Carga'});
                }
             }, function(err){
                 console.log(err);
                 return res.status(400).json({Erro: 'Não foi possível deletar a Carga'}); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },
    
}