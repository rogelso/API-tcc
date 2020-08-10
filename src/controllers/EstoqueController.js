const User = require("../models/User");
const Safra = require("../models/Safra");
const Estoque = require("../models/Estoque");


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    nome_produto:{max:30, min:4, type: 'string'},
    cod_tipo_produto: {min:1, type: 'number'},
    variedade_insumo: {max:30, min:4, type: 'string'},
    qtd_adquirida: {min:1, type: 'number'},
    unidade: {max:30, min:2, type: 'string'},
    kg_sc: {min:1, type: 'number'},          
    valor_unitario: {min:1, type: 'number'},
    valor_total: {min:1, type: 'number'},
    qtd_disponivel: {min:4, type: 'number'},
    data_compra: {type: 'date', convert: true},

}

module.exports = {
    async store(req, res){
        const {id_user} = req.params;
        const {id_safra} = req.params;

        //const {nome, localizacao, desc_talhao, qtda_ha} = req.body;
        const nome_produto = req.body.nome_produto.trim();
        const cod_tipo_produto = req.body.cod_tipo_produto;
        const variedade_insumo = req.body.variedade_insumo.trim();
        const qtd_adquirida = req.body.qtd_adquirida;
        const unidade = req.body.unidade.trim();
        const kg_sc = req.body.kg_sc;
        const valor_unitario = req.body.valor_unitario;
        const valor_total = req.body.valor_total;
        const data_compra = req.body.data_compra;
        const qtd_disponivel = req.body.qtd_disponivel;
    
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


        const errors = v.validate({nome_produto,cod_tipo_produto,variedade_insumo,qtd_adquirida,unidade,kg_sc,valor_unitario,valor_total,data_compra,qtd_disponivel}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const estoque = await Estoque.create({ 
            id_user,
            id_safra,
            nome_produto,
            cod_tipo_produto,
            variedade_insumo,
            qtd_adquirida,
            unidade,
            kg_sc,
            valor_unitario,
            valor_total,
            data_compra,
            qtd_disponivel    
        });

        return res.json(estoque);
    },


    async findAllProdutosSafra(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;


        const safra = await Safra.findByPk(id_safra, { //busca o safra e vincula os produtos
            include: {association: 'produtos'}
            
        });
        
        if (!safra){
            return res.status(400).json({error: 'Safra não encontrada'}); 
        }
        return res.json(safra);
    },

    
    async findOneProdutosSafra(req, res){   
        const {id_user} = req.params;
        const {id_safra} = req.params;
        const {id_produto} = req.params;
                            
        const produtos = await Estoque.findOne(
            { 
                where:{
                    id: id_produto,
                    id_user:id_user,
                    id_safra: id_safra
                },
            }
        );
        
        if (!produtos){
            return res.status(400).json({error: 'Não foi possivel encontrar o produto'}); 
        }

        return res.json(produtos);
    },


    async updateProduto(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_produto} = req.params;

            const nome_produto = req.body.nome_produto.trim();
            const cod_tipo_produto = req.body.cod_tipo_produto;
            const variedade_insumo = req.body.variedade_insumo.trim();
            const qtd_adquirida = req.body.qtd_adquirida;
            const unidade = req.body.unidade.trim();
            const kg_sc = req.body.kg_sc;
            const valor_unitario = req.body.valor_unitario;
            const valor_total = req.body.valor_total;
            const data_compra = req.body.data_compra;
            const qtd_disponivel = req.body.qtd_disponivel;

            const produto = await Estoque.findByPk(id_produto);
            if (!produto){
                return res.status(400).json({error: 'Produto não encontrado'});               
            }

            const errors = v.validate({nome_produto,cod_tipo_produto,variedade_insumo,qtd_adquirida,unidade,kg_sc,valor_unitario,valor_total,data_compra,qtd_disponivel}, filterValidator);
            if (Array.isArray(errors) && errors.length){
                return res.status(400).json(errors);
            }
            
            const [updated] = await Estoque.update({
                nome_produto:nome_produto,
                cod_tipo_produto:cod_tipo_produto,
                variedade_insumo:variedade_insumo,
                qtd_adquirida:qtd_adquirida,
                unidade:unidade,
                kg_sc: kg_sc,
                valor_unitario:valor_unitario,
                valor_total:valor_total,
                data_compra: data_compra,
                qtd_disponivel:qtd_disponivel
            },                
                { 
                    where:{
                        id: id_produto,
                        id_user:id_user,
                        id_safra: id_safra
                    },
                }
            );
            if (updated) {
                const produtoUpdated = await Estoque.findByPk(id_produto);
                return res.json(produtoUpdated);
            }else{
                console.log('Erro na atualização do Produto');
                return res.status(400).json({Erro: 'Não foi possivel atualizar o Produto'}); 
            }
      
        } catch (err){
            return res.status(400).json({error: err.message});            
        }
    },


    async deleteProduto(req, res){
        try{
            const {id_user} = req.params;
            const {id_safra} = req.params;
            const {id_produto} = req.params;    
            
            const scanProduto = await Estoque.findByPk(id_produto);
            if (!scanProduto){
                return res.status(400).json({error: 'Produto não encontrado'});               
            }
            const produto = await Estoque.destroy({
                where: {
                   id: id_produto,
                   id_user:id_user,
                   id_safra:id_safra                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  return res.status(200).json({sucesso: 'Produto deletado'});
                }else{
                  console.log('Erro no delete do produto');
                  return res.status(400).json({Erro: 'Não foi possivel deletar o Produto'});
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