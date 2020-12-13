const User = require("../models/User");
const Safra = require("../models/Safra");
const Venda = require("../models/Venda");
const Op = require('sequelize');
const ControleFinanceiro = require("../models/ControleFinanceiro");


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    tipo_produto:{max:30, min:4, type: 'string'},
    data_venda: {type: 'date', convert: true},
    qtd_sacas_venda: {min:1, type: 'number'},
    preco_unitario: {min:1, type: 'number'},
    deducoes_impostos: {type: 'number'},          
    receita: {min:1, type: 'number'}
}

module.exports = {
    async store(req, res){
        const {id_user} = req.params;
        const {id_safra} = req.params;
    
        const tipo_produto = req.body.tipo_produto.trim();
        const data_venda = req.body.data_venda;
        const qtd_sacas_venda = req.body.qtd_sacas_venda;
        const preco_unitario = req.body.preco_unitario;
        const deducoes_impostos = req.body.deducoes_impostos;
        const receita = req.body.receita;
    
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

        if (safra.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Safra selecionada não pertence ao usuario'});           
        }

        // ##verificar quantidades de sacas disponiveis para venda ##


        const errors = v.validate({tipo_produto,data_venda,qtd_sacas_venda,preco_unitario,deducoes_impostos,receita}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const venda = await Venda.create({ 
            id_user,
            id_safra,
            tipo_produto,
            data_venda,
            qtd_sacas_venda,
            preco_unitario,
            deducoes_impostos,
            receita
        });

        if(venda){ 
            const scan_controle_financeiro = await ControleFinanceiro.findOne({
                where:{
                    id_user:id_user, 
                    id_safra:id_safra}
            });
            if (scan_controle_financeiro){
                const  receita_bruta_total = scan_controle_financeiro.receita_bruta_total + venda.receita;
                const  deducoes_impostos_total = scan_controle_financeiro.deducoes_impostos_total + venda.deducoes_impostos;
            
                const receita_liquida_total = receita_bruta_total - deducoes_impostos_total;
            
                const [update_controle_financeiro] = await ControleFinanceiro.update({
                    receita_bruta_total : receita_bruta_total,
                    deducoes_impostos_total: deducoes_impostos_total,
                    receita_liquida_total: receita_liquida_total
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
                    return res.json(venda);                
                }else{
                    console.log('Erro na atualização do controle financeiro');
                    return res.status(400).json({Erro: 'Não foi possivel atualizar o controle financeiro'}); 
                }
            }
        }
    },


    async findAllVendasSafra(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_venda} = req.params;

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
        

        const vendas = await Safra.findByPk(id_safra, { //busca o safra e vincula as vendas
            include: {association: 'vendas'} 
        });
        
        if (!vendas){
            return res.status(400).json({error: 'Não foi possível encontrar as vendas'}); 
        }
        return res.json(vendas);
    },

    
    async findAllVendasByTipoProduto(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {tipo_produto} = req.params;

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
        

        const vendas = await Safra.findByPk(id_safra, { //busca o safra e vincula as vendas
            include: {association: 'vendas', where: {tipo_produto: tipo_produto}} 
        });
        
        if (!vendas){
            return res.status(400).json({error: 'Não foi possível encontrar as vendas'}); 
        }
        return res.json(vendas);
    },

    
    async findOneVendaSafra(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_venda} = req.params;
                            
        const venda = await Venda.findOne(
            { 
                where:{
                    id: id_venda,
                    id_user:id_user,
                    id_safra: id_safra
                },
            }
        );
        if (!venda){
            return res.status(400).json({error: 'Não foi possivel carregar as informações da venda'}); 
        }

        return res.json(venda);
    },


    async updateVendaSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_venda} = req.params;

            const tipo_produto = req.body.tipo_produto.trim();
            const data_venda = req.body.data_venda;
            const qtd_sacas_venda = req.body.qtd_sacas_venda;
            const preco_unitario = req.body.preco_unitario;
            const deducoes_impostos = req.body.deducoes_impostos;
            const receita = req.body.receita;

            const venda = await Venda.findByPk(id_venda);
            if (!venda){
                return res.status(400).json({error: 'Venda não encontrada'});               
            }

            const errors = v.validate({tipo_produto,data_venda,qtd_sacas_venda,preco_unitario,deducoes_impostos,receita}, filterValidator);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
            
            const [updated] = await Venda.update({
                tipo_produto: tipo_produto,
                data_venda: data_venda ,
                qtd_sacas_venda: qtd_sacas_venda,
                preco_unitario: preco_unitario,
                deducoes_impostos: deducoes_impostos,
                receita: receita
            },                
                { 
                    where:{
                        id: id_venda,
                        id_user:id_user,
                        id_safra: id_safra
                    },
                }
            );
            if (updated) {
                const vendaUpdated = await Venda.findByPk(id_venda);
                
                //== ATUALIZA CONTROLE FINANCEIRO==//
                const scan_controle_financeiro = await ControleFinanceiro.findOne({
                    where:{
                        id_user:id_user, 
                        id_safra:id_safra}
                });
                const  receita_bruta_total = (scan_controle_financeiro.receita_bruta_total - venda.receita) + receita;
                const  deducoes_impostos_total = (scan_controle_financeiro.deducoes_impostos_total - venda.deducoes_impostos) + deducoes_impostos;
                
                const receita_liquida_total = receita_bruta_total - deducoes_impostos_total;
                
                const [update_controle_financeiro] = await ControleFinanceiro.update({
                    receita_bruta_total : receita_bruta_total,
                    deducoes_impostos_total: deducoes_impostos_total,
                    receita_liquida_total: receita_liquida_total
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
                        return res.json(vendaUpdated);               
                    }else{
                        console.log('Erro na atualização do controle financeiro');
                        return res.status(400).json({Erro: 'Não foi possivel atualizar o controle financeiro'}); 
                    }                                                 
                
            }else{
                console.log('Erro na atualização da Venda');
                return res.status(400).json({Erro: 'Não foi possível atualizar a Venda'}); 
            }
      
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async deleteVendaSafra(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_venda} = req.params;    
            
            const scanVenda = await Venda.findByPk(id_venda);
            if (!scanVenda){
                return res.status(400).json({error: 'Venda não encontrada'});               
            }

            //== ATUALIZA CONTROLE FINANCEIRO==//
            const scan_controle_financeiro = await ControleFinanceiro.findOne({
                where:{
                    id_user:id_user, 
                    id_safra:id_safra}
            });

            const venda = await Venda.destroy({
                where: {
                   id: id_venda,
                   id_user:id_user,
                   id_safra:id_safra                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                    console.log('Deleted successfully');             
                    //== ATUALIZA CONTROLE FINANCEIRO==//                 
                    const  receita_bruta_total = parseFloat(scan_controle_financeiro.receita_bruta_total - scanVenda.receita);
                    const  deducoes_impostos_total = parseFloat(scan_controle_financeiro.deducoes_impostos_total - scanVenda.deducoes_impostos);
                    
                    const receita_liquida_total = parseFloat(receita_bruta_total - deducoes_impostos_total);
                    
                    const update_controle_financeiro = ControleFinanceiro.update({
                    receita_bruta_total : receita_bruta_total,
                    deducoes_impostos_total: deducoes_impostos_total,
                    receita_liquida_total: receita_liquida_total
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
                        return res.status(200).json({sucesso: 'Venda deletada, Dados do Controle Financeiro atualizados.'});
                    }else{
                        console.log('Não foi possivel atualizar o controle financeiro');
                        return res.status(400).json({Erro: 'Não foi possivel atualizar o controle financeiro'}); 
                    }  
                }else{
                  console.log('Erro no delete da Venda');
                  return res.status(400).json({Erro: 'Não foi possivel deletar a Venda'});
                }
             }, function(err){
                 console.log(err);
                 return res.status(400).json({Erro: 'Não foi possível deletar a Venda'}); 
             });
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },

}