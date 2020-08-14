const User = require("../models/User");
const TalhaoSafra = require("../models/TalhaoSafra");
const Aplicacao = require("../models/Aplicacao");


// validator
const Validator = require('fastest-validator');
const Talhao = require("../models/Talhao");
const v = new Validator();
const filterValidator = {
    cod_tipo_aplicacao:{min:1, type: 'number'},
    tipo_aplicacao: {max:25, min:1, type: 'string'},
    nro_tratamento: {type: 'number'},
    data_ini_aplicacao: {type: 'date', convert:true},
    data_fim_aplicacao: {type: 'date', convert:true},
    total_horas_trabalhadas: {min:1, type: 'number'},
    custo_hora: {min:1, type: 'number'},          
    custo_total_servico: {min:1, type: 'number'}
}

module.exports = {
    async store(req, res){
        const {id_user} = req.params;
        const {id_talhao_safra} = req.params;

        //const {nome, localizacao, desc_talhao, qtda_ha} = req.body;
        const cod_tipo_aplicacao = req.body.cod_tipo_aplicacao;
        const tipo_aplicacao = req.body.tipo_aplicacao.trim();
        const nro_tratamento = req.body.nro_tratamento;
        const data_ini_aplicacao = req.body.data_ini_aplicacao;
        const data_fim_aplicacao = req.body.data_fim_aplicacao;
        const total_horas_trabalhadas = req.body.total_horas_trabalhadas;
        const custo_hora = req.body.custo_hora;
        const custo_total_servico = req.body.custo_total_servico;
  
    
        //ver se user existe
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }

        //ver se talhao safra existe
        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
        if (!talhao_safra){
            return res.status(400).json({error: 'Talhao Safra não encontrada'});           
        }

        if (talhao_safra.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Talhao Safra selecionado não pertence ao usuario'});           
        }


        const errors = v.validate({cod_tipo_aplicacao,tipo_aplicacao,nro_tratamento,data_ini_aplicacao,data_fim_aplicacao,total_horas_trabalhadas,custo_hora,custo_total_servico}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const aplicacao = await Aplicacao.create({ 
            id_user,
            id_talhao_safra,
            cod_tipo_aplicacao,
            tipo_aplicacao,
            nro_tratamento,
            data_ini_aplicacao,
            data_fim_aplicacao,
            total_horas_trabalhadas,
            custo_hora,
            custo_total_servico   
        });

        return res.json(aplicacao);
    },


    async findAllAplicacoes(req, res){   
        const {id_user} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_aplicacoes} = req.params;


        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra, { //busca o safra e vincula os produtos
            include: {association: 'aplicacao'}
            
        });
        
        if (!talhao_safra){
            return res.status(400).json({error: 'Safra não encontrada'}); 
        }
        return res.json(talhao_safra);
    },

    
    async findOneAplicacoes(req, res){   
        const {id_user} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_aplicacao} = req.params;
                            
        const aplicacao = await Aplicacao.findOne(
            { 
                where:{
                    id: id_aplicacao,
                    id_user:id_user,
                    id_talhao_safra: id_talhao_safra
                },
            }
        );
        
        if (!aplicacao){
            return res.status(400).json({error: 'Não foi possivel encontrar a Aplicacão'}); 
        }

        return res.json(aplicacao);
    },


    async updateAplicacoes(req, res){
        try{
            const {id_user} = req.params;
            const {id_talhao_safra} = req.params;
            const {id_aplicacao} = req.params;

            const cod_tipo_aplicacao = req.body.cod_tipo_aplicacao;
            const tipo_aplicacao = req.body.tipo_aplicacao.trim();
            const nro_tratamento = req.body.nro_tratamento;
            const data_ini_aplicacao = req.body.data_ini_aplicacao;
            const data_fim_aplicacao = req.body.data_fim_aplicacao;
            const total_horas_trabalhadas = req.body.total_horas_trabalhadas;
            const custo_hora = req.body.custo_hora;
            const custo_total_servico = req.body.custo_total_servico;

            //ver se user existe
            const user = await User.findByPk(id_user);
            if (!user){
                return res.status(400).json({error: 'Usuário não encontrado'});           
            }

            //ver se talhao safra existe
            const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
            if (!talhao_safra){
                return res.status(400).json({error: 'Talhao Safra não encontrada'});           
            }

            if (talhao_safra.id_user != id_user){
                return res.status(400).json({error: 'Erro no cadastro. Talhao Safra selecionado não pertence ao usuario'});           
            }


            const errors = v.validate({cod_tipo_aplicacao,tipo_aplicacao,nro_tratamento,data_ini_aplicacao,data_fim_aplicacao,total_horas_trabalhadas,custo_hora,custo_total_servico}, filterValidator);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
            
            const [updated] = await Aplicacao.update({
                cod_tipo_aplicacao:cod_tipo_aplicacao,
                tipo_aplicacao:tipo_aplicacao,
                nro_tratamento:nro_tratamento,
                data_ini_aplicacao:data_ini_aplicacao,
                data_fim_aplicacao:data_fim_aplicacao,
                total_horas_trabalhadas:total_horas_trabalhadas,
                custo_hora:custo_hora,
                custo_total_servico:custo_total_servico 
            },                
                { 
                    where:{
                        id: id_aplicacao,
                        id_user:id_user,
                        id_talhao_safra: id_talhao_safra
                    },
                }
            );
            if (updated) {
                const aplicacaoUpdated = await Aplicacao.findByPk(id_aplicacao);
                return res.json(aplicacaoUpdated);
            }else{
                console.log('Erro na atualização da Aplicação');
                return res.status(400).json({Erro: 'Não foi possivel atualizar a Aplicacão'}); 
            }
      
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async deleteAplicacoes(req, res){
        try{
            const {id_user} = req.params;
            const {id_talhao_safra} = req.params;
            const {id_aplicacao} = req.params;    
            
            const scanAplicacao = await Aplicacao.findByPk(id_aplicacao);
            if (!scanAplicacao){
                return res.status(400).json({error: 'Aplicação não encontrada'});               
            }
            const aplicacao = await Aplicacao.destroy({
                where: {
                   id: id_aplicacao,
                   id_user:id_user,
                   id_talhao_safra:id_talhao_safra                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Aplicacão deletada'});
                }else{
                  console.log('Erro no delete da aplição');
                  return res.status(400).json({Erro: 'Não foi possivel deletar a Aplicação'});
                }
             }, function(err){
                 console.log(err);
                 return res.status(400).json({Erro: 'Não foi possivel deletar a Aplicação'}); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

}