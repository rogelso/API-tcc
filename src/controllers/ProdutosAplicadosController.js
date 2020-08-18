const User = require("../models/User");
const Aplicacao = require("../models/Aplicacao");
const TalhaoSafra = require("../models/TalhaoSafra");
const ProdutosAplicados = require("../models/ProdutosAplicados"); 

const Estoque = require("../models/Estoque"); 


// validator
const Validator = require('fastest-validator');
const v = new Validator();
const filterValidator = {
    qtda_ha:{min:1, type: 'number'},
    unidade_medida: {max:25, min:1, type: 'string'},
    qtd_total_usada: {min:1, type: 'number'}
}

module.exports = {
    async store(req, res){
        const {id_aplicacao} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_user} = req.params;
    
        const id_produto = req.body.id_produto;
        const qtda_ha = req.body.qtda_ha;
        const unidade_medida = req.body.unidade_medida;
        const qtd_total_usada = req.body.qtd_total_usada;
           
        //ver se user existe so pra ter
        const user = await User.findByPk(id_user);
        if (!user){
            return res.status(400).json({error: 'Usuário não encontrado'});           
        }

        //ver se aplicacao existe
        const aplicacao = await Aplicacao.findByPk(id_aplicacao);
        if (!aplicacao){
            return res.status(400).json({error: 'Aplicação não encontrada'});           
        }
        if (aplicacao.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Aplicacão selecionada não pertence ao usuário'});           
        }
        

        //ver se talhao safra existe
        const talhao_safra = await TalhaoSafra.findByPk(id_talhao_safra);
        if (!talhao_safra){
            return res.status(400).json({error: 'Talhao Safra não encontrado'});           
        }
        if (talhao_safra.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Talhao Safra selecionado não pertence ao usuario'});           
        }
        if (aplicacao.id_talhao_safra != talhao_safra.id){
            return res.status(400).json({error: 'Erro no cadastro. A Aplicacão selecionada não corresponde ao seu Talhão Safra'});           
        }
        

        //===========================================================//
        //ver se produto existe e se tem disponvel
        const produto = await Estoque.findByPk(id_produto);
        if (!produto){
            return res.status(400).json({error: 'Produto não encontrado'});           
        }
        if (talhao_safra.id_safra != produto.id_safra){
            return res.status(400).json({error: 'Erro no cadastro. Produto Selecionado não corresponde a Safra selecionada'});           
        }
        if (produto.id_user != id_user){
            return res.status(400).json({error: 'Erro no cadastro. Este usuário naõ possui esse produto'});           
        }
        if (produto.qtd_disponivel < qtd_total_usada){
            return res.status(400).json({error: 'Erro no cadastro. ATENÇÃO! a quantidade disponível desse Produto é menor do que você esta cadastrando'});           
        }

        //ver  pra mostrar produtos disponiveis ja tem no estoque sei la

        const errors = v.validate({qtda_ha,unidade_medida,qtd_total_usada}, filterValidator);
        if (Array.isArray(errors) && errors.length){
            return res.status(400).json(errors);
        }

        const produtos_aplicados = await ProdutosAplicados.create({ 
            id_aplicacao,
            id_talhao_safra,
            id_produto,
            qtda_ha,
            unidade_medida,
            qtd_total_usada   
        });
        
        const atualizaQtdDisponivelProduto = parseFloat((produto.qtd_disponivel - qtd_total_usada).toFixed(2));
        if(produtos_aplicados){
            const updateQtdDisponivelProduto = await Estoque.update({
                qtd_disponivel:atualizaQtdDisponivelProduto
            },                
                { 
                    where:{
                        id: id_produto,
                        id_user:id_user    
                    },
                }
            );
            return res.json(produtos_aplicados);
        }
    },


    async findAllProdutosAplicado(req, res){   
        const {id_user} = req.params;
        const {id_talhao_safra} = req.params;
        const {id_aplicacao} = req.params;

        const produtos_aplicados = await Aplicacao.findByPk(id_aplicacao, { //busca o safra e vincula os produtos
            include: {association: 'produtos_aplicados'}            
        });
        
        if (!produtos_aplicados){
            return res.status(400).json({error: 'Não foi possivel encontrar a Aplicacão'}); 
        }
        return res.json(produtos_aplicados);
    },

    
    async findOneProdutoAplicado(req, res){   
        const {id_produto_aplicado} = req.params;
        const {id_aplicacao} = req.params;
        const {id_talhao_safra} = req.params;
                             
        const produto_aplicacao = await ProdutosAplicados.findOne(
            { 
                where:{
                    id: id_produto_aplicado,
                    id_aplicacao: id_aplicacao,
                    id_talhao_safra: id_talhao_safra
                },
            }
        );
        
        if (!produto_aplicacao){
            return res.status(400).json({error: 'Não foi possivel encontrar o registro do produto aplicado'}); 
        }

        return res.json(produto_aplicacao);
    },


    async deleteProdutoAplicado(req, res){
        try{
            const {id_user} = req.params;
            const {id_produto_aplicado} = req.params;
            const {id_aplicacao} = req.params;
            const {id_talhao_safra} = req.params;   
            
            const scanProdutoAplicado = await ProdutosAplicados.findByPk(id_produto_aplicado);
            if (!scanProdutoAplicado){
                return res.status(400).json({error: 'Não foi possivel encontrar o registro do produto aplicado'});               
            }
            
            const produto = await Estoque.findOne(
                { 
                    where:{
                        id: scanProdutoAplicado.id_produto,
                        id_user:id_user
                    },
                }
            );
            if(!produto){
                return res.status(400).json({error: 'Erro ao carregar id do produto do estoque'}); 
            }
            const atualizaQtdDisponivelProduto = parseFloat((produto.qtd_disponivel + scanProdutoAplicado.qtd_total_usada).toFixed(2));

            const deleteProdutoAplicado = await ProdutosAplicados.destroy({
                where: {
                    id: id_produto_aplicado,
                    id_aplicacao: id_aplicacao,
                    id_talhao_safra: id_talhao_safra                         
                }
             }).then(function(rowDeleted){ 
               if(rowDeleted === 1){
                  console.log('Deleted successfully');
                  
                const updateQtdDisponivelProduto = Estoque.update({
                    qtd_disponivel:atualizaQtdDisponivelProduto
                },                
                    { 
                        where:{
                            id: produto.id,
                            id_user:id_user    
                        },
                    }
                );   
                    console.log('Produto Atualizado');
                    return res.status(200).json({sucesso: 'Produto Aplicado deletado, Estoque Atualizado!'});
                }else{
                  console.log('Erro no delete do Produto Aplicado');
                  return res.status(400).json({Erro: 'Não foi possivel deletar o Produto Aplicado'});
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